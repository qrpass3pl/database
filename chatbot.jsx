import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, BookOpen, Code2, Lightbulb, RotateCcw } from 'lucide-react';

export default function ProgrammingChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm your programming learning companion. I'll adapt to your level and style. What's your current programming experience?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    experience: null, // 'beginner', 'intermediate', 'advanced'
    languages: [],
    learningStyle: null, // 'visual', 'hands-on', 'theoretical', 'mixed'
    interests: [],
    conversationCount: 0
  });
  
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractUserProfile = (text) => {
    const lowerText = text.toLowerCase();
    let profile = { ...userProfile };
    let updated = false;

    // Detect experience level
    if (!profile.experience) {
      if (lowerText.match(/beginner|start|new|learning|never|first/)) {
        profile.experience = 'beginner';
        updated = true;
      } else if (lowerText.match(/intermediate|few years|some experience|decent|know/)) {
        profile.experience = 'intermediate';
        updated = true;
      } else if (lowerText.match(/advanced|expert|senior|years of|professional|deep/)) {
        profile.experience = 'advanced';
        updated = true;
      }
    }

    // Detect programming languages
    const languages = ['javascript', 'python', 'java', 'cpp', 'c\+\+', 'csharp', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'typescript', 'scala'];
    languages.forEach(lang => {
      if (lowerText.includes(lang) && !profile.languages.includes(lang)) {
        profile.languages.push(lang);
        updated = true;
      }
    });

    // Detect learning style
    if (!profile.learningStyle) {
      if (lowerText.match(/show|diagram|visual|picture|example/)) {
        profile.learningStyle = 'visual';
        updated = true;
      } else if (lowerText.match(/code|build|project|hands-on|create/)) {
        profile.learningStyle = 'hands-on';
        updated = true;
      } else if (lowerText.match(/explain|why|concept|theory|understand/)) {
        profile.learningStyle = 'theoretical';
        updated = true;
      }
    }

    // Detect interests
    const interests = ['web', 'mobile', 'game', 'data', 'ai', 'ml', 'backend', 'frontend', 'devops', 'security', 'database', 'api'];
    interests.forEach(interest => {
      if (lowerText.includes(interest) && !profile.interests.includes(interest)) {
        profile.interests.push(interest);
        updated = true;
      }
    });

    if (updated) {
      setUserProfile(profile);
    }

    return profile;
  };

  const generateBotResponse = async (text, profile) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let response = '';
    const lowerText = text.toLowerCase();

    // Personalized response based on profile
    if (!profile.experience) {
      if (lowerText.match(/beginner|start|new|hello|hi/i)) {
        response = "Great! Welcome to your learning journey! 🚀\n\nI'll tailor everything to your pace:\n• I'll use simple explanations without jargon\n• I'll provide lots of hands-on examples\n• I'll break concepts into small, digestible chunks\n\nWhat programming language would you like to start with? (Python, JavaScript, Java, etc.)";
      } else {
        response = "Awesome! As a beginner, I'll make sure to explain things clearly without overwhelming you. What specific area interests you? Web development, data science, game development, or something else?";
      }
    } else if (profile.experience === 'beginner') {
      if (lowerText.match(/help|stuck|error|problem|debug/)) {
        response = "No problem! Let's break it down step by step. Can you:\n1. Share the error message you're seeing\n2. Show me the code snippet that's causing issues\n3. Tell me what you expected to happen\n\nI'll help you understand what went wrong and how to fix it! 💡";
      } else if (lowerText.match(/how|what|why|explain/)) {
        response = `I see you want to understand the concepts better. Since you're ${profile.experience}, I'll explain this in simple terms with examples.\n\nWhat would you like me to explain?`;
      } else {
        response = "Got it! Here's a beginner-friendly approach:\n\n**Step-by-step guide:**\n1. Start with the basics\n2. Practice with small examples\n3. Build a small project\n4. Debug and learn\n\nI'm here to guide you through each step. What would you like to tackle first?";
      }
    } else if (profile.experience === 'intermediate') {
      response = "Nice! With your intermediate level, I can dive deeper into best practices and architectural patterns.\n\n**I can help with:**\n• Design patterns and architecture\n• Performance optimization\n• Testing and debugging\n• Industry best practices\n\nWhat's on your mind? 🎯";
    } else if (profile.experience === 'advanced') {
      response = "Excellent! Let's discuss advanced topics:\n\n**I can help with:**\n• System design and architecture\n• Performance optimization at scale\n• Advanced debugging techniques\n• Emerging technologies\n• Code review and mentoring\n\nWhat challenge are you working on? 🔥";
    }

    // Mention detected interests
    if (profile.interests.length > 0) {
      response += `\n\n✨ I noticed you're interested in: ${profile.interests.join(', ')}. I'll keep this in mind!`;
    }

    if (profile.languages.length > 0) {
      response += `\n📚 Using: ${profile.languages.join(', ')}`;
    }

    setIsLoading(false);
    return response;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const updatedProfile = extractUserProfile(input);
    
    const botResponse = await generateBotResponse(input, updatedProfile);
    
    const botMessage = {
      id: messages.length + 2,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const resetProfile = () => {
    setUserProfile({
      experience: null,
      languages: [],
      learningStyle: null,
      interests: [],
      conversationCount: 0
    });
    setMessages([{
      id: 1,
      text: "Hi! 👋 I'm your programming learning companion. I'll adapt to your level and style. What's your current programming experience?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 900px;
          margin: 0 auto;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(88, 28, 135, 0.3) 100%);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          border: 1px solid rgba(168, 85, 247, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .chat-header {
          background: linear-gradient(90deg, #a855f7 0%, #6d28d9 100%);
          padding: 24px;
          text-align: center;
          border-bottom: 1px solid rgba(168, 85, 247, 0.3);
        }

        .header-title {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .header-subtitle {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 8px;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          animation: slideIn 0.3s ease-out;
          word-wrap: break-word;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 70%;
          padding: 14px 18px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.6;
          word-wrap: break-word;
        }

        .message.bot .message-bubble {
          background: rgba(88, 28, 135, 0.4);
          border: 1px solid rgba(168, 85, 247, 0.3);
          color: rgba(255, 255, 255, 0.95);
          border-radius: 16px 16px 16px 4px;
        }

        .message.user .message-bubble {
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
          color: white;
          border-radius: 16px 16px 4px 16px;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
        }

        .input-area {
          padding: 20px 24px;
          border-top: 1px solid rgba(168, 85, 247, 0.2);
          background: rgba(15, 23, 42, 0.4);
        }

        .input-form {
          display: flex;
          gap: 12px;
        }

        .input-field {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 14px;
          transition: all 0.2s;
        }

        .input-field:focus {
          outline: none;
          border-color: rgba(168, 85, 247, 0.6);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .send-btn, .reset-btn, .profile-btn {
          padding: 12px 18px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .send-btn {
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
          color: white;
          min-width: 100px;
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(168, 85, 247, 0.4);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .reset-btn {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .reset-btn:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .profile-btn {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .profile-btn:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .control-buttons {
          display: flex;
          gap: 8px;
          padding: 0 24px 16px;
          justify-content: center;
        }

        .profile-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .profile-content {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(88, 28, 135, 0.4) 100%);
          padding: 32px;
          border-radius: 20px;
          border: 1px solid rgba(168, 85, 247, 0.3);
          max-width: 400px;
          color: white;
          max-height: 80vh;
          overflow-y: auto;
        }

        .profile-section {
          margin-bottom: 24px;
        }

        .profile-section h3 {
          color: #a855f7;
          margin: 0 0 8px 0;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .profile-item {
          padding: 8px 12px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 4px;
          color: rgba(255, 255, 255, 0.9);
        }

        .loading-dots {
          display: inline-flex;
          gap: 4px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a855f7;
          animation: bounce 1.4s infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-8px); }
        }

        .messages-area::-webkit-scrollbar {
          width: 8px;
        }

        .messages-area::-webkit-scrollbar-track {
          background: rgba(168, 85, 247, 0.1);
          border-radius: 10px;
        }

        .messages-area::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 10px;
        }

        .messages-area::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>

      <div className="chat-container">
        <div className="chat-header">
          <h1 className="header-title">
            <Zap size={28} />
            CodeMentor AI
          </h1>
          <p className="header-subtitle">Adaptive programming learning assistant</p>
        </div>

        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-bubble">
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot">
              <div className="message-bubble">
                <span className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="control-buttons">
          <button className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
            <BookOpen size={16} />
            Your Profile
          </button>
          <button className="reset-btn" onClick={resetProfile}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="input-area">
          <form className="input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="input-field"
              placeholder="Ask anything about programming..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
              Send
            </button>
          </form>
        </div>
      </div>

      {showProfile && (
        <div className="profile-modal" onClick={() => setShowProfile(false)}>
          <div className="profile-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={20} />
              Your Learning Profile
            </h2>

            <div className="profile-section">
              <h3>Experience Level</h3>
              <div className="profile-item">
                {userProfile.experience ? userProfile.experience.charAt(0).toUpperCase() + userProfile.experience.slice(1) : 'Not yet detected'}
              </div>
            </div>

            <div className="profile-section">
              <h3>Languages</h3>
              {userProfile.languages.length > 0 ? (
                userProfile.languages.map(lang => (
                  <div key={lang} className="profile-item">
                    {lang.toUpperCase()}
                  </div>
                ))
              ) : (
                <div className="profile-item">Not yet detected</div>
              )}
            </div>

            <div className="profile-section">
              <h3>Learning Style</h3>
              <div className="profile-item">
                {userProfile.learningStyle ? userProfile.learningStyle.charAt(0).toUpperCase() + userProfile.learningStyle.slice(1) : 'Not yet detected'}
              </div>
            </div>

            <div className="profile-section">
              <h3>Interests</h3>
              {userProfile.interests.length > 0 ? (
                userProfile.interests.map(interest => (
                  <div key={interest} className="profile-item">
                    {interest.toUpperCase()}
                  </div>
                ))
              ) : (
                <div className="profile-item">Not yet detected</div>
              )}
            </div>

            <div className="profile-section" style={{ marginBottom: 0, marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(168, 85, 247, 0.2)' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                💡 <strong>How it works:</strong> The more you chat, the better I understand your needs. Tell me about your experience, interests, and learning preferences for personalized help!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}