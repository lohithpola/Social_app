package com.app.socialmedia.config;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class MyWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming messages
        String payload = message.getPayload();
        System.out.println("Received message: " + payload);

        // Send a response back to the client
        session.sendMessage(new TextMessage("Hello from server!"));
    }
}
