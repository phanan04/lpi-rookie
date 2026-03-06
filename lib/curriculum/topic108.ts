import type { Topic } from '../types'
import { Settings } from 'lucide-react'

export const topic108: Topic = {
    id: '108',
    title: 'Essential System Services',
    icon: Settings,
    description: 'Maintain system time, manage logging, configure mail transfer agents, and manage printing.',
    lessons: [
      {
        id: '108.1',
        topicId: '108',
        title: 'Maintain System Time',
        weight: 3,
        description: 'Set system time and hardware clock, configure NTP synchronisation.',
        sections: [
          {
            type: 'h2',
            text: 'System Clock vs Hardware Clock',
          },
          {
            type: 'table',
            headers: ['Clock', 'Description'],
            rows: [
              ['System clock (software clock)', 'Maintained by the kernel in RAM. Set when the OS boots from the hardware clock. Used by all running processes.'],
              ['Hardware clock (RTC — Real Time Clock)', 'Battery-backed clock on the motherboard. Persists across reboots and power-off. May drift; typically set to UTC.'],
            ],
          },
          {
            type: 'h2',
            text: 'date and hwclock',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['date', 'Show current system time'],
              ['date "+%Y-%m-%d %H:%M:%S"', 'Format output: 2026-03-06 14:30:00'],
              ['date -s "2026-03-06 14:30:00"', 'Set system clock manually (root)'],
              ['date -u', 'Show time in UTC'],
              ['hwclock', 'Show hardware clock time'],
              ['hwclock --systohc', 'Write system clock → hardware clock (sync from OS to RTC)'],
              ['hwclock --hctosys', 'Write hardware clock → system clock (sync from RTC to OS)'],
              ['hwclock --utc', 'Treat hardware clock as UTC'],
              ['hwclock --localtime', 'Treat hardware clock as local time'],
            ],
          },
          {
            type: 'h2',
            text: 'timedatectl — systemd Time Management',
          },
          {
            type: 'code',
            text: '# Show full time/date/timezone status\ntimedatectl\n\n# Set system time\ntimedatectl set-time "2026-03-06 14:30:00"\n\n# Set timezone\ntimedatectl set-timezone Europe/London\ntimedatectl list-timezones\n\n# Enable NTP synchronisation\ntimedatectl set-ntp true\ntimedatectl set-ntp false\n\n# Sample output:\n#                Local time: Fri 2026-03-06 14:30:00 GMT\n#            Universal time: Fri 2026-03-06 14:30:00 UTC\n#                  RTC time: Fri 2026-03-06 14:29:58\n#                 Time zone: Europe/London (GMT, +0000)\n# System clock synchronized: yes\n#               NTP service: active',
          },
          {
            type: 'h2',
            text: 'NTP — Network Time Protocol',
          },
          {
            type: 'table',
            headers: ['Daemon / Tool', 'Description'],
            rows: [
              ['ntpd', 'Classic NTP daemon (ntp package). Reads /etc/ntp.conf.'],
              ['chronyd', 'Modern NTP daemon (chrony package). Faster sync. Reads /etc/chrony.conf.'],
              ['systemd-timesyncd', 'Lightweight SNTP client built into systemd. Syncs system clock only. Reads /etc/systemd/timesyncd.conf.'],
              ['ntpq -p', 'Query ntpd peers and synchronisation status'],
              ['chronyc tracking', 'Show chrony synchronisation statistics'],
              ['chronyc sources', 'List NTP sources chrony is using'],
            ],
          },
          {
            type: 'code',
            text: '# /etc/ntp.conf (ntpd)\nserver 0.pool.ntp.org iburst\nserver 1.pool.ntp.org iburst\ndriftfile /var/lib/ntp/drift\n\n# /etc/chrony.conf (chronyd)\npool 2.debian.pool.ntp.org iburst\ndriftfile /var/lib/chrony/drift\n\n# Check NTP sync status\nntpq -p\n# remote           refid      st  when  poll  reach  delay  offset  jitter\n# *0.pool.ntp.org  .GPS.      1   45    64    377    2.5    0.123   0.456\n# * = currently selected source; + = good candidate\n\nchronyc tracking\nchronyc sources -v\n\n# systemd-timesyncd config\ncat /etc/systemd/timesyncd.conf\n# [Time]\n# NTP=0.debian.pool.ntp.org 1.debian.pool.ntp.org\n# FallbackNTP=2.debian.pool.ntp.org',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'System clock = OS kernel clock (RAM). Hardware clock = RTC (battery-backed, persists). hwclock --systohc syncs OS → RTC; --hctosys syncs RTC → OS. timedatectl manages time+timezone+NTP via systemd. NTP strata: stratum 0 = reference clock (GPS/atomic), stratum 1 = directly connected, stratum 2 = synced from stratum 1, etc. ntpd uses /etc/ntp.conf; chronyd uses /etc/chrony.conf; systemd-timesyncd uses /etc/systemd/timesyncd.conf. ntpq -p shows ntpd peers (* = selected source). chronyc tracking / sources for chronyd. date -s sets clock; hwclock --utc treats RTC as UTC (recommended).',
          },
          {
            type: 'files',
            files: ['/etc/ntp.conf', '/etc/chrony.conf', '/etc/systemd/timesyncd.conf', '/var/lib/ntp/drift', '/var/lib/chrony/drift'],
          },
        ],
      },
      {
        id: '108.2',
        topicId: '108',
        title: 'System Logging',
        weight: 4,
        description: 'Configure and use syslog, rsyslog, systemd journal, and logrotate.',
        sections: [
          {
            type: 'h2',
            text: 'Syslog Facilities and Priorities',
          },
          {
            type: 'table',
            headers: ['Facility', 'Code', 'Description'],
            rows: [
              ['kern', '0', 'Kernel messages'],
              ['user', '1', 'User-level messages'],
              ['mail', '2', 'Mail system'],
              ['daemon', '3', 'System daemons'],
              ['auth', '4', 'Security/authentication'],
              ['syslog', '5', 'Internal syslogd messages'],
              ['lpr', '6', 'Printer subsystem'],
              ['news', '7', 'USENET news subsystem'],
              ['cron', '9', 'Cron and at messages'],
              ['local0-local7', '16-23', 'Custom / reserved for local use'],
            ],
          },
          {
            type: 'table',
            headers: ['Priority (Severity)', 'Code', 'Description'],
            rows: [
              ['emerg', '0', 'System is unusable — panic'],
              ['alert', '1', 'Must act immediately'],
              ['crit', '2', 'Critical conditions'],
              ['err', '3', 'Error conditions'],
              ['warning', '4', 'Warning conditions'],
              ['notice', '5', 'Normal but significant'],
              ['info', '6', 'Informational messages'],
              ['debug', '7', 'Debug-level messages'],
            ],
          },
          {
            type: 'h2',
            text: 'rsyslog Configuration',
          },
          {
            type: 'code',
            text: '# /etc/rsyslog.conf — main config\n# Format: FACILITY.PRIORITY  DESTINATION\n\n# Log all kernel messages to /var/log/kern.log\nkern.*                          /var/log/kern.log\n\n# Log auth messages of warning and above\nauth.warning                    /var/log/auth.log\n\n# Log all crit and above from any facility to console\n*.crit                          /dev/console\n\n# Log everything except debug to /var/log/messages\n*.info;mail.none;authpriv.none  /var/log/messages\n\n# Send to remote syslog server (UDP 514)\n*.* @192.168.1.10:514    # UDP (single @)\n*.* @@192.168.1.10:514   # TCP (double @@)\n\n# Reload rsyslog after config change\nsystemctl restart rsyslog\n\n# /etc/rsyslog.d/ — drop-in configs',
          },
          {
            type: 'h2',
            text: 'Common Log Files',
          },
          {
            type: 'table',
            headers: ['File', 'Contents'],
            rows: [
              ['/var/log/messages', 'General system messages (RHEL/SUSE)'],
              ['/var/log/syslog', 'General system messages (Debian/Ubuntu)'],
              ['/var/log/auth.log', 'Authentication and sudo (Debian)'],
              ['/var/log/secure', 'Authentication and sudo (RHEL)'],
              ['/var/log/kern.log', 'Kernel messages'],
              ['/var/log/dmesg', 'Boot-time kernel messages snapshot'],
              ['/var/log/cron', 'Cron job execution logs (RHEL)'],
              ['/var/log/mail.log', 'Mail server logs'],
              ['/var/log/boot.log', 'Boot service start/stop (RHEL)'],
              ['/var/log/wtmp', 'Binary login/logout history — read with last'],
              ['/var/log/btmp', 'Binary failed login attempts — read with lastb'],
              ['/var/log/lastlog', 'Most recent login per user — read with lastlog'],
              ['/run/utmp', 'Currently logged-in users — read with who, w'],
            ],
          },
          {
            type: 'h2',
            text: 'systemd Journal (journalctl)',
          },
          {
            type: 'code',
            text: '# Show all journal entries (newest last)\njournalctl\n\n# Follow live (like tail -f)\njournalctl -f\n\n# Show entries for current boot\njournalctl -b\n\n# Show entries for previous boot\njournalctl -b -1\n\n# Filter by priority (err and above)\njournalctl -p err\njournalctl -p warning\n\n# Filter by systemd unit\njournalctl -u sshd\njournalctl -u nginx --since "1 hour ago"\n\n# Filter by time range\njournalctl --since "2026-03-06 08:00" --until "2026-03-06 12:00"\njournalctl --since yesterday\n\n# Show kernel messages only\njournalctl -k\n\n# Disk space used by journal\njournalctl --disk-usage\n\n# Vacuum journal (keep last 2 weeks)\njournalctl --vacuum-time=2weeks\njournalctl --vacuum-size=500M',
          },
          {
            type: 'h2',
            text: 'Journal Storage Configuration',
          },
          {
            type: 'code',
            text: '# /etc/systemd/journald.conf\n[Journal]\nStorage=auto          # auto(default), persistent, volatile, none\n# auto: persistent if /var/log/journal/ exists, else volatile\n# persistent: always save to /var/log/journal/\n# volatile: RAM only (/run/log/journal/)\n# none: disable journal\n\nCompress=yes          # compress journal files\nSystemMaxUse=500M     # max disk space for system journal\nMaxFileSec=1month     # max age of individual journal files\n\n# Storage locations:\n# Persistent: /var/log/journal/\n# Volatile:   /run/log/journal/\n\n# Restart after config change:\nsystemctl restart systemd-journald',
          },
          {
            type: 'h2',
            text: 'logrotate — Log File Rotation',
          },
          {
            type: 'code',
            text: '# logrotate runs daily via cron: /etc/cron.daily/logrotate\n# Global config: /etc/logrotate.conf\n# Per-service configs: /etc/logrotate.d/\n\n# Example /etc/logrotate.d/nginx:\n/var/log/nginx/*.log {\n    daily               # rotate every day\n    missingok           # do not error if log file is missing\n    rotate 14           # keep 14 rotated files\n    compress            # gzip old log files\n    delaycompress       # compress after 1 rotation (keeps last uncompressed)\n    notifempty          # do not rotate if log is empty\n    create 0640 www-data adm   # create new log with these perms\n    postrotate\n        nginx -s reopen  # signal nginx to reopen its log files after rotate\n    endscript\n}\n\n# Test logrotate without actually rotating:\nlogrotate -d /etc/logrotate.d/nginx\n\n# Force rotate now (even if not due):\nlogrotate -f /etc/logrotate.conf',
          },
          {
            type: 'h2',
            text: 'logger — Write to Syslog',
          },
          {
            type: 'code',
            text: '# logger writes a message to the system syslog\nlogger "This is a test message"\nlogger -p user.warning "Disk space is low"\nlogger -p kern.crit "Kernel panic imminent"\n\n# -p facility.priority\n# -t tag: prepend a tag to the message\nlogger -t myapp -p local0.info "Application started"\n\n# -s: also print to stderr\nlogger -s "This shows on screen and goes to syslog"\n\n# Useful in scripts:\n#!/bin/bash\nlogger -t backup_script "Backup started"\ntar czf /backup/etc.tar.gz /etc\nlogger -t backup_script "Backup complete: $?"',
          },
          {
            type: 'h2',
            text: 'syslog-ng — Alternative Logging Daemon',
          },
          {
            type: 'p',
            text: 'syslog-ng is an alternative to rsyslog. It uses a different configuration syntax based on source → filter → destination pipelines. Main config: /etc/syslog-ng/syslog-ng.conf.',
          },
          {
            type: 'code',
            text: '# /etc/syslog-ng/syslog-ng.conf structure:\nsource s_sys {\n    system();          # collect all system log sources\n    internal();        # syslog-ng internal messages\n};\n\nfilter f_auth { facility(auth, authpriv); };\nfilter f_err  { level(err .. emerg); };\n\ndestination d_auth { file("/var/log/auth.log"); };\ndestination d_syslog { file("/var/log/syslog"); };\ndestination d_remote { network("192.168.1.10" port(514)); };\n\nlog { source(s_sys); filter(f_auth); destination(d_auth); };\nlog { source(s_sys); filter(f_err);  destination(d_syslog); };\n\n# Reload syslog-ng:\nsystemctl reload syslog-ng',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Syslog facility.priority format: kern.err, *.info, mail.none. Priorities (high to low): emerg, alert, crit, err, warning, notice, info, debug. rsyslog @ = UDP, @@ = TCP for remote logging. /var/log/messages (RHEL) = /var/log/syslog (Debian). /var/log/wtmp (login history, read with last); /var/log/btmp (failed logins, read with lastb); /var/log/lastlog (last login per user, read with lastlog). journalctl -b = current boot; -b -1 = previous boot; -f = follow; -u = unit; -k = kernel; -p = priority. journald.conf Storage=persistent saves to /var/log/journal/. logrotate runs from /etc/cron.daily/; configs in /etc/logrotate.d/; rotate=N keeps N old files; compress gzips old logs. logger writes to syslog from command line: logger -p facility.priority "message". syslog-ng is an alternative to rsyslog; config: /etc/syslog-ng/syslog-ng.conf.',
          },
          {
            type: 'files',
            files: ['/etc/rsyslog.conf', '/etc/rsyslog.d/', '/etc/syslog-ng/syslog-ng.conf', '/var/log/messages', '/var/log/syslog', '/var/log/auth.log', '/var/log/wtmp', '/var/log/btmp', '/var/log/lastlog', '/var/log/journal/', '/etc/systemd/journald.conf', '/etc/logrotate.conf', '/etc/logrotate.d/'],
          },
        ],
      },
      {
        id: '108.3',
        topicId: '108',
        title: 'Mail Transfer Agent (MTA) Basics',
        weight: 3,
        description: 'Understand MTA concepts, manage the mail queue, and use command-line mail tools.',
        sections: [
          {
            type: 'h2',
            text: 'Email Architecture',
          },
          {
            type: 'table',
            headers: ['Component', 'Abbrev', 'Description'],
            rows: [
              ['Mail Transfer Agent', 'MTA', 'Routes and relays email between servers. Examples: Postfix, Sendmail, Exim, qmail'],
              ['Mail Delivery Agent', 'MDA', 'Delivers mail to local mailbox. Examples: procmail, maildrop, Dovecot LDA'],
              ['Mail User Agent', 'MUA', 'Client that users read/write mail with. Examples: mutt, thunderbird, outlook'],
              ['SMTP', '', 'Simple Mail Transfer Protocol — port 25 (server-to-server), 587 (submission), 465 (SMTPS)'],
              ['IMAP', '', 'Internet Message Access Protocol — port 143/993. Server-side storage.'],
              ['POP3', '', 'Post Office Protocol v3 — port 110/995. Downloads and deletes from server.'],
            ],
          },
          {
            type: 'h2',
            text: 'Postfix — Common MTA',
          },
          {
            type: 'table',
            headers: ['File', 'Description'],
            rows: [
              ['/etc/postfix/main.cf', 'Main Postfix config: myhostname, mydomain, relayhost, etc.'],
              ['/etc/postfix/master.cf', 'Postfix daemon process table'],
              ['/etc/aliases', 'Local alias table: map addresses to users or files'],
              ['/var/spool/postfix/', 'Mail queue directory'],
            ],
          },
          {
            type: 'code',
            text: '# Key /etc/postfix/main.cf parameters\nmyhostname = mail.example.com\nmydomain = example.com\nmyorigin = $mydomain\ninet_interfaces = all\nmydestination = $myhostname, localhost.$mydomain, $mydomain\nrelayhost = [smtp.isp.com]:587    # smart host / relay\n\n# Reload Postfix after config change\npostfix reload\n# or\nsystemctl reload postfix',
          },
          {
            type: 'h2',
            text: 'Mail Queue Management',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['mailq', 'Show the mail queue (same as sendmail -bp)'],
              ['postqueue -p', 'Show Postfix queue (same as mailq)'],
              ['postqueue -f', 'Flush queue — attempt to deliver all queued messages now'],
              ['postsuper -d ALL', 'Delete ALL messages from the queue'],
              ['postsuper -d <queueid>', 'Delete a specific message'],
              ['postsuper -r ALL', 'Requeue all messages (reset their delivery time)'],
              ['sendmail -bp', 'Show mail queue (sendmail/Postfix compatible)'],
              ['newaliases', 'Rebuild /etc/aliases database after editing'],
            ],
          },
          {
            type: 'h2',
            text: 'Command-line Mail Sending',
          },
          {
            type: 'code',
            text: '# Send mail from command line\necho "Message body" | mail -s "Subject" user@example.com\nmail -s "Alert" root < /tmp/report.txt\n\n# mutt: powerful TUI mail client\nmutt -s "Subject" user@example.com < body.txt\n\n# /etc/aliases — redirect local mail\n# Format: alias: destination\nroot: admin@example.com\nwebmaster: alice\npostmaster: root\n# After editing:\nnewaliases\n\n# ~/.forward — per-user mail forwarding\necho "alice@gmail.com" > ~/.forward\n\n# Mailbox locations\n/var/mail/username       # mbox format (default)\n/var/spool/mail/username # alternative path\n~/Maildir/               # Maildir format (one file per message)',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'MTA routes mail (Postfix, Sendmail, Exim). MDA delivers to mailbox (procmail). MUA is the client (mutt, Thunderbird). SMTP port 25 (relay), 587 (submission), 465 (SMTPS). Postfix main config: /etc/postfix/main.cf. mailq shows queue. postqueue -f flushes queue. postsuper -d deletes from queue. newaliases rebuilds alias DB after editing /etc/aliases. ~/.forward forwards mail to another address. /var/mail/username is the default local mailbox. sendmail -bp = mailq.',
          },
          {
            type: 'files',
            files: ['/etc/postfix/main.cf', '/etc/postfix/master.cf', '/etc/aliases', '/var/spool/postfix/', '/var/mail/', '~/.forward'],
          },
        ],
      },
      {
        id: '108.4',
        topicId: '108',
        title: 'Manage Printers and Printing',
        weight: 2,
        description: 'Manage print queues and print jobs using CUPS.',
        sections: [
          {
            type: 'h2',
            text: 'CUPS — Common Unix Printing System',
          },
          {
            type: 'p',
            text: 'CUPS is the standard printing system on Linux. It provides the printing spooler, scheduler and web admin interface (http://localhost:631).',
          },
          {
            type: 'table',
            headers: ['File / Path', 'Description'],
            rows: [
              ['/etc/cups/cupsd.conf', 'CUPS daemon configuration file'],
              ['/etc/cups/printers.conf', 'Configured printer definitions'],
              ['/etc/cups/ppd/', 'PPD (PostScript Printer Description) files for each printer'],
              ['/var/log/cups/access_log', 'CUPS access log'],
              ['/var/log/cups/error_log', 'CUPS error log'],
              ['/var/spool/cups/', 'Print job spool directory'],
            ],
          },
          {
            type: 'h2',
            text: 'Print Commands',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['lpr file', 'Print a file to the default printer'],
              ['lpr -P printername file', 'Print to a specific printer'],
              ['lpr -# 3 file', 'Print 3 copies'],
              ['lpq', 'Show queue for default printer'],
              ['lpq -P printername', 'Show queue for specific printer'],
              ['lprm', 'Cancel most recent print job'],
              ['lprm <jobid>', 'Cancel specific job by ID'],
              ['lprm -P printer -', 'Cancel ALL jobs on a printer'],
              ['lpstat -t', 'Show all printers and their status'],
              ['lpstat -s', 'Show printer summary (default printer, status)'],
              ['lpstat -p', 'Show status of all printers'],
              ['lpadmin -p printer -E -v uri -m ppd', 'Add a printer via command line'],
              ['lpadmin -d printer', 'Set the default printer'],
              ['lpadmin -x printer', 'Remove a printer'],
              ['cupsaccept printer', 'Allow printer to accept jobs'],
              ['cupsreject printer', 'Reject new jobs for a printer'],
              ['cupsenable printer', 'Start sending jobs to printer'],
              ['cupsdisable printer', 'Stop sending jobs to printer (hold queue)'],
            ],
          },
          {
            type: 'code',
            text: '# Print a PDF file\nlpr -P HP_LaserJet document.pdf\n\n# Show default printer\nlpstat -d\n# system default destination: HP_LaserJet\n\n# Show all printers\nlpstat -p\n\n# Show full status\nlpstat -t\n\n# List available printer names\nlpstat -a\n\n# Cancel all jobs (as root)\nlprm -P HP_LaserJet -\n\n# Environment variable to set default printer\nexport PRINTER=HP_LaserJet\nexport LPDEST=HP_LaserJet   # older apps use LPDEST\n\n# CUPS web interface:\n# http://localhost:631',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'CUPS is the standard Linux print system. lpr prints, lpq shows queue, lprm cancels jobs. lpstat -t shows everything; -s shows summary; -d shows default printer; -p shows printer status. lpadmin manages printers: -d sets default, -x removes, -E enables. cupsaccept/cupsreject control job acceptance; cupsenable/cupsdisable control actual printing. CUPS config: /etc/cups/cupsd.conf. PPD files in /etc/cups/ppd/. PRINTER or LPDEST env variable sets default. Web admin at http://localhost:631.',
          },
          {
            type: 'files',
            files: ['/etc/cups/cupsd.conf', '/etc/cups/printers.conf', '/etc/cups/ppd/', '/var/spool/cups/', '/var/log/cups/'],
          },
        ],
      },
    ],
}
