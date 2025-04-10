package com.app.socialmedia.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.List;
import java.util.Map;

@Component
public class CustomHandshakeInterceptor implements HandshakeInterceptor {
    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) throws Exception {
        // Read JWT from headers
        List<String> authHeader = request.getHeaders().get("Authorization");
        System.out.println(authHeader);

        if (authHeader != null && !authHeader.isEmpty()) {
            String token = authHeader.get(0).replace("Bearer ", "");
            // ✅ validate token here if needed
            attributes.put("token", token);
            return true;
        }

        System.out.println("JWT not present in WebSocket handshake!");
        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
    }
}
