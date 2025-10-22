# Chatty — Real-Time Modern Chat App

Chatty is a **real-time chat application** built with **React, TypeScript, TailwindCSS, and WebSockets**, featuring a **Gen Z-inspired dark UI**. Users can join chat rooms, send messages, see when others are typing, and interact with modern chat features like **emoji & attachment buttons**.

---

## Features

- 💬 **Real-time messaging** using WebSockets  
- 🖤 **Modern dark UI** with gradient themes (Gen Z style)  
- 🏃‍♂️ **Typing indicators** for other users  
- ✨ Smooth **message animations** (slide-in left/right)  
- 📎 **Attachment button** (placeholder for file upload)  
- 😊 **Emoji button** (placeholder for emoji picker)  
- 🔒 **Unique user identification** using UUIDs  
- ⚡ Responsive design for desktop & mobile  

## Tech Stack

- **Frontend:** React + TypeScript + TailwindCSS  
- **Backend:** Node.js + WebSocket (ws)  
- **Optional:** Redis for pub/sub to handle multiple rooms/users  

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/chatty.git
cd chatty

### 2 step
npm install

### 3 step 
npm run build && npm run start

###4 step run frontend 
npm run dev



/chatty
├─ /src
│  ├─ App.tsx          # Main app with contacts & chat window
│  ├─ ChatRoom.tsx     # ChatRoom component with messages & input
│  └─ index.tsx        # Entry point
├─ /server
│  └─ server.js        # WebSocket server
├─ package.json
└─ README.md
