package com.app.socialmedia.controller;

import com.app.socialmedia.model.Comment;
import com.app.socialmedia.service.CommentService;
import com.app.socialmedia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/setComment/{postId}")
    public ResponseEntity<Comment> setComment(@PathVariable long postId, @RequestBody Comment comment) {
        return new ResponseEntity<>(commentService.addComment(comment, postId), HttpStatus.OK);
    }

    @GetMapping("getComments/{postId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable long postId) {
        return new ResponseEntity<>(commentService.getComments(postId), HttpStatus.OK);
    }

    @DeleteMapping("/deleteComment/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }
}
