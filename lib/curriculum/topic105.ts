import type { Topic } from '../types'
import { FileCode } from 'lucide-react'

export const topic105: Topic = {
    id: '105',
    title: 'Shells and Shell Scripting',
    icon: FileCode,
    description: 'Customize the shell environment, write Bash scripts, and query SQL databases.',
    lessons: [
      {
        id: '105.1',
        topicId: '105',
        title: 'Customize and Use the Shell Environment',
        weight: 4,
        description: 'Set environment variables, customize shell startup files, write and use functions and aliases.',
        sections: [
          {
            type: 'h2',
            text: 'Shell Startup Files',
          },
          {
            type: 'table',
            headers: ['File', 'When Executed', 'Scope'],
            rows: [
              ['/etc/profile', 'Login shell startup — system-wide', 'All users'],
              ['/etc/profile.d/*.sh', 'Sourced by /etc/profile — system-wide drop-ins', 'All users'],
              ['/etc/bash.bashrc', 'Interactive non-login shell — system-wide (Debian)', 'All users'],
              ['/etc/bashrc', 'Interactive non-login shell — system-wide (RHEL)', 'All users'],
              ['~/.bash_profile', 'Login shell — user personal (sourced first if exists)', 'Single user'],
              ['~/.bash_login', 'Login shell — if .bash_profile not found', 'Single user'],
              ['~/.profile', 'Login shell — if neither .bash_profile nor .bash_login found; also used by sh/dash', 'Single user'],
              ['~/.bashrc', 'Interactive non-login shell — user personal', 'Single user'],
              ['~/.bash_logout', 'Executed when login shell exits', 'Single user'],
            ],
          },
          {
            type: 'info',
            title: 'Login vs Non-Login Shell',
            body: 'Login shell: when you log in via console, SSH, or su -. Reads /etc/profile then ~/.bash_profile. Non-login shell: new terminal in GUI, running bash in a script, or su (without -). Reads /etc/bashrc then ~/.bashrc. ~/.bash_profile usually sources ~/.bashrc to get both.',
          },
          {
            type: 'h2',
            text: 'Environment Variables',
          },
          {
            type: 'table',
            headers: ['Variable', 'Description'],
            rows: [
              ['PATH', 'Colon-separated list of directories searched for commands'],
              ['HOME', 'Current user\'s home directory'],
              ['USER / LOGNAME', 'Current logged-in username'],
              ['SHELL', 'Path to the current user\'s default shell'],
              ['PS1', 'Primary prompt string (what you see before commands)'],
              ['PS2', 'Secondary prompt (continuation prompt, default ">")'],
              ['HISTSIZE', 'Number of commands kept in memory during session'],
              ['HISTFILESIZE', 'Number of commands saved to ~/.bash_history'],
              ['HISTFILE', 'Path to history file (default ~/.bash_history)'],
              ['LANG', 'Default locale (language + encoding)'],
              ['LC_ALL', 'Override all locale settings'],
              ['TZ', 'Timezone (e.g., "America/New_York", "UTC")'],
              ['TERM', 'Terminal type (e.g., xterm-256color, vt100)'],
              ['MANPATH', 'Colon-separated dirs searched for man pages'],
            ],
          },
          {
            type: 'code',
            text: '# Set and export a variable\nexport MYVAR="hello"\nexport PATH="$PATH:/opt/myapp/bin"\n\n# View all environment variables\nenv\nprintenv\nprintenv PATH\n\n# Unset a variable\nunset MYVAR\n\n# Make variable read-only\nreadonly CONST=42\n\n# Show/set shell options\nset -o           # list all options with on/off state\nset -o noclobber # prevent > from overwriting files\nset +o noclobber # disable that option\nset -x           # debug: print each command before executing\nset -e           # exit script on any error\nset -u           # treat unset variables as errors',
          },
          {
            type: 'h2',
            text: 'Aliases and Functions',
          },
          {
            type: 'code',
            text: '# Define an alias\nalias ll="ls -lah"\nalias grep="grep --color=auto"\nalias rm="rm -i"   # safer rm\n\n# List all aliases\nalias\n\n# Remove an alias\nunalias ll\n\n# Aliases are NOT exported to subshells\n# Put alias definitions in ~/.bashrc or ~/.bash_aliases\n\n# Shell function (more powerful than alias — accepts args)\ngreet() {\n    echo "Hello, $1!"\n    echo "You passed $# arguments"\n}\ngreet World     # output: Hello, World!\n\n# Export a function to subshells\nexport -f greet\n\n# List all defined functions\ndeclare -F          # function names only\ndeclare -f greet    # function definition',
          },
          {
            type: 'h2',
            text: 'source and . (dot) Command',
          },
          {
            type: 'code',
            text: '# Source a file: execute it in the CURRENT shell (not a subshell)\n# Changes to variables/aliases/functions persist in the current shell\nsource ~/.bashrc\n. ~/.bashrc         # identical (. is the POSIX form)\n\n# Compare: running a script directly creates a subshell\nbash myscript.sh    # changes do NOT affect current shell\n./myscript.sh       # same — new subshell\n\n# Typical use: reload profile after editing\nsource ~/.bash_profile',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Login shell reads /etc/profile then ~/.bash_profile (or ~/.bash_login or ~/.profile). Non-login interactive shell reads /etc/bashrc (or /etc/bash.bashrc) then ~/.bashrc. ~/.bash_profile usually sources ~/.bashrc. source (or .) runs a file in the current shell — changes persist. bash script.sh runs in a subshell — changes are lost. alias defines shortcut commands; unalias removes them; aliases are NOT exported to subshells. export makes variables available to child processes. export -f exports functions. HISTSIZE=memory, HISTFILESIZE=file. PS1 is the prompt. set -e exits on error; set -x enables debug tracing.',
          },
          {
            type: 'files',
            files: ['/etc/profile', '/etc/profile.d/', '/etc/bash.bashrc', '/etc/bashrc', '~/.bash_profile', '~/.bashrc', '~/.bash_logout', '~/.bash_history'],
          },
        ],
      },
      {
        id: '105.2',
        topicId: '105',
        title: 'Customize or Write Simple Scripts',
        weight: 4,
        description: 'Write Bash scripts using variables, loops, conditionals, functions, and handle arguments and exit codes.',
        sections: [
          {
            type: 'h2',
            text: 'Script Basics',
          },
          {
            type: 'code',
            text: '#!/bin/bash\n# Shebang line must be first line — specifies the interpreter\n# Make executable: chmod +x script.sh\n# Run: ./script.sh  OR  bash script.sh\n\n# Variables (no spaces around =)\nNAME="Alice"\nAGE=30\necho "Name: $NAME, Age: $AGE"\n\n# Command substitution\nTODAY=$(date +%Y-%m-%d)\nFILES=$(ls /etc | wc -l)\n\n# Arithmetic\nRESULT=$((5 + 3 * 2))     # = 11\nlet COUNT=COUNT+1\n((COUNT++))\n\n# Read user input\nread -p "Enter your name: " USERNAME\nread -s -p "Password: " PASS   # -s = silent (no echo)',
          },
          {
            type: 'h2',
            text: 'Special Variables',
          },
          {
            type: 'table',
            headers: ['Variable', 'Description'],
            rows: [
              ['$0', 'Script name / path'],
              ['$1 … $9', 'Positional arguments ($1 = first arg, $9 = ninth)'],
              ['${10}', 'Tenth and above arguments (need braces)'],
              ['$#', 'Number of positional arguments'],
              ['$*', 'All arguments as a single word'],
              ['$@', 'All arguments as separate words (preserves quoting — prefer this)'],
              ['$?', 'Exit status of last command (0 = success, non-zero = error)'],
              ['$$', 'PID of current shell'],
              ['$!', 'PID of last background process'],
              ['$-', 'Current shell option flags'],
            ],
          },
          {
            type: 'h2',
            text: 'Test and Conditionals',
          },
          {
            type: 'code',
            text: '# test command (same as [ ])\ntest -f /etc/hosts && echo "file exists"\n[ -f /etc/hosts ] && echo "file exists"\n[[ "$VAR" == "hello" ]] && echo "match"   # bash extended test\n\n# File tests\n[ -f file ]     # is a regular file\n[ -d dir ]      # is a directory\n[ -e path ]     # exists (any type)\n[ -r file ]     # readable\n[ -w file ]     # writable\n[ -x file ]     # executable\n[ -s file ]     # non-empty (size > 0)\n[ -L file ]     # is a symlink\n[ -z "$STR" ]   # string is empty\n[ -n "$STR" ]   # string is non-empty\n[ "$A" = "$B" ] # strings equal\n[ "$A" != "$B" ]# strings not equal\n[ $N -eq 5 ]    # numeric equal\n[ $N -ne 5 ]    # not equal\n[ $N -lt 5 ]    # less than\n[ $N -le 5 ]    # less than or equal\n[ $N -gt 5 ]    # greater than\n[ $N -ge 5 ]    # greater than or equal\n\n# if / elif / else\nif [ -f "$1" ]; then\n    echo "File exists"\nelif [ -d "$1" ]; then\n    echo "Is a directory"\nelse\n    echo "Not found"\nfi\n\n# case statement\ncase "$OS" in\n    debian|ubuntu)  echo "Debian-based" ;;\n    rhel|centos)    echo "RHEL-based" ;;\n    *)              echo "Unknown" ;;\nesac',
          },
          {
            type: 'h2',
            text: 'Loops',
          },
          {
            type: 'code',
            text: '# for loop — iterate over list\nfor FRUIT in apple banana cherry; do\n    echo "Fruit: $FRUIT"\ndone\n\n# for loop — iterate over files\nfor FILE in /etc/*.conf; do\n    echo "Config: $FILE"\ndone\n\n# for loop — C-style\nfor ((i=0; i<5; i++)); do\n    echo "i = $i"\ndone\n\n# while loop\nCOUNT=0\nwhile [ $COUNT -lt 5 ]; do\n    echo "Count: $COUNT"\n    ((COUNT++))\ndone\n\n# until loop (opposite of while)\nuntil [ $COUNT -ge 5 ]; do\n    ((COUNT++))\ndone\n\n# Loop control\nbreak       # exit loop\ncontinue    # skip to next iteration\n\n# Read file line by line\nwhile IFS= read -r LINE; do\n    echo "$LINE"\ndone < /etc/hosts',
          },
          {
            type: 'h2',
            text: 'Exit Codes and Error Handling',
          },
          {
            type: 'code',
            text: '# Every command returns an exit code: 0=success, 1-255=error\nls /etc\necho $?    # 0\n\nls /nonexistent\necho $?    # 2 (No such file)\n\n# Exit from script with code\nexit 0     # success\nexit 1     # generic error\n\n# Conditional execution using exit codes\ncommand && echo "succeeded"   # run if command succeeded\ncommand || echo "failed"      # run if command failed\ncommand1 && command2 || command3  # if1 then2 else3\n\n# set -e: exit script immediately on any error\n#!/bin/bash\nset -e\nset -u    # treat unset vars as error\nset -o pipefail  # fail if any pipe command fails\n\n# trap: run cleanup on exit or signals\ntrap "rm -f /tmp/lockfile; exit" INT TERM EXIT\ntrap "echo Script interrupted" INT',
          },
          {
            type: 'h2',
            text: 'Functions',
          },
          {
            type: 'code',
            text: '# Define function\nmy_func() {\n    local VAR="local scope"   # local: only visible inside function\n    echo "Arg 1: $1"\n    return 0    # return sets $? (0-255 only; not a value)\n}\n\n# Call function\nmy_func "hello"\n\n# Capture function output\nRESULT=$(my_func "hello")\n\n# here-document\ncat << EOF\nLine 1\nLine 2\nEOF\n\n# here-string\ngrep "root" <<< "root:x:0:0"',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'Shebang #!/bin/bash must be first line. chmod +x to make executable. Variables: no spaces around =. $# = arg count, $@ = all args (with quoting), $* = all as one string. $? = last exit code (0=success). test / [ ] for comparisons; -f=file, -d=dir, -z=empty string, -n=non-empty. String: =, != ; Numeric: -eq, -ne, -lt, -gt, -le, -ge. Use local inside functions to avoid polluting global scope. return sets $? (0–255). exit exits the script. trap catches signals. set -e exits on error; set -u errors on unset vars; set -o pipefail catches pipe errors. source / . runs file in current shell.',
          },
        ],
      },
      {
        id: '105.3',
        topicId: '105',
        title: 'SQL Data Management',
        weight: 2,
        description: 'Query, insert, update and delete data using basic SQL with SQLite or MySQL/MariaDB.',
        sections: [
          {
            type: 'h2',
            text: 'SQL Basics',
          },
          {
            type: 'table',
            headers: ['Statement', 'Purpose'],
            rows: [
              ['SELECT', 'Read / retrieve rows from a table'],
              ['INSERT', 'Add new rows into a table'],
              ['UPDATE', 'Modify existing rows'],
              ['DELETE', 'Remove rows from a table'],
              ['CREATE TABLE', 'Create a new table'],
              ['DROP TABLE', 'Delete a table and all its data'],
              ['CREATE DATABASE', 'Create a new database'],
              ['SHOW DATABASES', 'List all databases (MySQL)'],
              ['SHOW TABLES', 'List all tables in current database (MySQL)'],
              ['.tables', 'List tables (SQLite)'],
            ],
          },
          {
            type: 'code',
            text: '-- SELECT: query data\nSELECT * FROM users;                          -- all columns, all rows\nSELECT name, email FROM users;                -- specific columns\nSELECT * FROM users WHERE age > 30;           -- filter rows\nSELECT * FROM users WHERE name = \'Alice\';     -- exact match\nSELECT * FROM users ORDER BY name ASC;        -- sort ascending\nSELECT * FROM users ORDER BY age DESC;        -- sort descending\nSELECT * FROM users LIMIT 10;                 -- first 10 rows\nSELECT COUNT(*) FROM users;                   -- count rows\nSELECT MAX(age), MIN(age), AVG(age) FROM users;\n\n-- INSERT: add a row\nINSERT INTO users (name, email, age) VALUES (\'Bob\', \'bob@example.com\', 25);\n\n-- UPDATE: modify rows\nUPDATE users SET email = \'new@example.com\' WHERE name = \'Alice\';\nUPDATE users SET age = age + 1 WHERE active = 1;\n\n-- DELETE: remove rows\nDELETE FROM users WHERE age < 18;\nDELETE FROM users WHERE name = \'Bob\';\n\n-- CREATE TABLE\nCREATE TABLE users (\n    id   INTEGER PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email TEXT UNIQUE,\n    age  INTEGER\n);\n\n-- DROP TABLE\nDROP TABLE IF EXISTS old_table;',
          },
          {
            type: 'h2',
            text: 'JOIN and GROUP BY',
          },
          {
            type: 'code',
            text: '-- INNER JOIN: matching rows in both tables\nSELECT orders.id, users.name\nFROM orders\nINNER JOIN users ON orders.user_id = users.id;\n\n-- LEFT JOIN: all rows from left table\nSELECT users.name, orders.id\nFROM users\nLEFT JOIN orders ON users.id = orders.user_id;\n\n-- GROUP BY with aggregate\nSELECT department, COUNT(*) AS headcount, AVG(salary)\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5;\n\n-- LIKE pattern matching\nSELECT * FROM users WHERE email LIKE \'%@example.com\';\nSELECT * FROM users WHERE name LIKE \'A%\';   -- starts with A\nSELECT * FROM users WHERE name LIKE \'_ob\';  -- _ matches one char',
          },
          {
            type: 'h2',
            text: 'Using SQLite and MySQL from the Command Line',
          },
          {
            type: 'code',
            text: '# SQLite — single-file database\nsqlite3 mydb.sqlite           # open or create\nsqlite3 mydb.sqlite "SELECT * FROM users;"\n.help                         # list SQLite commands\n.tables                       # list tables\n.schema users                 # show CREATE TABLE statement\n.quit                         # exit\n\n# MySQL / MariaDB\nmysql -u root -p              # interactive session\nmysql -u user -p dbname -e "SELECT * FROM users;"\n\n-- Inside MySQL:\nSHOW DATABASES;\nUSE mydatabase;\nSHOW TABLES;\nDESCRIBE users;               -- show table structure\nEXIT;',
          },
          {
            type: 'exam',
            title: 'Exam Tips',
            body: 'SELECT retrieves, INSERT adds, UPDATE modifies, DELETE removes. WHERE filters rows. ORDER BY sorts (ASC=ascending, DESC=descending). LIMIT restricts row count. COUNT(*), MAX(), MIN(), AVG() are aggregate functions. GROUP BY groups rows; HAVING filters groups (like WHERE but for groups). INNER JOIN returns matching rows from both tables. LEFT JOIN returns all rows from left table. LIKE with % (any sequence) and _ (any single char). SQLite: sqlite3 file; .tables, .schema. MySQL: mysql -u user -p; SHOW DATABASES; USE db; DESCRIBE table.',
          },
        ],
      },
    ],
}
