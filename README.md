# LPI 101-500 — Linux Learning Platform

A full-featured LMS built for studying the **LPIC-1 / LPI 101-500** Linux certification exam.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- **Structured curriculum** — Topics 101–104 following the official LPI syllabus
- **Lesson reader** — Rich content with code blocks, tables, tip/warning/exam callouts
- **Inline practice terminal** — Interactive browser-based Linux terminal after each theory section
- **End-of-lesson quizzes** — Per-lesson quiz using `QuizEngine` with instant feedback and explanations
- **Full mock exam** — 40-question timed exam drawn from the entire question bank
- **Flashcard review** — Spaced-repetition style flashcard mode
- **Progress tracking** — Per-topic and per-lesson completion, quiz scores saved to localStorage
- **Responsive UI** — Works on desktop and mobile; collapsible sidebar
- **Monkeytype-inspired dark theme** — Clean, minimal dark UI with Lexend Deca + JetBrains Mono fonts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Fonts | Lexend Deca · JetBrains Mono |
| State | React `useState` + `localStorage` |

---

## Curriculum Coverage

| Topic | Title | Status |
|---|---|---|
| 101 | System Architecture | ✅ |
| 102 | Linux Installation and Package Management | ✅ |
| 103 | GNU and Unix Commands | ✅ |
| 104 | Devices, Linux Filesystems, FHS | ✅ |
| 105–110 | Shells, Interfaces, Security, Networking... | 🚧 In progress |

---

## License

MIT
