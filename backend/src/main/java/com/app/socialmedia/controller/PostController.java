package com.app.socialmedia.controller;

import com.app.socialmedia.dto.PostDto;
import com.app.socialmedia.model.Likes;
import com.app.socialmedia.model.Post;
import com.app.socialmedia.service.JWTService;
import com.app.socialmedia.service.PostService;
import com.app.socialmedia.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class PostController {

    @Autowired
    private PostService postService;
    @Autowired
    private JWTService jwtService;

    @PostMapping("/createPost")
    public ResponseEntity<Post> createPost(@RequestBody PostDto postDto, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String username = jwtService.extractUserName(authHeader.substring(7));
        Post post = postService.createpost(username, postDto);
        return new ResponseEntity<>(post, HttpStatus.CREATED);
    }

    @GetMapping("getPost/{id}")
    public ResponseEntity<Post> getPost(@PathVariable long id) {
        return new ResponseEntity<>(postService.getpost(id), HttpStatus.OK);
    }

    @PostMapping("/updatePost/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable long id, @RequestBody Map<String, Integer> requestBody) {
        Integer likes = requestBody.get("likes");
        return new ResponseEntity<>(postService.updatepost(id, likes), HttpStatus.OK);
    }


}

