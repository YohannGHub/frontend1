import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export const useWebSocket = (url?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const wsUrl = url || `ws://localhost:5000/ws`;

  useEffect(() => {
    // ⛔ On désactive complètement la connexion WebSocket
    console.warn('WebSocket désactivé — route /ws non supportée par le backend.');

    // 🧘 Tu peux réactiver ce bloc plus tard si tu crées une vraie route WebSocket :
    /*
    const connect = () => {
      try {
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          console.log('WebSocket connecté');
          setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            setLastMessage(message);
            setMessages(prev => [...prev, message].slice(-100));
          } catch (error) {
            console.error('Erreur parsing WebSocket message:', error);
          }
        };

        ws.current.onclose = () => {
          console.log('WebSocket déconnecté');
          setIsConnected(false);
          setTimeout(connect, 3000);
        };

        ws.current.onerror = (error) => {
          console.error('Erreur WebSocket:', error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Erreur connexion WebSocket:', error);
        setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
    */
  }, [wsUrl]);

  const sendMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket non connecté');
    }
  };

  return {
    isConnected: false,
    lastMessage: null,
    messages: [],
    sendMessage,
  };
};
