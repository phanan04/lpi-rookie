'use client'
import Terminal from '@/components/Terminal'
import Link from 'next/link'

export default function TerminalPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: '#646669' }}>
          <Link href="/" style={{ color: '#646669' }} className="hover:text-white transition-colors">trang chủ</Link>
          <span style={{ color: '#404244' }}>/</span>
          <span style={{ color: '#d1d0c5', fontWeight: 500 }}>terminal</span>
        </nav>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#d1d0c5', fontFamily: 'Lexend Deca, sans-serif', letterSpacing: '-0.01em' }}>
          linux terminal
        </h1>
        <p className="text-sm" style={{ color: '#646669' }}>
          luyện tập lệnh linux cho kỳ thi LPI · ~60 lệnh được mô phỏng · filesystem ảo đầy đủ
        </p>
      </div>

      {/* Quick reference */}
      <div style={{ background: '#2c2e31', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', padding: '14px 18px' }}>
        <p className="text-xs mb-2" style={{ color: '#646669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>gợi ý nhanh</p>
        <div className="flex flex-wrap gap-2">
          {['ls -la /etc','cat /etc/passwd','systemctl status ssh','df -h','ps aux','lsmod','fdisk -l','uname -a','chmod 755 file.sh'].map(cmd => (
            <span key={cmd} style={{
              background: 'rgba(226,183,20,0.08)',
              border: '1px solid rgba(226,183,20,0.15)',
              borderRadius: '5px',
              padding: '2px 10px',
              color: '#e2b714',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              cursor: 'default',
            }}>
              {cmd}
            </span>
          ))}
        </div>
      </div>

      {/* Terminal */}
      <Terminal height="520px" />

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'keyboard shortcuts', items: ['↑↓ — history', 'Tab — autocomplete', 'Ctrl+C — cancel', 'Ctrl+L — clear'] },
          { title: 'thử lệnh hay', items: ['ls -la /etc', 'cat /etc/fstab', 'systemctl list-units', 'find / -name "*.conf"'] },
          { title: 'lpi exam tips', items: ['chmod 644 = rw-r--r--', 'runlevel 3 = multi-user', 'runlevel 5 = graphical', '/etc/passwd format: user:x:uid:gid'] },
        ].map(tip => (
          <div key={tip.title} style={{ background: '#2c2e31', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', padding: '14px 18px' }}>
            <p className="text-xs mb-2" style={{ color: '#646669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tip.title}</p>
            <ul className="space-y-1">
              {tip.items.map(item => (
                <li key={item} className="text-xs" style={{ color: '#d1d0c5', fontFamily: 'JetBrains Mono, monospace' }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
