// ── Virtual Linux Filesystem ──────────────────────────────
// Simulated filesystem for LPI 101-500 practice

export type FSEntry = {
  type: 'file' | 'dir'
  content?: string
  perm: string       // e.g. "-rw-r--r--" or "drwxr-xr-x"
  owner: string
  group: string
  size: number
  mtime: string
}

export const VFS: Record<string, FSEntry> = {
  '/':                  { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Mar  6 05:44' },
  '/etc':               { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 15 10:23' },
  '/home':              { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Jan 12 08:00' },
  '/home/user':         { type:'dir', perm:'drwxr-xr-x', owner:'user', group:'user', size:4096, mtime:'Mar  6 05:44' },
  '/home/user/Documents': { type:'dir', perm:'drwxr-xr-x', owner:'user', group:'user', size:4096, mtime:'Mar  1 09:00' },
  '/home/user/Downloads': { type:'dir', perm:'drwxr-xr-x', owner:'user', group:'user', size:4096, mtime:'Mar  3 14:22' },
  '/proc':              { type:'dir', perm:'dr-xr-xr-x', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44' },
  '/sys':               { type:'dir', perm:'dr-xr-xr-x', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44' },
  '/var':               { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 20 11:00' },
  '/var/log':           { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'syslog', size:4096, mtime:'Mar  6 05:44' },
  '/var/lib':           { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 20 11:00' },
  '/var/lib/dpkg':      { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 20 11:00' },
  '/tmp':               { type:'dir', perm:'drwxrwxrwt', owner:'root', group:'root', size:4096, mtime:'Mar  6 05:44' },
  '/usr':               { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 10 08:00' },
  '/usr/bin':           { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 10 08:00' },
  '/usr/sbin':          { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 10 08:00' },
  '/usr/local':         { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Jan  1 00:00' },
  '/bin':               { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 10 08:00' },
  '/sbin':              { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 10 08:00' },
  '/root':              { type:'dir', perm:'drwx------', owner:'root', group:'root', size:4096, mtime:'Mar  5 22:10' },
  '/boot':              { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 10 08:00' },
  '/dev':               { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:3760, mtime:'Mar  6 05:44' },
  '/lib':               { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 10 08:00' },
  '/mnt':               { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Jan  1 00:00' },
  '/media':             { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Jan  1 00:00' },
  '/opt':               { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Jan  1 00:00' },
  '/srv':               { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Jan  1 00:00' },

  // ── /etc files ──────────────────────────────────────────
  '/etc/passwd': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:1456, mtime:'Feb 10 08:12',
    content: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:100:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
sshd:x:105:65534::/run/sshd:/usr/sbin/nologin
user:x:1000:1000:User,,,:/home/user:/bin/bash`
  },
  '/etc/shadow': {
    type:'file', perm:'-rw-r-----', owner:'root', group:'shadow', size:892, mtime:'Feb 10 08:12',
    content: `root:$6$xyz$hashedpassword:19400:0:99999:7:::
daemon:*:19400:0:99999:7:::
user:$6$abc$hashedpassword:19400:0:99999:7:::` 
  },
  '/etc/group': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:748, mtime:'Feb 10 08:12',
    content: `root:x:0:
daemon:x:1:
bin:x:2:
sys:x:3:
adm:x:4:syslog,user
tty:x:5:
disk:x:6:
lp:x:7:
mail:x:8:
news:x:9:
www-data:x:33:
sudo:x:27:user
shadow:x:42:
audio:x:29:user
video:x:44:user
user:x:1000:`
  },
  '/etc/fstab': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:742, mtime:'Jan 15 09:30',
    content: `# /etc/fstab: static file system information.
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/sda1 during installation
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890  /               ext4    errors=remount-ro  0       1
# /boot was on /dev/sda2 during installation
UUID=b2c3d4e5-f6a7-8901-bcde-f12345678901  /boot           ext4    defaults           0       2
# swap was on /dev/sda3 during installation
UUID=c3d4e5f6-a7b8-9012-cdef-123456789012  none            swap    sw                 0       0
# tmpfs
tmpfs                                       /tmp            tmpfs   defaults,noatime   0       0
/dev/cdrom                                  /media/cdrom0   udf,iso9660 user,noauto    0       0`
  },
  '/etc/hostname': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:8, mtime:'Jan 12 08:00',
    content: 'lpi-vm'
  },
  '/etc/hosts': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:221, mtime:'Jan 12 08:00',
    content: `127.0.0.1   localhost
127.0.1.1   lpi-vm
::1         localhost ip6-localhost ip6-loopback
fe00::0     ip6-localnet
ff00::0     ip6-mcastprefix
ff02::1     ip6-allnodes
ff02::2     ip6-allrouters`
  },
  '/etc/resolv.conf': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:73, mtime:'Mar  6 05:44',
    content: `# Generated by NetworkManager
nameserver 8.8.8.8
nameserver 1.1.1.1
search localdomain`
  },
  '/etc/os-release': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:381, mtime:'Jan 10 00:00',
    content: `PRETTY_NAME="Ubuntu 22.04.3 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04.3 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy`
  },
  '/etc/motd': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:286, mtime:'Jan 10 00:00',
    content: `
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)

  System information as of Thu Mar  6 05:44:00 UTC 2026

  System load:  0.08              Processes:           142
  Usage of /:   23.4% of 19.56GB  Users logged in:     1
  Memory usage: 45%               IPv4 address: 192.168.1.100

LPI 101-500 Practice Environment
`
  },
  '/etc/shells': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:94, mtime:'Jan 10 00:00',
    content: `/bin/sh
/bin/bash
/usr/bin/bash
/bin/rbash
/usr/bin/rbash
/bin/dash
/usr/bin/dash
/usr/bin/zsh`
  },
  '/etc/crontab': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:722, mtime:'Jan 10 00:00',
    content: `# /etc/crontab: system-wide crontab
# m h dom mon dow user  command
17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6    1 * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )`
  },
  '/etc/inittab': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:884, mtime:'Jan 10 00:00',
    content: `# /etc/inittab  (SysV init - for reference, systemd is now default)
# Default runlevel. The runlevels are:
#   0 - halt (Do NOT set initdefault to this)
#   1 - Single user mode
#   2 - Multiuser, without NFS
#   3 - Full multiuser mode (text)
#   4 - unused
#   5 - X11 (graphical)
#   6 - reboot (Do NOT set initdefault to this)
id:5:initdefault:
si::sysinit:/etc/init.d/rcS
l0:0:wait:/etc/init.d/rc 0
l1:1:wait:/etc/init.d/rc 1
l2:2:wait:/etc/init.d/rc 2
l3:3:wait:/etc/init.d/rc 3
l5:5:wait:/etc/init.d/rc 5
l6:6:wait:/etc/init.d/rc 6
ca:12345:ctrlaltdel:/sbin/shutdown -t1 -a -r now`
  },

  // ── /proc files ──────────────────────────────────────────
  '/proc/cpuinfo': {
    type:'file', perm:'-r--r--r--', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44',
    content: `processor	: 0
vendor_id	: GenuineIntel
cpu family	: 6
model		: 142
model name	: Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz
stepping	: 10
microcode	: 0xea
cpu MHz		: 1800.000
cache size	: 6144 KB
physical id	: 0
siblings	: 4
core id		: 0
cpu cores	: 4
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ht syscall nx rdtscp lm constant_tsc rep_good nopl cpuid pni pclmulqdq ssse3 cx16 sse4_1 sse4_2 x2apic popcnt tsc_deadline_timer aes xsave avx
bogomips	: 3600.00
clflush size	: 64
cache_alignment	: 64
address sizes	: 39 bits physical, 48 bits virtual`
  },
  '/proc/meminfo': {
    type:'file', perm:'-r--r--r--', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44',
    content: `MemTotal:        8145720 kB
MemFree:         3241456 kB
MemAvailable:    5023844 kB
Buffers:          182340 kB
Cached:          1891420 kB
SwapCached:            0 kB
Active:          2341568 kB
Inactive:        1523456 kB
SwapTotal:       2097148 kB
SwapFree:        2097148 kB
Dirty:               128 kB
Writeback:             0 kB
AnonPages:       1791480 kB
Mapped:           512340 kB
VmallocTotal:   34359738367 kB`
  },
  '/proc/version': {
    type:'file', perm:'-r--r--r--', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44',
    content: `Linux version 5.15.0-91-generic (buildd@lcy02-amd64-059) (gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0, GNU ld (GNU Binutils for Ubuntu) 2.38) #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023`
  },
  '/proc/mounts': {
    type:'file', perm:'-r--r--r--', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44',
    content: `sysfs /sys sysfs rw,nosuid,nodev,noexec,relatime 0 0
proc /proc proc rw,nosuid,nodev,noexec,relatime 0 0
devtmpfs /dev devtmpfs rw,nosuid,size=4096k,nr_inodes=4096,mode=755 0 0
tmpfs /run tmpfs rw,nosuid,nodev,noexec,relatime,size=1629148k,mode=755 0 0
/dev/sda1 / ext4 rw,relatime,errors=remount-ro 0 0
/dev/sda2 /boot ext4 rw,relatime 0 0
tmpfs /tmp tmpfs rw,nosuid,nodev,noatime 0 0`
  },

  // ── /etc/systemd ──────────────────────────────────────────
  '/etc/systemd': { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Jan 10 00:00' },
  '/etc/systemd/system': { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Jan 10 00:00' },

  // ── /var/log ──────────────────────────────────────────────
  '/var/log/syslog': {
    type:'file', perm:'-rw-r-----', owner:'syslog', group:'adm', size:51200, mtime:'Mar  6 05:44',
    content: `Mar  6 05:44:01 lpi-vm systemd[1]: Starting Daily apt download activities...
Mar  6 05:44:01 lpi-vm systemd[1]: Started Daily apt download activities.
Mar  6 05:44:03 lpi-vm kernel: [12345.678901] EXT4-fs (sda1): re-mounted. Opts: errors=remount-ro
Mar  6 05:44:10 lpi-vm sshd[1234]: Accepted publickey for user from 192.168.1.50 port 54321 ssh2
Mar  6 05:44:10 lpi-vm systemd-logind[456]: New session 3 of user user.`
  },
  '/var/log/auth.log': {
    type:'file', perm:'-rw-r-----', owner:'syslog', group:'adm', size:8192, mtime:'Mar  6 05:44',
    content: `Mar  6 05:44:10 lpi-vm sshd[1234]: Accepted publickey for user from 192.168.1.50
Mar  6 05:44:10 lpi-vm sshd[1234]: pam_unix(sshd:session): session opened for user user(uid=1000) by (uid=0)
Mar  6 05:40:01 lpi-vm sudo: user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/usr/bin/apt update`
  },

  // ── /home/user files ──────────────────────────────────────
  '/home/user/.bashrc': {
    type:'file', perm:'-rw-r--r--', owner:'user', group:'user', size:3526, mtime:'Jan 12 08:00',
    content: `# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files

# don't put duplicate lines or lines starting with space in the history.
HISTCONTROL=ignoreboth
HISTSIZE=1000
HISTFILESIZE=2000

# enable color support of ls
if [ -x /usr/bin/dircolors ]; then
    eval "\$(dircolors -b)"
    alias ls='ls --color=auto'
fi

# some useful aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'

# prompt
PS1='\\u@\\h:\\w\\$ '`
  },
  '/home/user/.bash_history': {
    type:'file', perm:'-rw-r--r--', owner:'user', group:'user', size:512, mtime:'Mar  6 05:30',
    content: `ls -la
cd /etc
cat /etc/passwd
systemctl status ssh
df -h
ps aux
sudo apt update
chmod 755 script.sh
grep -r "root" /etc/passwd
uname -a`
  },
  '/home/user/Documents/notes.txt': {
    type:'file', perm:'-rw-r--r--', owner:'user', group:'user', size:256, mtime:'Mar  5 14:00',
    content: `LPI 101-500 Study Notes
========================
Topic 101: System Architecture
- Know SysV runlevels 0-6
- systemd targets: multi-user.target = runlevel 3
- graphical.target = runlevel 5

Topic 102: Linux Installation
- Primary partition: max 4 per disk
- Extended partition can contain logical drives
- /boot usually separate, small (200-500MB)`
  },
  '/home/user/script.sh': {
    type:'file', perm:'-rwxr-xr-x', owner:'user', group:'user', size:128, mtime:'Mar  4 16:30',
    content: `#!/bin/bash
# Sample script for LPI practice
echo "System information:"
uname -a
echo "Disk usage:"
df -h
echo "Memory:"
free -h`
  },

  // ── /boot ──────────────────────────────────────────────────
  '/boot/grub': { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 10 08:00' },
  // ── /proc additional files ────────────────────────────────
  '/proc/interrupts': {
    type:'file', perm:'-r--r--r--', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44',
    content: `           CPU0       CPU1       CPU2       CPU3
  0:         16          0          0          0  IO-APIC   2-edge      timer
  1:          0          0        142          0  IO-APIC   1-edge      i8042 (keyboard)
  3:          0          0          0          0  IO-APIC   3-edge      ttyS1 (COM2)
  4:          0          8          0          0  IO-APIC   4-edge      ttyS0 (COM1)
  6:          0          0          0          2  IO-APIC   6-edge      floppy
  8:          0          1          0          0  IO-APIC   8-edge      rtc0
  9:          0          0          0          0  IO-APIC   9-fasteoi   acpi
 14:        256          0          0          0  IO-APIC  14-edge      ata_piix
 15:          0          0          0        512  IO-APIC  15-edge      ata_piix
 24:          0          0       4321          0  PCI-MSI 524288-edge   0000:00:1f.2 (SATA)
 25:         12          0          0          0  PCI-MSI 512000-edge   eth0
NMI:          0          0          0          0  Non-maskable interrupts
LOC:    1234567    1020304    1011234    1009876  Local timer interrupts`
  },
  '/proc/dma': {
    type:'file', perm:'-r--r--r--', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44',
    content: ` 1: parport0
 2: floppy
 4: cascade`
  },
  '/proc/ioports': {
    type:'file', perm:'-r--r--r--', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44',
    content: `0000-0000 : PCI Bus 0000:00
  0000-001f : dma1
  0020-0021 : PIC (8259A)
  0040-0043 : timer0
  0060-006f : keyboard (i8042)
  0070-0077 : rtc0
  00f0-00ff : fpu
  0170-0177 : ata_piix (IDE secondary)
  01f0-01f7 : ata_piix (IDE primary)
  02f8-02ff : serial (ttyS1 / COM2)
  0376-0376 : ata_piix
  03c0-03df : vga+
  03f2-03f5 : floppy
  03f6-03f6 : ata_piix
  03f8-03ff : serial (ttyS0 / COM1)
  0cf8-0cff : PCI conf1`
  },
  '/proc/modules': {
    type:'file', perm:'-r--r--r--', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44',
    content: `xt_conntrack 24576 1 - Live 0xffffffffc0a00000
nft_chain_ipv4 16384 1 - Live 0xffffffffc09f0000
ip_tables 32768 2 iptable_filter,iptable_nat Live 0xffffffffc09e0000
ext4 794624 2 - Live 0xffffffffc08e0000
mbcache 16384 1 ext4 Live 0xffffffffc08d0000
jbd2 135168 1 ext4 Live 0xffffffffc08b0000
vboxguest 356352 2 - Live 0xffffffffc0850000`
  },
  '/proc/cmdline': {
    type:'file', perm:'-r--r--r--', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44',
    content: `BOOT_IMAGE=/vmlinuz-5.15.0-91-generic root=/dev/sda1 ro quiet splash`
  },
  '/proc/partitions': {
    type:'file', perm:'-r--r--r--', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44',
    content: `major minor  #blocks  name

   8        0   20971520 sda
   8        1   18874368 sda1
   8        2     524288 sda2
   8        3    1572864 sda3
  11        0    1048575 sr0`
  },

  // ── /dev entries ──────────────────────────────────────────
  '/dev/sda':   { type:'file', perm:'brw-rw----', owner:'root', group:'disk', size:0, mtime:'Mar  6 05:44', content:'' },
  '/dev/sda1':  { type:'file', perm:'brw-rw----', owner:'root', group:'disk', size:0, mtime:'Mar  6 05:44', content:'' },
  '/dev/sda2':  { type:'file', perm:'brw-rw----', owner:'root', group:'disk', size:0, mtime:'Mar  6 05:44', content:'' },
  '/dev/sda3':  { type:'file', perm:'brw-rw----', owner:'root', group:'disk', size:0, mtime:'Mar  6 05:44', content:'' },
  '/dev/sr0':   { type:'file', perm:'brw-rw----', owner:'root', group:'cdrom', size:0, mtime:'Mar  6 05:44', content:'' },
  '/dev/tty0':  { type:'file', perm:'crw--w----', owner:'root', group:'tty',  size:0, mtime:'Mar  6 05:44', content:'' },
  '/dev/ttyS0': { type:'file', perm:'crw-rw----', owner:'root', group:'dialout', size:0, mtime:'Mar  6 05:44', content:'' },
  '/dev/null':  { type:'file', perm:'crw-rw-rw-', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44', content:'' },
  '/dev/zero':  { type:'file', perm:'crw-rw-rw-', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44', content:'' },
  '/dev/random':{ type:'file', perm:'crw-rw-rw-', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44', content:'' },
  '/dev/urandom':{ type:'file', perm:'crw-rw-rw-', owner:'root', group:'root', size:0, mtime:'Mar  6 05:44', content:'' },

  // ── /etc/modprobe.d & module config ───────────────────────
  '/etc/modprobe.d': { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Jan 10 00:00' },
  '/etc/modprobe.d/blacklist.conf': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:256, mtime:'Jan 10 00:00',
    content: `# Blacklist modules to prevent auto-loading
# Add lines like: blacklist <module_name>
blacklist nouveau
blacklist pcspkr
# options example:
# options iwlwifi 11n_disable=1`
  },
  '/etc/modules-load.d': { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Jan 10 00:00' },
  '/etc/modules-load.d/modules.conf': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:64, mtime:'Jan 10 00:00',
    content: `# Modules to load at boot (systemd-based systems)
loop
dm_mod`
  },
  '/etc/modules': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:128, mtime:'Jan 10 00:00',
    content: `# /etc/modules: kernel modules to load at boot time (Debian/Ubuntu)
# Add one module per line
loop
dm_mod`
  },
  '/lib/modules': { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 10 08:00' },
  '/lib/modules/5.15.0-91-generic': { type:'dir', perm:'drwxr-xr-x', owner:'root', group:'root', size:4096, mtime:'Feb 10 08:00' },
  '/lib/modules/5.15.0-91-generic/modules.dep': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:512, mtime:'Feb 10 08:00',
    content: `kernel/fs/ext4/ext4.ko: kernel/fs/jbd2/jbd2.ko kernel/lib/mbcache.ko
kernel/fs/jbd2/jbd2.ko:
kernel/lib/mbcache.ko:
kernel/drivers/net/ethernet/intel/e1000/e1000.ko:`
  },

  '/boot/grub/grub.cfg': {
    type:'file', perm:'-rw-r--r--', owner:'root', group:'root', size:4563, mtime:'Feb 10 08:00',
    content: `# GRUB Configuration File
# Auto-generated by grub-mkconfig
set default="0"
set timeout=5

menuentry 'Ubuntu' {
  insmod ext2
  set root='hd0,msdos1'
  linux   /vmlinuz-5.15.0-91-generic root=/dev/sda1 ro  quiet splash
  initrd  /initrd.img-5.15.0-91-generic
}

menuentry 'Ubuntu (recovery mode)' {
  insmod ext2
  set root='hd0,msdos1'
  linux   /vmlinuz-5.15.0-91-generic root=/dev/sda1 ro single
  initrd  /initrd.img-5.15.0-91-generic
}`
  },
}

// Directories → list of child names
export function getChildren(path: string, overlay: Record<string, FSEntry>): string[] {
  const merged = { ...VFS, ...overlay }
  const normalized = path.endsWith('/') && path !== '/' ? path.slice(0,-1) : path
  const children = new Set<string>()

  for (const key of Object.keys(merged)) {
    if (key === normalized) continue
    const parent = key.split('/').slice(0,-1).join('/') || '/'
    if (parent === normalized) {
      const name = key.split('/').pop()!
      children.add(name)
    }
  }
  return [...children].sort()
}

export function getEntry(path: string, overlay: Record<string, FSEntry>): FSEntry | null {
  const merged = { ...VFS, ...overlay }
  return merged[path] ?? null
}

export function resolvePath(rawPath: string, cwd: string): string {
  if (!rawPath) return cwd
  let path = rawPath.startsWith('/') ? rawPath : cwd + '/' + rawPath
  // home shortcut
  path = path.replace(/^~/, '/home/user')
  // normalize segments
  const parts = path.split('/').filter(Boolean)
  const resolved: string[] = []
  for (const p of parts) {
    if (p === '.') continue
    if (p === '..') { resolved.pop(); continue }
    resolved.push(p)
  }
  return '/' + resolved.join('/')
}
