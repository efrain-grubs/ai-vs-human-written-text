import React, { useState } from 'react';
import axios from 'axios';

function Text() {
  const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [aiReply, setAiReply] = useState(null);
  const [userText, setUserText] = useState('');
  const [chat, setChat] = useState([]);

  const sendText = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", { text: input });
      setPrediction(res.data.prediction);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const sendPrediction = async () => {
    try {
      const res = await axios.post("http://localhost:5050/predict", { prediction, text: input });
      setAiReply(res.data.aiReply);
      setChat([
        { role: 'user', content: input },
        res.data.aiReply
      ]);
    } catch (err) {
      console.log("error", err);
    }
  };

  const conversation = async () => {
    try {
      const response = await axios.post("http://localhost:5050/chat", { userText, aiReply });
      setChat((prev) => [
        ...prev,
        { role: 'user', content: userText },
        { role: 'assistant', content: response.data.aiReply }
      ]);
      setAiReply(response.data.aiReply);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-md flex flex-col space-y-6">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          sendText();
          sendPrediction();
          setInput('');
        }}
        className="flex space-x-2"
      >
        <input
          placeholder="Enter text..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded border border-gray-300"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>

      {input.length < 30 && prediction && (
        <h1 className="text-red-600 font-semibold">
          Please type in more text for a more accurate result
        </h1>
      )}

      {prediction && prediction * 100 > 70 ? (
        <h1 className="text-xl font-bold text-blue-700">I'm 100 percent sure this was written by AI</h1>
      ) : prediction * 100 > 50 ? (
        <h1 className="text-xl font-bold text-blue-700">
          I'm {Math.floor(prediction * 100)}% sure this was written by AI
        </h1>
      ) : null}

      {prediction && prediction * 100 < 40 ? (
        <h1 className="text-xl font-bold text-green-700">
          I'm confident this was written by a human
        </h1>
      ) : prediction * 100 < 50 && prediction ? (
        <h1 className="text-xl font-bold text-yellow-600">
          I'm {Math.floor(prediction * 100)}% sure there are parts of this text that contain AI-written text
        </h1>
      ) : null}

      <div className="flex flex-col space-y-4 bg-white p-4 rounded-md h-[400px] overflow-y-auto">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {aiReply && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            conversation();
            setUserText('');
          }}
          className="flex space-x-2"
        >
          <input
            placeholder="Continue the conversation..."
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            className="flex-1 px-4 py-2 rounded border border-gray-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}

export default Text;

