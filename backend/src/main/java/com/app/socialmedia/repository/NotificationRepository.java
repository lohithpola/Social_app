package com.app.socialmedia.repository;

import com.app.socialmedia.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByTimeStampDesc(Long userId);
}
