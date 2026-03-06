'use client'
import { VFS, FSEntry, getChildren, getEntry, resolvePath } from './fs'

export type Line = { text: string; html?: boolean; className?: string }

export interface TermState {
  cwd: string
  user: string
  hostname: string
  overlay: Record<string, FSEntry>
  permissions: Record<string, string>
  history: string[]
  env: Record<string, string>
}

const g = (s: string) => `<span style="color:#4caf74">${s}</span>`
const y = (s: string) => `<span style="color:#e2b714">${s}</span>`
const r = (s: string) => `<span style="color:#ca4754">${s}</span>`
const c = (s: string) => `<span style="color:#50c8d0">${s}</span>`
const d = (s: string) => `<span style="color:#646669">${s}</span>`
const b = (s: string) => `<span style="color:#6eb4ff">${s}</span>`
const w = (s: string) => `<span style="color:#d1d0c5">${s}</span>`

function perm(entry: FSEntry, override?: string): string {
  const p = override || entry.perm
  return p.split('').map(ch => {
    if (ch === 'd') return b('d')
    if (ch === 'r') return y('r')
    if (ch === 'w') return r('w')
    if (ch === 'x') return g('x')
    if (ch === '-') return d('-')
    return ch
  }).join('')
}

function fmtLs(name: string, entry: FSEntry, permOverride?: string): string {
  const p = permOverride || entry.perm
  const isDir = entry.type === 'dir'
  const isExec = p.includes('x') && !isDir
  const namePart = isDir ? b(name + '/') : isExec ? g(name) : w(name)
  return `${perm(entry, p)}  1 ${d(entry.owner.padEnd(8))} ${d(entry.group.padEnd(8))} ${d(String(entry.size).padStart(6))} ${d(entry.mtime.padStart(12))} ${namePart}`
}

