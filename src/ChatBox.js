// src/components/Chatbox.js
import React, { useState } from 'react';
import axios from 'axios';
import './components/ChatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [chatSessionId, setChatSessionId] = useState(null);  // Track chat session
  const [sessionInput, setSessionInput] = useState('');  // Input for session ID

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      // Add the user's message to the chatbox
      setMessages([...messages, { message: inputValue, sender: 'You' }]);

      try {
        // Send the message to the backend
        const response = await axios.post('http://localhost:8000/api/chatbot', {
          message: inputValue,
          chat_session_id: chatSessionId,
        });

        // Update the chat session ID (if it's the first message)
        if (!chatSessionId) {
          setChatSessionId(response.data.chat_session_id);
        }

        // Add the bot's response to the chatbox
        setMessages(prevMessages => [
          ...prevMessages,
          { message: response.data.messages.slice(-1)[0].message, sender: 'Bot' }
        ]);

      } catch (error) {
        console.error('Error sending message:', error);
      }

      setInputValue('');  // Clear the input field
    }
  };

  const handleKeyPressSend = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleKeyPressSession = (e) => {
    if (e.key === 'Enter') {
      handleLoadSession();
    }
  };

  const handleSessionInputChange = (e) => {
    setSessionInput(e.target.value);
  };

  const handleLoadSession = async () => {
    if (sessionInput.trim()) {
      try {
        const response = await axios.get(`http://localhost:8000/api/chatbots/session/${sessionInput}`);
        setChatSessionId(sessionInput);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error loading session:', error);
      }
    }
  };

  return (
    <div className="chatbox">
      {/* Conditionally render the session ID as the title */}
      <div className="chatbox-title">
        {chatSessionId ? `Session ID: ${chatSessionId}` : 'New Chat Session'}
      </div>
      <div className="chatbox-messages">
        {messages.map((message, index) => (
          <div key={index} className="chatbox-message">
            <strong>{message.sender}: </strong>
            {message.message}
          </div>
        ))}
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPressSend}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          value={sessionInput}
          onChange={handleSessionInputChange}
          onKeyPress={handleKeyPressSession}
          placeholder="Enter Session ID"
        />
        <button onClick={handleLoadSession}>Send</button>
      </div>
    
    </div>
  );
};

export default ChatBox;
