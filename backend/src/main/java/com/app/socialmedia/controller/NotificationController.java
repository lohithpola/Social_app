//package com.app.socialmedia.controller;
//
//import com.app.socialmedia.model.Notification;
//import com.app.socialmedia.model.Users;
//import com.app.socialmedia.repository.UserRepo;
//import com.app.socialmedia.service.NotificationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Date;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//public class NotificationController {
//
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;
//
//    @Autowired
//    private NotificationService notificationService;
//
//    @Autowired
//    private UserRepo userRepository;
//
//    @MessageMapping("/notify") // Frontend sends to /app/notify
//    @SendTo("/topic/notifications/{userId}")
//    public void sendNotification(@Payload Map<String, Object> payload) {
//        Long toUserId = Long.valueOf(payload.get("toUserId").toString());
//        String type = payload.get("type").toString();
//        String fromUserName = payload.get("fromUserName").toString();
//        Users user = userRepository.findById(toUserId).orElseThrow();
//        Notification notification = new Notification();
//        notification.setUser(user);
//        notification.setType(type);
//        notification.setContent(fromUserName + (type.equals("like") ? " liked your post." : " commented on your post."));
//        notification.setTimeStamp(new Date());
//        notification.setRead(false);
//
//        notificationService.saveNotification(notification);
//    }
//    @GetMapping("/user/{userId}")
//    public List<Notification> getNotifications(@PathVariable Long userId) {
//        return notificationService.getUserNotifications(userId);
//    }
//
//}
