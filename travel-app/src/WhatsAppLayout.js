import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Layout from './Layout';
import './WhatsAppLayout.css';

const WhatsAppLayout = () => {
  const { userId, otherUserId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastMessageId, setLastMessageId] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch conversations and initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Always fetch conversations
        const convRes = await axios.get(`http://127.0.0.1:8000/chat/conversations/${userId}`);
        setConversations(convRes.data.conversations);
        
        // Only fetch user details and messages if otherUserId is provided
        if (otherUserId) {
          const userRes = await axios.get(`http://127.0.0.1:8000/users/${otherUserId}`);
          setOtherUser(userRes.data);
          
          const messagesRes = await axios.get(
            `http://127.0.0.1:8000/chat/messages/${userId}/${otherUserId}`
          );
          setMessages(messagesRes.data.messages || []);
          
          if (messagesRes.data.messages?.length > 0) {
            setLastMessageId(
              messagesRes.data.messages[messagesRes.data.messages.length - 1].message_id
            );
          }
        }
      } catch (err) {
        console.error('Initial load error:', err);
        setError(err.response?.data?.detail || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userId, otherUserId]);

  // Poll for new messages when a conversation is selected
  useEffect(() => {
    let timeoutId;
    const checkInterval = 2000;

    const checkForNewMessages = async () => {
      if (isChecking || !lastMessageId || !otherUserId) return;
      
      setIsChecking(true);
      try {
        const hasNewRes = await axios.get(
          `http://127.0.0.1:8000/chat/has-new-messages/${userId}/${otherUserId}/${lastMessageId}`
        );
        
        if (hasNewRes.data) {
          const messagesRes = await axios.get(
            `http://127.0.0.1:8000/chat/messages/${userId}/${otherUserId}`
          );
          
          setMessages(messagesRes.data.messages || []);
          
          if (messagesRes.data.messages?.length > 0) {
            setLastMessageId(
              messagesRes.data.messages[messagesRes.data.messages.length - 1].message_id
            );
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      } finally {
        setIsChecking(false);
        timeoutId = setTimeout(checkForNewMessages, checkInterval);
      }
    };

    if (lastMessageId && otherUserId) {
      timeoutId = setTimeout(checkForNewMessages, checkInterval);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [userId, otherUserId, lastMessageId, isChecking]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !otherUserId) return;
  
    const tempMessage = {
      sender_id: parseInt(userId),
      receiver_id: parseInt(otherUserId),
      message: newMessage,
      message_id: Date.now(),
      timestamp: new Date().toISOString()
    };
  
    try {
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
  
      const messageToSend = {
        sender_id: tempMessage.sender_id,
        receiver_id: tempMessage.receiver_id,
        message: tempMessage.message
      };
      await axios.post('http://127.0.0.1:8000/chat/messages', messageToSend);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      setMessages(prev => prev.filter(m => m.message_id !== tempMessage.message_id));
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="whatsapp-loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="whatsapp-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="whatsapp-container">
        {/* Left sidebar - Conversation list */}
        <div className="conversation-sidebar">
          <div className="sidebar-header">
            <h2>Chats</h2>
          </div>
          
          {conversations.length === 0 ? (
            <div className="no-conversations">
              <p>No conversations yet. Start chatting with your matches!</p>
            </div>
          ) : (
            <div className="conversation-list">
              {conversations.map((conv) => (
                <Link
                  key={conv.other_user_id}
                  to={`/chat/${userId}/${conv.other_user_id}`}
                  className={`conversation-item ${otherUserId === conv.other_user_id.toString() ? 'active' : ''}`}
                >
                  <img 
                    src={`https://www.gravatar.com/avatar/${conv.other_user_id}?d=identicon`} 
                    alt={conv.first_name} 
                    className="conversation-avatar"
                  />
                  <div className="conversation-info">
                    <h3>{conv.first_name} {conv.last_name}</h3>
                    <p className="last-message-preview">
                      {conv.last_message?.substring(0, 30)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right side - Chat area */}
        <div className="chat-area">
          {otherUserId ? (
            <>
              <div className="chat-header">
                {otherUser && (
                  <div className="chat-user-info">
                    <img 
                      src={`https://www.gravatar.com/avatar/${otherUserId}?d=identicon`} 
                      alt={otherUser.first_name} 
                      className="chat-avatar"
                    />
                    <h3>{otherUser.first_name} {otherUser.last_name}</h3>
                  </div>
                )}
              </div>

              <div className="chat-messages">
                {messages.map((msg) => (
                  <div 
                    key={msg.message_id} 
                    className={`message ${msg.sender_id == userId ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{msg.message}</p>
                      <span className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows="1"
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim() || isChecking || !otherUserId}
                >
                  {isChecking ? '...' : 'Send'}
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="welcome-message">
                <h3>Welcome to your chats!</h3>
                <p>Select a conversation from the sidebar to start chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WhatsAppLayout;