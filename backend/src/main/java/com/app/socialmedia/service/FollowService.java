package com.app.socialmedia.service;

import com.app.socialmedia.exception.FollowNotFoundException;
import com.app.socialmedia.exception.UserNotFoundException;
import com.app.socialmedia.model.Follow;
import com.app.socialmedia.model.Users;
import com.app.socialmedia.repository.FollowRepo;
import com.app.socialmedia.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowService {

    @Autowired
    private FollowRepo followRepo;
    @Autowired private UserRepo userRepo;

    public Follow followUser(Follow follow) {
        return followRepo.save(follow);
    }

    public List<Follow> getFollows(long followerId) {
        List<Follow> follows = followRepo.findByFollowerId(followerId);
        if (follows.isEmpty()) {
            throw new FollowNotFoundException("No follows found for user with ID: " + followerId);
        }
        return follows;
    }

    public boolean unfollowUser(String username, long followingId) {
        Users user = userRepo.findByUserName(username);
        if (user == null) {
            throw new UserNotFoundException("User not found with username: " + username);
        }

        long deleted = followRepo.deleteByFollowerIdAndFollowingId(user.getId(), followingId);
        if (deleted == 0) {
            throw new FollowNotFoundException("Follow relationship not found between " + username + " and user ID " + followingId);
        }
        return true;
    }

    public List<Follow> getFollowing(long userId) {
        if (!userRepo.existsById(userId)) {
            throw new UserNotFoundException("User with ID " + userId + " not found");
        }
        return followRepo.findByFollowerId(userId);
    }

    public List<Follow> getFollowers(long userId) {
        if (!userRepo.existsById(userId)) {
            throw new UserNotFoundException("User with ID " + userId + " not found");
        }
        return followRepo.findByFollowingId(userId);
    }
}