export function createState(): TermState {
  return {
    cwd: '/home/user',
    user: 'user',
    hostname: 'lpi-vm',
    overlay: {},
    permissions: {},
    history: [],
    env: { HOME: '/home/user', PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', SHELL: '/bin/bash', TERM: 'xterm-256color' },
  }
}

export function getPrompt(state: TermState): string {
  const disp = state.cwd === `/home/${state.user}` ? '~' : state.cwd.replace(`/home/${state.user}`, '~')
  const sym = state.user === 'root' ? '#' : '$'
  return `${g(state.user + '@' + state.hostname)}:${b(disp)}${sym} `
}

export function execute(input: string, state: TermState): { lines: Line[]; newState: TermState } {
  const st = { ...state, overlay: { ...state.overlay }, permissions: { ...state.permissions } }
  const trimmed = input.trim()
  if (!trimmed) return { lines: [], newState: st }

  // handle VAR=val assignments
  if (/^[A-Z_]+=/.test(trimmed) && !trimmed.includes(' ')) {
    const [k, ...v] = trimmed.split('=')
    st.env = { ...st.env, [k]: v.join('=') }
    return { lines: [], newState: st }
  }

  const [cmd, ...args] = trimmed.split(/\s+/)
  const lines: Line[] = []
  const err = (msg: string) => lines.push({ text: r(`bash: ${cmd}: ${msg}`), html: true })
  const out = (msg: string, isHtml = false) => lines.push({ text: msg, html: isHtml })

  switch (cmd) {
    // ── Navigation ────────────────────────────────────────────
    case 'pwd':
      out(w(st.cwd), true)
      break

    case 'cd': {
      const target = args[0] || st.env.HOME || '/home/user'
      const resolved = resolvePath(target, st.cwd)
      const entry = getEntry(resolved, st.overlay)
      if (!entry || entry.type !== 'dir') {
        out(r(`bash: cd: ${target}: No such file or directory`), true)
      } else {
        st.cwd = resolved
      }
      break
    }

    case 'ls': {
      const flags = args.filter(a => a.startsWith('-')).join('')
      const pathArg = args.find(a => !a.startsWith('-'))
      const target = pathArg ? resolvePath(pathArg, st.cwd) : st.cwd
      const entry = getEntry(target, st.overlay)
      if (!entry) { err('cannot access: No such file or directory'); break }
      if (entry.type === 'file') { out(pathArg || target); break }

      const children = getChildren(target, st.overlay)
      const showAll = flags.includes('a')
      const longFmt = flags.includes('l')

      let names = showAll ? ['.', '..', ...children] : children.filter(n => !n.startsWith('.'))
      if (longFmt) {
        if (showAll) out(`total ${names.length * 4}`)
        names.forEach(name => {
          const childPath = target === '/' ? `/${name}` : `${target}/${name}`
          let childEntry = getEntry(childPath, st.overlay)
          if (!childEntry) {
            if (name === '.') childEntry = entry
            else if (name === '..') childEntry = getEntry(target.split('/').slice(0,-1).join('/') || '/', st.overlay) || entry
            else return
          }
          const overridePerm = st.permissions[childPath]
          out(fmtLs(name, childEntry, overridePerm), true)
        })
      } else {
        const cols: string[] = names.map(name => {
          const childPath = target === '/' ? `/${name}` : `${target}/${name}`
          const childEntry = getEntry(childPath, st.overlay)
          if (!childEntry) return d(name)
          const p = st.permissions[childPath] || childEntry.perm
          if (childEntry.type === 'dir') return b(name + '/')
          if (p.includes('x') && !p.startsWith('d')) return g(name)
          return w(name)
        })
        // group into rows of 4
        for (let i = 0; i < cols.length; i += 4) {
          out(cols.slice(i, i+4).map(s => s.padEnd(20)).join('  '), true)
        }
      }
      break
    }

    // ── File operations ──────────────────────────────────────
    case 'cat': {
      if (!args.length) { out(r('bash: cat: missing operand'), true); break }
      args.filter(a => !a.startsWith('-')).forEach(arg => {
        const p = resolvePath(arg, st.cwd)
        const e = getEntry(p, st.overlay)
        if (!e) { out(r(`cat: ${arg}: No such file or directory`), true) }
        else if (e.type === 'dir') { out(r(`cat: ${arg}: Is a directory`), true) }
        else { (e.content || '').split('\n').forEach(l => out(w(l), true)) }
      })
      break
    }

    case 'echo': {
      const flags = args[0] === '-e' || args[0] === '-n' ? args[0] : ''
      const rest = flags ? args.slice(1) : args
      const msg = rest.join(' ').replace(/\$([A-Z_]+)/g, (_, k) => st.env[k] || '')
      out(w(msg), true)
      break
    }

    case 'touch': {
      args.forEach(arg => {
        const p = resolvePath(arg, st.cwd)
        if (!getEntry(p, st.overlay)) {
          st.overlay[p] = { type:'file', perm:'-rw-r--r--', owner:st.user, group:st.user, size:0, mtime:'Mar  6 05:44', content:'' }
        }
      })
      break
    }

    case 'mkdir': {
      const p_ = args.filter(a => !a.startsWith('-'))
      if (!p_.length) { err('missing operand'); break }
      p_.forEach(arg => {
        const p = resolvePath(arg, st.cwd)
        if (getEntry(p, st.overlay)) { out(r(`mkdir: cannot create directory '${arg}': File exists`), true) }
        else { st.overlay[p] = { type:'dir', perm:'drwxr-xr-x', owner:st.user, group:st.user, size:4096, mtime:'Mar  6 05:44' } }
      })
      break
    }

    case 'rm': {
      args.filter(a => !a.startsWith('-')).forEach(arg => {
        const p = resolvePath(arg, st.cwd)
        const e = getEntry(p, st.overlay)
        if (!e) { out(r(`rm: cannot remove '${arg}': No such file or directory`), true) }
        else if (e.type === 'dir') { out(r(`rm: cannot remove '${arg}': Is a directory`), true) }
        else { delete st.overlay[p] }
      })
      break
    }

    case 'rmdir': {
      args.forEach(arg => {
        const p = resolvePath(arg, st.cwd)
        const e = getEntry(p, st.overlay)
        if (!e) { out(r(`rmdir: failed to remove '${arg}': No such file or directory`), true) }
        else if (e.type !== 'dir') { out(r(`rmdir: failed to remove '${arg}': Not a directory`), true) }
        else { delete st.overlay[p] }
      })
      break
    }

    case 'cp': {
      if (args.length < 2) { err('missing file operand'); break }
      const src = resolvePath(args[0], st.cwd)
      const dst = resolvePath(args[1], st.cwd)
      const srcE = getEntry(src, st.overlay)
      if (!srcE) { out(r(`cp: '${args[0]}': No such file or directory`), true); break }
      st.overlay[dst] = { ...srcE }
      break
    }

    case 'mv': {
      if (args.length < 2) { err('missing file operand'); break }
      const src = resolvePath(args[0], st.cwd)
      const dst = resolvePath(args[1], st.cwd)
      const srcE = getEntry(src, st.overlay)
      if (!srcE) { out(r(`mv: '${args[0]}': No such file or directory`), true); break }
      st.overlay[dst] = { ...srcE }
      delete st.overlay[src]
      break
    }

    case 'grep': {
      const flags = args.filter(a => a.startsWith('-')).join('')
      const positional = args.filter(a => !a.startsWith('-'))
      if (positional.length < 2) { out(r('Usage: grep [OPTION] PATTERN FILE'), true); break }
      const [pattern, ...files] = positional
      const regex = new RegExp(pattern, flags.includes('i') ? 'gi' : 'g')
      files.forEach(file => {
        const p = resolvePath(file, st.cwd)
        const e = getEntry(p, st.overlay)
        if (!e || e.type !== 'file') { out(r(`grep: ${file}: No such file or directory`), true); return }
        const content = e.content || ''
        content.split('\n').forEach((line, idx) => {
          if (regex.test(line)) {
            const hl = line.replace(regex, m => y(m))
            out(flags.includes('n') ? `${d(String(idx+1))}:${hl}` : hl, true)
          }
        })
      })
      break
    }

    case 'head': case 'tail': {
      const n = args.includes('-n') ? parseInt(args[args.indexOf('-n')+1]) : 10
      const file = args.find(a => !a.startsWith('-'))
      if (!file) { err('missing file operand'); break }
      const p = resolvePath(file, st.cwd)
      const e = getEntry(p, st.overlay)
      if (!e || e.type !== 'file') { out(r(`${cmd}: ${file}: No such file or directory`), true); break }
      const ls = (e.content || '').split('\n')
      const slice = cmd === 'head' ? ls.slice(0, n) : ls.slice(-n)
      slice.forEach(l => out(w(l), true))
      break
    }

    case 'wc': {
      const file = args.find(a => !a.startsWith('-'))
      if (!file) { err('missing file operand'); break }
      const p = resolvePath(file, st.cwd)
      const e = getEntry(p, st.overlay)
      if (!e) { out(r(`wc: ${file}: No such file or directory`), true); break }
      const content = e.content || ''
      const lines2 = content.split('\n').length
      const words = content.split(/\s+/).filter(Boolean).length
      const bytes = content.length
      out(`${y(String(lines2).padStart(6))} ${y(String(words).padStart(6))} ${y(String(bytes).padStart(6))} ${w(file)}`, true)
      break
    }

    case 'find': {
      const startPath = args[0]?.startsWith('/') || args[0]?.startsWith('.')
        ? resolvePath(args[0], st.cwd)
        : st.cwd
      const nameIdx = args.indexOf('-name')
      const namePattern = nameIdx >= 0 ? args[nameIdx+1] : null
      const all = { ...VFS, ...st.overlay }
      Object.keys(all).filter(k => k.startsWith(startPath)).forEach(k => {
        if (!namePattern || k.endsWith(namePattern.replace('*', ''))) out(w(k), true)
      })
      break
    }

    // ── Permissions ──────────────────────────────────────────
    case 'chmod': {
      if (args.length < 2) { err('missing operand'); break }
      const [mode, ...targets] = args
      targets.forEach(t => {
        const p = resolvePath(t, st.cwd)
        const e = getEntry(p, st.overlay)
        if (!e) { out(r(`chmod: cannot access '${t}': No such file or directory`), true); return }
        // numeric mode → convert to permission string
        if (/^\d+$/.test(mode)) {
          const digits = mode.padStart(3,'0').split('').map(Number)
          const toStr = (d: number) => [(d&4)?'r':'-',(d&2)?'w':'-',(d&1)?'x':'-'].join('')
          const prefix = e.type==='dir' ? 'd' : '-'
          st.permissions[p] = prefix + digits.map(toStr).join('')
        } else {
          // symbolic: just store as-is
          st.permissions[p] = (e.perm[0] || '-') + mode
        }
        out(d(`mode of '${t}' changed to ${mode}`), true)
      })
      break
    }

    case 'chown': {
      if (args.length < 2) { err('missing operand'); break }
      out(d(`ownership of '${args[1]}' changed`), true)
      break
    }
    case 'chgrp': {
      if (args.length < 2) { err('missing operand'); break }
      out(d(`group of '${args[1]}' changed`), true)
      break
    }
    case 'umask': {
      if (!args.length) out(y('0022'), true)
      else out(d(`umask set to ${args[0]}`), true)
      break
    }

    case 'ln': {
      if (args.length < 2) { err('missing operand'); break }
      const sym = args.includes('-s')
      const [, src, dst] = sym ? args : ['', args[0], args[1]]
      out(d(`${sym?'symbolic':'hard'} link '${dst}' → '${src}' created`), true)
      break
    }

    case 'stat': {
      const file = args[0]
      if (!file) { err('missing operand'); break }
      const p = resolvePath(file, st.cwd)
      const e = getEntry(p, st.overlay)
      if (!e) { out(r(`stat: cannot stat '${file}': No such file or directory`), true); break }
      out(`  ${w('File:')} ${c(p)}`, true)
      out(`  ${w('Size:')} ${y(String(e.size))}    ${w('Type:')} ${e.type==='dir'?b('directory'):w('regular file')}`, true)
      out(`  ${w('Permissions:')} ${y(e.perm)}    ${w('Uid:')} ${y(e.owner)}    ${w('Gid:')} ${y(e.group)}`, true)
      out(`  ${w('Modified:')} ${d(e.mtime)}`, true)
      break
    }

    case 'file': {
      args.forEach(a => {
        const p = resolvePath(a, st.cwd)
        const e = getEntry(p, st.overlay)
        if (!e) out(r(`${a}: ERROR: No such file`), true)
        else if (e.type==='dir') out(`${w(a)}: ${b('directory')}`, true)
        else if (a.endsWith('.sh')) out(`${w(a)}: ${g('Bourne-Again shell script, ASCII text executable')}`, true)
        else out(`${w(a)}: ${d('ASCII text')}`, true)
      })
      break
    }

    // ── System info ──────────────────────────────────────────
    case 'uname': {
      const all2 = args.includes('-a')
      if (all2 || args.includes('-s')) process.stdout?.write?.('Linux ')
      if (all2) out(w('Linux lpi-vm 5.15.0-91-generic #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux'), true)
      else if (!args.length || args.includes('-s')) out(w('Linux'), true)
      else if (args.includes('-r')) out(w('5.15.0-91-generic'), true)
      else if (args.includes('-m')) out(w('x86_64'), true)
      else if (args.includes('-n')) out(w(st.hostname), true)
      else out(w('Linux'), true)
      break
    }

    case 'hostname':
      out(w(st.hostname), true)
      break

    case 'whoami':
      out(w(st.user), true)
      break

    case 'id':
      out(w(`uid=1000(${st.user}) gid=1000(${st.user}) groups=1000(${st.user}),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev)`), true)
      break

    case 'uptime':
      out(w(` 05:44:00 up 12:03,  1 user,  load average: 0.08, 0.12, 0.09`), true)
      break

    case 'date':
      out(w(`Thu Mar  6 05:44:00 UTC 2026`), true)
      break

    case 'w': case 'who':
      out(`${y(st.user.padEnd(10))} ${d('pts/0')}  ${d('2026-03-06 05:44')} ${d('(192.168.1.50)')}`, true)
      break

    case 'env':
      Object.entries(st.env).forEach(([k,v]) => out(`${y(k)}=${w(v)}`, true))
      break

    case 'export':
      if (!args.length) { Object.entries(st.env).forEach(([k,v]) => out(`${d('declare -x')} ${y(k)}="${w(v)}"`, true)); break }
      args.forEach(a => {
        const [k,...v] = a.split('=')
        if (v.length) st.env = { ...st.env, [k]: v.join('=') }
        out(d(`exported ${k}`), true)
      })
      break

    case 'which': case 'whereis':
      if (!args.length) { err('missing argument'); break }
      args.forEach(a => {
        const bins: Record<string,string> = {
          bash:'/bin/bash', sh:'/bin/sh', ls:'/bin/ls', cat:'/bin/cat',
          grep:'/bin/grep', find:'/usr/bin/find', chmod:'/bin/chmod',
          chown:'/bin/chown', systemctl:'/bin/systemctl', apt:'/usr/bin/apt',
          dpkg:'/usr/bin/dpkg', rpm:'/usr/bin/rpm', vim:'/usr/bin/vim',
          python3:'/usr/bin/python3', perl:'/usr/bin/perl',
        }
        if (bins[a]) out(w(bins[a]), true)
        else out(r(`${a}: not found`), true)
      })
      break

    case 'type':
      args.forEach(a => {
        const builtin = ['cd','echo','pwd','export','alias','type','help','history'].includes(a)
        if (builtin) out(`${w(a)} is a shell builtin`, true)
        else out(`${w(a)} is /usr/bin/${a}`, true)
      })
      break

    // ── Process ──────────────────────────────────────────────
    case 'ps': {
      const all2 = args.join('').includes('a')
      out(w(`  PID TTY          TIME CMD`), true)
      out(`${d(' 1234')} ${d('pts/0')}   ${d('00:00:00')} ${g('bash')}`, true)
      if (all2) {
        out(`${d('    1')} ${d('?     ')}   ${d('00:00:03')} ${w('systemd')}`, true)
        out(`${d(' ')} ${d('?     ')}   ${d('00:00:01')} ${w('kthreadd')}`, true)
        out(`${d('  456')} ${d('?     ')}   ${d('00:00:02')} ${w('systemd-journald')}`, true)
        out(`${d('  789')} ${d('?     ')}   ${d('00:00:00')} ${w('sshd')}`, true)
        out(`${d(' 1100')} ${d('?     ')}   ${d('00:00:00')} ${w('cron')}`, true)
        out(`${d(' 1200')} ${d('?     ')}   ${d('00:00:00')} ${w('rsyslogd')}`, true)
        out(`${d(' 1500')} ${d('pts/0')}   ${d('00:00:00')} ${w('ps')}`, true)
      } else {
        out(`${d(' 1500')} ${d('pts/0')}   ${d('00:00:00')} ${w('ps')}`, true)
      }
      break
    }

    case 'top':
      out(b(`top - 05:44:00 up 12:03, 1 user, load average: 0.08, 0.12, 0.09`), true)
      out(w(`Tasks:  142 total,   1 running, 141 sleeping,   0 stopped,   0 zombie`), true)
      out(w(`%Cpu(s):  2.3 us,  0.8 sy,  0.0 ni, 96.7 id,  0.1 wa,  0.0 hi,  0.1 si`), true)
      out(w(`MiB Mem :   7955.8 total,   3165.5 free,   2143.2 used,   2646.9 buff/cache`), true)
      out(w(`MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   4906.1 avail Mem`), true)
      out('', true)
      out(`${y('  PID')} ${d('USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND')}`, true)
      out(`${y('    1')} ${w('root      20   0  168760  13124   8236 S   0.0   0.2   0:03.12 systemd')}`, true)
      out(`${w('  456')} ${d('root      20   0   26396   5216   4224 S   0.0   0.1   0:01.22 systemd-journald')}`, true)
      out(`${w(' 1234')} ${g('user      20   0   10624   5364   3276 S   0.5   0.1   0:00.03 bash')}`, true)
      out(d('(press q to quit — simulation only)'), true)
      break

    case 'kill':
      if (!args.length) { err('missing operand'); break }
      out(d(`Signal sent to process ${args[args.length-1]}`), true)
      break

    case 'nice': case 'nohup':
      out(d(`[running command with adjusted priority]`), true)
      break

    // ── Disk ────────────────────────────────────────────────
    case 'df': {
      const human = args.includes('-h')
      out(`${y('Filesystem      ')} ${y('1K-blocks')}  ${y('  Used')} ${y('Available')} ${y('Use%')} ${y('Mounted on')}`, true)
      if (human) {
        out(`${w('/dev/sda1       ')} ${d('   20G')}  ${d(' 4.6G')} ${d('     14G')} ${g(' 25%')} ${c('/')}`, true)
        out(`${w('/dev/sda2       ')} ${d('  500M')}  ${d(' 122M')} ${d('    345M')} ${g(' 26%')} ${c('/boot')}`, true)
        out(`${w('tmpfs           ')} ${d('  1.6G')}  ${d(' 2.1M')} ${d('    1.6G')} ${g('  1%')} ${c('/run')}`, true)
        out(`${w('tmpfs           ')} ${d('  7.8G')}  ${d('8.0M ')} ${d('    7.8G')} ${g('  1%')} ${c('/dev/shm')}`, true)
      } else {
        out(`${w('/dev/sda1       ')} ${d(' 20480000')} ${d(' 4700000')} ${d('  14800000')} ${g(' 25%')} ${c('/')}`, true)
        out(`${w('/dev/sda2       ')} ${d('   512000')} ${d('  124892')} ${d('    354648')} ${g(' 26%')} ${c('/boot')}`, true)
      }
      break
    }

    case 'du': {
      const human = args.includes('-h')
      const target = args.find(a => !a.startsWith('-')) || '.'
      out(`${human ? d('4.2M') : d('4312')}    ${w(target)}`, true)
      break
    }

    case 'lsblk':
      out(w(`NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT`), true)
      out(`${g('sda  ')}   ${d('8:0')}    0  ${y('20G')}  0 ${b('disk')}`, true)
      out(`${g('├─sda1')} ${d('8:1')}    0  ${y('18G')}  0 ${b('part')} ${c('/')}`, true)
      out(`${g('├─sda2')} ${d('8:2')}    0 ${y('500M')}  0 ${b('part')} ${c('/boot')}`, true)
      out(`${g('└─sda3')} ${d('8:3')}    0 ${y('1.5G')}  0 ${b('part')} ${c('[SWAP]')}`, true)
      out(`${g('sr0  ')}  ${d('11:0')}    1  ${y('1.1G')}  0 ${b('rom')}`, true)
      break

    case 'fdisk': {
      if (args.includes('-l')) {
        out(w(`Disk /dev/sda: 20 GiB, 21474836480 bytes, 41943040 sectors`), true)
        out(d(`Disk model: VBOX HARDDISK`), true)
        out(d(`Units: sectors of 1 * 512 = 512 bytes`), true)
        out(d(`Sector size: 512 bytes   I/O size: 512 bytes`), true)
        out(d(`Disklabel type: dos   Disk identifier: 0x1234abcd`), true)
        out('', true)
        out(y(`Device     Boot    Start      End  Sectors  Size Id Type`), true)
        out(`${w('/dev/sda1')} ${g('*')}        2048 37750783 37748736  ${y('18G')} 83 ${b('Linux')}`, true)
        out(`${w('/dev/sda2')}          37750784 38799359  1048576 ${y('512M')} 83 ${b('Linux')}`, true)
        out(`${w('/dev/sda3')}          38799360 41943039  3143680 ${y('1.5G')} 82 ${b('Linux swap / Solaris')}`, true)
      } else {
        out(r('fdisk: must be run as root or with -l flag'), true)
      }
      break
    }

    case 'mount': {
      if (!args.length || args[0] === '-l') {
        out(`${b('sysfs')} on ${c('/sys')} type ${y('sysfs')} ${d('(rw,nosuid,nodev,noexec,relatime)')}`, true)
        out(`${b('proc')} on ${c('/proc')} type ${y('proc')} ${d('(rw,nosuid,nodev,noexec,relatime)')}`, true)
        out(`${b('/dev/sda1')} on ${c('/')} type ${y('ext4')} ${d('(rw,relatime,errors=remount-ro)')}`, true)
        out(`${b('/dev/sda2')} on ${c('/boot')} type ${y('ext4')} ${d('(rw,relatime)')}`, true)
        out(`${b('tmpfs')} on ${c('/tmp')} type ${y('tmpfs')} ${d('(rw,nosuid,nodev,noatime)')}`, true)
      } else {
        out(g(`mount: ${args[args.length-1]} mounted successfully`), true)
      }
      break
    }

    case 'umount':
      out(g(`umount: ${args[0] || '/mnt'} unmounted`), true)
      break

    // ── Systemd / Init ───────────────────────────────────────
    case 'systemctl': {
      const sub = args[0]
      const unit = args[1] || 'sshd.service'
      const services: Record<string,{active:boolean,enabled:boolean,pid:number}> = {
        'ssh': {active:true,enabled:true,pid:789},
        'sshd': {active:true,enabled:true,pid:789},
        'cron': {active:true,enabled:true,pid:1100},
        'rsyslog': {active:true,enabled:true,pid:1200},
        'nginx': {active:false,enabled:false,pid:0},
        'apache2': {active:false,enabled:false,pid:0},
        'mysql': {active:false,enabled:false,pid:0},
        'networking': {active:true,enabled:true,pid:500},
      }
      const svcKey = unit.replace('.service','')
      const svc = services[svcKey]

      switch (sub) {
        case 'status': {
          const name = svcKey + '.service'
          if (svc) {
            out(`${y('●')} ${w(name)} - ${c(svcKey.toUpperCase() + ' Service')}`, true)
            out(`     ${d('Loaded:')} loaded ${d(`(/lib/systemd/system/${name}; ${svc.enabled?y('enabled'):r('disabled')}`)}${d(')')}`, true)
            out(`     ${d('Active:')} ${svc.active ? g('active (running)') : r('inactive (dead)')} since Thu 2026-03-06 05:44:00 UTC`, true)
            if (svc.active) out(`    ${d('Main PID:')} ${y(String(svc.pid))} (${svcKey})`, true)
            out(`       ${d('CGroup:')} /system.slice/${name}`, true)
          } else {
            out(`${r('●')} ${w(unit)} - Unknown`, true)
            out(`     ${d('Loaded:')} not-found ${r('(Reason: No such file or directory)')}`, true)
            out(`     ${d('Active:')} ${r('inactive (dead)')}`, true)
          }
          break
        }
        case 'start': case 'stop': case 'restart':
          out(g(`${sub}: ${unit} ${sub === 'stop' ? 'stopped' : 'started'} successfully`), true); break
        case 'enable': case 'disable':
          out(g(`${unit} ${sub}d`), true)
          out(d(`Created symlink /etc/systemd/system/multi-user.target.wants/${unit}`), true); break
        case 'get-default':
          out(w('graphical.target'), true); break
        case 'set-default':
          out(g(`Created symlink /etc/systemd/system/default.target → /lib/systemd/system/${args[1] || 'multi-user.target'}`), true); break
        case 'isolate':
          out(d(`Switching to ${args[1] || 'multi-user.target'}...`), true)
          out(g('Done.'), true); break
        case 'list-units':
          out(`${y('UNIT                     ')} ${y('LOAD  ')} ${y('ACTIVE ')} ${y('SUB    ')} ${y('DESCRIPTION')}`, true)
          out(`${g('sshd.service             ')} ${d('loaded')} ${g('active')} ${g('running')} ${w('OpenSSH Daemon')}`, true)
          out(`${g('cron.service             ')} ${d('loaded')} ${g('active')} ${g('running')} ${w('Cron Daemon')}`, true)
          out(`${r('nginx.service            ')} ${d('loaded')} ${r('inactive')} ${r('dead   ')} ${w('Nginx HTTP Server')}`, true)
          out(d(`\n3 loaded units listed.`), true); break
        default:
          out(r(`Unknown systemctl sub-command: ${sub}`), true)
      }
      break
    }

    case 'service': {
      const name = args[0]; const action = args[1]
      out(g(` * ${action === 'stop' ? 'Stopping' : 'Starting'} ${name}...`), true)
      out(g(` * ${name} ${action === 'stop' ? 'stopped' : 'started'}.`), true)
      break
    }

    case 'runlevel':
      out(w('N 5'), true)
      break

    case 'init': case 'telinit': {
      const lvl = args[0]
      const msgs: Record<string,string> = {
        '0':'System is going down for power off...','1':'Entering single-user mode...',
        '3':'Switching to multi-user text mode...','5':'Switching to multi-user graphical mode...',
        '6':'System is going down for reboot...'
      }
      out(y(msgs[lvl] || `Switching to runlevel ${lvl}...`), true); break
    }

    case 'shutdown':
      out(y(`Shutdown scheduled...`), true)
      out(d('Broadcast message from root@lpi-vm (pts/0) (Thu Mar  6 05:44:00 2026):'), true)
      out(r('The system is going down for power-off!'), true); break
    case 'reboot': out(y('Rebooting...'), true); break
    case 'halt':   out(y('Halting system...'), true); break
    case 'poweroff': out(y('Powering off...'), true); break

    // ── Package management ───────────────────────────────────
    case 'dpkg': {
      if (args[0] === '-l') {
        out(`${y('Desired=Unknown/Install/Remove/Purge/Hold')}`, true)
        out(d('| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend'), true)
        out(`${y('||/ Name                      Version                   Architecture  Description')}`, true)
        out(d('+++-=========================-=========================-=============-====================='), true)
        const pkgs = [
          ['ii','bash','5.1-6ubuntu1','amd64','GNU Bourne Again SHell'],
          ['ii','coreutils','8.32-4.1ubuntu1','amd64','GNU core utilities'],
          ['ii','grep','3.7-1build1','amd64','GNU grep, egrep and fgrep'],
          ['ii','openssh-server','1:8.9p1-3ubuntu0.6','amd64','secure shell (SSH) server'],
          ['ii','vim','2:8.2.3995-1ubuntu2.15','amd64','Vi IMproved - enhanced vi editor'],
          ['ii','curl','7.81.0-1ubuntu1.15','amd64','command line tool for transferring data'],
          ['ii','wget','1.21.2-2ubuntu1','amd64','retrieves files from the web'],
          ['ii','tar','1.34+dfsg-1build3','amd64','GNU version of the tar archiving utility'],
          ['ii','gzip','1.10-4ubuntu4.1','amd64','GNU compression utilities'],
        ]
        pkgs.forEach(([s,n,v,a,d2]) => out(`${g(s)} ${w(n.padEnd(26))} ${d(v.padEnd(26))} ${d(a.padEnd(13))} ${d(d2)}`, true))
      } else if (args[0] === '-i') {
        out(g(`Selecting previously unselected package ${args[1]}.`), true)
        out(g(`Installing ${args[1]}...`), true)
        out(g('Processing triggers for man-db...'), true)
      } else if (['-r','-P'].includes(args[0])) {
        out(y(`Removing ${args[1]}...`), true)
        out(g('Done.'), true)
      } else {
        err('unknown option')
      }
      break
    }

    case 'apt': case 'apt-get': {
      const sub = args[0]
      if (sub === 'update') {
        out(d('Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease'), true)
        out(d('Hit:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease'), true)
        out(g('Reading package lists... Done'), true)
        out(d('Building dependency tree... Done'), true)
        out(d('Reading state information... Done'), true)
        out(g('All packages are up to date.'), true)
      } else if (sub === 'install') {
        out(d(`Reading package lists... Done`), true)
        out(d('Building dependency tree... Done'), true)
        out(y(`The following NEW packages will be installed: ${args.slice(1).join(' ')}`), true)
        out(d('0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.'), true)
        out(g(`Get:1 http://archive.ubuntu.com/ubuntu jammy/main ${args[1]} amd64`), true)
        out(g(`Unpacking ${args[1]}...`), true)
        out(g(`Setting up ${args[1]}...`), true)
        out(g('Processing triggers for man-db... Done'), true)
      } else if (sub === 'remove') {
        out(y(`Removing ${args.slice(1).join(' ')}...`), true)
        out(g('Done.'), true)
      } else if (sub === 'upgrade') {
        out(d('Reading package lists... Done'), true)
        out(g('Calculating upgrade... Done'), true)
        out(g('0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.'), true)
      } else {
        out(r(`apt: unknown sub-command '${sub}'`), true)
      }
      break
    }

    case 'rpm': {
      if (args[0] === '-qa') {
        ['bash-5.1.8-6.el9.x86_64','coreutils-8.32-34.el9.x86_64','openssh-server-8.7p1-34.el9.x86_64',
         'grep-3.6-5.el9.x86_64','vim-enhanced-8.2.2637-20.el9.x86_64'].forEach(p => out(w(p), true))
      } else if (['-i','--install'].includes(args[0])) {
        out(g(`Installing ${args[1]}...`), true)
      } else if (['-e','--erase'].includes(args[0])) {
        out(y(`Erasing ${args[1]}...`), true)
      } else out(r('rpm: unknown option'), true)
      break
    }

    case 'yum': case 'dnf': {
      const sub = args[0]
      if (sub === 'install') {
        out(d('Resolving Dependencies...'), true)
        out(y(`--> Installing: ${args.slice(1).join(', ')}`), true)
        out(g('\n==> Installed:'), true)
        args.slice(1).forEach(p => out(g(`  ${p}`), true))
        out(g('\nComplete!'), true)
      } else if (sub === 'remove') {
        out(y(`Removing: ${args.slice(1).join(', ')}`), true)
        out(g('Complete!'), true)
      } else if (sub === 'list' || sub === 'update') {
        out(d('Last metadata expiration check...'), true)
        out(g('All packages are up to date.'), true)
      } else out(r(`unknown sub-command: ${sub}`), true)
      break
    }

    // ── Kernel modules ───────────────────────────────────────
    case 'lsmod':
      out(`${y('Module                  Size  Used by')}`, true)
      ;[['xt_conntrack','24576','1'],['nft_chain_ipv4','16384','1'],['ip_tables','32768','2 iptable_filter,iptable_nat'],
        ['ext4','794624','2'],['mbcache','16384','1 ext4'],['jbd2','135168','1 ext4'],
        ['vboxguest','356352','2']].forEach(([m,s,u]) => out(`${w(m.padEnd(24))} ${d(s.padStart(7))}  ${d(u)}`, true))
      break

    case 'modprobe':
      if (args[0] === '-r') out(g(`Module ${args[1]} removed`), true)
      else out(g(`Module ${args[0] || 'module'} loaded`), true)
      break

    case 'modinfo': {
      const mod = args[0] || 'ext4'
      out(`${y('filename:')}       ${w(`/lib/modules/5.15.0-91-generic/kernel/fs/${mod}.ko`)}`, true)
      out(`${y('description:')}    ${w(mod + ' filesystem support')}`, true)
      out(`${y('author:')}         ${w('Linux kernel contributors')}`, true)
      out(`${y('license:')}        ${w('GPL')}`, true)
      out(`${y('name:')}           ${w(mod)}`, true)
      break
    }

    case 'rmmod':
      out(g(`Module ${args[0]} removed`), true); break

    case 'lspci':
      out(`00:00.0 ${y('Host bridge')}: ${w('Intel Corporation 440FX - 82441FX PMC [Natoma] (rev 02)')}`, true)
      out(`00:01.0 ${y('ISA bridge')}: ${w('Intel Corporation 82371SB PIIX3 ISA (rev 01)')}`, true)
      out(`00:02.0 ${y('VGA compatible controller')}: ${w('VMware SVGA II Adapter')}`, true)
      out(`00:03.0 ${y('Ethernet controller')}: ${w('Intel Corporation 82540EM Gigabit Ethernet Controller')}`, true)
      out(`00:04.0 ${y('System peripheral')}: ${w('InnoTek Systemberatung GmbH VirtualBox Guest Service')}`, true)
      break

    case 'lsusb':
      out(`Bus 001 Device 001: ID 1d6b:0002 ${w('Linux Foundation 2.0 root hub')}`, true)
      out(`Bus 002 Device 001: ID 1d6b:0001 ${w('Linux Foundation 1.1 root hub')}`, true)
      out(`Bus 002 Device 002: ID 80ee:0021 ${w('Oracle Corporation VirtualBox USB Tablet')}`, true)
      break

    case 'lshw':
      out(y('WARNING: lshw requires root. Showing summary...'), true)
      out(`  ${w('description:')} Computer`, true)
      out(`  ${d('product:')} VirtualBox (lpi-vm)`, true)
      out(`  ${d('width:')} 64 bits`, true)
      out(`    ${w('*-cpu')}`, true)
      out(`       ${d('description:')} CPU`, true)
      out(`       ${d('product:')} Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz`, true)
      out(`       ${d('width:')} 64 bits`, true)
      out(`    ${w('*-memory')}`, true)
      out(`       ${d('description:')} System Memory`, true)
      out(`       ${d('size:')} 8GiB`, true)
      out(`    ${w('*-disk')}`, true)
      out(`       ${d('description:')} ATA Disk`, true)
      out(`       ${d('product:')} VBOX HARDDISK`, true)
      out(`       ${d('size:')} 20GiB`, true)
      break

    case 'dmidecode':
      out(y('# dmidecode requires root. Showing simulated output...'), true)
      out(d('SMBIOS 2.5 present.'), true)
      out('', true)
      out(`${w('Handle 0x0000, DMI type 0, 24 bytes')}`, true)
      out(`${y('BIOS Information')}`, true)
      out(`\t${d('Vendor:')} Oracle Corporation`, true)
      out(`\t${d('Version:')} VirtualBox`, true)
      out(`\t${d('Release Date:')} 12/01/2006`, true)
      out('', true)
      out(`${w('Handle 0x0001, DMI type 1, 27 bytes')}`, true)
      out(`${y('System Information')}`, true)
      out(`\t${d('Manufacturer:')} innotek GmbH`, true)
      out(`\t${d('Product Name:')} VirtualBox`, true)
      out(`\t${d('Version:')} 1.2`, true)
      break

    case 'hdparm': {
      const dev = args.find(a => a.startsWith('/dev/')) || '/dev/sda'
      if (args.includes('-I')) {
        out(y(`\n/dev/sda:\n`), true)
        out(`\t${w('ATA device, with non-removable media')}`, true)
        out(`\t${d('Model Number:')}       VBOX HARDDISK`, true)
        out(`\t${d('Serial Number:')}      VBabc12345-def67890`, true)
        out(`\t${d('Firmware Revision:')}  1.0`, true)
        out(`\t${d('Transport:')}          Serial, ATA8-AST`, true)
        out(`\t${d('Standards:')}          Supported: 9 8 7 6 5`, true)
        out(`\t${w('Capabilities:')}`, true)
        out(`\t\tDMA: mdma0 mdma1 mdma2 udma0 udma1 udma2 udma3 udma4 ${g('*udma5')}`, true)
        out(`\t\tCycle time: min=120ns recommended=120ns`, true)
      } else if (args.includes('-t')) {
        out(y(`\nTiming buffered disk reads for ${dev}:`), true)
        out(`  3 reads: ${g('378.12 MB in  3.01 seconds = 125.63 MB/sec')}`, true)
      } else {
        out(d(`hdparm: use -I for identity info, -t for speed test`), true)
      }
      break
    }

    case 'udevadm': {
      const sub = args[0]
      if (sub === 'info') {
        const dev = args.find(a => a.startsWith('/dev/')) || '/dev/sda'
        out(`${y('P:')} /devices/pci0000:00/0000:00:1f.2/ata1/host0/target0:0:0/0:0:0:0/block/sda`, true)
        out(`${y('N:')} sda`, true)
        out(`${y('S:')} disk/by-id/ata-VBOX_HARDDISK_VBabc12345`, true)
        out(`${y('E:')} DEVNAME=${w(dev)}`, true)
        out(`${y('E:')} DEVTYPE=${w('disk')}`, true)
        out(`${y('E:')} ID_BUS=${w('ata')}`, true)
        out(`${y('E:')} ID_MODEL=${w('VBOX_HARDDISK')}`, true)
        out(`${y('E:')} ID_SERIAL_SHORT=${w('VBabc12345')}`, true)
        out(`${y('E:')} SUBSYSTEM=${w('block')}`, true)
      } else if (sub === 'monitor') {
        out(d('monitor will print the received events for:'), true)
        out(d('UDEV - the event which udev sends out after rule processing'), true)
        out(d('KERNEL - the kernel uevent'), true)
        out('', true)
        out(g('KERNEL[12345.678] add      /devices/.../usb1/1-2 (usb)'), true)
        out(g('UDEV  [12345.690] add      /devices/.../usb1/1-2 (usb)'), true)
        out(d('(simulation — press Ctrl+C to stop)'), true)
      } else if (sub === 'trigger') {
        out(g('udevadm: events triggered'), true)
      } else if (sub === 'control' && args[1] === '--reload-rules') {
        out(g('udevadm: rules reloaded'), true)
      } else if (sub === 'settle') {
        out(g('udevadm: all events settled'), true)
      } else {
        out(d('Usage: udevadm {info|monitor|trigger|control|settle} [OPTIONS]'), true)
      }
      break
    }

    case 'lscpu':
      out(`${y('Architecture:')}                    ${w('x86_64')}`, true)
      out(`${y('CPU op-mode(s):')}                  ${w('32-bit, 64-bit')}`, true)
      out(`${y('CPU(s):')}                          ${w('4')}`, true)
      out(`${y('Model name:')}                      ${w('Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz')}`, true)
      out(`${y('Thread(s) per core:')}              ${w('1')}`, true)
      out(`${y('Core(s) per socket:')}              ${w('4')}`, true)
      out(`${y('CPU MHz:')}                         ${w('1800.000')}`, true)
      out(`${y('L2 cache:')}                        ${w('1 MiB')}`, true)
      out(`${y('L3 cache:')}                        ${w('6 MiB')}`, true)
      break

    case 'dmesg':
      out(d('[    0.000000] Linux version 5.15.0-91-generic (buildd@lcy02)'), true)
      out(d('[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-5.15.0-91-generic root=/dev/sda1 ro quiet'), true)
      out(d('[    0.241973] ACPI: IRQ0 used by override.'), true)
      out(g('[    1.234215] EXT4-fs (sda1): mounted filesystem with ordered data mode.'), true)
      out(g('[    2.345678] systemd[1]: Detected virtualization oracle.'), true)
      out(d('[   12.000000] IPv6: ADDRCONF(NETDEV_UP): eth0: link is not ready'), true)
      out(g('[   12.123456] e1000: eth0 NIC Link is Up 1000 Mbps Full Duplex'), true)
      break

    // ── Network ──────────────────────────────────────────────
    case 'ifconfig':
      out(`${b('eth0')}: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500`, true)
      out(`        ${y('inet')} ${w('192.168.1.100')}  netmask ${d('255.255.255.0')}  broadcast ${d('192.168.1.255')}`, true)
      out(`        ${y('inet6')} ${w('fe80::a00:27ff:fe4e:66a1')}  prefixlen 64  scopeid ${d('0x20<link>')}`, true)
      out(`        ${d('ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)')}`, true)
      out(`        ${d('RX packets 12345  bytes 8765432 (8.3 MiB)')}`, true)
      out('', true)
      out(`${b('lo')}: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536`, true)
      out(`        ${y('inet')} ${w('127.0.0.1')}  netmask ${d('255.0.0.0')}`, true)
      break

    case 'ip':
      if (args[0] === 'addr' || args[0] === 'a') {
        out(`1: ${b('lo')}: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN`, true)
        out(`    ${y('inet')} ${w('127.0.0.1/8')} scope host lo`, true)
        out(`2: ${b('eth0')}: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP`, true)
        out(`    ${y('inet')} ${w('192.168.1.100/24')} brd ${d('192.168.1.255')} scope global eth0`, true)
      } else if (args[0] === 'route' || args[0] === 'r') {
        out(`default via ${w('192.168.1.1')} dev ${b('eth0')}`, true)
        out(`${w('192.168.1.0/24')} dev ${b('eth0')} proto kernel scope link src ${w('192.168.1.100')}`, true)
      }
      break

    case 'ping':
      if (!args.length) { err('missing host operand'); break }
      out(d(`PING ${args[0]} (93.184.216.34) 56(84) bytes of data.`), true)
      for (let i=1; i<=4; i++) out(g(`64 bytes from ${args[0]}: icmp_seq=${i} ttl=56 time=12.${i*3} ms`), true)
      out(d(`\n--- ${args[0]} ping statistics ---`), true)
      out(d(`4 packets transmitted, 4 received, 0% packet loss, time 3004ms`), true)
      break

    case 'netstat': case 'ss':
      out(`${y('Proto')} ${y('Recv-Q')} ${y('Send-Q')} ${y('Local Address           ')} ${y('Foreign Address         ')} ${y('State')}`, true)
      out(`${w('tcp  ')} ${d('     0')} ${d('     0')} ${w('0.0.0.0:22              ')} ${d('0.0.0.0:*               ')} ${g('LISTEN')}`, true)
      out(`${w('tcp  ')} ${d('     0')} ${d('     0')} ${w('192.168.1.100:22        ')} ${d('192.168.1.50:54321      ')} ${g('ESTABLISHED')}`, true)
      out(`${w('tcp  ')} ${d('     0')} ${d('     0')} ${w('127.0.0.1:631           ')} ${d('0.0.0.0:*               ')} ${g('LISTEN')}`, true)
      break

    // ── Archives ─────────────────────────────────────────────
    case 'tar': {
      const f = args.filter(a=>!a.startsWith('-')).join(' ')
      if (args.join('').includes('x')) out(g(`Extracting from archive...`), true)
      else if (args.join('').includes('c')) out(g(`Creating archive: ${f}`), true)
      else if (args.join('').includes('t')) {
        out(d('drwxr-xr-x user/user         0 2026-03-06 01:00 ./'), true)
        out(w('-rw-r--r-- user/user      1234 2026-03-06 01:00 ./file.txt'), true)
      }
      break
    }
    case 'gzip':
      out(g(`${args[0] || 'file'} compressed → ${args[0] || 'file'}.gz`), true); break
    case 'gunzip': case 'zcat':
      out(g(`Decompressing ${args[0] || 'file.gz'}...`), true); break

    // ── Text utils ───────────────────────────────────────────
    case 'sort': case 'uniq': case 'cut': case 'tr': case 'tee': case 'diff':
      out(d(`[${cmd}: pipe input required — redirect a file with < or use pipe |]`), true); break

    case 'awk': case 'sed':
      out(d(`[${cmd}: pipe input required for interactive use]`), true); break

    // ── User management ──────────────────────────────────────
    case 'useradd':
      out(g(`User '${args.find(a=>!a.startsWith('-')) || 'newuser'}' created`), true); break
    case 'userdel':
      out(y(`User '${args[0]}' deleted`), true); break
    case 'usermod':
      out(g(`User modified`), true); break
    case 'groupadd':
      out(g(`Group '${args[0]}' created`), true); break
    case 'passwd':
      out(d('Enter new UNIX password: '), true)
      out(d('Retype new UNIX password: '), true)
      out(g(`passwd: password updated successfully`), true); break

    case 'su':
      if (!args.length || args[0] === '-') {
        out(d(`Password: `), true)
        out(g(`Switched to root. Type 'exit' to return.`), true)
        st.user = 'root'; st.cwd = '/root'
      } else {
        out(d(`Password: `), true)
        out(g(`Switched to user ${args[0]}`), true)
        st.user = args[0]; st.cwd = `/home/${args[0]}`
      }
      break

    case 'sudo':
      if (!args.length) { err('no command specified'); break }
      out(d(`[sudo] password for ${st.user}: `), true)
      out(g(`Executing: ${args.join(' ')} as root`), true); break

    // ── Shell builtins / misc ────────────────────────────────
    case 'history':
      state.history.forEach((cmd2, i) => out(`${d(String(i+1).padStart(5))}  ${w(cmd2)}`, true))
      break

    case 'clear':
      lines.push({ text: '__CLEAR__' }); break

    case 'man': {
      const topic = args[0]
      const manPages: Record<string,string> = {
        ls: `LS(1)\n\nNAME\n    ls - list directory contents\n\nSYNOPSIS\n    ls [OPTION]... [FILE]...\n\nOPTIONS\n    -a    do not ignore entries starting with .\n    -l    use a long listing format\n    -h    with -l, print human readable sizes`,
        chmod: `CHMOD(1)\n\nNAME\n    chmod - change file mode bits\n\nSYNOPSIS\n    chmod [OPTION]... MODE[,MODE]... FILE...\n    chmod [OPTION]... OCTAL-MODE FILE...\n\nMODES\n    u=user, g=group, o=other, a=all\n    r=read(4), w=write(2), x=execute(1)`,
        grep: `GREP(1)\n\nNAME\n    grep - print lines that match patterns\n\nSYNOPSIS\n    grep [OPTIONS] PATTERN [FILE...]\n\nOPTIONS\n    -i    case insensitive\n    -n    show line numbers\n    -r    recursive\n    -v    invert match`,
        systemctl: `SYSTEMCTL(1)\n\nNAME\n    systemctl - Control the systemd system and service manager\n\nSYNOPSIS\n    systemctl [OPTIONS...] COMMAND [UNIT...]\n\nCOMMANDS\n    start     Start unit\n    stop      Stop unit\n    restart   Restart unit\n    status    Show status\n    enable    Enable unit at boot\n    disable   Disable unit at boot\n    get-default   Get default target\n    set-default   Set default target`,
      }
      if (manPages[topic]) {
        out(b('──────────────────────────────'), true)
        manPages[topic].split('\n').forEach(l => out(w(l), true))
        out(b('──────────────────────────────'), true)
        out(d('(end of man page)'), true)
      } else if (topic) {
        out(r(`No manual entry for ${topic}`), true)
      } else {
        err('what manual page do you want?')
      }
      break
    }

    case 'help':
      out(b('── LPI Terminal Simulator ─ Available commands ──────────────────'), true)
      out('', true)
      out(`${y('Navigation:')}  ls, cd, pwd, find`, true)
      out(`${y('Files:')}       cat, echo, touch, mkdir, rm, rmdir, cp, mv, ln, stat, file`, true)
      out(`${y('Text:')}        grep, head, tail, wc, sort, uniq, cut`, true)
      out(`${y('Permissions:')} chmod, chown, chgrp, umask`, true)
      out(`${y('Process:')}     ps, top, kill, nice, nohup`, true)
      out(`${y('System:')}      uname, hostname, uptime, date, whoami, id, env, export`, true)
      out(`${y('Disk:')}        df, du, lsblk, fdisk, mount, umount`, true)
      out(`${y('Init/Systemd:')} systemctl, service, runlevel, init, shutdown, reboot`, true)
      out(`${y('Packages:')}    dpkg, apt, apt-get, rpm, yum, dnf`, true)
      out(`${y('Kernel:')}      lsmod, modprobe, modinfo, rmmod, lspci, lsusb, lshw, dmidecode, hdparm, lscpu, dmesg, udevadm`, true)
      out(`${y('Network:')}     ifconfig, ip, ping, netstat, ss`, true)
      out(`${y('Archive:')}     tar, gzip, gunzip`, true)
      out(`${y('Users:')}       useradd, userdel, usermod, groupadd, passwd, su, sudo`, true)
      out(`${y('Shell:')}       which, whereis, type, man, history, clear, help, exit`, true)
      out('', true)
      out(d('Tip: Use ↑/↓ to navigate history, Tab to complete paths'), true)
      break

    case 'exit': case 'logout':
      out(d('logout'), true)
      break

    case '': break

    default:
      if (trimmed.startsWith('./')) {
        const p = resolvePath(trimmed.split(' ')[0], st.cwd)
        const e = getEntry(p, st.overlay)
        if (!e) out(r(`bash: ${trimmed.split(' ')[0]}: No such file or directory`), true)
        else out(g(`[Executing ${trimmed.split(' ')[0]}...]`), true)
      } else {
        out(r(`bash: ${cmd}: command not found`), true)
        out(d(`Type 'help' for available commands`), true)
      }
  }

  return { lines, newState: st }
}
