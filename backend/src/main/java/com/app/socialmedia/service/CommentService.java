package com.app.socialmedia.service;

import com.app.socialmedia.exception.CommentNotFoundException;
import com.app.socialmedia.exception.PostNotFoundException;
import com.app.socialmedia.model.Comment;
import com.app.socialmedia.model.Post;
import com.app.socialmedia.repository.CommentRepo;
import com.app.socialmedia.repository.PostRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    @Autowired
    private PostRepo postRepo;
    @Autowired private CommentRepo commentRepo;

    public Comment addComment(Comment comment, long postId) {
        Post post = postRepo.findById(postId).orElseThrow(()->new PostNotFoundException("Post not found with ID:"+postId));
        comment.setPost(post);
        comment.setTimeStamp(new Date());
        return commentRepo.save(comment);
    }

    public List<Comment> getComments(long postId) {
        if (!postRepo.existsById(postId)) {
            throw new PostNotFoundException("Post not found with ID: " + postId);
        }
        return commentRepo.findByPostId(postId);
    }

    public void deleteComment(long commentId) {
        if (!commentRepo.existsById(commentId)) {
            throw new CommentNotFoundException("Comment not found with ID: " + commentId);
        }
        commentRepo.deleteById(commentId);
    }
}
