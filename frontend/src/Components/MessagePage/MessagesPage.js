import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from '../../Login/Header';

function MessagesPage({ currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const [adminId, setAdminId] = useState('');

  // Static adminId set here
  const staticAdminId = '680633e28b7652df112c297b';  // Provided admin MongoDB ID

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/messages/user/${currentUserId}`);
        setMessages(res.data);

        // Set the static adminId directly
        setAdminId(staticAdminId);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentUserId]);

  // Send new text message
  const sendMessage = async () => {
    if (!newText.trim()) return;

    if (!staticAdminId) {
      alert('Cannot send message: No admin found yet.');
      return;
    }

    try {
      await axios.post('http://localhost:4000/messages/send', {
        senderId: currentUserId,
        receiverId: staticAdminId,
        text: newText
      });
      setNewText('');
      alert('Message sent!');

      // Refresh messages
      const res = await axios.get(`http://localhost:4000/messages/user/${currentUserId}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  return (
    <>
    <Header/>
    <MessagesContainer>
      <h2>Your Messages</h2>

      <MessagesList>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <MessageItem key={msg._id}>
              <p>{msg.text}</p>
              {msg.fileUrl && (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                  📄 View Prescription
                </a>
              )}
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
            </MessageItem>
          ))
        )}
      </MessagesList>

      <NewMessageSection>
        <textarea 
          value={newText} 
          onChange={(e) => setNewText(e.target.value)} 
          placeholder="Type your message..." 
        />
        <button onClick={sendMessage}>Send Message</button>
      </NewMessageSection>
    </MessagesContainer>
    </>
  );
}

export default MessagesPage;

// Styled Components
const MessagesContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const MessagesList = styled.div`
  margin-bottom: 2rem;
`;

const MessageItem = styled.div`
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: #f7f7f7;
  border-radius: 8px;
  
  p {
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  a {
    color: #007bff;
    text-decoration: underline;
    font-size: 0.9rem;
  }
  
  small {
    display: block;
    margin-top: 0.5rem;
    color: #777;
    font-size: 0.75rem;
  }
`;

const NewMessageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  textarea {
    width: 100%;
    height: 80px;
    padding: 10px;
    resize: none;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 0.9rem;
  }

  button {
    align-self: flex-end;
    background: #007bff;
    color: white;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: #0056b3;
    }
  }
`;
