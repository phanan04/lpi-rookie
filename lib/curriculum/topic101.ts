import type { Topic } from '../types'
import { Cpu } from 'lucide-react'

export const topic101: Topic = {
    id: '101',
    title: 'System Architecture',
    icon: Cpu,
    description:
      'Determine and configure fundamental hardware settings, understand the boot process, and manage system runlevels and targets.',
    lessons: [
      {
        id: '101.1',
        topicId: '101',
        title: 'Determine and Configure Hardware Settings',
        weight: 2,
        description:
          'Enable and disable integrated peripherals, differentiate between the various types of mass storage devices, determine hardware resources for devices, tools and utilities to list various hardware information.',
        sections: [
          {
            type: 'h2',
            text: 'The /proc Filesystem',
          },
          {
            type: 'p',
            text: 'The /proc virtual filesystem is a window into the running kernel. It does not reside on disk; the kernel creates it dynamically in memory. Files in /proc contain information about processes, hardware, and kernel parameters.',
          },
          {
            type: 'table',
            headers: ['File/Directory', 'Description'],
            rows: [
              ['/proc/cpuinfo', 'CPU type, model, cores, flags'],
              ['/proc/meminfo', 'RAM and swap usage details'],
              ['/proc/interrupts', 'IRQ assignments and counts'],
              ['/proc/ioports', 'I/O port ranges used by devices'],
              ['/proc/dma', 'DMA channel assignments'],
              ['/proc/bus/pci', 'PCI bus devices (older interface)'],
              ['/proc/modules', 'Currently loaded kernel modules'],
              ['/proc/partitions', 'Partition table information'],
            ],
          },
          {
            type: 'practice',
            title: 'Khám phá /proc',
            hint: 'cat /proc/cpuinfo',
          },
          {
            type: 'h2',
            text: 'The /sys Filesystem',
          },
          {
            type: 'p',
            text: 'The /sys filesystem (sysfs) is newer than /proc and provides a structured view of the kernel device model. Hardware devices appear as directory trees exposing their attributes.',
          },
          {
            type: 'code',
            text: '# Explore a PCI device in /sys\nls /sys/bus/pci/devices/\ncat /sys/bus/pci/devices/0000:00:1f.2/class\n\n# View a network interface\nls /sys/class/net/eth0/\ncat /sys/class/net/eth0/speed',
          },
          {
            type: 'practice',
            title: 'Khám phá /sys',
            hint: 'ls /sys',
          },
          {
            type: 'h2',
            text: 'The /dev Directory',
          },
          {
            type: 'p',
            text: '/dev contains device files. Modern Linux uses udev to dynamically create/remove device nodes. Device files have a major number (driver) and minor number (specific device instance).',
          },
          {
            type: 'table',
            headers: ['Device File', 'Description'],
            rows: [
              ['/dev/sda, sdb...', 'SATA/SCSI/USB hard drives'],
              ['/dev/hda, hdb...', 'IDE hard drives (legacy)'],
              ['/dev/sr0', 'CD/DVD-ROM drive'],
              ['/dev/tty0..N', 'Virtual terminals'],
              ['/dev/ttyS0..N', 'Serial ports (COM ports)'],
              ['/dev/lp0', 'Parallel port printer'],
              ['/dev/null', 'Discard all written data, returns EOF'],
              ['/dev/zero', 'Returns infinite null bytes'],
              ['/dev/random', 'True random number generator'],
              ['/dev/urandom', 'Non-blocking pseudo-random'],
              ['/dev/fd0', 'Floppy disk drive (legacy)'],
            ],
          },
          {
            type: 'practice',
            title: 'Khám phá /dev',
            hint: 'ls /dev',
          },
          {
            type: 'h2',
            text: 'Storage Device Types and Naming',
          },
          {
            type: 'table',
            headers: ['Device Type', 'Kernel Device Name', 'Notes'],
            rows: [
              ['SATA / SCSI / USB storage', '/dev/sda, /dev/sdb, /dev/sdc ...', 'Lettered a–z; partitions add number: /dev/sda1, /dev/sda2'],
              ['NVMe SSD', '/dev/nvme0n1, /dev/nvme1n1', 'Format: nvme<ctrl>n<ns>; partitions: /dev/nvme0n1p1 (p prefix)'],
              ['IDE / PATA (legacy)', '/dev/hda, /dev/hdb, /dev/hdc ...', 'hda=primary master, hdb=primary slave, hdc/hdd=secondary channel'],
              ['eMMC / SD card', '/dev/mmcblk0, /dev/mmcblk1', 'Partitions: /dev/mmcblk0p1, /dev/mmcblk0p2'],
              ['Virtio (KVM/VM guest)', '/dev/vda, /dev/vdb', 'Paravirtualized block device inside virtual machines'],
              ['Optical drive (CD/DVD)', '/dev/sr0, /dev/sr1', 'Also symlinked as /dev/cdrom or /dev/dvd'],
            ],
          },
          {
            type: 'practice',
            title: 'Xem phân vùng & thiết bị block',
            hint: 'lsblk',
          },
          {
            type: 'h2',
            text: 'BIOS/UEFI — Enabling and Disabling Integrated Peripherals',
          },
          {
            type: 'p',
            text: 'BIOS and UEFI firmware settings allow enabling or disabling on-board hardware controllers before the OS loads. Access the setup by pressing Del, F2, F10, or Esc during POST (varies by manufacturer).',
          },
          {
            type: 'table',
            headers: ['Peripheral', 'Common BIOS Setting', 'Notes'],
            rows: [
              ['USB controller', 'Enable / Disable; USB Legacy Support', 'USB Legacy enables keyboard/mouse in BIOS without OS driver'],
              ['Serial port COM1', 'IRQ4 / I/O 0x03F8; Enable / Disable', 'COM1 uses IRQ 4 by default; COM2 uses IRQ 3'],
              ['Parallel port LPT1', 'IRQ7 / 0x0378; mode: SPP, EPP, ECP', 'Disable frees IRQ 7; ECP mode uses DMA channel'],
              ['Onboard NIC', 'Enable / Disable; Wake-on-LAN (WOL)', 'Disable if dedicated NIC is installed'],
              ['SATA controller mode', 'AHCI / IDE (Legacy) / RAID', 'Changing mode can break existing boot; AHCI recommended'],
              ['Onboard audio / video', 'Enable / Disable', 'Disable to free IRQs/resources for dedicated card'],
              ['Secure Boot (UEFI)', 'Enable / Disable', 'Prevents unsigned bootloaders; may need disabling for some distros'],
            ],
          },
          {
            type: 'practice',
            title: 'Xem boot messages (BIOS/hardware detection)',
            hint: 'dmesg',
          },
          {
            type: 'h2',
            text: 'Kernel Modules',
          },
          {
            type: 'p',
            text: 'Kernel modules (drivers) can be loaded and unloaded at runtime. They are stored in /lib/modules/$(uname -r)/.',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['lsmod', 'List currently loaded modules'],
              ['modinfo <module>', 'Show module information (description, params, author)'],
              ['modprobe <module>', 'Load a module and its dependencies'],
              ['modprobe -r <module>', 'Unload a module and its dependencies'],
              ['insmod <file.ko>', 'Load a specific module file (no dependency resolution)'],
              ['rmmod <module>', 'Unload a module (must not be in use)'],
              ['depmod', 'Build module dependency database'],
            ],
          },
          {
            type: 'code',
            text: '# List all loaded modules\nlsmod\n\n# Show information about the e1000 network driver\nmodinfo e1000\n\n# Load the usb-storage module\nmodprobe usb-storage\n\n# Unload a module\nmodprobe -r usb-storage\n\n# Persistent module loading: add to /etc/modules (Debian) or /etc/modules-load.d/*.conf',
          },
          {
            type: 'practice',
            title: 'Thực hành: quản lý module',
            hint: 'lsmod',
          },
          {
            type: 'h2',
            text: 'Hardware Discovery Tools',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['lspci', 'List PCI devices (network cards, GPU, sound)'],
              ['lspci -v', 'Verbose PCI listing'],
              ['lspci -k', 'Show kernel driver in use for each device'],
              ['lsusb', 'List USB devices'],
              ['lsusb -v', 'Verbose USB listing'],
              ['lshw', 'Detailed hardware info (requires root)'],
              ['lscpu', 'Display CPU architecture information'],
              ['lsblk', 'List block devices in tree format'],
              ['dmidecode', 'Read DMI/SMBIOS hardware info (BIOS, RAM slots, etc.)'],
              ['lspci -nn', 'Show PCI devices with [vendor:device] numeric IDs (e.g., [8086:1d68])'],
              ['hdparm -I /dev/sda', 'Show ATA/SATA drive identity, capabilities, and feature support'],
              ['hdparm -t /dev/sda', 'Benchmark sequential disk read speed'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: hardware discovery',
            hint: 'lspci',
          },
          {
            type: 'h2',
            text: 'udev — Dynamic Device Management',
          },
          {
            type: 'p',
            text: 'udev is the device manager for the Linux kernel. It dynamically creates/removes device nodes in /dev when hardware is added or removed (hot-plug). udev rules are stored in /etc/udev/rules.d/ and /lib/udev/rules.d/.',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['udevadm info /dev/sda', 'Show udev attributes of a device'],
              ['udevadm monitor', 'Watch real-time udev events (plug/unplug)'],
              ['udevadm trigger', 'Re-trigger device events (reload rules)'],
              ['udevadm control --reload-rules', 'Reload udev rules without restart'],
              ['udevadm settle', 'Wait until all udev events are processed'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: udevadm',
            hint: 'udevadm info /dev/sda',
          },
          {
            type: 'h2',
            text: 'IRQ, DMA, and I/O Ports',
          },
          {
            type: 'p',
            text: 'Hardware devices communicate with the CPU using three mechanisms: Interrupts (IRQ), Direct Memory Access (DMA), and I/O port addresses.',
          },
          {
            type: 'table',
            headers: ['Resource', '/proc file', 'Description'],
            rows: [
              ['IRQ (Interrupt Request)', '/proc/interrupts', 'Signals CPU that device needs attention. IRQ 0=timer, 1=keyboard, 3=COM2, 4=COM1, 6=floppy, 14=IDE primary'],
              ['DMA (Direct Memory Access)', '/proc/dma', 'Allows device to transfer data to/from RAM without CPU. Frees CPU during large transfers.'],
              ['I/O Ports', '/proc/ioports', 'Port address space for device registers. e.g., 0x0060–0x006f = keyboard, 0x03f8 = COM1'],
            ],
          },
          {
            type: 'practice',
            title: 'Xem IRQ, DMA, I/O ports',
            hint: 'cat /proc/interrupts',
          },
          {
            type: 'h2',
            text: 'Cold Plug vs Hot Plug',
          },
          {
            type: 'table',
            headers: ['Type', 'Description', 'Examples'],
            rows: [
              ['Cold plug', 'Device connected before system boots; detected at startup by BIOS/kernel', 'Internal hard drives, RAM, PCI cards'],
              ['Hot plug', 'Device connected while system is running; udev handles detection and /dev node creation', 'USB devices, Thunderbolt, eSATA, ExpressCard'],
            ],
          },
          {
            type: 'practice',
            title: 'Xem thiết bị USB (hot-plug)',
            hint: 'lsusb',
          },
          {
            type: 'h2',
            text: 'Kernel Module Configuration Files',
          },
          {
            type: 'table',
            headers: ['File/Directory', 'Description'],
            rows: [
              ['/etc/modules', 'Modules to load at boot (Debian/Ubuntu)'],
              ['/etc/modules-load.d/*.conf', 'Modules to load at boot (systemd-based)'],
              ['/etc/modprobe.d/*.conf', 'Module options, aliases, and blacklists'],
              ['/lib/modules/$(uname -r)/', 'Installed kernel modules directory'],
              ['/lib/modules/$(uname -r)/modules.dep', 'Module dependency map'],
            ],
          },
          {
            type: 'code',
            text: '# Blacklist a module (prevent auto-loading)\n# /etc/modprobe.d/blacklist.conf:\nblacklist nouveau\n\n# Set module option at load time\n# /etc/modprobe.d/iwlwifi.conf:\noptions iwlwifi 11n_disable=1\n\n# Show current IRQ assignments\ncat /proc/interrupts\n\n# Show DMA channels\ncat /proc/dma\n\n# Show I/O port assignments\ncat /proc/ioports\n\n# Monitor hardware events in real time\nudevadm monitor --environment --udev',
          },
          {
            type: 'practice',
            title: 'Thực hành: module config files',
            hint: 'cat /etc/modules',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Know which /proc files relate to IRQ (/proc/interrupts), DMA (/proc/dma), I/O ports (/proc/ioports). Know the difference: modprobe resolves dependencies and loads them automatically; insmod loads a single .ko file without dependency checks. modprobe -r unloads a module and its unused dependencies; rmmod requires manual unload order. udev manages /dev dynamically via rules in /etc/udev/rules.d/. lsmod reads /proc/modules. Blacklisting in /etc/modprobe.d/ prevents auto-loading. /etc/modules-load.d/ is the systemd way to load modules at boot. Device naming: /dev/sda=SATA/SCSI/USB, /dev/nvme0n1=NVMe, /dev/hda=IDE(legacy), /dev/mmcblk0=eMMC/SD. lspci -k shows driver in use; lspci -nn shows [vendor:device] IDs. Default serial port IRQs: COM1=IRQ4 (0x03F8), COM2=IRQ3 (0x02F8).',
          },
          {
            type: 'files',
            files: ['/proc/cpuinfo', '/proc/meminfo', '/proc/interrupts', '/proc/ioports', '/proc/dma', '/proc/modules', '/sys/', '/dev/', '/etc/modules', '/etc/modules-load.d/', '/etc/modprobe.d/', '/lib/modules/'],
          },
        ],
      },
      {
        id: '101.2',
        topicId: '101',
        title: 'Boot the System',
        weight: 3,
        description:
          'Guide the system through the booting process: BIOS/UEFI → Boot Loader → Kernel → Init/Systemd.',
        sections: [
          {
            type: 'h2',
            text: 'The Boot Sequence',
          },
          {
            type: 'olist',
            items: [
              'Power-On → Firmware (BIOS or UEFI) runs POST (Power-On Self Test)',
              'Firmware locates the boot device (disk, USB, network)',
              'BIOS: reads MBR (first 512 bytes of disk) → loads boot loader',
              'UEFI: reads EFI System Partition (ESP) → runs EFI bootloader directly',
              'Boot loader (GRUB2) loads kernel image and initrd into RAM',
              'Kernel initialises hardware, mounts root filesystem',
              'Kernel starts PID 1: init (SysV), upstart, or systemd',
              'Init/systemd brings up services and reaches target/runlevel',
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem quá trình boot',
            hint: 'systemd-analyze ; cat /proc/cmdline',
          },
          {
            type: 'h2',
            text: 'BIOS vs UEFI',
          },
          {
            type: 'table',
            headers: ['Feature', 'BIOS', 'UEFI'],
            rows: [
              ['Partition table', 'MBR (max 4 primary, max 2 TB)', 'GPT (up to 128 partitions, >2 TB)'],
              ['Boot code location', 'First 512 bytes (MBR)', 'EFI System Partition (.efi files)'],
              ['Interface', 'Text-only', 'Graphical, mouse support'],
              ['Secure Boot', 'Not supported', 'Supported'],
              ['64-bit mode', 'Limited', 'Native 64-bit'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Kiểm tra BIOS hay UEFI',
            hint: 'ls /sys/firmware/efi 2>/dev/null && echo "UEFI" || echo "BIOS/Legacy"',
          },
          {
            type: 'h2',
            text: 'Boot Loaders',
          },
          {
            type: 'p',
            text: 'GRUB2 (GRand Unified Bootloader version 2) is the standard Linux boot loader. Its configuration is generated automatically.',
          },
          {
            type: 'table',
            headers: ['File/Command', 'Description'],
            rows: [
              ['/boot/grub/grub.cfg', 'Main GRUB2 config (auto-generated, do not edit directly)'],
              ['/etc/default/grub', 'User-editable GRUB2 settings (timeout, cmdline, etc.)'],
              ['/etc/grub.d/', 'Scripts that generate grub.cfg'],
              ['grub-mkconfig -o /boot/grub/grub.cfg', 'Regenerate GRUB2 config (Debian/Ubuntu)'],
              ['grub2-mkconfig -o /boot/grub2/grub.cfg', 'Regenerate GRUB2 config (RHEL/CentOS)'],
              ['grub-install /dev/sda', 'Install GRUB2 to MBR of /dev/sda'],
              ['update-grub', 'Shorthand for grub-mkconfig (Debian)'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem cấu hình GRUB',
            hint: 'cat /etc/default/grub ; ls /etc/grub.d/ 2>/dev/null',
          },
          {
            type: 'h2',
            text: 'Kernel Boot Messages',
          },
          {
            type: 'p',
            text: 'The kernel outputs boot messages (dmesg) to the ring buffer. These messages describe hardware detection and driver initialisation.',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['dmesg', 'Print kernel ring buffer (boot messages)'],
              ['dmesg | less', 'Page through boot messages'],
              ['dmesg -T', 'Show human-readable timestamps'],
              ['dmesg | grep -i error', 'Find error messages in boot log'],
              ['journalctl -k', 'Show kernel messages via systemd journal'],
              ['journalctl -b', 'Show all logs from current boot'],
              ['journalctl -b -1', 'Show all logs from previous boot'],
              ['journalctl -b -p err', 'Show error-level and above from current boot'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem kernel boot messages',
            hint: 'dmesg -T | tail -20',
          },
          {
            type: 'h2',
            text: 'Boot Log Files',
          },
          {
            type: 'table',
            headers: ['File / Command', 'Description'],
            rows: [
              ['dmesg', 'Kernel ring buffer — live hardware and driver messages'],
              ['/var/log/dmesg', 'Kernel ring buffer snapshot saved at boot time'],
              ['/var/log/messages', 'General system messages — RHEL, CentOS, SUSE (syslog-based)'],
              ['/var/log/syslog', 'General system messages — Debian, Ubuntu (rsyslog)'],
              ['/var/log/boot.log', 'Service start/stop messages during boot — RHEL/CentOS'],
              ['journalctl -b', 'Full systemd journal from current boot'],
              ['journalctl -b -1', 'Full systemd journal from previous boot'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem log file hệ thống',
            hint: 'journalctl -b --no-pager | tail -20',
          },
          {
            type: 'h2',
            text: 'Init Systems: SysV vs systemd',
          },
          {
            type: 'p',
            text: 'The first process (PID 1) started by the kernel is the init system. Modern Linux uses systemd, but LPIC-1 requires knowledge of SysV init too.',
          },
          {
            type: 'table',
            headers: ['SysV Init', 'systemd'],
            rows: [
              ['/sbin/init', '/lib/systemd/systemd or /usr/lib/systemd/systemd'],
              ['/etc/inittab', '/etc/systemd/system/ and /lib/systemd/system/'],
              ['Runlevels (0–6)', 'Targets (poweroff, rescue, multi-user, graphical, ...)'],
              ['/etc/init.d/ scripts', 'Unit files (.service, .target, .socket, ...)'],
              ['Sequential startup', 'Parallel startup (much faster)'],
            ],
          },
          {
            type: 'practice',
            title: 'Thực hành: Xác định init system đang dùng',
            hint: 'ps -p 1 -o comm= ; ls -la /sbin/init 2>/dev/null',
          },
          {
            type: 'h2',
            text: 'initrd and initramfs',
          },
          {
            type: 'p',
            text: "The kernel cannot mount the root filesystem until it has the necessary drivers. initrd (initial RAM disk) or initramfs (initial RAM filesystem) is a temporary root filesystem loaded by the boot loader into RAM. It contains just enough drivers to mount the real root filesystem.",
          },
          {
            type: 'code',
            text: '# List initramfs contents\nlsinitrd /boot/initramfs-$(uname -r).img | head -30\n\n# or on Debian:\nunmkinitramfs /boot/initrd.img-$(uname -r) /tmp/initrd-inspect\n\n# dmesg shows which modules are loaded during early boot\ndmesg | grep "initrd"',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem initramfs',
            hint: 'ls /boot/initrd* /boot/initramfs* 2>/dev/null ; uname -r',
          },
          {
            type: 'h2',
            text: 'Kernel Parameters (Boot Options)',
          },
          {
            type: 'p',
            text: 'Kernel parameters are passed by the boot loader on the kernel command line. They control kernel behaviour and can be viewed at runtime via /proc/cmdline.',
          },
          {
            type: 'table',
            headers: ['Parameter', 'Description'],
            rows: [
              ['root=/dev/sda1', 'Specify root filesystem device'],
              ['ro', 'Mount root filesystem read-only initially (standard)'],
              ['rw', 'Mount root filesystem read-write at boot'],
              ['quiet', 'Suppress most boot messages'],
              ['splash', 'Show a graphical splash screen'],
              ['init=/bin/bash', 'Start bash as PID 1 instead of init (rescue / single-user)'],
              ['single or 1', 'Boot to single-user mode (runlevel 1 / rescue.target)'],
              ['nomodeset', 'Disable kernel mode setting (GPU fallback)'],
              ['acpi=off', 'Disable ACPI power management'],
              ['mem=2G', 'Limit usable RAM to 2 GB'],
              ['maxcpus=1', 'Limit to 1 CPU for testing'],
              ['systemd.unit=rescue.target', 'systemd: boot to rescue target'],
            ],
          },
          {
            type: 'code',
            text: '# View the kernel parameters used for this boot\ncat /proc/cmdline\n\n# GRUB2: temporarily edit kernel parameters at boot\n# 1. At GRUB menu, press "e" to edit the selected entry\n# 2. Find the line starting with linux\n# 3. Append or change parameters at the end\n# 4. Press Ctrl+X or F10 to boot with changes\n\n# Permanently add kernel parameter via /etc/default/grub:\nGRUB_CMDLINE_LINUX_DEFAULT="quiet splash nomodeset"\n# Then regenerate: update-grub',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem kernel parameters',
            hint: 'cat /proc/cmdline',
          },
          {
            type: 'h2',
            text: 'SysRq Keys — Emergency Kernel Interface',
          },
          {
            type: 'p',
            text: 'Magic SysRq keys allow direct communication with the kernel even when the system is locked up. Triggered via Alt+SysRq+<key> or by writing to /proc/sysrq-trigger.',
          },
          {
            type: 'table',
            headers: ['Key', 'Action'],
            rows: [
              ['b', 'Immediately reboot (no sync/unmount)'],
              ['o', 'Power off immediately'],
              ['s', 'Sync all filesystems'],
              ['u', 'Remount all filesystems read-only'],
              ['e', 'Send SIGTERM to all processes except init'],
              ['i', 'Send SIGKILL to all processes except init'],
              ['t', 'Dump task list to console'],
              ['m', 'Dump memory info'],
              ['f', 'Trigger OOM killer'],
            ],
          },
          {
            type: 'code',
            text: '# Enable SysRq (may be disabled in hardened kernels)\necho 1 > /proc/sys/kernel/sysrq\n\n# Trigger sync via sysrq-trigger\necho s > /proc/sysrq-trigger\n\n# Emergency reboot when completely frozen (the REISUB trick):\n# Alt+SysRq+r, e, i, s, u, b\n# (Raise Elephants Is So Utterly Boring)\n# r=unraw keyboard, e=terminate, i=kill, s=sync, u=unmount, b=reboot',
          },
          {
            type: 'practice',
            title: 'Thực hành: Xem trạng thái SysRq',
            hint: 'cat /proc/sys/kernel/sysrq',
          },
          {
            type: 'h2',
            text: 'systemd-analyze — Boot Performance',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['systemd-analyze', 'Show total boot time breakdown: firmware + loader + kernel + userspace'],
              ['systemd-analyze blame', 'List all units sorted by activation time (slowest first)'],
              ['systemd-analyze critical-chain', 'Show critical dependency path that delayed reaching the default target'],
              ['systemd-analyze plot > boot.svg', 'Generate SVG timeline chart of the entire boot sequence'],
              ['systemd-analyze verify unit.service', 'Check a unit file for syntax errors without starting it'],
            ],
          },
          {
            type: 'code',
            text: '# Show total boot time\nsystemd-analyze\n# Startup finished in 1.2s (firmware) + 0.5s (loader) + 2.1s (kernel) + 8.4s (userspace)\n\n# Find the 10 slowest services\nsystemd-analyze blame | head -10\n\n# Show critical dependency chain\nsystemd-analyze critical-chain graphical.target',
          },
          {
            type: 'practice',
            title: 'Thực hành: Phân tích hiệu suất boot',
            hint: 'systemd-analyze blame 2>/dev/null | head -10',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Key boot sequence: BIOS/UEFI → MBR/ESP → GRUB2 → Kernel → initrd/initramfs → /sbin/init (PID 1). initrd/initramfs provides drivers needed to mount the real root filesystem. Know dmesg for boot messages; /var/log/messages (RHEL/CentOS) and /var/log/syslog (Debian/Ubuntu) for persistent logs; /var/log/boot.log for service start messages. Know /etc/default/grub for GRUB settings; grub-mkconfig or update-grub regenerates grub.cfg. /proc/cmdline shows active kernel parameters. init=/bin/bash boots to bash as PID 1 (recovery). SysRq: kernel.sysrq must be 1; REISUB sequence safely reboots a frozen system. systemd-analyze blame shows slowest services at boot.',
          },
          {
            type: 'files',
            files: ['/boot/grub/grub.cfg', '/etc/default/grub', '/etc/grub.d/', '/boot/vmlinuz-*', '/boot/initrd.img-*', '/proc/cmdline', '/proc/sys/kernel/sysrq', '/proc/sysrq-trigger', '/var/log/messages', '/var/log/syslog', '/var/log/boot.log', '/var/log/dmesg'],
          },
        ],
      },
      {
        id: '101.3',
        topicId: '101',
        title: 'Change Runlevels, Boot Targets, and Shutdown',
        weight: 3,
        description:
          'Set the default runlevel/target, switch between runlevels/targets, and properly shut down or reboot the system.',
        sections: [
          {
            type: 'h2',
            text: 'SysV Runlevels',
          },
          {
            type: 'p',
            text: 'SysV init defines numbered runlevels. Scripts in /etc/rcN.d/ (N = runlevel) are run during transitions.',
          },
          {
            type: 'table',
            headers: ['Runlevel', 'Description'],
            rows: [
              ['0', 'Halt / Power off'],
              ['1 or S', 'Single-user mode (maintenance, no network)'],
              ['2', 'Multi-user without NFS (Debian: with GUI)'],
              ['3', 'Full multi-user, text mode (RHEL/CentOS: no GUI)'],
              ['4', 'Undefined / custom'],
              ['5', 'Full multi-user, graphical mode (X11)'],
              ['6', 'Reboot'],
            ],
          },
          {
            type: 'code',
            text: '# Check current runlevel\nrunlevel         # output: "N 5" (N=previous, 5=current)\nwho -r           # shows runlevel with date and time\n\n# Switch runlevel immediately (two equivalent methods)\ninit 3           # tell init directly\ntelinit 3        # signal to init daemon (recommended)\n\n# Reload /etc/inittab after editing (without rebooting)\ntelinit q\n\n# Set default runlevel in /etc/inittab\n# id:5:initdefault:\ngrep initdefault /etc/inittab',
          },
          {
            type: 'h2',
            text: 'systemd Targets',
          },
          {
            type: 'p',
            text: 'systemd replaces runlevels with targets. Targets are unit files describing system states.',
          },
          {
            type: 'table',
            headers: ['systemd Target', 'SysV Equivalent', 'Description'],
            rows: [
              ['poweroff.target', 'Runlevel 0', 'Shut down and power off'],
              ['rescue.target', 'Runlevel 1', 'Single-user / rescue mode'],
              ['multi-user.target', 'Runlevel 2,3,4', 'Text-mode multi-user'],
              ['graphical.target', 'Runlevel 5', 'Graphical multi-user'],
              ['reboot.target', 'Runlevel 6', 'Reboot'],
              ['emergency.target', '(none)', 'Emergency shell, minimal mounts'],
            ],
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['systemctl get-default', 'Show current default target'],
              ['systemctl set-default graphical.target', 'Set default target to graphical'],
              ['systemctl isolate multi-user.target', 'Switch to target immediately'],
              ['systemctl list-units --type=target', 'List all active targets'],
              ['systemctl status', 'Show overall system status'],
              ['systemctl start/stop/restart/enable/disable <unit>', 'Manage a service unit'],
            ],
          },
          {
            type: 'h2',
            text: 'Shutdown and Reboot',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['shutdown -h now', 'Halt the system immediately'],
              ['shutdown -h +10 "Message"', 'Halt in 10 minutes with broadcast message'],
              ['shutdown -r now', 'Reboot immediately'],
              ['shutdown -c', 'Cancel a pending shutdown'],
              ['poweroff', 'Power off system (equivalent to shutdown -h now)'],
              ['reboot', 'Reboot system (equivalent to shutdown -r now)'],
              ['halt', 'Halt the CPU (may or may not power off)'],
              ['init 0', 'SysV: go to runlevel 0 (halt)'],
              ['init 6', 'SysV: go to runlevel 6 (reboot)'],
              ['systemctl poweroff', 'systemd: power off'],
              ['systemctl reboot', 'systemd: reboot'],
              ['wall "Server going down in 5 min"', 'Broadcast a message to all logged-in terminal sessions'],
            ],
          },
          {
            type: 'tip',
            title: 'Wall Message and /etc/nologin',
            body: 'shutdown broadcasts a wall (write-all) message to all terminals before halting. /etc/nologin is created ~5 minutes before shutdown — its presence prevents non-root logins. Send a manual broadcast at any time with: wall "message". The optional message in shutdown -h +10 "Going down" is also delivered via wall.',
          },
          {
            type: 'h2',
            text: 'SysV Init Scripts',
          },
          {
            type: 'p',
            text: '/etc/init.d/ contains startup/stop scripts for services. Symlinks in /etc/rcN.d/ determine what runs at each runlevel. The letter K (Kill) or S (Start) followed by a two-digit priority number precedes the service name.',
          },
          {
            type: 'code',
            text: '# SysV service management\nservice ssh start\nservice ssh stop\nservice ssh restart\nservice ssh status\n\n# Manage runlevel links\nupdate-rc.d ssh enable        # Debian: enable at default runlevels\nupdate-rc.d ssh disable       # Debian: disable\nchkconfig sshd on             # RHEL/CentOS\nchkconfig sshd off\nchkconfig --list sshd         # show per-runlevel status\n\n# List scripts in runlevel 3\nls -la /etc/rc3.d/\n# S20ssh -> ../init.d/ssh       (Start, priority 20)\n# K80apache2 -> ../init.d/apache2  (Kill, priority 80)',
          },
          {
            type: 'h2',
            text: 'systemctl — Full Reference',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['systemctl start <unit>', 'Start a unit now'],
              ['systemctl stop <unit>', 'Stop a unit'],
              ['systemctl restart <unit>', 'Stop then start a unit'],
              ['systemctl reload <unit>', 'Reload config without stopping (if supported)'],
              ['systemctl status <unit>', 'Show unit status and recent log tail'],
              ['systemctl enable <unit>', 'Enable at boot (creates symlink in /etc/systemd/system/)'],
              ['systemctl disable <unit>', 'Disable at boot (removes symlink)'],
              ['systemctl is-enabled <unit>', 'Check if enabled'],
              ['systemctl is-active <unit>', 'Check if currently running'],
              ['systemctl mask <unit>', 'Prevent unit from ever starting (symlink to /dev/null)'],
              ['systemctl unmask <unit>', 'Undo mask'],
              ['systemctl daemon-reload', 'Reload systemd unit files after editing'],
              ['systemctl list-units', 'List all active units'],
              ['systemctl list-unit-files', 'List all known unit files and their state'],
              ['systemctl get-default', 'Show default target'],
              ['systemctl set-default multi-user.target', 'Change default target'],
              ['systemctl isolate rescue.target', 'Switch to target now (drops non-essential services)'],
            ],
          },
          {
            type: 'h2',
            text: 'systemd Default Target — How It Works',
          },
          {
            type: 'p',
            text: 'systemctl set-default TARGET creates a symlink /etc/systemd/system/default.target pointing to the requested target unit file. You can inspect or change it manually:',
          },
          {
            type: 'code',
            text: '# Inspect the default target symlink\nls -la /etc/systemd/system/default.target\n# /etc/systemd/system/default.target -> /lib/systemd/system/multi-user.target\n\n# set-default is equivalent to:\nln -sf /lib/systemd/system/graphical.target /etc/systemd/system/default.target\n\n# isolate: switch immediately and stop units not needed by new target\nsystemctl isolate multi-user.target\nsystemctl isolate rescue.target        # single-user, most filesystems mounted\nsystemctl isolate emergency.target     # minimal shell, root FS read-only only',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Know all runlevels 0-6 and their systemd target equivalents. systemctl set-default creates symlink /etc/systemd/system/default.target → target unit. systemctl isolate switches targets immediately and stops unneeded units. emergency.target is more minimal than rescue.target (root FS read-only, no other mounts). telinit N changes SysV runlevel; telinit q re-reads /etc/inittab without rebooting. Know shutdown: -h (halt), -r (reboot), -c (cancel), +N (minutes), now. wall broadcasts to all terminals; /etc/nologin blocks non-root logins when the file exists. Runlevel 1 / rescue.target = single-user mode. SysV: /etc/init.d/ scripts; /etc/rcN.d/ symlinks use K (kill) or S (start) + 2-digit priority number. update-rc.d (Debian) and chkconfig (RHEL) manage these symlinks.',
          },
          {
            type: 'files',
            files: ['/etc/inittab', '/etc/rcN.d/', '/etc/init.d/', '/lib/systemd/system/', '/etc/systemd/system/', '/etc/systemd/system/default.target', '/etc/nologin'],
          },
        ],
      },
    ],
}
