import type { Topic } from '../types'
import { HardDrive } from 'lucide-react'

export const topic104: Topic = {
    id: '104',
    title: 'Devices, Linux Filesystems, Filesystem Hierarchy Standard',
    icon: HardDrive,
    description:
      'Create partitions and filesystems, ensure filesystem integrity, mount/unmount, manage permissions, create links, and understand the FHS.',
    lessons: [
      {
        id: '104.1',
        topicId: '104',
        title: 'Create Partitions and Filesystems',
        weight: 2,
        description:
          'Use fdisk, gdisk, and mkfs to partition disks and create filesystems.',
        sections: [
          {
            type: 'h2',
            text: 'Partition Tools',
          },
          {
            type: 'table',
            headers: ['Tool', 'Description'],
            rows: [
              ['fdisk', 'Interactive partition editor for MBR disks (also limited GPT support)'],
              ['gdisk (GPT fdisk)', 'Interactive partition editor for GPT disks'],
              ['parted', 'Partition editor supporting both MBR and GPT, scripting-friendly'],
              ['cfdisk', 'Curses-based interactive fdisk'],
            ],
          },
          {
            type: 'code',
            text: '# fdisk interactive session\nfdisk /dev/sdb\n# Key commands inside fdisk:\n#  m  = display help menu\n#  p  = print partition table\n#  n  = new partition\n#  d  = delete partition\n#  t  = change partition type (82=Linux swap, 83=Linux, 8e=Linux LVM)\n#  w  = write changes and exit\n#  q  = quit without saving\n\n# List partition table without entering fdisk\nfdisk -l /dev/sdb\n\n# gdisk for GPT\ngdisk /dev/sdb\n\n# parted\nparted /dev/sdb print\nparted /dev/sdb mklabel gpt\nparted /dev/sdb mkpart primary ext4 1MiB 10GiB',
          },
          {
            type: 'h2',
            text: 'Creating Filesystems (mkfs)',
          },
          {
            type: 'table',
            headers: ['Command', 'Filesystem', 'Description'],
            rows: [
              ['mkfs.ext4 /dev/sdb1', 'ext4', 'Linux native filesystem (most common)'],
              ['mkfs.ext3 /dev/sdb1', 'ext3', 'ext4 predecessor with journal'],
              ['mkfs.ext2 /dev/sdb1', 'ext2', 'Old Linux FS, no journal'],
              ['mkfs.xfs /dev/sdb1', 'XFS', 'High-performance, RHEL default'],
              ['mkfs.btrfs /dev/sdb1', 'btrfs', 'Copy-on-write, snapshots, checksums'],
              ['mkfs.vfat /dev/sdb1', 'FAT32', 'Windows compatibility, USB drives'],
              ['mkfs.ntfs /dev/sdb1', 'NTFS', 'Windows compatible (needs ntfs-3g)'],
              ['mkfs -t ext4 /dev/sdb1', 'ext4', 'Alternative syntax'],
              ['mkswap /dev/sdb2', 'swap', 'Initialise swap partition'],
            ],
          },
          {
            type: 'h2',
            text: 'ext Filesystem Features',
          },
          {
            type: 'table',
            headers: ['Feature', 'ext2', 'ext3', 'ext4'],
            rows: [
              ['Journaling', 'No', 'Yes', 'Yes (improved)'],
              ['Max file size', '2 TB', '2 TB', '16 TB'],
              ['Max fs size', '16 TB', '32 TB', '1 EB'],
              ['Extents', 'No', 'No', 'Yes'],
              ['Delayed allocation', 'No', 'No', 'Yes'],
            ],
          },
          {
            type: 'h2',
            text: 'parted — Interactive Partition Editor',
          },
          {
            type: 'code',
            text: '# Start interactive parted session\nparted /dev/sdb\n\n# Inside parted (interactive commands):\n(parted) help                      # list commands\n(parted) print                     # show partition table\n(parted) mklabel gpt               # create new GPT partition table\n(parted) mklabel msdos             # create new MBR partition table\n(parted) mkpart primary ext4 1MiB 10GiB   # create primary partition\n(parted) mkpart primary linux-swap 10GiB 12GiB  # swap partition\n(parted) rm 1                      # delete partition 1\n(parted) resizepart 1 20GiB        # resize partition 1 to 20 GiB\n(parted) name 1 "boot"             # name partition (GPT only)\n(parted) set 1 boot on             # set boot flag\n(parted) set 2 lvm on              # set LVM flag\n(parted) quit\n\n# Non-interactive (scripted)\nparted -s /dev/sdb mklabel gpt\nparted -s /dev/sdb mkpart primary ext4 1MiB 10GiB\nparted /dev/sdb print',
          },
          {
            type: 'table',
            headers: ['Partition Type Flag', 'Description'],
            rows: [
              ['boot', 'Bootable partition flag (MBR active flag)'],
              ['lvm', 'Marks partition for use by LVM'],
              ['raid', 'Marks partition for use by Linux software RAID (mdadm)'],
              ['swap', 'Marks partition as swap'],
              ['esp', 'EFI System Partition (GPT, for UEFI boot)'],
            ],
          },
          {
            type: 'h2',
            text: 'lsblk and blkid — Block Device Information',
          },
          {
            type: 'code',
            text: '# lsblk: list block devices in tree view\nlsblk\n# NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS\n# sda      8:0    0   50G  0 disk\n# ├─sda1   8:1    0    1G  0 part /boot\n# └─sda2   8:2    0   49G  0 part\n#   ├─vg-root 253:0  0  45G  0 lvm  /\n#   └─vg-swap 253:1  0   4G  0 lvm  [SWAP]\n\n# Show filesystem type and UUID\nlsblk -o NAME,SIZE,FSTYPE,UUID,MOUNTPOINTS\n\n# blkid: show UUIDs and filesystem types\nblkid\nblkid /dev/sda1\n# /dev/sda1: UUID="abc-123" TYPE="ext4" PARTUUID="..."\n\n# Get just the UUID of a device\nblkid -s UUID -o value /dev/sda1',
          },
          {
            type: 'h2',
            text: 'Swap Space',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['mkswap /dev/sdb2', 'Initialise a swap partition'],
              ['swapon /dev/sdb2', 'Enable a swap partition/file'],
              ['swapoff /dev/sdb2', 'Disable a swap partition/file'],
              ['swapon -s', 'Show all active swap areas (summary)'],
              ['swapon --show', 'Same, tabular format'],
              ['free -h', 'Shows total/used/free swap'],
            ],
          },
          {
            type: 'code',
            text: '# Create a swap file (alternative to swap partition)\ndd if=/dev/zero of=/swapfile bs=1M count=2048   # 2GB swap file\nchmod 600 /swapfile\nmkswap /swapfile\nswapon /swapfile\n\n# Make permanent in /etc/fstab:\n/swapfile   none   swap   sw   0 0',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'fdisk works with MBR, gdisk with GPT. mkfs.ext4 creates an ext4 filesystem. Partition type 82 = Linux swap, 83 = Linux data, 8e = Linux LVM. mkswap initialises swap; swapon activates it; swapoff deactivates. mkfs -t TYPE is same as mkfs.TYPE. lsblk shows block device tree. blkid shows UUID and filesystem type. Use UUID in /etc/fstab to survive device renaming.',
          },
        ],
      },
      {
        id: '104.2',
        topicId: '104',
        title: 'Maintain the Integrity of Filesystems',
        weight: 2,
        description:
          'Check and repair filesystems, monitor disk usage, and use ext-specific tools.',
        sections: [
          {
            type: 'h2',
            text: 'Disk Usage Tools',
          },
          {
            type: 'table',
            headers: ['Command', 'Description', 'Key Options'],
            rows: [
              ['df', 'Show disk space usage of mounted filesystems', '-h (human), -T (show FS type), -i (inodes)'],
              ['du', 'Show disk usage of files and directories', '-h (human), -s (summary), -c (grand total), --max-depth=N'],
              ['du -sh /*', 'Show top-level directory sizes', ''],
            ],
          },
          {
            type: 'h2',
            text: 'Filesystem Check and Repair',
          },
          {
            type: 'warning',
            title: 'Important',
            body: 'Always unmount a filesystem (or use a live/rescue system) before running fsck on it. Running fsck on a mounted filesystem can cause severe data corruption.',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['fsck /dev/sdb1', 'Check filesystem (auto-detects type)'],
              ['fsck -n /dev/sdb1', 'Dry run — check only, do not repair'],
              ['fsck -y /dev/sdb1', 'Automatically answer yes to all repair prompts'],
              ['fsck -f /dev/sdb1', 'Force check even if FS marked clean'],
              ['e2fsck /dev/sdb1', 'Check ext2/3/4 filesystem specifically'],
              ['e2fsck -p /dev/sdb1', 'Automatically repair (preen mode)'],
              ['xfs_repair /dev/sdb1', 'Repair XFS filesystem'],
              ['xfs_check /dev/sdb1', 'Check XFS (older versions)'],
            ],
          },
          {
            type: 'h2',
            text: 'tune2fs — Tune ext Filesystems',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['tune2fs -l /dev/sdb1', 'List filesystem superblock info'],
              ['tune2fs -c N /dev/sdb1', 'Set max mount count before auto-check (-1 = disable)'],
              ['tune2fs -i N /dev/sdb1', 'Set interval between checks (e.g., 1m = 1 month)'],
              ['tune2fs -L label /dev/sdb1', 'Set volume label'],
              ['tune2fs -m N /dev/sdb1', 'Set reserved block percentage for root'],
              ['tune2fs -j /dev/sdb2', 'Add journal to ext2 (converts to ext3)'],
            ],
          },
          {
            type: 'h2',
            text: 'mke2fs and debugfs',
          },
          {
            type: 'code',
            text: '# mke2fs is the underlying tool for mkfs.ext*\nmke2fs -t ext4 /dev/sdb1              # same as mkfs.ext4\nmke2fs -t ext4 -b 4096 /dev/sdb1     # 4096 byte blocks\nmke2fs -L "mydata" /dev/sdb1          # set label\n\n# debugfs: interactive ext filesystem debugger\ndebugfs /dev/sdb1\ndebugfs -R "stat <8>" /dev/sdb1       # show inode 8 info',
          },
          {
            type: 'h2',
            text: 'Inode Information',
          },
          {
            type: 'code',
            text: '# Check inode usage (inodes used vs available)\ndf -i\ndf -ih   # human-readable inode counts\n\n# Find largest directories by disk use\ndu -sh /var/log/*\n\n# Find top 10 directories by size\ndu -h /home | sort -rh | head -10\n\n# Check filesystem type\ndf -T\nstat -f /home   # show filesystem statistics',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'df shows filesystem space, du shows file/directory space. df -i shows inode usage. fsck MUST run on unmounted FS (or read-only mounted). tune2fs -l shows superblock info. e2fsck is for ext filesystems, xfs_repair for XFS. fsck -y auto-repairs without prompting. A filesystem can run out of inodes (too many small files) even if disk space is available.',
          },
        ],
      },
      {
        id: '104.3',
        topicId: '104',
        title: 'Control Mounting and Unmounting of Filesystems',
        weight: 3,
        description:
          'Mount and unmount filesystems, manage /etc/fstab for automatic mounting.',
        sections: [
          {
            type: 'h2',
            text: 'mount Command',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['mount', 'Show all currently mounted filesystems'],
              ['mount /dev/sdb1 /mnt/data', 'Mount partition at /mnt/data'],
              ['mount -t ext4 /dev/sdb1 /mnt', 'Mount with explicit filesystem type'],
              ['mount -o ro /dev/sdb1 /mnt', 'Mount read-only'],
              ['mount -o remount,rw /mnt', 'Remount with different options'],
              ['mount -a', 'Mount all entries in /etc/fstab'],
              ['mount UUID="..." /mnt', 'Mount by UUID'],
              ['mount LABEL="mydata" /mnt', 'Mount by label'],
            ],
          },
          {
            type: 'h2',
            text: 'umount Command',
          },
          {
            type: 'code',
            text: '# Unmount by mount point\numount /mnt/data\n\n# Unmount by device\numount /dev/sdb1\n\n# Force unmount (use carefully)\numount -f /mnt/data\n\n# Lazy unmount (detach from namespace, cleans up when idle)\numount -l /mnt/data\n\n# Error: "device is busy" — find what\'s using it\nlsof /mnt/data\nfuser -m /mnt/data\nfuser -km /mnt/data   # kill processes using it',
          },
          {
            type: 'h2',
            text: '/etc/fstab — Filesystem Table',
          },
          {
            type: 'p',
            text: '/etc/fstab defines filesystems to mount at boot. Format: 6 fields per line.',
          },
          {
            type: 'code',
            text: '# /etc/fstab format:\n# <device>     <mount-point>   <type>  <options>       <dump> <pass>\n/dev/sda1      /               ext4    defaults        0      1\n/dev/sda2      /home           ext4    defaults        0      2\nUUID=abc-123   /data           ext4    defaults,noatime 0     2\n/dev/sda3      none            swap    sw              0      0\ntmpfs          /tmp            tmpfs   defaults,noatime 0     0\n\n# Get UUID for a device\nblkid /dev/sda1\nlsblk -o NAME,UUID',
          },
          {
            type: 'table',
            headers: ['Field', 'Description'],
            rows: [
              ['Device', 'Device path (/dev/sda1), UUID="...", or LABEL="..."'],
              ['Mount point', 'Where to mount (directory path, or "none" for swap)'],
              ['Type', 'Filesystem type: ext4, xfs, vfat, swap, tmpfs, nfs...'],
              ['Options', 'Comma-separated: defaults, ro, noatime, user, noauto...'],
              ['Dump', '0 = no backup, 1 = backup with dump command'],
              ['Pass', '0 = skip fsck, 1 = root (check first), 2 = check after root'],
            ],
          },
          {
            type: 'h2',
            text: 'Common Mount Options',
          },
          {
            type: 'table',
            headers: ['Option', 'Description'],
            rows: [
              ['defaults', 'rw, suid, dev, exec, auto, nouser, async'],
              ['ro', 'Read-only'],
              ['rw', 'Read-write'],
              ['noatime', 'Don\'t update access time (performance)'],
              ['noexec', 'Don\'t allow execution of binaries'],
              ['nosuid', 'Ignore SUID/SGID bits'],
              ['nodev', 'Don\'t interpret device files'],
              ['user', 'Allow regular users to mount'],
              ['auto', 'Mount with mount -a (used in fstab)'],
              ['noauto', 'Don\'t mount with mount -a'],
            ],
          },
          {
            type: 'h2',
            text: 'Special Filesystem Types',
          },
          {
            type: 'table',
            headers: ['Type', 'Description', 'Example'],
            rows: [
              ['tmpfs', 'Temporary filesystem in RAM/swap', 'mount -t tmpfs -o size=512M tmpfs /mnt/tmp'],
              ['proc', 'Virtual: process/kernel info', 'mount -t proc proc /proc'],
              ['sysfs', 'Virtual: device model info', 'mount -t sysfs sysfs /sys'],
              ['nfs', 'Network File System', 'mount -t nfs server:/export /mnt/nfs'],
              ['bind mount', 'Mount a directory at another path', 'mount --bind /source /destination'],
              ['iso9660 (loop)', 'CD-ROM/ISO image', 'mount -t iso9660 -o loop image.iso /mnt'],
            ],
          },
          {
            type: 'code',
            text: '# Bind mount: make a directory accessible at another path\nmount --bind /home/alice /var/www/alice\n\n# Mount an ISO image\nmount -o loop,ro /path/to/image.iso /mnt/iso\n\n# Mount NFS share\nmount -t nfs 192.168.1.100:/exports/data /mnt/nfs\n\n# NFS in /etc/fstab\n192.168.1.100:/exports/data  /mnt/nfs  nfs  defaults  0 0\n\n# tmpfs in /etc/fstab (RAM-based /tmp)\ntmpfs  /tmp  tmpfs  defaults,noatime,mode=1777  0 0',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: '/etc/fstab has 6 fields: device, mountpoint, fstype, options, dump, pass. Pass 1 = root FS (check first), pass 2 = others, pass 0 = skip fsck. Dump 0 = skip dump. mount -a mounts all non-noauto fstab entries. umount requires no processes using the device. blkid shows UUID and labels. Use UUID= in fstab to avoid device name changes after reboot. mount --bind makes a dir accessible at two paths simultaneously.',
          },
          {
            type: 'files',
            files: ['/etc/fstab', '/etc/mtab', '/proc/mounts', '/proc/filesystems'],
          },
        ],
      },
      {
        id: '104.5',
        topicId: '104',
        title: 'Manage File Permissions and Ownership',
        weight: 3,
        description:
          'Set and modify Linux file permissions using chmod, change ownership with chown and chgrp, understand umask, SUID, SGID, and sticky bit.',
        sections: [
          {
            type: 'h2',
            text: 'Standard Linux Permissions',
          },
          {
            type: 'p',
            text: 'Every file has permissions for three classes: owner (user), group, and others. Each class gets three permission bits: read (r), write (w), execute (x).',
          },
          {
            type: 'code',
            text: '# Example: -rwxr-xr--  1 alice dev 1024 Mar 6 10:00 script.sh\n# Breakdown:\n# -  = regular file (d=dir, l=link, c=char, b=block)\n# rwx = owner (alice) can read, write, execute\n# r-x = group (dev) can read and execute\n# r-- = others can only read\n\n# Numeric (octal) notation:\n# r=4, w=2, x=1\n# rwx = 4+2+1 = 7\n# r-x = 4+0+1 = 5\n# r-- = 4+0+0 = 4\n# So: -rwxr-xr-- = 754',
          },
          {
            type: 'h2',
            text: 'chmod — Change Permissions',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['chmod 755 file', 'Set permissions to rwxr-xr-x (numeric)'],
              ['chmod 644 file', 'Set permissions to rw-r--r-- (owner rw, rest r)'],
              ['chmod u+x file', 'Add execute for owner'],
              ['chmod g-w file', 'Remove write from group'],
              ['chmod o=r file', 'Set others to read only'],
              ['chmod a+r file', 'Add read for all (a=all: u+g+o)'],
              ['chmod u+x,g-w file', 'Multiple changes at once'],
              ['chmod -R 755 dir/', 'Recursive change'],
              ['chmod --reference=ref file', 'Copy permissions from reference file'],
            ],
          },
          {
            type: 'h2',
            text: 'chown and chgrp',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['chown alice file', 'Change owner to alice'],
              ['chown alice:dev file', 'Change owner to alice and group to dev'],
              ['chown :dev file', 'Change group only'],
              ['chown -R alice /home/alice', 'Recursive ownership change'],
              ['chgrp dev file', 'Change group to dev'],
              ['chgrp -R dev dir/', 'Recursive group change'],
            ],
          },
          {
            type: 'h2',
            text: 'umask',
          },
          {
            type: 'p',
            text: 'umask defines the default permissions for newly created files and directories by masking bits. Default umask is typically 022.',
          },
          {
            type: 'code',
            text: '# View current umask\numask\numask -S  # symbolic view\n\n# Default creation permissions:\n# Files:       666 (rw-rw-rw-)\n# Directories: 777 (rwxrwxrwx)\n\n# With umask 022:\n# Files:       666 - 022 = 644 (rw-r--r--)\n# Directories: 777 - 022 = 755 (rwxr-xr-x)\n\n# With umask 027:\n# Files:       666 - 027 = 640 (rw-r-----)\n# Directories: 777 - 027 = 750 (rwxr-x---)\n\n# Set umask for session\numask 022\n\n# Permanent: add to ~/.bashrc or /etc/profile',
          },
          {
            type: 'h2',
            text: 'Special Permission Bits',
          },
          {
            type: 'table',
            headers: ['Bit', 'On files', 'On directories', 'chmod'],
            rows: [
              ['SUID (4000)', 'Execute as the file\'s owner, not calling user', '(no effect for most), displayed as s in owner x position', 'chmod u+s file or chmod 4755 file'],
              ['SGID (2000)', 'Execute as the file\'s group', 'New files inherit directory\'s group (not creator\'s)', 'chmod g+s dir or chmod 2755 dir'],
              ['Sticky bit (1000)', '(no standard effect on files)', 'Only owner or root can delete/rename files in this dir', 'chmod +t dir or chmod 1777 dir'],
            ],
          },
          {
            type: 'code',
            text: '# Examples of special bits\nls -la /usr/bin/passwd\n# -rwsr-xr-x  (SUID: s in owner execute position)\n\nls -la /tmp\n# drwxrwxrwt  (Sticky: t in others execute position)\n\nls -la /usr/bin/write\n# -rwxr-sr-x  (SGID: s in group execute position)',
          },
          {
            type: 'h2',
            text: 'Access Control Lists (ACL)',
          },
          {
            type: 'p',
            text: 'ACLs extend standard Unix permissions to allow per-user and per-group permission settings beyond the single owner/group/other model.',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['getfacl file', 'Show ACL of a file'],
              ['setfacl -m u:alice:rwx file', 'Give alice read/write/execute on file'],
              ['setfacl -m g:dev:rx file', 'Give group dev read/execute'],
              ['setfacl -m o::r file', 'Set others to read-only via ACL'],
              ['setfacl -x u:alice file', 'Remove alice\'s ACL entry'],
              ['setfacl -b file', 'Remove all ACL entries (keep base permissions)'],
              ['setfacl -R -m u:alice:rx dir/', 'Recursive ACL apply'],
              ['setfacl -d -m g:dev:rwx dir/', 'Set default ACL (inherited by new files in dir)'],
            ],
          },
          {
            type: 'code',
            text: '# Filesystem must be mounted with "acl" option, or acl support compiled in\n# View ACL\ngetfacl /var/www/html/\n# output:\n# # file: html/\n# # owner: www-data\n# # group: www-data\n# user::rwx\n# user:alice:rwx    <-- extra user entry!\n# group::r-x\n# mask::rwx\n# other::r-x\n\n# Copy ACL from one file to another\ngetfacl source.txt | setfacl --set-file=- dest.txt',
          },
          {
            type: 'h2',
            text: 'chattr and lsattr — Extended File Attributes',
          },
          {
            type: 'table',
            headers: ['Attribute', 'Flag', 'Description'],
            rows: [
              ['Immutable', 'i', 'File cannot be modified, renamed, deleted, or linked (even by root)'],
              ['Append only', 'a', 'File can only be opened for appending (useful for logs)'],
              ['No dump', 'd', 'Exclude from dump backups'],
              ['Secure deletion', 's', 'Overwrite with zeros on delete'],
              ['Undeletable', 'u', 'Content saved on undelete'],
            ],
          },
          {
            type: 'code',
            text: '# Make a file immutable\nchattr +i /etc/resolv.conf\n\n# Remove immutable flag\nchattr -i /etc/resolv.conf\n\n# Make a log file append-only\nchattr +a /var/log/app.log\n\n# List attributes\nlsattr /etc/resolv.conf\n# ----i----------- /etc/resolv.conf',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Octal: r=4, w=2, x=1. SUID=4000, SGID=2000, Sticky=1000. Sticky bit on /tmp prevents users deleting each other\'s files. SUID on passwd allows users to change their own password (runs as root). umask 022 → files get 644, dirs get 755. ACLs require filesystem support (ext4 usually has it built-in). getfacl/setfacl manage ACLs. chattr +i makes file immutable even to root.',
          },
        ],
      },
      {
        id: '104.6',
        topicId: '104',
        title: 'Create and Change Hard and Symbolic Links',
        weight: 2,
        description:
          'Understand inodes, create hard links and soft (symbolic) links.',
        sections: [
          {
            type: 'h2',
            text: 'Inodes and Hard Links',
          },
          {
            type: 'p',
            text: 'Every file has an inode storing metadata (permissions, ownership, timestamps, data block pointers). A hard link is another directory entry pointing to the same inode. Deleting one hard link does not delete the data until all links are removed.',
          },
          {
            type: 'table',
            headers: ['Property', 'Hard Link', 'Symbolic (Soft) Link'],
            rows: [
              ['Inode', 'Same inode as original', 'Different inode (contains path to target)'],
              ['Cross filesystems', 'NO — must be same filesystem', 'YES — can span filesystems'],
              ['Link to directory', 'Normally NOT allowed', 'YES'],
              ['If target deleted', 'Data still accessible via link', 'Link becomes dangling (broken)'],
              ['Appears as', 'Regular file', 'l in ls -l'],
              ['Created with', 'ln source link', 'ln -s source link'],
            ],
          },
          {
            type: 'code',
            text: '# Create a hard link\nln /etc/hosts /tmp/hosts-link\nls -li /etc/hosts /tmp/hosts-link   # same inode number!\n\n# Create a symbolic link\nln -s /etc/hosts /tmp/hosts-symlink\nls -la /tmp/hosts-symlink\n# lrwxrwxrwx 1 root root 10 ... /tmp/hosts-symlink -> /etc/hosts\n\n# Dangling symlink (target deleted)\nln -s /tmp/nonexistent /tmp/broken\nls -la /tmp/broken   # link exists but points to nothing\n\n# Find all hard links to same inode\nfind / -inum 1234567\n\n# View link count in ls -l (3rd column)\nls -l /etc/hosts   # 1 = one hard link (besides itself)',
          },
          {
            type: 'h2',
            text: 'Relative vs Absolute Symlinks',
          },
          {
            type: 'code',
            text: '# Absolute symlink (works from anywhere)\nln -s /usr/local/bin/python3 /usr/local/bin/python\n\n# Relative symlink (relative to the link\'s location, NOT cwd)\ncd /usr/local/bin\nln -s python3.11 python3   # OK: both in same dir\n\n# Danger: relative symlink created from wrong directory\nln -s python3.11 /usr/local/bin/python3   # WRONG if cwd != /usr/local/bin\n# Use absolute path to be safe when not in target dir',
          },
          {
            type: 'h2',
            text: 'readlink and stat',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['readlink file', 'Print target of a symbolic link'],
              ['readlink -f file', 'Resolve all symlinks — print canonical absolute path'],
              ['readlink -e file', 'Like -f but fails if path does not exist'],
              ['stat file', 'Show detailed file info: inode, permissions, timestamps, size'],
              ['stat -c %i file', 'Print inode number only'],
              ['ls -i file', 'Show inode number in listing'],
              ['ls -li dir/', 'Long listing with inode numbers'],
            ],
          },
          {
            type: 'code',
            text: '# Show what a symlink points to\nreadlink /usr/bin/python3\n# python3.11\n\n# Resolve all levels of symlinks\nreadlink -f /usr/bin/python3\n# /usr/bin/python3.11\n\n# Show file stats including inode\nstat /etc/hosts\n# File: /etc/hosts\n# Size: 221          Blocks: 8          IO Block: 4096   regular file\n# Device: 802h/2050d  Inode: 524303      Links: 1\n# Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)\n\n# Verify two hard links share an inode\nstat -c "%i %n" /etc/hosts /tmp/hosts-link\n# 524303 /etc/hosts\n# 524303 /tmp/hosts-link  ← same inode!',
          },
          {
            type: 'h2',
            text: 'cp with Links',
          },
          {
            type: 'code',
            text: '# Copy creates a NEW inode (default behavior)\ncp file1 file2                # new inode, new data\n\n# Create hard links with cp instead of ln\ncp -l file1 file2             # hard link (same inode)\n\n# Create symbolic links with cp\ncp -s file1 link1             # symbolic link\n\n# cp -p preserves permissions/timestamps (does NOT preserve hard links)\n# cp -a preserves everything including symlinks in directory trees\ncp -a /source/dir/ /dest/dir/',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Hard links: same inode, same filesystem only, cannot link directories (except with special options). Soft links: different inode, can cross filesystems and link directories, can be dangling. ln = hard link, ln -s = symbolic link. Link count in ls -l column 2 shows how many hard links point to the inode. A directory always has at least 2 hard links (itself + its . entry). readlink prints symlink target; readlink -f resolves all levels. stat shows inode number. find -inum finds all hard links to same inode.',
          },
        ],
      },
      {
        id: '104.7',
        topicId: '104',
        title: 'Find System Files and Place Files in Correct Location',
        weight: 2,
        description:
          'Understand the FHS, find files using find, locate, which, and whereis.',
        sections: [
          {
            type: 'h2',
            text: 'Filesystem Hierarchy Standard (FHS)',
          },
          {
            type: 'table',
            headers: ['Directory', 'Contents'],
            rows: [
              ['/', 'Root of filesystem'],
              ['/bin', 'Essential user command binaries (ls, cp, mv, cat...)'],
              ['/sbin', 'Essential system binaries (fsck, ifconfig, reboot...)'],
              ['/etc', 'Host-specific system configuration files'],
              ['/home', 'User home directories'],
              ['/root', "Root user's home directory"],
              ['/lib', 'Essential shared libraries and kernel modules'],
              ['/lib64', '64-bit shared libraries'],
              ['/usr', 'Secondary hierarchy (read-only, shareable)'],
              ['/usr/bin', 'Non-essential user command binaries'],
              ['/usr/sbin', 'Non-essential system binaries'],
              ['/usr/lib', 'Libraries for /usr/bin and /usr/sbin'],
              ['/usr/local', 'Locally installed software (beyond distro packages)'],
              ['/usr/share', 'Architecture-independent shared data, man pages'],
              ['/var', 'Variable data: logs, spool, databases'],
              ['/var/log', 'Log files'],
              ['/var/spool', 'Spool data (print, mail queues)'],
              ['/var/cache', 'Application cache data'],
              ['/tmp', 'Temporary files (cleared on reboot)'],
              ['/proc', 'Virtual FS for process/kernel info'],
              ['/sys', 'Virtual FS for device model (sysfs)'],
              ['/dev', 'Device files'],
              ['/mnt', 'Temporary mount point'],
              ['/media', 'Removable media mount points'],
              ['/opt', 'Optional add-on application software'],
              ['/boot', 'Boot loader files, kernel, initrd'],
              ['/srv', 'Data served by system (web, FTP)'],
            ],
          },
          {
            type: 'h2',
            text: 'File-Finding Commands',
          },
          {
            type: 'table',
            headers: ['Command', 'Description'],
            rows: [
              ['find / -name "file"', 'Search filesystem (real-time, slow)'],
              ['locate file', 'Search pre-built database (fast, may be stale)'],
              ['updatedb', 'Update the locate database (needs root, run daily by cron)'],
              ['which cmd', 'Find first executable in PATH'],
              ['whereis cmd', 'Find binary, source, and man page locations'],
              ['type cmd', 'Report what type an identifier is (builtin, alias, file)'],
            ],
          },
          {
            type: 'code',
            text: '# find: the powerful way\nfind /usr -name "python*" -type f\nfind / -name "*.conf" -user root\n\n# locate: fast database search\nlocate passwd\nlocate -i "*.TXT"    # case-insensitive\n\n# Update locate database\nsudo updatedb\n\n# which: find in PATH\nwhich python3\n# /usr/bin/python3\n\n# whereis: multiple locations\nwhereis bash\n# bash: /bin/bash /usr/share/man/man1/bash.1.gz\n\n# type: what IS this command\ntype ll\n# ll is aliased to `ls -alF\'',
          },
          {
            type: 'h2',
            text: '/usr/local vs /opt',
          },
          {
            type: 'table',
            headers: ['Location', 'Purpose'],
            rows: [
              ['/usr/local/bin', 'Manually compiled or installed programs (for all users)'],
              ['/usr/local/lib', 'Libraries for /usr/local programs'],
              ['/usr/local/etc', 'Config files for /usr/local programs'],
              ['/opt/<package>/', 'Self-contained third-party packages (e.g., /opt/oracle/)'],
            ],
          },
          {
            type: 'h2',
            text: 'find — Comprehensive Reference',
          },
          {
            type: 'table',
            headers: ['Option', 'Description', 'Example'],
            rows: [
              ['-name', 'Match filename (case-sensitive)', 'find / -name "*.conf"'],
              ['-iname', 'Match filename (case-insensitive)', 'find / -iname "README*"'],
              ['-type f', 'Regular files only', 'find /tmp -type f'],
              ['-type d', 'Directories only', 'find /etc -type d'],
              ['-type l', 'Symbolic links only', 'find /usr -type l'],
              ['-user alice', 'Files owned by alice', 'find /home -user alice'],
              ['-group dev', 'Files owned by group dev', 'find / -group dev'],
              ['-size +100M', 'Files larger than 100MB', 'find / -size +100M'],
              ['-mtime -7', 'Modified in last 7 days', 'find / -mtime -7'],
              ['-mtime +30', 'Modified more than 30 days ago', 'find /tmp -mtime +30'],
              ['-newer file', 'Files newer than reference file', 'find /src -newer Makefile'],
              ['-perm 644', 'Files with exact permissions 644', 'find /etc -perm 644'],
              ['-perm /4000', 'Files with SUID bit set', 'find / -perm /4000'],
              ['-exec cmd {} \\;', 'Execute cmd on each found file', 'find /tmp -mtime +7 -exec rm {} \\;'],
              ['-exec cmd {} +', 'Execute cmd with all found files (batched)', 'find /etc -name "*.bak" -exec ls -la {} +'],
              ['-delete', 'Delete found files', 'find /tmp -mtime +30 -delete'],
              ['-print0', 'Null-terminated output (for xargs -0)', 'find / -name "*.tmp" -print0 | xargs -0 rm'],
              ['-maxdepth N', 'Limit recursion depth', 'find /etc -maxdepth 1 -type f'],
              ['!  -not', 'Negate condition', 'find / -not -type f'],
              ['-o  -or', 'OR two conditions', 'find / -name "*.log" -o -name "*.tmp"'],
            ],
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Know FHS directories: /bin=essential binaries, /etc=config, /var=variable data, /tmp=temp (cleared on reboot), /usr=user programs, /opt=optional packages, /srv=served data, /proc=kernel/process virtual FS. locate uses a database (requires updatedb to be current). which only searches PATH. whereis also finds man pages and source. find -exec {} \\; runs once per file; -exec {} + is faster (batches args). find -perm /4000 finds SUID files. find -type l finds symlinks.',
          },
          {
            type: 'files',
            files: ['/bin/', '/sbin/', '/etc/', '/usr/bin/', '/usr/sbin/', '/var/log/', '/tmp/', '/proc/', '/sys/', '/dev/'],
          },
        ],
      },
    ],
}
