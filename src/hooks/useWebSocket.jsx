import { useState, useEffect, useCallback, useRef } from 'react';

const useWebSocket = (token) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);

  const connect = useCallback(() => {
    if (socketRef.current || isConnectingRef.current) return;

    isConnectingRef.current = true;
    const ws = new WebSocket('ws://localhost:8080/ws');
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      isConnectingRef.current = false;
      // Send authentication message immediately after connection
      ws.send(
        JSON.stringify({
          type: 'authentication',
          token: `${token}`,
        })
      );
      console.log('Authentication message sent');
    };

    ws.onmessage = (event) => {
      setLastMessage(event);
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      console.log(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
      socketRef.current = null;
      isConnectingRef.current = false;
      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => connect(), 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnectingRef.current = false;
    };
  }, [token]);

  const sendMessage = useCallback((message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      console.log('Message sent:', message);
    } else {
      console.warn('WebSocket is not connected. Unable to send message.');
    }
  }, []);

  useEffect(() => {
    if (token) {
      connect();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect, token]);

  return { sendMessage, lastMessage, isConnected, connect };
};

export default useWebSocket;
