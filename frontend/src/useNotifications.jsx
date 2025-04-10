import { useEffect, useRef, useState } from "react";
import SockJS from 'sockjs-client/dist/sockjs';
import Stomp from "stompjs";

const useNotifications = (userId, onMessage) => {
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const sock = new SockJS("http://localhost:8080/ws");

    const client = Stomp.over(sock);
    client.connect(
      { Authorization: `Bearer ${jwt}` }, 
      () => {
        setStompClient(client);
        client.subscribe(`/topic/notifications/${userId}`, (message) => {
          const notification = JSON.parse(message.body);
          onMessage(notification);
        });
      },
      (error) => {
        console.error("STOMP connection error:", error);
      }
    );

    return () => {
      if (client.connected) {
        client.disconnect();
      }
    };
  }, [userId]);
  return stompClient;
};

export default useNotifications;
