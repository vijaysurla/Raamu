import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m Raamu, your AI learning companion. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: 'I understand your question. Let me help you with that...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <Card className="chat-card">
          <CardHeader className="chat-header">
            <div className="chat-header-content">
              <Sparkles size={24} className="text-primary" />
              <div>
                <h2>Chat with Raamu</h2>
                <p className="text-secondary">Your AI Learning Companion</p>
              </div>
            </div>
          </CardHeader>

          <CardBody className="chat-body">
            <div className="messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-content">
                    {message.type === 'bot' && (
                      <div className="message-avatar">
                        <Sparkles size={16} />
                      </div>
                    )}
                    <div className="message-bubble">
                      <p>{message.content}</p>
                      <span className="message-time">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input-container">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about physics..."
                className="chat-input"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                <Send size={20} />
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="suggestions-card">
          <CardHeader>
            <h3>Suggested Questions</h3>
          </CardHeader>
          <CardBody>
            <div className="suggestions-list">
              <button
                className="suggestion-button"
                onClick={() => setInputMessage('What is friction?')}
              >
                What is friction?
              </button>
              <button
                className="suggestion-button"
                onClick={() => setInputMessage('Explain Newton\'s laws')}
              >
                Explain Newton's laws
              </button>
              <button
                className="suggestion-button"
                onClick={() => setInputMessage('How does pressure work?')}
              >
                How does pressure work?
              </button>
              <button
                className="suggestion-button"
                onClick={() => setInputMessage('Examples of force in daily life')}
              >
                Examples of force in daily life
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
