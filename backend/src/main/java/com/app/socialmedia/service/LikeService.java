package com.app.socialmedia.service;

import com.app.socialmedia.exception.LikeNotFoundException;
import com.app.socialmedia.exception.PostNotFoundException;
import com.app.socialmedia.model.Likes;
import com.app.socialmedia.model.Post;
import com.app.socialmedia.repository.LikeRepo;
import com.app.socialmedia.repository.PostRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeService {

    @Autowired
    private PostRepo postRepo;
    @Autowired
    private LikeRepo likeRepo;

    public Likes likePost(Likes likes, long postId) {
        Post post = postRepo.findById(postId).orElseThrow(() -> new PostNotFoundException("Post not found with Id"+postId));
        likes.setPost(post);
        return likeRepo.save(likes);
    }

    public boolean isPostLiked(String username, long postId) {
        Post post = postRepo.findById(postId).orElseThrow(()->new PostNotFoundException("Post not found with Id"+postId));
        return likeRepo.findByUserNameAndPost(username, post) != null;
    }

    public boolean removeLike(String username, long postId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + postId));

        Likes like = likeRepo.findByUserNameAndPost(username, post);
        if (like == null) {
            throw new LikeNotFoundException("Like not found for user: " + username + " on post ID: " + postId);
        }

        likeRepo.delete(like);
        return true;
    }


    public List<Likes> getLikes(long postId) {
        if (!postRepo.existsById(postId)) {
            throw new PostNotFoundException("Post not found with ID: " + postId);
        }
        return likeRepo.findByPostId(postId);
    }
}
