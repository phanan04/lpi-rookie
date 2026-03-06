import type { Topic } from '../types'
import { UserCog } from 'lucide-react'

export const topic107: Topic = {
    id: '107',
    title: 'Administrative Tasks',
    icon: UserCog,
    description: 'Manage users and groups, schedule tasks with cron, and configure localisation.',
    lessons: [
      {
        id: '107.1',
        topicId: '107',
        title: 'Manage User and Group Accounts and Related System Files',
        weight: 5,
        description: 'Create, modify, and delete user and group accounts. Understand /etc/passwd, /etc/shadow, /etc/group.',
        sections: [
          {
            type: 'h2',
            text: '/etc/passwd — User Database',
          },
          {
            type: 'p',
            text: 'Seven colon-separated fields per line: username:password:UID:GID:GECOS:home:shell',
          },
          {
            type: 'code',
            text: '# Example /etc/passwd entry:\nroot:x:0:0:root:/root:/bin/bash\nalice:x:1001:1001:Alice Smith,,,:/home/alice:/bin/bash\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin\n\n# Fields:\n# 1: username\n# 2: x = password in /etc/shadow\n# 3: UID (User ID)\n# 4: GID (primary Group ID)\n# 5: GECOS / comment field (full name, room, phone...)\n# 6: home directory\n# 7: login shell (/bin/bash, /sbin/nologin, /bin/false)',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem nội dung /etc/passwd',
            hint: 'cat /etc/passwd | head -10',
          },
          {
            type: 'h2',
            text: '/etc/shadow — Password Hashes',
          },
          {
            type: 'p',
            text: 'Nine colon-separated fields: username:hash:lastchange:min:max:warn:inactive:expire:reserved',
          },
          {
            type: 'table',
            headers: ['Field', 'Description'],
            rows: [
              ['username', 'Must match /etc/passwd entry'],
              ['hash', 'Hashed password. ! or * = account locked. Empty = no password.'],
              ['lastchange', 'Days since epoch (Jan 1 1970) when password was last changed'],
              ['min', 'Minimum days before password can be changed (0 = any time)'],
              ['max', 'Maximum days before password must be changed (99999 = never expires)'],
              ['warn', 'Days before expiry to warn user'],
              ['inactive', 'Days after expiry before account is disabled'],
              ['expire', 'Absolute date (days since epoch) when account is disabled'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem thông tin aging của user hiện tại',
            hint: 'chage -l $(whoami)',
          },
          {
            type: 'h2',
            text: '/etc/group — Group Database',
          },
          {
            type: 'code',
            text: '# /etc/group format: groupname:password:GID:members\nroot:x:0:\nsudo:x:27:alice,bob\ndocker:x:999:alice\n\n# Supplementary groups: user belongs to primary GID + all groups listing them',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem các nhóm của user hiện tại',
            hint: 'id ; groups',
          },
          {
            type: 'h2',
            text: 'User Management Commands',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['useradd username', 'Create new user (minimal — no home dir by default on some distros)'],
              ['useradd -m username', 'Create user WITH home directory'],
              ['useradd -m -s /bin/bash -G sudo username', 'Create user with bash shell, in sudo group'],
              ['useradd -u 1500 -g users username', 'Set specific UID and primary group'],
              ['useradd -e 2026-12-31 username', 'Set account expiry date'],
              ['usermod -l newname oldname', 'Rename a user'],
              ['usermod -d /new/home -m username', 'Change home dir and move contents'],
              ['usermod -s /bin/zsh username', 'Change login shell'],
              ['usermod -aG docker alice', 'Add alice to docker group (-a = append, -G = supplementary)'],
              ['usermod -L username', 'Lock account (prepend ! to password hash)'],
              ['usermod -U username', 'Unlock account (remove !)'],
              ['userdel username', 'Delete user (keep home directory)'],
              ['userdel -r username', 'Delete user AND home directory and mail spool'],
              ['passwd username', 'Set/change password for user'],
              ['passwd -l username', 'Lock password'],
              ['passwd -u username', 'Unlock password'],
              ['passwd -e username', 'Expire password (force change at next login)'],
              ['chage -l username', 'List password aging information'],
              ['chage -M 90 username', 'Set max password age to 90 days'],
              ['chage -E 2026-12-31 username', 'Set account expiry'],
              ['id username', 'Show UID, GID, and group memberships'],
              ['whoami', 'Show current username'],
              ['su - username', 'Switch to user (login shell)'],
              ['sudo command', 'Run command as root (requires /etc/sudoers entry)'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem thông tin user',
            hint: 'whoami ; id ; finger $(whoami) 2>/dev/null || grep "^$(whoami):" /etc/passwd',
          },
          {
            type: 'h2',
            text: 'Group Management Commands',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['groupadd groupname', 'Create a new group'],
              ['groupadd -g 2000 groupname', 'Create group with specific GID'],
              ['groupmod -n newname oldname', 'Rename a group'],
              ['groupdel groupname', 'Delete a group'],
              ['gpasswd -a alice docker', 'Add alice to docker group'],
              ['gpasswd -d alice docker', 'Remove alice from docker group'],
              ['gpasswd -M alice,bob groupname', 'Set entire member list for a group'],
              ['groups username', 'List all groups a user belongs to'],
              ['newgrp docker', 'Switch primary group to docker for current session'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem danh sách group trong hệ thống',
            hint: 'cat /etc/group | head -15',
          },
          {
            type: 'h2',
            text: 'Default Files for New Users',
          },
          {
            type: 'table',
            headers: ['Path', 'Description'],
            rows: [
              ['/etc/skel/', 'Skeleton directory: files here are copied to new user\'s home on useradd -m'],
              ['/etc/login.defs', 'Defaults: PASS_MAX_DAYS, UID_MIN, UID_MAX, GID_MIN, GID_MAX, ENCRYPT_METHOD'],
              ['/etc/default/useradd', 'Defaults for useradd: SHELL, HOME, GROUP, INACTIVE, EXPIRE'],
            ],
          },
          {
            type: 'code',
            text: '# View password aging info\nchage -l alice\n# Last password change     : Jan 01, 2026\n# Password expires         : Apr 01, 2026\n# Account expires          : never\n\n# Force user to change password at next login\nchage -d 0 alice      # set lastchange to epoch = expired immediately\npasswd -e alice       # same effect\n\n# View login.defs\ngrep -v "^#" /etc/login.defs | grep -v "^$"\n\n# Convert shadow to old format (emergency access)\npwunconv     # merge shadow back to /etc/passwd\npwconv       # split passwords back to /etc/shadow',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem cấu hình mặc định cho user mới',
            hint: 'grep -v "^#" /etc/login.defs | grep -v "^$" | head -20',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: '/etc/passwd: 7 fields (user:x:UID:GID:GECOS:home:shell). /etc/shadow: 9 fields (hash field: ! or * = locked). /etc/group: 4 fields (group:x:GID:members). useradd -m creates home; -s sets shell; -G sets supplementary groups. usermod -aG adds to group WITHOUT removing from others (-a is critical). userdel -r removes home dir. passwd -l locks; -e expires. chage manages password aging: -M max days, -E expiry date. id shows UIDs and group memberships. /etc/skel/ provides template files for new home directories. /etc/login.defs sets system-wide defaults for UID ranges, password aging.',
          },
          {
            type: 'files',
            files: ['/etc/passwd', '/etc/shadow', '/etc/group', '/etc/gshadow', '/etc/skel/', '/etc/login.defs', '/etc/default/useradd'],
          },
        ],
      },
      {
        id: '107.2',
        topicId: '107',
        title: 'Automate System Administration Tasks by Using Cron',
        weight: 4,
        description: 'Use cron and at to schedule commands. Understand crontab syntax and anacron.',
        sections: [
          {
            type: 'h2',
            text: 'cron — Recurring Task Scheduler',
          },
          {
            type: 'p',
            text: 'cron runs commands on a schedule defined in crontab files. The crond daemon reads crontab files and executes commands at specified times.',
          },
          {
            type: 'h2',
            text: 'Crontab Syntax',
          },
          {
            type: 'code',
            text: '# Crontab format: 5 time fields + command\n# MIN  HOUR  DOM  MON  DOW  COMMAND\n#  |    |     |    |    |\n#  |    |     |    |    +--- Day of Week: 0-7 (0 and 7 = Sunday)\n#  |    |     |    +-------- Month: 1-12 (or names: jan-dec)\n#  |    |     +------------- Day of Month: 1-31\n#  |    +------------------- Hour: 0-23\n#  +------------------------ Minute: 0-59\n\n# Examples:\n30 2 * * *     /usr/bin/backup.sh         # Daily at 02:30\n0  9 * * 1     /scripts/weekly-report.sh  # Every Monday at 09:00\n*/15 * * * *   /usr/bin/check.sh          # Every 15 minutes\n0 0 1 * *      /scripts/monthly.sh        # First of every month at midnight\n0 6 * * 1-5    /scripts/workday.sh        # Weekdays at 06:00\n0 */6 * * *    /scripts/every6h.sh        # Every 6 hours\n5 4 * * 0      /scripts/sunday.sh         # Every Sunday at 04:05\n@reboot        /scripts/startup.sh        # At system start\n@daily         /scripts/daily.sh          # Once a day (= 0 0 * * *)\n@hourly        /scripts/hourly.sh         # Once an hour',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem crontab hiện tại',
            hint: 'crontab -l 2>/dev/null || echo "No crontab for current user"',
          },
          {
            type: 'h2',
            text: 'Managing Crontabs',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['crontab -e', 'Edit current user\'s crontab (uses $EDITOR)'],
              ['crontab -l', 'List current user\'s crontab'],
              ['crontab -r', 'Remove current user\'s crontab'],
              ['crontab -u alice -e', 'Edit alice\'s crontab (root only)'],
              ['crontab -u alice -l', 'List alice\'s crontab'],
              ['crontab file', 'Install crontab from a file (replaces existing)'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem system crontab',
            hint: 'cat /etc/crontab',
          },
          {
            type: 'h2',
            text: 'cron Directories and System Crontabs',
          },
          {
            type: 'table',
            headers: ['Path', 'Description'],
            rows: [
              ['/var/spool/cron/crontabs/', 'Per-user crontab files (Debian); managed by crontab command'],
              ['/var/spool/cron/', 'Per-user crontab files (RHEL)'],
              ['/etc/crontab', 'System crontab — same as user format but has USERNAME field (6th field)'],
              ['/etc/cron.d/', 'Drop-in system cron files (same format as /etc/crontab with username field)'],
              ['/etc/cron.hourly/', 'Scripts run every hour'],
              ['/etc/cron.daily/', 'Scripts run every day'],
              ['/etc/cron.weekly/', 'Scripts run every week'],
              ['/etc/cron.monthly/', 'Scripts run every month'],
              ['/etc/cron.allow', 'If exists: ONLY listed users may use crontab'],
              ['/etc/cron.deny', 'If exists: listed users are DENIED crontab access'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem các script cron.daily',
            hint: 'ls /etc/cron.daily/ ; ls /etc/cron.weekly/',
          },
          {
            type: 'h2',
            text: 'at — One-Time Scheduling',
          },
          {
            type: 'code',
            text: '# Schedule a one-time task\nat 14:30                           # enter command interactively at prompt\nat 14:30 tomorrow\nat 2:30pm + 1 week\nat now + 2 hours\n\n# Specify command directly\necho "backup.sh" | at midnight\nat -f /scripts/backup.sh 03:00\n\n# List pending at jobs\natq\n\n# Remove an at job by job number\natrm 5\n\n# at access control (same logic as cron)\n/etc/at.allow    # if exists: only listed users can use at\n/etc/at.deny     # if exists: listed users denied access to at\n\n# batch — like at, but runs when system load drops below 1.5\nbatch\n# Enter command at the prompt, then Ctrl+D\necho "/scripts/heavy_report.sh" | batch\n# batch queues jobs to run when idle — no specific time required',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem hàng đợi at jobs',
            hint: 'atq 2>/dev/null || at -l 2>/dev/null || echo "No at jobs or at not installed"',
          },
          {
            type: 'h2',
            text: 'anacron — Catch-Up Scheduler',
          },
          {
            type: 'p',
            text: 'anacron runs jobs that were missed because the system was off. Unlike cron, it does not assume 24/7 uptime. Configured in /etc/anacrontab.',
          },
          {
            type: 'code',
            text: '# /etc/anacrontab format:\n# period  delay  job-id  command\n1         5      cron.daily    run-parts /etc/cron.daily\n7         10     cron.weekly   run-parts /etc/cron.weekly\n30        15     cron.monthly  run-parts /etc/cron.monthly\n\n# period: days between runs\n# delay: minutes to wait after boot before running\n# job-id: unique identifier for tracking\n\n# anacron tracks last run dates in:\n# /var/spool/anacron/',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem cấu hình anacron',
            hint: 'cat /etc/anacrontab 2>/dev/null || echo "anacron not configured"',
          },
          {
            type: 'h2',
            text: 'systemd Timers',
          },
          {
            type: 'code',
            text: '# List all systemd timers\nsystemctl list-timers\nsystemctl list-timers --all\n\n# A systemd timer consists of two unit files:\n# mybackup.timer  + mybackup.service\n\n# Example: /etc/systemd/system/mybackup.timer\n[Unit]\nDescription=Run backup daily\n\n[Timer]\nOnCalendar=daily\nPersistent=true       # run if missed (like anacron)\n\n[Install]\nWantedBy=timers.target\n\n# Enable and start:\nsystemctl enable --now mybackup.timer',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem systemd timers đang hoạt động',
            hint: 'systemctl list-timers --no-pager 2>/dev/null | head -15',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Crontab format: MIN HOUR DOM MON DOW COMMAND. * = every, */N = every N, 1-5 = range, 1,3,5 = list. DOW: 0 and 7 both = Sunday. @reboot, @daily, @hourly are shortcuts. crontab -e edits, -l lists, -r removes, -u specifies user (root only). /etc/crontab and /etc/cron.d/ files need an extra USERNAME field before the command. /etc/cron.allow (whitelist) takes priority over /etc/cron.deny (blacklist). at schedules one-time jobs; atq lists them; atrm removes them. batch is like at but runs when system load drops below 1.5. anacron handles missed jobs for systems not running 24/7; configured in /etc/anacrontab. systemd timers can replace cron; Persistent=true gives anacron-like catch-up.',
          },
          {
            type: 'files',
            files: ['/etc/crontab', '/etc/cron.d/', '/etc/cron.daily/', '/etc/cron.weekly/', '/etc/cron.monthly/', '/var/spool/cron/', '/etc/cron.allow', '/etc/cron.deny', '/etc/anacrontab', '/var/spool/anacron/', '/etc/at.allow', '/etc/at.deny'],
          },
        ],
      },
      {
        id: '107.3',
        topicId: '107',
        title: 'Localisation and Internationalisation',
        weight: 3,
        description: 'Configure locale, timezone, character encoding, and keyboard settings.',
        sections: [
          {
            type: 'h2',
            text: 'Locale',
          },
          {
            type: 'p',
            text: 'A locale defines language, region, character encoding, and formatting conventions (date, time, numbers, currency).',
          },
          {
            type: 'table',
            headers: ['Variable', 'Controls'],
            rows: [
              ['LANG', 'Default for all locale categories not individually set'],
              ['LC_MESSAGES', 'Language for system messages and translations'],
              ['LC_TIME', 'Date and time formatting (date format, weekday names)'],
              ['LC_NUMERIC', 'Number formatting (decimal point, thousands separator)'],
              ['LC_MONETARY', 'Currency formatting'],
              ['LC_COLLATE', 'String sorting order'],
              ['LC_CTYPE', 'Character classification (what is uppercase, digit, etc.)'],
              ['LC_PAPER', 'Default paper size (A4 vs Letter)'],
              ['LC_ALL', 'Override ALL LC_* and LANG (highest priority)'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem locale hiện tại',
            hint: 'locale',
          },
          {
            type: 'code',
            text: '# Show current locale settings\nlocale\n\n# List available locales\nlocale -a\nlocale -a | grep en_US\n\n# Locale format: language_COUNTRY.ENCODING\n# en_US.UTF-8 = English, United States, UTF-8 encoding\n# fr_FR.UTF-8 = French, France\n# ja_JP.EUC-JP = Japanese, Japan, EUC-JP encoding\n# C or POSIX = minimal POSIX locale (ASCII only)\n\n# Set locale for current session\nexport LANG=en_US.UTF-8\nexport LC_ALL=C    # force ASCII/POSIX (useful in scripts)\n\n# System-wide locale configuration:\n# Debian/Ubuntu:\ncat /etc/default/locale\nlocalectl set-locale LANG=en_US.UTF-8\n\n# RHEL/CentOS:\ncat /etc/locale.conf\nlocalectl set-locale LANG=en_US.UTF-8\n\n# Generate a locale (after editing /etc/locale.gen on Debian)\nlocale-gen en_US.UTF-8\n\n# localectl: systemd locale management\nlocalectl\nlocalectl list-locales\nlocalectl set-locale LANG=de_DE.UTF-8',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem localectl và cài đặt locale hệ thống',
            hint: 'localectl status',
          },
          {
            type: 'h2',
            text: 'Timezone',
          },
          {
            type: 'code',
            text: '# Show current date, time, and timezone\ndate\ntimedatectl\n\n# List available timezones\ntimedatectl list-timezones\ntimedatectl list-timezones | grep America\n\n# Set timezone\ntimedatectl set-timezone America/New_York\ntimedatectl set-timezone UTC\n\n# Manual timezone setting (symlink method)\nln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime\n\n# /etc/timezone (Debian): contains timezone name string\ncat /etc/timezone\necho "America/New_York" > /etc/timezone\ndpkg-reconfigure tzdata    # Debian interactive\n\n# TZ environment variable (per-session override)\nexport TZ="Asia/Tokyo"\ndate\nTZ="UTC" date    # one-time; does not persist',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem timezone hiện tại',
            hint: 'timedatectl status ; cat /etc/timezone 2>/dev/null ; date',
          },
          {
            type: 'h2',
            text: 'Character Encoding',
          },
          {
            type: 'table',
            headers: ['Encoding', 'Description'],
            rows: [
              ['UTF-8', 'Universal, variable-width 1–4 bytes. Standard for Linux. Backward-compatible with ASCII.'],
              ['UTF-16', 'Fixed-width 2 or 4 bytes. Used by Windows, Java.'],
              ['ISO-8859-1 (Latin-1)', 'Single-byte Western European (256 chars). Legacy.'],
              ['ISO-8859-15 (Latin-9)', 'Like Latin-1 but adds € and some French chars.'],
              ['ASCII', '7-bit, 128 characters. Subset of UTF-8.'],
              ['EUC-JP / EUC-KR', 'Legacy East Asian encodings.'],
            ],
          },
          {
            type: 'code',
            text: '# Convert file encoding\niconv -f ISO-8859-1 -t UTF-8 input.txt -o output.txt\niconv -l             # list all supported encodings\n\n# Check encoding of a file\nfile -i document.txt\n# document.txt: text/plain; charset=utf-8',
          },
          {
            type: 'practice',
            title: 'Thực hành: Kiểm tra encoding của file',
            hint: 'file -i /etc/passwd ; echo $LANG',
          },
          {
            type: 'h2',
            text: 'Keyboard and Console Settings',
          },
          {
            type: 'code',
            text: '# Set keyboard layout for the console\nlocalectl set-keymap us\nlocalectl set-keymap de\n\n# Set console keymap and X11 keymap together\nlocalectl set-keymap us\nlocalectl set-x11-keymap us\n\n# Temporary console keymap change (old method)\nloadkeys us\nloadkeys de\n\n# Show current keyboard settings\nlocalectl status\n\n# /etc/vconsole.conf (systemd):\ncat /etc/vconsole.conf\n# KEYMAP=us\n# FONT=Lat2-Terminus16\n\n# Set console font\nsetfont Lat2-Terminus16',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem keymap hiện tại',
            hint: 'localectl status 2>/dev/null | grep -i keymap || cat /etc/vconsole.conf 2>/dev/null',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'LANG sets the default locale. LC_ALL overrides all LC_* variables. LC_MESSAGES=language for messages; LC_TIME=date format; LC_COLLATE=sort order. C or POSIX locale = ASCII/minimal. UTF-8 is the standard Linux encoding; variable-width 1–4 bytes; ASCII-compatible. iconv converts between encodings. timedatectl manages time and timezone. /etc/localtime is symlink to /usr/share/zoneinfo/<Zone>. /etc/timezone (Debian) contains the zone name as text. TZ envvar overrides timezone per-session. localectl manages locale, keymap, timezone via systemd. /etc/locale.conf (RHEL) and /etc/default/locale (Debian) store locale settings.',
          },
          {
            type: 'files',
            files: ['/etc/locale.conf', '/etc/default/locale', '/etc/timezone', '/etc/localtime', '/usr/share/zoneinfo/', '/etc/vconsole.conf', '/usr/share/i18n/'],
          },
        ],
      },
    ],
}
