# VoiceBridge 🌉

### AI-Powered Citizen Complaint and Infrastructure Insights Platform

VoiceBridge is a platform that helps citizens report local problems using voice, text, and photos. It uses AI to understand complaints and helps government officials identify areas that need infrastructure development.

Our goal is to make citizen complaints easier to report, understand, and use for better decision-making.

## 💡 Problem Statement

Citizens report problems such as damaged roads, poor drainage, and other public infrastructure issues every day.

However, these complaints may be spread across different channels, making it difficult to understand which areas need urgent attention.

VoiceBridge aims to bring these complaints together and turn them into useful insights for infrastructure planning.

## 🚀 Key Features

* **Voice Complaints:** Citizens can report problems using their voice.
* **Text Complaints:** Users can also type their complaints.
* **Photo Evidence:** Citizens can upload photos to show the condition of public infrastructure.
* **AI-Powered Analysis:** Gemini AI helps understand complaints and analyze text and images.
* **Location-Based Insights:** Complaints can be associated with specific locations to identify areas facing similar problems.
* **Government Dashboard:** Officials can view complaints and understand common issues.
* **Community Insights:** Helps identify areas where multiple complaints indicate a need for development.
* **Secure User Access:** Firebase Authentication and security rules help manage access to the platform.

## 🛠️ Technology Stack

| Technology              | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| React                   | Builds the website interface               |
| JavaScript              | Handles the application's logic            |
| Vite                    | Runs the frontend development server       |
| Tailwind CSS            | Designs the website                        |
| Web Speech API          | Converts speech into text                  |
| Node.js and Express.js  | Handle backend requests                    |
| Gemini AI               | Understands complaints and analyzes images |
| Firebase Authentication | Manages user login and signup              |
| Cloud Firestore         | Stores complaints and complaint history    |
| Firebase Storage        | Stores uploaded photos                     |
| React Router            | Handles navigation between pages           |
| React State/Context     | Manages data used by the interface         |

## 🔄 How VoiceBridge Works

1. A citizen submits a complaint using voice, text, or a photo.
2. The complaint is sent to the backend.
3. Gemini AI analyzes the complaint and available image evidence.
4. The AI returns structured information about the complaint.
5. Firebase stores the complaint and related information.
6. The dashboard displays complaints and community insights.
7. Government officials can use these insights to identify areas that may need attention.

## 🏗️ Project Structure

```text
VoiceBridge/
│
├── backend/          # Backend application
├── src/              # Frontend source code
├── public/           # Public frontend assets
├── index.html        # Frontend entry point
├── package.json      # Project dependencies and scripts
├── vite.config.js    # Vite configuration
├── tailwind.config.js
├── .env.example      # Example environment variables
├── .gitignore        # Files excluded from Git
└── README.md         # Project documentation
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js and npm
* Git
* A code editor such as Visual Studio Code

### Installation

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**2. Open the project**

```bash
cd VoiceBridge
```

**3. Install frontend dependencies**

```bash
npm install
```

**4. Install backend dependencies**

```bash
cd backend
npm install
```

### Environment Variables

Create environment files for the frontend and backend using the project's `.env.example` files.

Add the required configuration for:

* Gemini API
* Firebase project
* Backend server

Use the exact variable names required by your application. Never upload your actual API keys or private credentials to GitHub.

### Run the Application

Start the backend and frontend using the development commands specified in their respective `package.json` files.

The frontend and backend may need to run in separate terminals.

## 🌍 Our Vision

VoiceBridge aims to connect citizens and government officials through technology by turning everyday complaints into meaningful community insights.

We hope this idea can contribute to better infrastructure planning and more responsive public services.

## 👥 Team

Built with teamwork, creativity, and a shared vision of solving real-world problems.

## 🏆 Hackathon

Developed during **Build with AI: Code for Communities 2.0**, organized by Google Developer Group (GDG) Indore at Walkover.

## 📌 Project Status

Developed as a hackathon project. Further improvements and features can be added as the project evolves.
