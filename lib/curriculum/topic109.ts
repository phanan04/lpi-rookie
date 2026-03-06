import type { Topic } from '../types'
import { Globe } from 'lucide-react'

export const topic109: Topic = {
    id: '109',
    title: 'Networking Fundamentals',
    icon: Globe,
    description: 'Configure and troubleshoot networking: IP addressing, interfaces, DNS, and routing.',
    lessons: [
      {
        id: '109.1',
        topicId: '109',
        title: 'Fundamentals of Internet Protocols',
        weight: 4,
        description: 'Understand TCP/IP, IPv4, IPv6, subnetting, and common network services and ports.',
        sections: [
          {
            type: 'h2',
            text: 'IPv4 Addressing',
          },
          {
            type: 'table',
            headers: ['Class', 'Range', 'Default Mask', 'Private Range'],
            rows: [
              ['A', '1.0.0.0 – 126.255.255.255', '/8 (255.0.0.0)', '10.0.0.0/8'],
              ['B', '128.0.0.0 – 191.255.255.255', '/16 (255.255.0.0)', '172.16.0.0/12 (172.16–172.31)'],
              ['C', '192.0.0.0 – 223.255.255.255', '/24 (255.255.255.0)', '192.168.0.0/16'],
              ['Loopback', '127.0.0.0/8', '—', '127.0.0.1 = localhost'],
              ['APIPA / Link-local', '169.254.0.0/16', '—', 'Auto-assigned when DHCP fails'],
            ],
          },
          {
            type: 'h2',
            text: 'Subnetting and CIDR',
          },
          {
            type: 'table',
            headers: ['CIDR', 'Subnet Mask', 'Hosts per Subnet', 'Notes'],
            rows: [
              ['/8', '255.0.0.0', '16,777,214', 'Class A'],
              ['/16', '255.255.0.0', '65,534', 'Class B'],
              ['/24', '255.255.255.0', '254', 'Class C — most common LAN'],
              ['/25', '255.255.255.128', '126', 'Half a /24'],
              ['/28', '255.255.255.240', '14', 'Small subnet'],
              ['/30', '255.255.255.252', '2', 'Point-to-point links'],
              ['/32', '255.255.255.255', '1', 'Host route / loopback'],
            ],
          },
          {
            type: 'h2',
            text: 'IPv6',
          },
          {
            type: 'table',
            headers: ['Address Type', 'Prefix', 'Description'],
            rows: [
              ['Loopback', '::1/128', 'Equivalent to IPv4 127.0.0.1'],
              ['Link-local', 'fe80::/10', 'Auto-configured per interface; not routable'],
              ['Unique local', 'fc00::/7 (fd00::/8)', 'Private addresses (like RFC1918)'],
              ['Global unicast', '2000::/3', 'Publicly routable addresses'],
              ['Multicast', 'ff00::/8', 'One-to-many communication'],
              ['Unspecified', '::/128', 'Unknown/unassigned address'],
            ],
          },
          {
            type: 'h2',
            text: 'Common Ports and Protocols',
          },
          {
            type: 'table',
            headers: ['Port', 'Protocol', 'Service'],
            rows: [
              ['20/21', 'TCP', 'FTP (data/control)'],
              ['22', 'TCP', 'SSH, SFTP, SCP'],
              ['23', 'TCP', 'Telnet (insecure)'],
              ['25', 'TCP', 'SMTP (server relay)'],
              ['53', 'TCP/UDP', 'DNS'],
              ['67/68', 'UDP', 'DHCP (server/client)'],
              ['80', 'TCP', 'HTTP'],
              ['110', 'TCP', 'POP3'],
              ['119', 'TCP', 'NNTP (news)'],
              ['123', 'UDP', 'NTP'],
              ['139/445', 'TCP', 'Samba / SMB / CIFS'],
              ['143', 'TCP', 'IMAP'],
              ['161/162', 'UDP', 'SNMP (query/trap)'],
              ['389', 'TCP', 'LDAP'],
              ['443', 'TCP', 'HTTPS'],
              ['465/587', 'TCP', 'SMTP over TLS / submission'],
              ['514', 'UDP', 'Syslog'],
              ['993/995', 'TCP', 'IMAPS / POP3S'],
              ['3306', 'TCP', 'MySQL / MariaDB'],
              ['5432', 'TCP', 'PostgreSQL'],
            ],
          },
          {
            type: 'h2',
            text: 'TCP vs UDP',
          },
          {
            type: 'table',
            headers: ['Aspect', 'TCP', 'UDP'],
            rows: [
              ['Connection', 'Connection-oriented (3-way handshake)', 'Connectionless'],
              ['Reliability', 'Guaranteed delivery, ordering, retransmission', 'No guarantee — fire and forget'],
              ['Speed', 'Slower (overhead)', 'Faster (low overhead)'],
              ['Use cases', 'HTTP, SSH, FTP, SMTP, database', 'DNS, NTP, VoIP, streaming, DHCP'],
            ],
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Loopback: 127.0.0.1. APIPA: 169.254.0.0/16 (DHCP failure). /24 = 255.255.255.0 = 254 hosts. IPv6 loopback: ::1. Link-local: fe80::/10. Know key ports: 22=SSH, 25=SMTP, 53=DNS, 80=HTTP, 443=HTTPS, 110=POP3, 143=IMAP, 3306=MySQL. TCP = reliable, connection-oriented; UDP = fast, connectionless. /etc/services lists all port/protocol mappings. CIDR notation: /prefix = number of network bits.',
          },
          {
            type: 'files',
            files: ['/etc/services', '/etc/protocols', '/etc/hosts'],
          },
        ],
      },
      {
        id: '109.2',
        topicId: '109',
        title: 'Persistent Network Configuration',
        weight: 4,
        description: 'Configure network interfaces, routing, and hostname persistently using traditional and systemd-networkd tools.',
        sections: [
          {
            type: 'h2',
            text: 'Network Interface Naming',
          },
          {
            type: 'table',
            headers: ['Naming Scheme', 'Example', 'Description'],
            rows: [
              ['Traditional (legacy)', 'eth0, eth1, wlan0', 'Simple sequential names; can change after reboot/hardware change'],
              ['Predictable (systemd)', 'enp3s0, wlp2s0, eno1', 'Based on PCI slot/bus: en=ethernet, wl=wireless, o=onboard, p=PCI slot'],
              ['Loopback', 'lo', 'Always 127.0.0.1; does not change'],
            ],
          },
          {
            type: 'h2',
            text: 'ip Command (iproute2)',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['ip addr show', 'Show all interface addresses'],
              ['ip addr show eth0', 'Show addresses on eth0 only'],
              ['ip addr add 192.168.1.10/24 dev eth0', 'Add IP address to interface'],
              ['ip addr del 192.168.1.10/24 dev eth0', 'Remove IP address from interface'],
              ['ip link show', 'Show all interfaces (link layer)'],
              ['ip link set eth0 up', 'Bring interface up'],
              ['ip link set eth0 down', 'Bring interface down'],
              ['ip route show', 'Show routing table'],
              ['ip route add default via 192.168.1.1', 'Add default gateway'],
              ['ip route add 10.0.0.0/8 via 192.168.1.254', 'Add static route'],
              ['ip route del default', 'Remove default route'],
              ['ip neigh show', 'Show ARP / neighbour table'],
            ],
          },
          {
            type: 'h2',
            text: 'Legacy Network Commands (still on exam)',
          },
          {
            type: 'table',
            headers: ['Legacy Command', 'Modern Equivalent', 'Description'],
            rows: [
              ['ifconfig', 'ip addr / ip link', 'Show/configure interface addresses'],
              ['ifconfig eth0 up/down', 'ip link set eth0 up/down', 'Enable/disable interface'],
              ['route', 'ip route', 'Show/modify routing table'],
              ['route add default gw 192.168.1.1', 'ip route add default via 192.168.1.1', 'Add default gateway'],
              ['netstat -r', 'ip route', 'Show routing table'],
              ['netstat -tuln', 'ss -tuln', 'Show listening ports'],
              ['arp', 'ip neigh', 'Show/manage ARP cache'],
            ],
          },
          {
            type: 'h2',
            text: 'Persistent Configuration Files',
          },
          {
            type: 'table',
            headers: ['Distro Family', 'Config Location', 'Format'],
            rows: [
              ['Debian/Ubuntu', '/etc/network/interfaces', 'ifupdown format (auto eth0 / iface)'],
              ['Ubuntu 17.10+', '/etc/netplan/*.yaml', 'YAML (applies via systemd-networkd or NetworkManager)'],
              ['RHEL/CentOS 7', '/etc/sysconfig/network-scripts/ifcfg-eth0', 'KEY=VALUE format'],
              ['RHEL/CentOS 8+', 'NetworkManager / /etc/NetworkManager/', 'nmcli / nmtui / connection files'],
              ['systemd-networkd', '/etc/systemd/network/*.network', 'INI format'],
            ],
          },
          {
            type: 'code',
            text: '# /etc/network/interfaces (Debian static IP)\nauto eth0\niface eth0 inet static\n    address 192.168.1.100\n    netmask 255.255.255.0\n    gateway 192.168.1.1\n    dns-nameservers 8.8.8.8 8.8.4.4\n\n# DHCP:\nauto eth0\niface eth0 inet dhcp\n\n# Bring up/down interface:\nifup eth0\nifdown eth0\n\n# /etc/sysconfig/network-scripts/ifcfg-eth0 (RHEL)\nTYPE=Ethernet\nBOOTPROTO=none\nIPADDR=192.168.1.100\nPREFIX=24\nGATEWAY=192.168.1.1\nDNS1=8.8.8.8\nONBOOT=yes\n\n# Restart networking:\nsystemctl restart network     # RHEL 7\nnmcli con reload              # RHEL 8+\nnetplan apply                 # Ubuntu Netplan',
          },
          {
            type: 'h2',
            text: 'Hostname Configuration',
          },
          {
            type: 'code',
            text: '# Show hostname\nhostname\nhostnamectl\n\n# Set hostname permanently\nhostnamectl set-hostname myserver.example.com\n\n# Hostname types in systemd:\n# Static:  permanent, stored in /etc/hostname\n# Pretty:  human-friendly display name (may contain spaces)\n# Transient: temporary, from DHCP or kernel default\n\n# /etc/hostname — contains just the hostname\ncat /etc/hostname\n\n# /etc/hosts — local DNS override\ncat /etc/hosts\n# 127.0.0.1   localhost\n# 192.168.1.100   myserver.example.com   myserver',
          },
          {
            type: 'h2',
            text: 'nmcli — NetworkManager Command Line',
          },
          {
            type: 'code',
            text: '# nmcli — manage NetworkManager connections from CLI\n# Used on RHEL/CentOS 8+, Ubuntu, Fedora, etc.\n\n# Show device status\nnmcli device status\nnmcli dev\n\n# Show all connections\nnmcli connection show\nnmcli con show\n\n# Show details of a specific connection\nnmcli con show "Wired connection 1"\n\n# Bring connection up/down\nnmcli con up "Wired connection 1"\nnmcli con down ens33\n\n# Add a static IP connection\nnmcli con add type ethernet con-name myconn ifname ens33 \\\n    ip4 192.168.1.100/24 gw4 192.168.1.1\nnmcli con mod myconn ipv4.dns "8.8.8.8 8.8.4.4"\nnmcli con up myconn\n\n# Add a DHCP connection\nnmcli con add type ethernet con-name dhcp-eth0 ifname eth0 \\\n    ipv4.method auto\n\n# Modify an existing connection\nnmcli con mod ens33 ipv4.addresses 192.168.1.200/24\nnmcli con mod ens33 ipv4.gateway 192.168.1.1\nnmcli con mod ens33 ipv4.method manual\nnmcli con up ens33   # apply changes\n\n# Reload all connection files from disk\nnmcli con reload\n\n# nmtui — text user interface (menu-driven) for NetworkManager\nnmtui',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'ip addr/route/link replaced ifconfig/route (iproute2 package). Predictable interface names: en=ethernet, wl=wireless, p=PCI slot, o=onboard. ip addr add/del manages addresses. ip route add default via = set gateway. Debian persistent config: /etc/network/interfaces. RHEL: /etc/sysconfig/network-scripts/ifcfg-*. Ubuntu 18+: /etc/netplan/*.yaml. /etc/hostname stores hostname. hostnamectl sets hostname permanently. /etc/hosts provides local name resolution. ss -tuln shows listening sockets (replaces netstat). nmcli manages NetworkManager: con add/mod/up/down; device status shows interfaces; con reload applies config file changes. nmtui is the text menu interface for NetworkManager.',
          },
          {
            type: 'files',
            files: ['/etc/hostname', '/etc/hosts', '/etc/network/interfaces', '/etc/sysconfig/network-scripts/', '/etc/netplan/', '/etc/systemd/network/', '/etc/NetworkManager/'],
          },
        ],
      },
      {
        id: '109.3',
        topicId: '109',
        title: 'Basic Network Troubleshooting',
        weight: 4,
        description: 'Use tools to diagnose network connectivity, routing, and service issues.',
        sections: [
          {
            type: 'h2',
            text: 'Connectivity and Reachability',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['ping host', 'Send ICMP echo requests to test connectivity'],
              ['ping -c 4 host', 'Send exactly 4 pings'],
              ['ping -i 0.2 host', 'Flood/fast ping (0.2s interval)'],
              ['ping6 host', 'IPv6 ping'],
              ['traceroute host', 'Show hop-by-hop path to destination (UDP probes)'],
              ['traceroute -T host', 'TCP traceroute (bypasses some firewalls)'],
              ['traceroute -I host', 'ICMP traceroute'],
              ['tracepath host', 'Like traceroute but no root needed; also detects MTU'],
              ['mtr host', 'Combined ping + traceroute in real-time (my traceroute)'],
            ],
          },
          {
            type: 'h2',
            text: 'Port and Socket Inspection',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['ss -tuln', 'Show TCP/UDP listening ports (numeric, no resolve)'],
              ['ss -tulnp', 'Same + show process (PID/name) — needs root'],
              ['ss -ta', 'Show all TCP connections'],
              ['ss -s', 'Summary statistics'],
              ['netstat -tuln', 'Legacy: show listening ports (same info as ss)'],
              ['netstat -r', 'Legacy: show routing table'],
              ['nc -zv host port', 'Test TCP connectivity to a specific port'],
              ['nc -zvu host port', 'Test UDP port'],
              ['telnet host port', 'Test TCP connectivity (old method)'],
            ],
          },
          {
            type: 'h2',
            text: 'DNS Troubleshooting',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['host example.com', 'Simple DNS lookup (A, MX, NS records)'],
              ['host -t MX example.com', 'Query specific record type'],
              ['dig example.com', 'Detailed DNS query (default: A record)'],
              ['dig example.com MX', 'Query MX records'],
              ['dig @8.8.8.8 example.com', 'Query specific DNS server'],
              ['dig -x 192.168.1.1', 'Reverse DNS lookup (PTR)'],
              ['nslookup example.com', 'Interactive or one-shot DNS query (legacy)'],
              ['getent hosts example.com', 'Show how the OS resolves (respects /etc/nsswitch.conf)'],
            ],
          },
          {
            type: 'h2',
            text: 'Network Interface and ARP',
          },
          {
            type: 'code',
            text: '# Show interface stats (RX/TX bytes, errors, drops)\nip -s link show eth0\nifconfig eth0    # legacy\n\n# ARP cache\nip neigh show\narp -n           # legacy\n\n# Clear ARP entry\narp -d 192.168.1.1\n\n# Find route to host\nip route get 8.8.8.8\n# 8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.100\n\n# Check MTU for a path\ntracepath -n google.com\n\n# Capture packets (requires tcpdump/wireshark)\ntcpdump -i eth0 -n port 80\ntcpdump -i eth0 -n host 8.8.8.8\ntcpdump -i eth0 -w /tmp/capture.pcap',
          },
          {
            type: 'h2',
            text: 'Troubleshooting Methodology',
          },
          {
            type: 'olist',
            items: [
              'Check interface is up: ip link show / ip addr show',
              'Check IP address and subnet mask are correct: ip addr',
              'Check default gateway: ip route show (look for default via)',
              'Ping the gateway: ping <gateway IP>',
              'Ping a public IP (no DNS): ping 8.8.8.8',
              'Test DNS resolution: dig google.com / cat /etc/resolv.conf',
              'Check if service port is listening: ss -tuln | grep :80',
              'Test remote service: nc -zv host port',
              'Check firewall rules: iptables -L -n / nft list ruleset',
            ],
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'ping tests ICMP reachability. traceroute shows the path/hops. mtr combines ping+traceroute live. ss replaces netstat: ss -tuln = listening ports; -p adds process info. nc -zv tests TCP port; -u for UDP. dig is the preferred DNS query tool: dig type @server. host is simpler. getent hosts uses /etc/nsswitch.conf resolution order. ip route get shows which route would be used for a destination. tcpdump captures packets: -i interface, -n no resolve, -w write pcap. Check in order: link → IP → gateway → route → DNS → service port → firewall.',
          },
        ],
      },
      {
        id: '109.4',
        topicId: '109',
        title: 'Configure Client Side DNS',
        weight: 2,
        description: 'Configure DNS resolution on a Linux client: /etc/resolv.conf, /etc/hosts, /etc/nsswitch.conf.',
        sections: [
          {
            type: 'h2',
            text: '/etc/resolv.conf',
          },
          {
            type: 'code',
            text: '# /etc/resolv.conf — DNS resolver configuration\n# Up to 3 nameservers consulted in order\nnameserver 8.8.8.8          # primary DNS server\nnameserver 8.8.4.4          # secondary DNS server\nnameserver 192.168.1.1      # local DNS (3rd)\n\n# search: append these domains when resolving short names\n# "ping webserver" becomes "ping webserver.example.com"\nsearch example.com corp.example.com\n\n# domain: single search domain (similar to search with one entry)\ndomain example.com\n\n# Options\noptions ndots:5    # names with fewer than 5 dots get search appended\noptions timeout:2  # seconds to wait for DNS response\noptions attempts:3 # retry attempts per nameserver',
          },
          {
            type: 'h2',
            text: '/etc/hosts',
          },
          {
            type: 'code',
            text: '# /etc/hosts — static name-to-IP mappings\n# Checked BEFORE DNS (by default, per /etc/nsswitch.conf)\n# Format: IP  canonical-name  [aliases...]\n127.0.0.1       localhost\n127.0.1.1       mypc.localdomain  mypc\n192.168.1.100   server.example.com  server\n10.0.0.5        db1 db1.internal\n::1             localhost ip6-localhost\n\n# Useful for:\n# - Development: override production domain to local\n# - Blocking: map ad domains to 0.0.0.0\n# - Quick workarounds without DNS changes',
          },
          {
            type: 'h2',
            text: '/etc/nsswitch.conf — Name Service Switch',
          },
          {
            type: 'p',
            text: '/etc/nsswitch.conf controls the order in which different databases (local files, DNS, NIS, LDAP) are consulted for name resolution and other lookups.',
          },
          {
            type: 'code',
            text: '# /etc/nsswitch.conf\n# hosts line controls hostname resolution order:\nhosts: files dns myhostname\n# files = /etc/hosts (checked first)\n# dns   = /etc/resolv.conf DNS servers (checked second)\n# myhostname = systemd resolver (knows own hostname even if not in /etc/hosts)\n\n# Other lookups:\npasswd:   files systemd\nshadow:   files\ngroup:    files systemd\nnetworks: files          # /etc/networks\nprotocols: db files      # /etc/protocols\nservices: db files       # /etc/services\n\n# If "dns" comes before "files", DNS is checked first\nhosts: dns files   # queries DNS before /etc/hosts\n\n# [NOTFOUND=return] stops searching if not found in current source\nhosts: files [NOTFOUND=return] dns',
          },
          {
            type: 'h2',
            text: 'systemd-resolved',
          },
          {
            type: 'code',
            text: '# systemd-resolved: stub DNS resolver and cache\n# Listens on 127.0.0.53:53 as a local stub resolver\n\n# Status and active DNS server\nresolvectl status\nresolvectl dns          # show DNS servers used per interface\n\n# Flush DNS cache\nresolvectl flush-caches\n\n# When systemd-resolved is active, /etc/resolv.conf is often a symlink:\nls -la /etc/resolv.conf\n# /etc/resolv.conf -> /run/systemd/resolve/stub-resolv.conf\n# (stub-resolv.conf points to 127.0.0.53)\n\n# Config:\ncat /etc/systemd/resolved.conf',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: '/etc/resolv.conf: nameserver (up to 3), search (appended for unqualified names), domain (single search domain). /etc/hosts checked before DNS (when hosts: files dns in nsswitch.conf). /etc/nsswitch.conf controls lookup order for hosts, passwd, group, etc. Default order: hosts: files dns — /etc/hosts first, then DNS. systemd-resolved listens on 127.0.0.53; resolvectl status shows active DNS. getent hosts <name> shows resolution result using nsswitch. Changing order to dns files checks DNS before /etc/hosts.',
          },
          {
            type: 'files',
            files: ['/etc/resolv.conf', '/etc/hosts', '/etc/nsswitch.conf', '/etc/systemd/resolved.conf', '/run/systemd/resolve/'],
          },
        ],
      },
    ],
}
