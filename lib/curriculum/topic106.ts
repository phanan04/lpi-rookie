import type { Topic } from '../types'
import { Monitor } from 'lucide-react'

export const topic106: Topic = {
    id: '106',
    title: 'User Interfaces and Desktops',
    icon: Monitor,
    description: 'Install and configure X11, graphical desktop environments, and accessibility features.',
    lessons: [
      {
        id: '106.1',
        topicId: '106',
        title: 'Install and Configure X11',
        weight: 2,
        description: 'Understand the X Window System architecture, configure X11, and troubleshoot display issues.',
        sections: [
          {
            type: 'h2',
            text: 'X Window System Architecture',
          },
          {
            type: 'p',
            text: 'X11 (X Window System) provides the foundation for graphical displays on Linux. It uses a client-server model where the X server manages the display hardware.',
          },
          {
            type: 'table',
            headers: ['Component', 'Description'],
            rows: [
              ['X Server', 'Runs on the local machine; controls display, keyboard, mouse. Draws pixels on screen.'],
              ['X Client', 'Applications that request drawing operations from the X server (e.g., xterm, firefox)'],
              ['Display Manager', 'Graphical login screen: GDM (GNOME), LightDM, SDDM (KDE), XDM (classic)'],
              ['Window Manager', 'Controls window placement, decorations, and focus: Mutter, KWin, Openbox, i3'],
              ['Desktop Environment', 'Full suite: WM + file manager + taskbar + apps: GNOME, KDE Plasma, XFCE, LXDE'],
              ['DISPLAY variable', 'Tells X clients which server to connect to. Format: host:display.screen (e.g., :0, :0.0, remotehost:1)'],
            ],
          },
          {
            type: 'h2',
            text: 'Key X11 Files and Directories',
          },
          {
            type: 'table',
            headers: ['Path', 'Description'],
            rows: [
              ['/etc/X11/xorg.conf', 'Main Xorg configuration file (often absent; auto-detected)'],
              ['/etc/X11/xorg.conf.d/', 'Drop-in configuration snippets (preferred modern approach)'],
              ['/var/log/Xorg.0.log', 'X server log for display :0 — essential for troubleshooting'],
              ['~/.xsession-errors', 'Stderr output from X session / display manager'],
              ['~/.xinitrc', 'User startup commands when starting X with startx'],
              ['/etc/X11/xinit/xinitrc', 'System-wide xinitrc'],
              ['~/.Xauthority', 'MIT-MAGIC-COOKIE auth tokens for X server access'],
              ['/usr/share/X11/xkb/', 'Keyboard layout definitions'],
            ],
          },
          {
            type: 'h2',
            text: 'X11 Forwarding over SSH',
          },
          {
            type: 'code',
            text: '# Enable X11 forwarding in SSH session\nssh -X user@remotehost      # X11 forwarding (less secure)\nssh -Y user@remotehost      # Trusted X11 forwarding (more permissive)\n\n# Run a remote GUI app locally\nssh -X user@server xterm\nssh -Y user@server firefox\n\n# Check DISPLAY variable inside SSH session\necho $DISPLAY\n# localhost:10.0  (set automatically by ssh -X)\n\n# Required settings in /etc/ssh/sshd_config on server:\n# X11Forwarding yes\n# X11DisplayOffset 10     # default offset for forwarded displays\n\n# xauth: manage X authentication cookies\nxauth list\nxauth add $DISPLAY MIT-MAGIC-COOKIE-1 <cookie>',
          },
          {
            type: 'h2',
            text: 'Starting and Configuring X',
          },
          {
            type: 'code',
            text: '# Start X manually (uses ~/.xinitrc for startup commands)\nstartx\nstartx -- :1   # start on display :1\n\n# Re-generate xorg.conf (detects hardware automatically)\nXorg -configure       # creates /root/xorg.conf.new\n\n# Check X server info\nxdpyinfo\nxdpyinfo | grep "dimensions"   # screen resolution\nxrandr                          # list displays and resolutions\nxrandr --output HDMI1 --mode 1920x1080 --rate 60\nxrandr --output VGA1 --off      # disable a monitor\n\n# Check display manager (DM) in use\ncat /etc/X11/default-display-manager\nsystemctl status gdm3 lightdm sddm',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'X server runs locally and draws pixels; X clients are apps that talk to the server. DISPLAY=:0 (local), host:1 (remote). X11 forwarding over SSH: ssh -X or ssh -Y; needs X11Forwarding yes in sshd_config. /var/log/Xorg.0.log is the primary troubleshooting file. ~/.Xauthority holds MIT-MAGIC-COOKIE tokens. startx starts X using ~/.xinitrc. xdpyinfo shows display info; xrandr manages resolutions. Display managers: GDM (GNOME), LightDM, SDDM (KDE), XDM. Window manager handles window placement; desktop environment is the full suite.',
          },
          {
            type: 'files',
            files: ['/etc/X11/xorg.conf', '/etc/X11/xorg.conf.d/', '/var/log/Xorg.0.log', '~/.xinitrc', '~/.Xauthority', '~/.xsession-errors'],
          },
        ],
      },
      {
        id: '106.2',
        topicId: '106',
        title: 'Graphical Desktops',
        weight: 1,
        description: 'Know major Linux desktop environments and display managers.',
        sections: [
          {
            type: 'h2',
            text: 'Desktop Environments',
          },
          {
            type: 'table',
            headers: ['Environment', 'Description', 'Default Display Manager'],
            rows: [
              ['GNOME', 'Modern, polished, uses GTK3+. Default on Fedora, Ubuntu, Debian. Window manager: Mutter.', 'GDM (GNOME Display Manager)'],
              ['KDE Plasma', 'Feature-rich, highly customizable, uses Qt. Default on openSUSE, Kubuntu.', 'SDDM'],
              ['XFCE', 'Lightweight, fast. Good for older hardware. Uses GTK2+.', 'LightDM'],
              ['LXDE / LXQt', 'Very lightweight. LXDE uses GTK, LXQt uses Qt.', 'LightDM'],
              ['Cinnamon', 'GNOME 3 fork. Traditional layout. Used by Linux Mint.', 'MDM / LightDM'],
              ['MATE', 'Fork of GNOME 2. Traditional desktop.', 'LightDM'],
            ],
          },
          {
            type: 'h2',
            text: 'Display Managers',
          },
          {
            type: 'table',
            headers: ['Display Manager', 'Description'],
            rows: [
              ['GDM (GNOME Display Manager)', 'Default for GNOME; supports Wayland and X11'],
              ['LightDM', 'Lightweight and cross-desktop; used by Ubuntu, XFCE, LXDE'],
              ['SDDM (Simple Desktop Display Manager)', 'Modern, QML-based; default for KDE Plasma'],
              ['XDM (X Display Manager)', 'Classic, minimal; part of the original X distribution'],
              ['SLIM', 'Simple Login Manager; lightweight but unmaintained'],
            ],
          },
          {
            type: 'h2',
            text: 'Wayland vs X11',
          },
          {
            type: 'table',
            headers: ['Aspect', 'X11 (Xorg)', 'Wayland'],
            rows: [
              ['Architecture', 'Client-server; X server is separate process', 'Compositor handles both display and input directly'],
              ['Age', 'Since 1984; mature, widely compatible', 'Modern; GNOME/KDE default since ~2021'],
              ['Remote display', 'Native X11 forwarding (ssh -X)', 'No built-in remote display (workarounds: xwayland)'],
              ['Security', 'Any app can read all keystrokes (no isolation)', 'Improved isolation between apps'],
              ['Compatibility', 'Universal legacy support', 'XWayland provides X11 compatibility layer'],
            ],
          },
          {
            type: 'h2',
            text: 'Remote Desktop Protocols',
          },
          {
            type: 'table',
            headers: ['Protocol', 'Full Name', 'Description'],
            rows: [
              ['XDMCP', 'X Display Manager Control Protocol', 'Allows a remote X server (thin client) to request a full X session from an XDMCP-capable display manager (XDM, GDM, LightDM). Uses UDP 177. Unencrypted — route through SSH tunnel on untrusted networks.'],
              ['VNC', 'Virtual Network Computing', 'Desktop sharing protocol: transmits framebuffer (screen pixels) over the network. Server: vncserver / tigervnc. Client: vncviewer. Port 5900+. Cross-platform. Encrypt via SSH tunnel.'],
              ['SPICE', 'Simple Protocol for Independent Computing Environments', 'High-performance remote display protocol optimised for virtual machines (KVM/QEMU). Supports audio, USB redirection, dynamic resolution. Client: virt-viewer / remote-viewer.'],
              ['RDP', 'Remote Desktop Protocol', 'Microsoft protocol used to connect to Windows desktops. Linux implementation: xrdp (server), rdesktop / FreeRDP (clients). Port 3389.'],
              ['NX / X2Go', 'NX Technology / X2Go', 'Compressed X11 session over SSH. Very efficient on slow links. X2Go is active free software based on NX.'],
            ],
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Know the major desktop environments: GNOME (GDM, GTK), KDE Plasma (SDDM, Qt), XFCE (LightDM, lightweight), LXDE/LXQt (very lightweight). Display managers provide the graphical login screen. GDM=GNOME, SDDM=KDE, LightDM=cross-desktop. Wayland is the modern replacement for X11 — compositor architecture, better security. XWayland provides X11 backward compatibility under Wayland. Remote desktop: XDMCP = X11 thin client (UDP 177); VNC = framebuffer sharing (port 5900+); SPICE = optimised for VMs; RDP = Microsoft protocol (port 3389, xrdp on Linux). VNC and XDMCP are unencrypted — should be tunnelled via SSH.',
          },
        ],
      },
      {
        id: '106.3',
        topicId: '106',
        title: 'Accessibility',
        weight: 1,
        description: 'Know Linux desktop accessibility technologies and tools.',
        sections: [
          {
            type: 'h2',
            text: 'Assistive Technologies',
          },
          {
            type: 'table',
            headers: ['Tool / Feature', 'Description'],
            rows: [
              ['AT-SPI (Assistive Technology Service Provider Interface)', 'Core Linux accessibility framework — allows assistive tools to interact with GUI apps'],
              ['Orca', 'Screen reader for GNOME — reads text aloud using speech synthesis; supports braille displays'],
              ['GOK (GNOME On-screen Keyboard)', 'On-screen keyboard for users who cannot use a physical keyboard'],
              ['Onboard', 'On-screen keyboard for Ubuntu / lighter desktops'],
              ['KMag / KMouseTool', 'KDE screen magnifier / automatic mouse clicker'],
              ['Sticky Keys', 'Hold modifier keys (Shift, Ctrl, Alt) without pressing simultaneously'],
              ['Slow Keys', 'Requires a key to be held before it is accepted (ignores accidental taps)'],
              ['Bounce Keys', 'Ignores rapid repeated keystrokes from tremors'],
              ['Mouse Keys', 'Control mouse pointer with the numeric keypad'],
              ['High Contrast / Large Text', 'Theme settings for visual impairment'],
            ],
          },
          {
            type: 'h2',
            text: 'Command-Line Accessibility',
          },
          {
            type: 'table',
            headers: ['Tool', 'Description'],
            rows: [
              ['espeak / espeak-ng', 'Text-to-speech from the command line: echo "hello" | espeak'],
              ['festival', 'Text-to-speech synthesis engine'],
              ['brltty', 'Daemon providing braille display support in the console'],
              ['speakup', 'Kernel module for speech output directly from the Linux console'],
            ],
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'AT-SPI is the core Linux accessibility framework. Orca is the GNOME screen reader. Sticky Keys lets modifier keys be pressed sequentially. Slow Keys filters accidental taps. Bounce Keys reduces double-key input from tremors. Mouse Keys enables pointer control via numpad. brltty supports braille displays. speakup is a kernel-level console speech driver. espeak/festival are command-line text-to-speech tools.',
          },
        ],
      },
    ],
}
