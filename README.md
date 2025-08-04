# 🤖 AI Detector

A full-stack application that detects whether a given text is AI-generated or human-written using a trained machine learning model and a clean frontend interface.

---



## ✨ Features

- 🧠 Predict if a message was written by AI or a human
- 📊 Uses a trained deep learning model (Keras `.h5`)
- 🌍 Full-stack app: Python backend + Node.js server + frontend
- ⚡ Real-time response with probability score
- 🔒 Secure API integration using environment variables

---

## 🛠️ Tech Stack

**Frontend:**
- React or plain JavaScript
- Axios (for API calls)

**Backend:**
- Node.js + Express (middleware)
- Python (Flask or FastAPI)
- TensorFlow / Keras (ML model)



## 🧰 How to Run the Project Locally

### 1. Clone the Repository

git clone https://github.com/YOUR_USERNAME/ai-vs-human-written-text.git
cd ai-vs-human-written-text

**run the python backend**

cd backend/python
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python server.py

**run node**
Open another terminal tab:
cd backend
npm install
node index.js



**Run the Frontend**
Open another terminal tab
cd frontend
npm install
npm start





