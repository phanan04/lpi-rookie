import type { Topic } from '../types'
import { Package } from 'lucide-react'

export const topic102: Topic = {
    id: '102',
    title: 'Linux Installation and Package Management',
    icon: Package,
    description:
      'Design disk layouts, install and configure GRUB, manage shared libraries, and use both Debian and RPM package managers.',
    lessons: [
      {
        id: '102.1',
        topicId: '102',
        title: 'Design Hard Disk Layout',
        weight: 2,
        description:
          'Allocate filesystems and swap space to separate partitions or disks. Tailor the design to the intended use of the system.',
        sections: [
          {
            type: 'h2',
            text: 'Linux Filesystem Hierarchy Standard (FHS)',
          },
          {
            type: 'p',
            text: 'Every Linux filesystem starts from / (root). Different directories serve different purposes and may reside on separate partitions.',
          },
          {
            type: 'table',
            headers: ['Directory', 'Purpose', 'Separate Partition?'],
            rows: [
              ['/', 'Root of the entire filesystem', 'Required'],
              ['/boot', 'Kernel, initrd, GRUB files', 'Recommended (esp. with LVM/RAID)'],
              ['/home', 'User home directories', 'Recommended (user data isolation)'],
              ['/var', 'Variable data: logs, databases, mail, spools', 'Recommended (prevents root fill)'],
              ['/tmp', 'Temporary files (cleared on boot)', 'Optional (can be tmpfs)'],
              ['/usr', 'User binaries and read-only data', 'Optional'],
              ['/opt', 'Optional/third-party software', 'Optional'],
              ['swap', 'Virtual memory extension', 'Required (dedicated partition or file)'],
            ],
          },
          {
            type: 'h2',
            text: 'Partitioning Schemes',
          },
          {
            type: 'table',
            headers: ['Scheme', 'Description'],
            rows: [
              ['MBR (Master Boot Record)', 'Legacy, max 4 primary partitions, max disk size 2 TB. Extended+Logical partitions allow more.'],
              ['GPT (GUID Partition Table)', 'Modern, up to 128 partitions, >2 TB disks, required for UEFI.'],
            ],
          },
          {
            type: 'h2',
            text: 'LVM — Logical Volume Manager',
          },
          {
            type: 'p',
            text: 'LVM adds a layer of abstraction between physical disks and filesystems, enabling flexible resizing and snapshots.',
          },
          {
            type: 'olist',
            items: [
              'Physical Volumes (PV): physical disks or partitions (pvcreate)',
              'Volume Groups (VG): pool of PVs (vgcreate)',
              'Logical Volumes (LV): slices of a VG used as block devices (lvcreate)',
            ],
          },
          {
            type: 'h2',
            text: 'Swap Space',
          },
          {
            type: 'p',
            text: 'Swap extends RAM by using disk space. Linux supports both dedicated swap partitions and swap files.',
          },
          {
            type: 'code',
            text: '# Create and activate a swap partition\nmkswap /dev/sda2\nswapon /dev/sda2\n\n# Create a swap file\ndd if=/dev/zero of=/swapfile bs=1M count=2048\nchmod 600 /swapfile\nmkswap /swapfile\nswapon /swapfile\n\n# Check swap usage\nswapon --show\nfree -h',
          },
          {
            type: 'tip',
            title: 'Swap Size Guidelines',
            body: 'Traditional rule: 2× RAM. Modern guidance: for systems with >8 GB RAM, 1×–2× RAM. If hibernation (suspend-to-disk) is needed, swap must be at least as large as RAM.',
          },
          {
            type: 'h2',
            text: 'LVM — Logical Volume Manager (Detailed)',
          },
          {
            type: 'table',
            headers: ['LVM Command', 'Description'],
            rows: [
              ['pvcreate /dev/sdb', 'Initialize a physical volume (disk/partition)'],
              ['pvdisplay', 'Show detailed info about physical volumes'],
              ['pvs', 'Brief PV listing'],
              ['vgcreate vg0 /dev/sdb /dev/sdc', 'Create volume group from PVs'],
              ['vgdisplay vg0', 'Show volume group info'],
              ['vgs', 'Brief VG listing'],
              ['vgextend vg0 /dev/sdd', 'Add a PV to an existing VG'],
              ['lvcreate -L 10G -n lv_home vg0', 'Create 10 GB logical volume'],
              ['lvcreate -l 100%FREE -n lv_data vg0', 'Use all remaining free space'],
              ['lvdisplay /dev/vg0/lv_home', 'Show LV info'],
              ['lvs', 'Brief LV listing'],
              ['lvextend -L +5G /dev/vg0/lv_home', 'Extend LV by 5 GB'],
              ['resize2fs /dev/vg0/lv_home', 'Resize ext4 filesystem to match new LV size'],
              ['lvreduce -L -5G /dev/vg0/lv_home', 'Shrink LV (unmount first; resize FS first!)'],
            ],
          },
          {
            type: 'code',
            text: '# Full LVM setup example:\npvcreate /dev/sdb1 /dev/sdc1\nvgcreate vg_data /dev/sdb1 /dev/sdc1\nlvcreate -L 20G -n lv_home vg_data\nmkfs.ext4 /dev/vg_data/lv_home\nmount /dev/vg_data/lv_home /home\n\n# Add to /etc/fstab for persistence:\n/dev/vg_data/lv_home  /home  ext4  defaults  0  2\n\n# LVM device paths:\n/dev/vg_data/lv_home\n/dev/mapper/vg_data-lv_home   # (same device, different path)',
          },
          {
            type: 'h2',
            text: 'MBR vs GPT — Detailed Comparison',
          },
          {
            type: 'table',
            headers: ['Feature', 'MBR', 'GPT'],
            rows: [
              ['Max disk size', '2 TB', '>2 TB (no practical limit)'],
              ['Primary partitions', '4 max', '128 (default)'],
              ['Extended partitions', 'Yes (1 extended, many logical)', 'Not needed'],
              ['Partition table location', 'First sector (sector 0)', 'First and last sectors (backup)'],
              ['Boot support', 'BIOS', 'UEFI (also BIOS with grub)'],
              ['Partition IDs', '1-byte type codes', 'GUIDs'],
              ['Redundancy', 'None', 'Backup GPT at disk end'],
              ['fdisk support', 'Full support', 'Limited (use gdisk or parted)'],
            ],
          },
          {
            type: 'code',
            text: '# View partition table info\ncat /proc/partitions\n# major minor  #blocks  name\n#    8     0  52428800 sda\n#    8     1    512000 sda1\n#    8     2  51915776 sda2\n\n# View with lsblk\nlsblk\n\n# MBR extended/logical layout (fdisk shows):\n# sda1  primary\n# sda2  primary\n# sda3  extended   (container for logical partitions)\n# sda5  logical    (inside extended, numbering starts at 5)\n# sda6  logical\n\n# Check if disk uses MBR or GPT\nparted /dev/sda print | grep "Partition Table"',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Know which directories benefit from separate partitions and why (/var prevents root from filling up, /home separates user data, /boot needed for LVM/RAID). MBR: max 4 primary (or 3 primary + 1 extended with logical partitions > 4 total); max 2TB. GPT: up to 128 partitions, no size limit, requires UEFI or GRUB with GPT support. LVM hierarchy: PV → VG → LV. pvcreate/vgcreate/lvcreate. Swap must be at least RAM size for hibernation. /proc/partitions lists all block devices and partitions.',
          },
        ],
      },
      {
        id: '102.2',
        topicId: '102',
        title: 'Install a Boot Manager',
        weight: 2,
        description:
          'Selecting, installing, and configuring a boot loader — primarily GRUB2.',
        sections: [
          {
            type: 'h2',
            text: 'GRUB2 Architecture',
          },
          {
            type: 'p',
            text: 'GRUB2 (GNU GRand Unified Bootloader 2) is the default boot loader for most Linux distributions.',
          },
          {
            type: 'table',
            headers: ['File/Directory', 'Purpose'],
            rows: [
              ['/boot/grub/grub.cfg', 'Generated main config — do not edit manually'],
              ['/etc/default/grub', 'User settings: timeout, kernel parameters, splash'],
              ['/etc/grub.d/', 'Scripts (10_linux, 20_linux_xen, 40_custom...) that generate grub.cfg'],
              ['/boot/grub/', 'Stage files, modules, fonts'],
              ['/usr/share/grub/', 'GRUB theme and module files'],
            ],
          },
          {
            type: 'h2',
            text: 'Key /etc/default/grub Settings',
          },
          {
            type: 'code',
            text: '# /etc/default/grub\nGRUB_DEFAULT=0                  # Default menu entry (0 = first)\nGRUB_TIMEOUT=5                  # Seconds to wait before auto-boot\nGRUB_TIMEOUT_STYLE=menu         # show menu/countdown/hidden\nGRUB_CMDLINE_LINUX_DEFAULT="quiet splash"\nGRUB_CMDLINE_LINUX=""           # Added to all kernels, including recovery\nGRUB_DISTRIBUTOR="$(lsb_release -i -s 2>/dev/null)"\n\n# After editing, regenerate:\nupdate-grub          # Debian/Ubuntu\ngrub2-mkconfig -o /boot/grub2/grub.cfg   # RHEL/CentOS/Fedora',
          },
          {
            type: 'h2',
            text: 'Installing GRUB2',
          },
          {
            type: 'code',
            text: '# Install GRUB to MBR of /dev/sda\ngrub-install /dev/sda\n\n# Install to specific partition (UEFI)\ngrub-install --target=x86_64-efi --efi-directory=/boot/efi\n\n# After kernel update, regenerate config:\nupdate-grub',
          },
          {
            type: 'h2',
            text: 'Legacy GRUB (GRUB Legacy / GRUB 0.9x)',
          },
          {
            type: 'p',
            text: 'GRUB Legacy uses /boot/grub/menu.lst or /boot/grub/grub.conf (RHEL). You may need to know the basics for older systems.',
          },
          {
            type: 'code',
            text: '# Example /boot/grub/menu.lst (GRUB Legacy)\ndefault 0\ntimeout 5\n\ntitle Ubuntu 10.04\nroot (hd0,0)\nkernel /boot/vmlinuz-2.6.32 root=/dev/sda1 ro quiet splash\ninitrd /boot/initrd.img-2.6.32',
          },
          {
            type: 'warning',
            title: 'GRUB2 vs GRUB Legacy Device Naming',
            body: 'GRUB Legacy: (hd0,0) = first disk, first partition. GRUB2: (hd0,1) = first disk, first partition (partitions are 1-indexed in GRUB2, 0-indexed in Legacy).',
          },
          {
            type: 'h2',
            text: 'GRUB2 Rescue Mode',
          },
          {
            type: 'code',
            text: '# Press Shift (BIOS) or Esc (UEFI) at boot to show GRUB menu\n# Press "e" to edit selected entry, Ctrl+X to boot modified entry\n\n# GRUB rescue prompt (minimal — grub rescue>)\ngrub rescue> ls           # list detected disks/partitions\ngrub rescue> ls (hd0,1)/  # list files on first partition\ngrub rescue> set root=(hd0,1)\ngrub rescue> set prefix=(hd0,1)/boot/grub\ngrub rescue> insmod normal\ngrub rescue> normal        # load full grub menu\n\n# GRUB shell (grub>)\ngrub> linux /boot/vmlinuz root=/dev/sda1\ngrub> initrd /boot/initrd.img\ngrub> boot',
          },
          {
            type: 'h2',
            text: 'GRUB2 Loading Stages',
          },
          {
            type: 'table',
            headers: ['Stage', 'Location', 'Description'],
            rows: [
              ['Stage 1', 'MBR — first 446 bytes of disk', 'Minimal loader; only finds and jumps to Stage 1.5 or Stage 2'],
              ['Stage 1.5', 'Sectors between MBR and first partition', 'Contains filesystem driver; allows GRUB to read /boot partition'],
              ['Stage 2', '/boot/grub/ directory', 'Full GRUB environment: reads grub.cfg, displays menu, loads kernel + initrd'],
              ['UEFI mode', 'EFI System Partition (ESP)', 'grubx64.efi loaded directly by UEFI firmware — Stage 1/1.5 not needed'],
            ],
          },
          {
            type: 'h2',
            text: '/etc/grub.d/ Scripts',
          },
          {
            type: 'table',
            headers: ['Script', 'Purpose'],
            rows: [
              ['00_header', 'Sets global options: default entry, timeout, theme, gfxmode'],
              ['10_linux', 'Auto-detects all installed Linux kernels and generates one menu entry per kernel'],
              ['20_linux_xen', 'Generates menu entries for Xen hypervisor kernels'],
              ['30_os-prober', 'Probes for other operating systems (Windows, other Linux distros) and adds entries'],
              ['40_custom', 'User-editable — the correct place to add custom menu entries (safe to modify)'],
              ['41_custom', 'Reads /boot/grub/custom.cfg if that file exists'],
            ],
          },
          {
            type: 'code',
            text: '# /etc/grub.d/40_custom — add a custom boot entry\n#!/bin/sh\nexec tail -n +3 $0\n\nmenuentry "Recovery USB" {\n    set root=(hd1,1)\n    linux /boot/vmlinuz root=/dev/sdb1 ro\n    initrd /boot/initrd.img\n}\n\n# After editing 40_custom, ALWAYS regenerate grub.cfg:\nupdate-grub                                  # Debian/Ubuntu\ngrub2-mkconfig -o /boot/grub2/grub.cfg       # RHEL/CentOS\n\n# Install GRUB to disk:\ngrub-install /dev/sda                              # BIOS/MBR install\ngrub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB  # UEFI install\n\n# grub-install --recheck: force re-probe device map (use after adding new disk)\ngrub-install --recheck /dev/sda',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'GRUB2 loads in stages: Stage 1 (MBR, 446 bytes) → Stage 1.5 (sectors after MBR, contains FS driver) → Stage 2 (/boot/grub/, shows menu, loads kernel). UEFI uses grubx64.efi on the ESP directly — no Stage 1/1.5. Know: /etc/default/grub for user settings; update-grub / grub-mkconfig regenerates grub.cfg; grub-install writes GRUB to disk. GRUB2 is 1-indexed: (hd0,1)=sda1. GRUB Legacy 0-indexed: (hd0,0)=sda1. Debian=update-grub; RHEL=grub2-mkconfig -o /boot/grub2/grub.cfg. GRUB_CMDLINE_LINUX_DEFAULT adds params to normal boot only; GRUB_CMDLINE_LINUX adds to ALL entries including recovery. /etc/grub.d/40_custom is where to add custom menu entries; run update-grub after editing.',
          },
          {
            type: 'files',
            files: ['/boot/grub/grub.cfg', '/etc/default/grub', '/etc/grub.d/', '/etc/grub.d/40_custom', '/boot/grub/menu.lst', '/boot/efi/'],
          },
        ],
      },
      {
        id: '102.3',
        topicId: '102',
        title: 'Manage Shared Libraries',
        weight: 1,
        description:
          'Identify shared libraries required by programs, and install shared libraries.',
        sections: [
          {
            type: 'h2',
            text: 'Static vs Shared Libraries',
          },
          {
            type: 'table',
            headers: ['Type', 'Extension', 'Description'],
            rows: [
              ['Static library', '.a', 'Compiled into the binary at link time. Binary is self-contained but larger.'],
              ['Shared library', '.so', 'Loaded at runtime. Smaller binaries, shared across processes.'],
            ],
          },
          {
            type: 'h2',
            text: 'Library Naming Convention',
          },
          {
            type: 'p',
            text: 'Each shared library has three related names used by the kernel, ldconfig, and the compiler:',
          },
          {
            type: 'table',
            headers: ['Name Type', 'Example', 'Description'],
            rows: [
              ['Real name', 'libssl.so.1.1.1t', 'The actual file on disk. Format: lib<name>.so.<MAJOR>.<MINOR>.<PATCH>'],
              ['soname', 'libssl.so.1.1', 'Symlink → real name. Embedded into binary at compile time. All real-name versions sharing a soname are ABI-compatible.'],
              ['Linker name', 'libssl.so', 'Symlink → soname. Used by the compiler flag -lssl at build time to find the library.'],
            ],
          },
          {
            type: 'code',
            text: '# ldconfig creates and manages soname symlinks automatically\nldconfig\n\n# Symlink chain in /usr/lib/x86_64-linux-gnu/:\n# libssl.so         -> libssl.so.1.1        (linker name — created by -dev package)\n# libssl.so.1.1     -> libssl.so.1.1.1t     (soname — created by ldconfig)\n# libssl.so.1.1.1t                           (real name — the actual .so file)\n\n# ldd shows the soname each binary is linked against:\nldd /usr/bin/openssl\n# libssl.so.1.1 => /usr/lib/x86_64-linux-gnu/libssl.so.1.1 (0x00007f...)\n\n# Find which library file is behind a soname:\nreadlink -f /usr/lib/x86_64-linux-gnu/libssl.so.1.1',
          },
          {
            type: 'h2',
            text: 'Library Search Paths',
          },
          {
            type: 'p',
            text: "When a program runs, the dynamic linker (ld.so / ld-linux.so) finds required shared libraries in this order:",
          },
          {
            type: 'olist',
            items: [
              'Paths in LD_LIBRARY_PATH environment variable',
              'Paths in the binary\'s RPATH/RUNPATH (embedded at compile time)',
              'System-wide cache /etc/ld.so.cache (built by ldconfig)',
              'Default directories: /lib, /usr/lib, /lib64, /usr/lib64',
            ],
          },
          {
            type: 'h2',
            text: 'Tools',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['ldd <binary>', 'List shared libraries required by a binary'],
              ['ldconfig', 'Update /etc/ld.so.cache from /etc/ld.so.conf paths'],
              ['ldconfig -v', 'Verbose: show libraries being added to cache'],
              ['ldconfig -p', 'Print current contents of ld.so.cache'],
              ['/etc/ld.so.conf', 'File listing directories to search for libraries'],
              ['/etc/ld.so.conf.d/*.conf', 'Drop-in config files for additional library dirs'],
              ['LD_LIBRARY_PATH', 'Env var: colon-separated additional library paths'],
            ],
          },
          {
            type: 'code',
            text: '# Check what libraries bash needs\nldd /bin/bash\n# Output shows:  libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2\n\n# Add a custom lib dir and rebuild cache\necho "/usr/local/myapp/lib" > /etc/ld.so.conf.d/myapp.conf\nldconfig\n\n# Temporarily override for one command\nLD_LIBRARY_PATH=/opt/mylib/lib ./myprogram',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'ldd shows shared library dependencies of a binary. ldconfig rebuilds /etc/ld.so.cache from directories listed in /etc/ld.so.conf and /etc/ld.so.conf.d/. Library names: real name (libssl.so.1.1.1t), soname (libssl.so.1.1 — ABI version, embedded in binary), linker name (libssl.so — used by -lssl at compile time). ldconfig -p prints the cache. ldconfig -v shows what is being cached. LD_LIBRARY_PATH overrides the cache. Search order: LD_LIBRARY_PATH → RPATH/RUNPATH → ld.so.cache → /lib → /usr/lib.',
          },
          {
            type: 'files',
            files: ['/etc/ld.so.conf', '/etc/ld.so.conf.d/', '/etc/ld.so.cache', '/lib/', '/usr/lib/', '/lib64/', '/usr/lib64/'],
          },
        ],
      },
      {
        id: '102.4',
        topicId: '102',
        title: 'Use Debian Package Management',
        weight: 3,
        description:
          'Install, upgrade, and remove Debian binary packages (.deb) using dpkg and apt tools.',
        sections: [
          {
            type: 'h2',
            text: 'dpkg — Low-Level Package Tool',
          },
          {
            type: 'p',
            text: 'dpkg directly manages .deb packages without resolving dependencies. Used when apt is unavailable or for advanced operations.',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['dpkg -i package.deb', 'Install a .deb package file'],
              ['dpkg -r package', 'Remove package (keep config files)'],
              ['dpkg -P package', 'Purge package (remove + config files)'],
              ['dpkg -l', 'List all installed packages'],
              ['dpkg -l "pack*"', 'List packages matching glob pattern'],
              ['dpkg -L package', 'List files installed by package'],
              ['dpkg -S /path/to/file', 'Which package owns a file'],
              ['dpkg -s package', 'Show package status/info'],
              ['dpkg --configure -a', 'Configure all unpacked packages'],
              ['dpkg-reconfigure package', 'Re-run post-install configuration'],
            ],
          },
          {
            type: 'h2',
            text: 'apt and apt-get — High-Level Package Tools',
          },
          {
            type: 'p',
            text: 'apt and apt-get resolve dependencies automatically and download packages from repositories defined in /etc/apt/sources.list.',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['apt update', 'Refresh package list from repositories'],
              ['apt upgrade', 'Upgrade all upgradable packages'],
              ['apt full-upgrade', 'Upgrade with dependency changes (replaces dist-upgrade)'],
              ['apt install <pkg>', 'Install a package'],
              ['apt remove <pkg>', 'Remove package (keep config)'],
              ['apt purge <pkg>', 'Remove package and config files'],
              ['apt autoremove', 'Remove unused dependency packages'],
              ['apt search <term>', 'Search package names and descriptions'],
              ['apt show <pkg>', 'Show package details'],
              ['apt list --installed', 'List installed packages'],
            ],
          },
          {
            type: 'h2',
            text: 'apt-cache — Query Package Metadata',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['apt-cache search <term>', 'Search packages by keyword'],
              ['apt-cache show <pkg>', 'Show detailed package info'],
              ['apt-cache depends <pkg>', 'Show package dependencies'],
              ['apt-cache rdepends <pkg>', 'Show packages that depend on this package'],
              ['apt-cache policy <pkg>', 'Show installed vs available versions'],
            ],
          },
          {
            type: 'h2',
            text: 'Repository Configuration',
          },
          {
            type: 'code',
            text: '# /etc/apt/sources.list format:\n# deb URL distribution component1 component2\ndeb http://deb.debian.org/debian bookworm main contrib non-free\ndeb-src http://deb.debian.org/debian bookworm main\n\n# Additional sources in /etc/apt/sources.list.d/*.list\n\n# Types:\n# deb = binary packages\n# deb-src = source packages',
          },
          {
            type: 'h2',
            text: 'apt-file — Search Package Contents',
          },
          {
            type: 'code',
            text: '# apt-file: search which package provides a specific file\n# (even files not yet installed)\nsudo apt install apt-file\nsudo apt-file update          # build cache\n\napt-file search /usr/bin/convert       # which package has this binary?\napt-file list imagemagick              # list all files in imagemagick package\napt-file search "libssl.so"            # find package providing a library',
          },
          {
            type: 'h2',
            text: 'dpkg Package States',
          },
          {
            type: 'table',
            headers: ['Status Code', 'Meaning'],
            rows: [
              ['ii', 'Installed, OK — normal installed state'],
              ['rc', 'Removed, Config — package removed but config files remain'],
              ['un', 'Unknown, Not-installed'],
              ['iU', 'Installed, Unpacked — install incomplete'],
              ['iF', 'Installed, Failed-config — post-install script failed'],
            ],
          },
          {
            type: 'h2',
            text: 'APT Pinning',
          },
          {
            type: 'p',
            text: 'APT pinning (preferences) lets you control which version of a package gets installed when multiple versions are available (e.g., mixing stable and testing repos).',
          },
          {
            type: 'code',
            text: '# /etc/apt/preferences.d/mypin\nPackage: nginx\nPin: version 1.24.*\nPin-Priority: 1001\n\n# Priority rules:\n# >= 1000: install even if it is a downgrade\n# 990: default for installed version\n# 500: default system preference\n# 100: apt -t or package/<suite> selection\n# < 0: never install\n\n# Hold a package at current version\napt-mark hold nginx\napt-mark unhold nginx\ndpkg --get-selections | grep hold',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'dpkg -l lists installed packages (status codes: ii=installed, rc=removed-config-left, un=unknown-not-installed). dpkg -L lists files in an INSTALLED package. dpkg -S finds which package owns a file. dpkg -c lists files inside a .deb WITHOUT installing. dpkg -I shows .deb metadata (version, deps). dpkg -V verifies installed package files against checksums. apt update refreshes package lists; apt upgrade updates packages. apt-file needs apt-file update first; searches by file path. /var/lib/dpkg/status is the installed packages database. /var/lib/dpkg/info/<pkg>.list shows all files installed by a package. dpkg --configure -a fixes broken installs. apt-mark hold prevents upgrades.',
          },
          {
            type: 'h2',
            text: 'Inspecting .deb Package Files',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['dpkg -c package.deb', 'List all files inside a .deb without installing it'],
              ['dpkg -I package.deb', 'Show metadata of a .deb: version, architecture, depends, description'],
              ['dpkg -V package', 'Verify installed package: compare file checksums against package database'],
              ['dpkg -Va', 'Verify ALL installed packages (shows only files that differ)'],
              ['dpkg --get-selections', 'Export list of installed packages and their selection state'],
              ['dpkg --set-selections < list', 'Import package selections (then run apt-get dselect-upgrade)'],
            ],
          },
          {
            type: 'h2',
            text: 'Key dpkg and APT Directories',
          },
          {
            type: 'table',
            headers: ['Path', 'Description'],
            rows: [
              ['/var/lib/dpkg/status', 'Database of all installed packages, their status, and metadata'],
              ['/var/lib/dpkg/info/', 'Per-package files: <pkg>.list (file paths), <pkg>.md5sums, <pkg>.postinst, <pkg>.prerm'],
              ['/var/lib/apt/lists/', 'Cached package index files downloaded by apt update'],
              ['/var/cache/apt/archives/', 'Locally cached .deb files downloaded by apt install'],
              ['/etc/apt/sources.list', 'Primary repository configuration file'],
              ['/etc/apt/sources.list.d/', 'Drop-in repository files (.list format; one per file)'],
              ['/etc/apt/preferences.d/', 'APT pinning preferences files'],
            ],
          },
          {
            type: 'code',
            text: '# Inspect a .deb before installing\ndpkg -I curl_8.5.0-2_amd64.deb       # show metadata, dependencies\ndpkg -c curl_8.5.0-2_amd64.deb       # list files it would install\n\n# Verify installed package (no output = all OK)\ndpkg -V bash\n# ??5?????? /bin/bash    (5=checksum mismatch, ?=other checks)\n\n# Clone package selection to another system\ndpkg --get-selections > selections.txt\n# On the new system:\ndpkg --set-selections < selections.txt\napt-get dselect-upgrade',
          },
          {
            type: 'files',
            files: ['/etc/apt/sources.list', '/etc/apt/sources.list.d/', '/var/cache/apt/archives/', '/var/lib/dpkg/', '/var/lib/dpkg/status', '/var/lib/dpkg/info/', '/var/lib/apt/lists/'],
          },
        ],
      },
      {
        id: '102.5',
        topicId: '102',
        title: 'Use RPM and YUM/DNF Package Management',
        weight: 3,
        description:
          'Install, query, and remove packages on RPM-based systems using rpm, yum, and dnf.',
        sections: [
          {
            type: 'h2',
            text: 'rpm — Low-Level Package Tool',
          },
          {
            type: 'p',
            text: 'rpm manages .rpm packages directly. Package naming convention: name-version-release.arch.rpm (e.g., bash-5.1.8-6.el9.x86_64.rpm)',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['rpm -i package.rpm', 'Install a package'],
              ['rpm -iv package.rpm', 'Install with verbose output'],
              ['rpm -ivh package.rpm', 'Install verbose with progress hash marks'],
              ['rpm -U package.rpm', 'Upgrade (or install if not present)'],
              ['rpm -F package.rpm', 'Freshen — upgrade only if already installed'],
              ['rpm -e package', 'Erase (remove) a package'],
              ['rpm -q package', 'Query: is package installed?'],
              ['rpm -qa', 'Query all installed packages'],
              ['rpm -qi package', 'Query: show package info'],
              ['rpm -ql package', 'Query: list files in package'],
              ['rpm -qf /path/to/file', 'Query: which package owns this file'],
              ['rpm -qR package', 'Query: list requirements (dependencies)'],
              ['rpm --import /path/to/key', 'Import GPG key for package verification'],
              ['rpm -K package.rpm', 'Verify package signature'],
            ],
          },
          {
            type: 'h2',
            text: 'yum / dnf — High-Level Package Tools',
          },
          {
            type: 'p',
            text: 'yum (Yellowdog Updater Modified) and its successor dnf (Dandified YUM) handle dependency resolution and repository management.',
          },
          {
            type: 'table',
            headers: ['yum/dnf Command', 'Description'],
            rows: [
              ['yum install <pkg>', 'Install package(s)'],
              ['yum remove <pkg>', 'Remove package(s)'],
              ['yum update', 'Update all packages'],
              ['yum update <pkg>', 'Update specific package'],
              ['yum search <term>', 'Search available packages'],
              ['yum info <pkg>', 'Show package details'],
              ['yum list installed', 'List all installed packages'],
              ['yum list available', 'List available packages in repos'],
              ['yum provides /bin/bash', 'Which package provides a file'],
              ['yum deplist <pkg>', 'List dependencies of a package'],
              ['yum groupinstall "Development Tools"', 'Install a package group'],
              ['yum clean all', 'Remove cached package data'],
              ['yum-config-manager --enable repo', 'Enable a repository'],
            ],
          },
          {
            type: 'h2',
            text: 'zypper — openSUSE / SLES Package Manager',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['zypper install <pkg>', 'Install a package'],
              ['zypper remove <pkg>', 'Remove a package'],
              ['zypper update', 'Update all packages'],
              ['zypper search <term>', 'Search packages'],
              ['zypper info <pkg>', 'Show package info'],
              ['zypper repos', 'List configured repositories'],
              ['zypper refresh', 'Refresh repository metadata'],
            ],
          },
          {
            type: 'h2',
            text: 'Repository Configuration (RPM)',
          },
          {
            type: 'code',
            text: '# /etc/yum.repos.d/myrepo.repo\n[myrepo]\nname=My Custom Repository\nbaseurl=http://example.com/repo/\nenabled=1\ngpgcheck=1\ngpgkey=http://example.com/repo/RPM-GPG-KEY',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'rpm install/upgrade/erase: -i (install), -U (upgrade or install), -F (freshen — upgrade only), -e (erase). Query flags: -q (installed?), -qa (all), -qi (info), -ql (list files), -qf (owner of file), -qd (docs), -qc (configs), -qR (requirements). rpm -V verifies: 5=checksum, S=size, M=mode, U=user, G=group, T=timestamp, L=symlink, D=device. rpm -Va checks all packages. rpm does NOT resolve deps; yum/dnf DO. rpm2cpio + cpio -idmv extracts files from an RPM without installing. /var/lib/rpm/ is the RPM database directory. dnf history shows transaction log; dnf history undo <id> reverses a transaction.',
          },
          {
            type: 'h2',
            text: 'rpm — Package Verification',
          },
          {
            type: 'p',
            text: 'rpm -V checks installed package files against the RPM database. Each character in output shows a specific check that failed (. = OK):',
          },
          {
            type: 'table',
            headers: ['Code', 'Meaning'],
            rows: [
              ['5', 'MD5/SHA checksum differs (file content changed)'],
              ['S', 'File size differs'],
              ['M', 'File mode (permissions/type) differs'],
              ['U', 'User (owner) differs'],
              ['G', 'Group differs'],
              ['T', 'Timestamp (mtime) differs'],
              ['L', 'Symlink target changed'],
              ['D', 'Device major/minor number mismatch'],
              ['P', 'Capabilities differ'],
              ['.', 'This attribute verified OK — no change'],
              ['missing', 'File is missing entirely'],
            ],
          },
          {
            type: 'code',
            text: '# Verify a single installed package\nrpm -V sshd\n# S.5....T.  c  /etc/ssh/sshd_config   (size+checksum+timestamp differ; c=config file)\n\n# Verify ALL installed packages (slow — can take minutes)\nrpm -Va\n\n# Additional query options:\nrpm -qd bash           # list documentation files in package\nrpm -qc sshd           # list configuration files managed by package\nrpm -q --changelog bash | head -20  # show package changelog',
          },
          {
            type: 'h2',
            text: 'rpm2cpio — Extract RPM Without Installing',
          },
          {
            type: 'code',
            text: '# Extract all files from an RPM (does NOT install)\nrpm2cpio package.rpm | cpio -idmv\n# -i = extract  -d = create directories  -m = preserve mtime  -v = verbose\n\n# List contents of an RPM without extracting\nrpm2cpio package.rpm | cpio -t\n\n# Extract only a specific file (path relative to / with leading dot)\nrpm2cpio bash-5.1.rpm | cpio -id "./bin/bash"\n\n# Useful for recovery: replace a broken system binary\nrpm2cpio coreutils-*.rpm | cpio -id "./usr/bin/ls"',
          },
          {
            type: 'h2',
            text: 'dnf / yum — History and Advanced Commands',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['dnf history', 'List all past transactions (install/remove/update) with IDs'],
              ['dnf history info <id>', 'Show details of a specific transaction'],
              ['dnf history undo <id>', 'Reverse a transaction (reinstall removed packages, remove installed)'],
              ['dnf history redo <id>', 'Re-apply a previously undone transaction'],
              ['dnf downgrade <pkg>', 'Install the previous available version of a package'],
              ['dnf reinstall <pkg>', 'Re-download and reinstall the current version'],
              ['dnf autoremove', 'Remove packages installed as dependencies no longer needed'],
              ['dnf repolist', 'List all enabled repositories'],
              ['dnf repolist all', 'List both enabled and disabled repositories'],
              ['dnf config-manager --enable <repo>', 'Enable a disabled repository'],
            ],
          },
          {
            type: 'files',
            files: ['/etc/yum.repos.d/', '/var/cache/yum/', '/var/cache/dnf/', '/var/lib/rpm/', '/etc/rpm/'],
          },
        ],
      },
      {
        id: '102.6',
        topicId: '102',
        title: 'Linux as a Virtualization Guest',
        weight: 1,
        description:
          'Understand Linux running as a virtual machine guest in cloud and virtualized environments.',
        sections: [
          {
            type: 'h2',
            text: 'Virtualization Types',
          },
          {
            type: 'table',
            headers: ['Type', 'Description', 'Examples'],
            rows: [
              ['Full virtualization', 'Guest runs unmodified; hypervisor emulates hardware', 'KVM, VMware ESXi, VirtualBox'],
              ['Paravirtualization', 'Guest is modified to cooperate with hypervisor', 'Xen (PV mode)'],
              ['OS-level virtualization', 'Containers share host kernel; isolated user spaces', 'LXC, Docker, Podman'],
              ['Hardware-assisted', 'CPU extensions (Intel VT-x, AMD-V) assist hypervisor', 'KVM, Xen HVM'],
            ],
          },
          {
            type: 'h2',
            text: 'Detecting Virtualization',
          },
          {
            type: 'code',
            text: '# Detect if running inside a VM\nsystemd-detect-virt\n\n# Check DMI data for hypervisor info\ndmidecode -t system | grep -i product\n\n# Check /proc/cpuinfo flags\ngrep -i hypervisor /proc/cpuinfo\n\n# Check dmesg for hypervisor messages\ndmesg | grep -i virt',
          },
          {
            type: 'h2',
            text: 'Cloud and IaaS Instances',
          },
          {
            type: 'p',
            text: 'Cloud instances (AWS EC2, GCP, Azure) run as VMs. They typically use cloud-init for initial configuration and provide instance metadata via a special HTTP endpoint.',
          },
          {
            type: 'code',
            text: '# AWS/OpenStack instance metadata\ncurl http://169.254.169.254/latest/meta-data/\ncurl http://169.254.169.254/latest/meta-data/instance-id\ncurl http://169.254.169.254/latest/meta-data/public-ipv4\n\n# cloud-init logs\njournalctl -u cloud-init\ncat /var/log/cloud-init.log',
          },
          {
            type: 'h2',
            text: 'Containers vs. Virtual Machines',
          },
          {
            type: 'table',
            headers: ['Aspect', 'Virtual Machine (VM)', 'Container (LXC / Docker)'],
            rows: [
              ['Kernel', 'Each VM runs its own guest kernel', 'Shares the host kernel — no guest kernel'],
              ['Isolation', 'Hardware-level via hypervisor', 'OS-level via namespaces + cgroups'],
              ['Boot time', 'Seconds to minutes', 'Milliseconds to seconds'],
              ['Image size', 'Full OS (gigabytes)', 'App layers (megabytes)'],
              ['Resource overhead', 'High — full OS per VM', 'Low — shared kernel and libraries'],
              ['Security boundary', 'Stronger (hardware isolation)', 'Weaker (shared kernel expands attack surface)'],
              ['Tools', 'KVM, VMware ESXi, VirtualBox, Xen', 'Docker, Podman, LXC, LXD'],
            ],
          },
          {
            type: 'h2',
            text: 'Detecting the Virtualization Environment',
          },
          {
            type: 'table',
            headers: ['Command / Path', 'Description'],
            rows: [
              ['systemd-detect-virt', 'Prints: kvm, vmware, virtualbox, xen, lxc, docker, none, etc.'],
              ['virt-what', 'Older tool; prints hypervisor type (may need to install separately)'],
              ['dmidecode -t system', 'Reads SMBIOS — shows Manufacturer and Product Name (e.g., "VMware Virtual Platform")'],
              ['grep hypervisor /proc/cpuinfo', '"hypervisor" CPU flag is present when running inside any hardware-virtualised VM'],
              ['dmesg | grep -i virt', 'Boot messages often reference hypervisor or paravirt drivers'],
              ['ls /.dockerenv', 'This file exists inside Docker containers'],
            ],
          },
          {
            type: 'h2',
            text: 'D-Bus',
          },
          {
            type: 'p',
            text: 'D-Bus is an inter-process communication (IPC) system used by the desktop environment and systemd to communicate between processes.',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Know virtualization types: full virtualization (KVM, VMware — guest runs unmodified), paravirtualization (Xen PV — modified guest cooperates with hypervisor), OS-level/containers (Docker, LXC — shared kernel, namespaces + cgroups). Containers share the host kernel; VMs each have their own. systemd-detect-virt detects the environment type; virt-what is an older alternative. /proc/cpuinfo has a "hypervisor" flag when inside a hardware VM. Cloud VMs use cloud-init for first-boot configuration; instance metadata available at http://169.254.169.254/. D-Bus provides IPC between processes.',
          },
        ],
      },
    ],
}
