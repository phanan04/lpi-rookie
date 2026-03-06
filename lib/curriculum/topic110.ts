import type { Topic } from '../types'
import { ShieldCheck } from 'lucide-react'

export const topic110: Topic = {
    id: '110',
    title: 'Security',
    icon: ShieldCheck,
    description: 'Perform security administration, configure host security, and encrypt data with GPG and SSH.',
    lessons: [
      {
        id: '110.1',
        topicId: '110',
        title: 'Perform Security Administration Tasks',
        weight: 3,
        description: 'Find and fix security issues: SUID/SGID files, open ports, password policies, sudo, and resource limits.',
        sections: [
          {
            type: 'h2',
            text: 'SUID, SGID, and Sticky Bit',
          },
          {
            type: 'table',
            headers: ['Bit', 'Octal', 'Symbol', 'Effect on Files', 'Effect on Directories'],
            rows: [
              ['SUID (Set UID)', '4000', 's in owner-execute', 'File runs with owner\'s privileges (e.g., /usr/bin/passwd)', 'No effect on directories'],
              ['SGID (Set GID)', '2000', 's in group-execute', 'File runs with group\'s privileges', 'New files inherit directory\'s group'],
              ['Sticky bit', '1000', 't in other-execute', '(Obsolete on modern Linux for files)', 'Only owner can delete their own files (e.g., /tmp)'],
            ],
          },
          {
            type: 'code',
            text: '# Find SUID files (security audit)\nfind / -perm /4000 -type f 2>/dev/null\nfind / -perm -4000 -type f 2>/dev/null    # same: has SUID bit set\n\n# Find SGID files\nfind / -perm /2000 -type f 2>/dev/null\n\n# Find both SUID and SGID\nfind / -perm /6000 -type f 2>/dev/null\n\n# Set SUID on a file\nchmod u+s /usr/bin/myprogram\nchmod 4755 /usr/bin/myprogram\n\n# Remove SUID\nchmod u-s /usr/bin/myprogram\n\n# Sticky bit on /tmp\nls -ld /tmp\n# drwxrwxrwt  (t = sticky bit)\nchmod +t /shared_dir',
          },
          {
            type: 'h2',
            text: 'sudo and /etc/sudoers',
          },
          {
            type: 'code',
            text: '# /etc/sudoers — ALWAYS edit with visudo (syntax checking!)\n# Format: WHO  WHERE=(AS_WHO) WHAT\nroot    ALL=(ALL:ALL) ALL      # root can do anything\nalice   ALL=(ALL) ALL          # alice can run anything as any user\nbob     ALL=(root) /bin/systemctl   # bob can only run systemctl as root\n%sudo   ALL=(ALL:ALL) ALL      # all members of sudo group\n%wheel  ALL=(ALL) NOPASSWD: ALL  # wheel group: no password prompt\n\n# Include additional sudoers files\n#includedir /etc/sudoers.d\n\n# Run command as another user\nsudo command              # as root (default)\nsudo -u alice command     # as alice\nsudo -i                   # interactive root login shell\nsudo -l                   # list what sudo allows for current user\nsudo -l -U alice          # list alice\'s sudo rights (root)\n\n# Log of sudo usage\n/var/log/auth.log         # Debian\n/var/log/secure           # RHEL',
          },
          {
            type: 'h2',
            text: 'Password and Account Security',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['passwd -l username', 'Lock account (prepend ! to hash in /etc/shadow)'],
              ['passwd -u username', 'Unlock account'],
              ['passwd -e username', 'Expire password — force change at next login'],
              ['chage -M 90 username', 'Set maximum password age to 90 days'],
              ['chage -W 14 username', 'Warn user 14 days before expiry'],
              ['chage -I 30 username', 'Disable account 30 days after password expiry'],
              ['chage -l username', 'List password aging policy'],
              ['usermod -L username', 'Lock user account'],
              ['usermod -e 2026-12-31 username', 'Set account expiry date'],
              ['nologin / false', 'Set shell to /sbin/nologin or /bin/false to prevent login'],
            ],
          },
          {
            type: 'h2',
            text: 'Open Ports and Services',
          },
          {
            type: 'code',
            text: '# List all listening ports and their processes\nss -tulnp\nnetstat -tulnp   # legacy\n\n# Find processes listening on a specific port\nss -tlnp | grep :22\nlsof -i :22\n\n# fuser — identify processes using files or ports\nfuser 22/tcp         # show PID using TCP port 22\nfuser 80/tcp 443/tcp # multiple ports\nfuser -k 22/tcp      # kill process using TCP port 22\nfuser /var/log/syslog  # show processes with file open\nfuser -m /mnt        # show processes using a mount point\n\n# nmap — network port scanner\nnmap localhost             # scan localhost\nnmap -sT 192.168.1.1       # TCP connect scan\nnmap -sU 192.168.1.1       # UDP scan\nnmap -p 22,80,443 host    # scan specific ports\nnmap -p 1-1024 host       # scan port range\nnmap -sV host             # detect service versions\nnmap 192.168.1.0/24       # scan entire subnet\n\n# Disable an unused service\nsystemctl stop telnet\nsystemctl disable telnet\nsystemctl mask telnet   # prevent from ever starting\n\n# Check which services start at boot\nsystemctl list-unit-files --type=service | grep enabled',
          },
          {
            type: 'h2',
            text: 'ulimit — Resource Limits',
          },
          {
            type: 'code',
            text: '# Show current limits\nulimit -a\n\n# Common limits:\nulimit -n 4096     # max open file descriptors\nulimit -u 1000     # max processes\nulimit -s 8192     # max stack size (KB)\nulimit -c 0        # core dump size: 0 = disabled\nulimit -c unlimited  # enable core dumps\n\n# -S = soft limit (current enforced), -H = hard limit (max)\nulimit -Sn         # show soft file descriptor limit\nulimit -Hn         # show hard file descriptor limit\n\n# Persistent limits in /etc/security/limits.conf:\n# USER  TYPE  ITEM  VALUE\nalice   soft  nofile   4096\nalice   hard  nofile   8192\n*       hard  core     0\n@developers  soft  nproc  500',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'SUID (4000): file runs as owner. SGID (2000): file runs as group, dirs make new files inherit group. Sticky bit (1000): on dirs, only owner deletes their files (/tmp). find / -perm /4000 finds SUID files. sudo: edit with visudo only; NOPASSWD skips password; sudo -l lists permissions for current user. passwd -l locks; chage manages password aging. ulimit -a shows limits; /etc/security/limits.conf persists limits. ss -tulnp lists listening ports with process info. fuser identifies processes by port: fuser 22/tcp; -k kills process. nmap scans ports: -sT TCP, -sU UDP, -sV version detection. Disable unused services with systemctl disable + stop + mask.',
          },
          {
            type: 'files',
            files: ['/etc/sudoers', '/etc/sudoers.d/', '/etc/security/limits.conf', '/etc/security/limits.d/'],
          },
        ],
      },
      {
        id: '110.2',
        topicId: '110',
        title: 'Setup Host Security',
        weight: 3,
        description: 'Configure TCP wrappers, disable unnecessary services, and understand shadow passwords.',
        sections: [
          {
            type: 'h2',
            text: 'TCP Wrappers — /etc/hosts.allow and /etc/hosts.deny',
          },
          {
            type: 'p',
            text: 'TCP wrappers (libwrap) add access control to network services that are linked against the library. Rules are checked: hosts.allow first — if matched, access granted. If not in allow, check hosts.deny — if matched, access denied. If not in either, access is granted.',
          },
          {
            type: 'code',
            text: '# /etc/hosts.allow — whitelist\n# Format: daemon_list : client_list [: option]\nsshd : 192.168.1.0/24        # allow SSH from local subnet\nALL  : 127.0.0.1             # allow everything from localhost\nsshd : .example.com          # allow ssh from *.example.com\nin.ftpd : ALL EXCEPT .evil.com\n\n# /etc/hosts.deny — blacklist (deny everything else)\nALL : ALL                    # deny all not explicitly allowed\nsshd : 10.0.0.0/8\n\n# Check if a service uses TCP wrappers\nldd /usr/sbin/sshd | grep libwrap\n\n# Test what access would be granted:\ntcpdchk          # syntax check hosts.allow and hosts.deny\ntcpdmatch sshd 192.168.1.50  # test if this IP gets access to sshd',
          },
          {
            type: 'h2',
            text: 'Disabling Unnecessary Network Services',
          },
          {
            type: 'code',
            text: '# List all services and their status\nsystemctl list-unit-files --type=service | grep enabled\n\n# Disable and stop unnecessary services\nsystemctl disable --now avahi-daemon\nsystemctl disable --now cups\nsystemctl disable --now bluetooth\n\n# Mask a service to prevent it from ever being started:\nsystemctl mask telnet.socket\nsystemctl mask rsh.socket\n\n# inetd / xinetd: legacy super-server\n# /etc/inetd.conf — comment out services to disable\n# /etc/xinetd.d/ — per-service config files (disable = yes)\n\n# Check inetd services\ncat /etc/inetd.conf | grep -v "^#"\nls /etc/xinetd.d/',
          },
          {
            type: 'h2',
            text: 'Shadow Password Suite',
          },
          {
            type: 'table',
            headers: ['Tool', 'Description'],
            rows: [
              ['pwconv', 'Convert /etc/passwd to shadow passwords (create /etc/shadow)'],
              ['pwunconv', 'Merge /etc/shadow back into /etc/passwd (remove shadow)'],
              ['grpconv', 'Convert /etc/group to use /etc/gshadow'],
              ['grpunconv', 'Merge /etc/gshadow back into /etc/group'],
              ['pwck', 'Verify integrity of /etc/passwd and /etc/shadow'],
              ['grpck', 'Verify integrity of /etc/group and /etc/gshadow'],
            ],
          },
          {
            type: 'h2',
            text: 'Intrusion Detection — Basics',
          },
          {
            type: 'table',
            headers: ['Tool', 'Description'],
            rows: [
              ['find / -perm /4000', 'Locate SUID files (potential privilege escalation)'],
              ['find / -nouser -o -nogroup', 'Find files with no owner (may indicate deleted user account)'],
              ['last', 'Show recent successful logins from /var/log/wtmp'],
              ['lastb', 'Show failed login attempts from /var/log/btmp'],
              ['who', 'Show currently logged-in users from /run/utmp'],
              ['w', 'Show who is logged in and what they are doing'],
              ['lastlog', 'Show last login time for each user'],
              ['lsof -i', 'Show all open network connections'],
              ['ps aux', 'Show all running processes — check for unexpected ones'],
            ],
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'TCP wrappers: hosts.allow checked first, then hosts.deny. Default policy depends on whether the service is listed — "ALL:ALL" in deny with specific allows is common. tcpdmatch tests rules. ldd checks if binary uses libwrap (TCP wrappers). pwconv/pwunconv moves passwords to/from /etc/shadow. pwck validates /etc/passwd integrity. Disable, stop, and mask unused services. last/lastb/who/w/lastlog are essential audit commands. find / -nouser finds orphaned files.',
          },
          {
            type: 'files',
            files: ['/etc/hosts.allow', '/etc/hosts.deny', '/etc/inetd.conf', '/etc/xinetd.d/', '/etc/shadow', '/etc/gshadow'],
          },
        ],
      },
      {
        id: '110.3',
        topicId: '110',
        title: 'Securing Data with Encryption',
        weight: 4,
        description: 'Use SSH key-based authentication and GPG to encrypt, sign, and verify data.',
        sections: [
          {
            type: 'h2',
            text: 'SSH Key-Based Authentication',
          },
          {
            type: 'code',
            text: '# Generate SSH key pair\nssh-keygen -t rsa -b 4096            # RSA 4096-bit\nssh-keygen -t ed25519                # Ed25519 (modern, recommended)\nssh-keygen -t ecdsa -b 521           # ECDSA 521-bit\n# Keys stored in: ~/.ssh/id_rsa + id_rsa.pub (or id_ed25519)\n\n# Copy public key to remote server\nssh-copy-id user@remotehost\nssh-copy-id -i ~/.ssh/mykey.pub user@remotehost\n\n# Manual: append public key to authorized_keys\ncat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys  # on the server\n\n# Permissions (CRITICAL — SSH will refuse to work with wrong perms)\nchmod 700 ~/.ssh\nchmod 600 ~/.ssh/authorized_keys\nchmod 600 ~/.ssh/id_rsa          # private key: 600\nchmod 644 ~/.ssh/id_rsa.pub      # public key: 644\n\n# Connect using specific key\nssh -i ~/.ssh/mykey user@host',
          },
          {
            type: 'h2',
            text: 'SSH Agent and Config',
          },
          {
            type: 'code',
            text: '# ssh-agent: holds decrypted private keys in memory\neval $(ssh-agent)\nssh-add ~/.ssh/id_rsa         # add key to agent\nssh-add -l                    # list keys in agent\nssh-add -D                    # remove all keys from agent\n\n# ~/.ssh/config — per-host SSH configuration\nHost myserver\n    HostName 192.168.1.100\n    User alice\n    IdentityFile ~/.ssh/mykey\n    Port 2222\n    ServerAliveInterval 60\n\nHost bastion\n    HostName bastion.example.com\n    User deploy\n    ForwardAgent yes\n\n# Use: ssh myserver  (uses the config above)\n\n# /etc/ssh/sshd_config — server configuration\nPermitRootLogin no             # disable root SSH login\nPasswordAuthentication no      # key-only auth\nPubkeyAuthentication yes\nAllowUsers alice bob\nListenAddress 0.0.0.0\nPort 22\nX11Forwarding yes\n\n# After editing sshd_config:\nsystemctl reload sshd',
          },
          {
            type: 'h2',
            text: 'SSH Port Forwarding and Tunnels',
          },
          {
            type: 'code',
            text: '# Local port forwarding: forward local port to remote destination\nssh -L 8080:webserver:80 user@jumphost\n# Access localhost:8080 on your machine to reach webserver:80 via jumphost\n\n# Remote port forwarding: expose local service to remote machine\nssh -R 9090:localhost:3000 user@remotehost\n# On remotehost: localhost:9090 → your machine:3000\n\n# Dynamic port forwarding: SOCKS proxy\nssh -D 1080 user@remotehost\n# Configure browser to use SOCKS proxy at localhost:1080\n\n# Disable port forwarding in sshd_config:\nAllowTcpForwarding no\nAllowStreamLocalForwarding no',
          },
          {
            type: 'h2',
            text: 'GPG — GNU Privacy Guard',
          },
          {
            type: 'code',
            text: '# Generate a GPG key pair\ngpg --gen-key                            # interactive\ngpg --full-generate-key                  # with all options\n\n# List keys\ngpg --list-keys                          # public keyring\ngpg --list-secret-keys                   # private keys\n\n# Export / Import keys\ngpg --export -a "Alice" > alice.pub.gpg     # export public key (ASCII)\ngpg --export-secret-keys -a "Alice" > alice.sec.gpg\ngpg --import alice.pub.gpg               # import public key\n\n# Encrypt a file (for recipient Bob)\ngpg -e -r "Bob" document.txt\n# Creates: document.txt.gpg\n\n# Decrypt\ngpg -d document.txt.gpg\ngpg -d document.txt.gpg -o document.txt\n\n# Sign a file (verify origin)\ngpg --sign document.txt           # binary signature embedded\ngpg --clearsign document.txt      # ASCII clear-sign (readable)\ngpg --detach-sign document.txt    # separate .sig file\n\n# Verify a signature\ngpg --verify document.txt.sig document.txt\ngpg --verify document.txt.gpg\n\n# Encrypt AND sign\ngpg -se -r "Bob" document.txt',
          },
          {
            type: 'h2',
            text: 'GPG Key Management',
          },
          {
            type: 'code',
            text: '# Key trust levels (web of trust)\ngpg --edit-key "Bob"\n# gpg> trust\n# 1=unknown, 2=none, 3=marginal, 4=full, 5=ultimate, m=back\n\n# Revoke a key (if private key is compromised)\ngpg --gen-revoke "Alice" > revoke.asc\ngpg --import revoke.asc       # import to mark key as revoked\n\n# Upload key to keyserver\ngpg --keyserver hkps://keys.openpgp.org --send-keys <KEYID>\n\n# Import from keyserver\ngpg --keyserver hkps://keys.openpgp.org --recv-keys <KEYID>\ngpg --keyserver hkps://keys.openpgp.org --search-keys "alice@example.com"\n\n# GPG files\n~/.gnupg/          # main GPG directory\n~/.gnupg/pubring.kbx    # public keyring (newer format)\n~/.gnupg/trustdb.gpg    # trust database\n\n# File-based encryption with symmetric key (password only)\ngpg -c document.txt      # encrypt with passphrase\ngpg -d document.txt.gpg  # decrypt (prompts for passphrase)',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'SSH key pair: ssh-keygen generates; public key goes in ~/.ssh/authorized_keys on server. ~/.ssh/ must be 700; authorized_keys must be 600. ssh-copy-id copies key to server. ssh-add loads key into ssh-agent. ~/.ssh/config allows per-host settings. sshd_config: PermitRootLogin no, PasswordAuthentication no for security. SSH forwarding: -L local, -R remote, -D dynamic (SOCKS). GPG: --gen-key creates keys; -e encrypts; -d decrypts; --sign signs; --verify verifies; --clearsign embeds readable message with signature; --detach-sign creates separate .sig. gpg -se = encrypt AND sign. gpg --import/--export for key exchange. ~/.gnupg/ stores all GPG data.',
          },
          {
            type: 'files',
            files: ['~/.ssh/', '~/.ssh/authorized_keys', '~/.ssh/config', '~/.ssh/known_hosts', '/etc/ssh/sshd_config', '/etc/ssh/ssh_config', '~/.gnupg/'],
          },
        ],
      },
    ],
}
