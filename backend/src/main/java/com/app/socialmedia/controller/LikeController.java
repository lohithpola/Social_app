package com.app.socialmedia.controller;

import com.app.socialmedia.model.Likes;
import com.app.socialmedia.service.JWTService;
import com.app.socialmedia.service.LikeService;
import com.app.socialmedia.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LikeController {

    @Autowired
    private LikeService likeService;
    @Autowired
    private JWTService jwtService;

    @PostMapping("/updateLike/{postId}")
    public ResponseEntity<Likes> updateLike(@RequestBody Likes likes, @PathVariable long postId) {
        return new ResponseEntity<>(likeService.likePost(likes,postId), HttpStatus.CREATED);
    }

    @GetMapping("/getLikeData/{postId}")
    public ResponseEntity<List<Likes>> getLikeData(@PathVariable long postId) {
        return new ResponseEntity<>(likeService.getLikes(postId), HttpStatus.OK);
    }

    @GetMapping("/getLike/{postId}")
    public ResponseEntity<Boolean> getLike(HttpServletRequest request, @PathVariable long postId) {
        String authHeader = request.getHeader("Authorization");
        String username = jwtService.extractUserName(authHeader.substring(7));
        return new ResponseEntity<>(likeService.isPostLiked(username, postId), HttpStatus.OK);
    }

    @DeleteMapping("/deleteLike/{postId}")
    public ResponseEntity<Boolean> deleteLike(HttpServletRequest request, @PathVariable long postId) {
        String authHeader = request.getHeader("Authorization");
        String username = jwtService.extractUserName(authHeader.substring(7));
        return new ResponseEntity<>(likeService.removeLike(username, postId), HttpStatus.OK);
    }
}
