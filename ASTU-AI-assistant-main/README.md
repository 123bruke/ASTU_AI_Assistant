POWERED BY ASTU AI CLUB
*

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   🎓 ASTU AI Assistant – 3D Interactive AI Web Application
📌 Overview
ASTU AI Assistant is a 3D interactive AI-powered web application developed to support students at Adama Science and Technology University (ASTU).
The platform allows students to ask academic questions, request support, find campus locations, and connect with teachers through an intelligent AI assistant.
The system is powered by Google Gemini AI, which understands student questions and provides clear and helpful responses. The application is built entirely using TypeScript, ensuring a scalable and maintainable codebase.
This project aims to improve communication between students, teachers, and university services while providing a modern 3D interactive experience.
🚀 Features
🤖 AI Academic Assistant
AI chatbot powered by Google Gemini API
Understands natural language questions
Provides clear and intelligent answers
🎓 Student Support
Ask questions about courses
Request academic help
Get guidance for university services
👨‍🏫 Teacher Connection
Helps students communicate with teachers
Enables academic interaction and support
🗺️ Campus Navigation
Helps students find ASTU locations
Easy navigation for buildings and facilities
🌐 3D Interactive Interface
Modern 3D web experience
Interactive user interface
Engaging and visually attractive design
🧠 Technology Stack
Frontend
TypeScript
HTML5
CSS3
3D Web Technology (Three.js / WebGL)
Backend
TypeScript
Node.js
Express.js
Artificial Intelligence
Google Gemini API
Database
MongoDB / PostgreSQL (optional depending on deployment)
📂 Project Structure
Copy code

ASTU-AI-Assistant
│
├── frontend
│   ├── src
│   │   ├── main.ts
│   │   ├── components
│   │   └── styles
│
├── backend
│   ├── src
│   │   ├── server.ts
│   │   ├── routes
│   │   └── controllers
│
├── public
│   ├── assets
│   └── 3d_models
│
├── package.json
├── tsconfig.json
└── README.md
⚙️ Installation
1️⃣ Clone the repository
Bash
Copy code
git clone https://github.com/yourusername/astu-ai-assistant.git
2️⃣ Go to project directory
Bash
Copy code
cd astu-ai-assistant
3️⃣ Install dependencies
Bash
Copy code
npm install
4️⃣ Run development server
Bash
Copy code
npm run dev
🔑 Environment Variables
Create a .env file:
Copy code

GEMINI_API_KEY=your_gemini_api_key
PORT=3000
💡 Future Improvements
Voice-based AI assistant
Real-time teacher communication
ASTU course recommendation system
Mobile application version
Student portal integration
