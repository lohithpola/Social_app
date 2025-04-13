import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  TextField,
  Avatar,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

const SinglePost = () => {
  const { postId } = useParams();
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const [postData, setPostData] = useState(null);
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(0);
  const [username1, setuserName] = useState("");
  const [likedData, setLikedData] = useState([]);
  const [likeDialog, setLikeDialog] = useState(false);
  const [commentsData, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentDialog, setCommentDialog] = useState(false);
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response2 = await axios.get(`http://localhost:8080/getUser`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setuserName(response2.data.username);
        setUserId(response2.data.id);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    const fetchLike = async () => {
      try {
        const res1 = await axios.get(`http://localhost:8080/getLike/${postId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setLiked(res1.data);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchUsername();
    fetchLike();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/getComments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleOpenComments = () => {
    fetchComments();
    setCommentDialog(true);
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/deleteComment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setComments(commentsData.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/setComment/${postId}`,
        { content: newComment, userName: username1 },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Add new comment to the beginning of the list
      setComments([response.data, ...commentsData]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleShowLikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/getLikeData/${postId}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setLikedData(response.data);
      setLikeDialog(true);
    } catch (error) {
      console.error("Error fetching liked users:", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/getPost/${postId}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        setPostData(response.data);
        setLike(response.data.likes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    const newLikes = liked ? like - 1 : like + 1;
    setLiked(!liked);
    setLike(newLikes);

    try {
      if (!liked) {
        await axios.post(
          `http://localhost:8080/updateLike/${postId}`,
          { userName: username1 },
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
      } else {
        await axios.delete(`http://localhost:8080/deleteLike/${postId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
      }

      const response = await axios.post(
        `http://localhost:8080/updatePost/${postId}`,
        { likes: newLikes },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPostData(response.data);
    } catch (error) {
      console.error("Error updating likes:", error);
      // Revert UI changes on error
      setLiked(liked);
      setLike(like);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!postData) return <Typography>Post not found</Typography>;

  return (
    <Card
      sx={{ maxWidth: 600, margin: "20px auto", boxShadow: 3, borderRadius: 2 }}
    >
      {postData.user && (
        <CardHeader
          avatar={
            <Avatar
              src={
                postData.user.profilePic
                  ? `data:image/png;base64,${postData.user.profilePic}`
                  : undefined
              }
              alt={postData.user.userName || "User"}
            />
          }
          title={postData.user.userName || "User"}
          subheader={new Date(postData.timeStamp).toLocaleString()}
        />
      )}

      {postData.mediaUrl && (
        <CardMedia
          component="img"
          image={`data:image/png;base64,${postData.mediaUrl}`}
          alt="Post media"
          sx={{ maxHeight: 500, objectFit: "cover" }}
        />
      )}

      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <IconButton
            color={liked ? "error" : "default"}
            onClick={handleLike}
          >
            <FavoriteIcon />
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            <Button
              onClick={handleShowLikes}
              size="small"
              sx={{ textTransform: "none", minWidth: "auto", padding: 0 }}
            >
              {like} {like === 1 ? "like" : "likes"}
            </Button>
          </Typography>
          <IconButton onClick={handleOpenComments}>
            <CommentIcon />
          </IconButton>
        </Box>

        <Typography variant="body1">
          <strong>{postData.user?.userName || "User"}</strong> {postData.content}
        </Typography>
      </CardContent>

      {/* Comments Dialog */}
      <Dialog
        open={commentDialog}
        onClose={() => setCommentDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2, maxHeight: "300px", overflow: "auto" }}>
            {commentsData.length > 0 ? (
              [...commentsData]
                .sort(
                  (a, b) => {
                    // Check various possible timestamp field names
                    const dateA = a.timestamp || a.timeStamp || a.createdAt || a.created_at || 0;
                    const dateB = b.timestamp || b.timeStamp || b.createdAt || b.created_at || 0;
                    return new Date(dateB) - new Date(dateA);
                  }
                )
                .map((comment) => (
                  <Box
                    key={comment.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                      p: 1,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Typography variant="body2">
                      <strong>{comment.userName}</strong> {comment.content}
                    </Typography>
                    {comment.userName === username1 && (
                      <IconButton
                        size="small"
                        onClick={() => handleCommentDelete(comment.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ p: 2, textAlign: "center" }}
              >
                No comments yet
              </Typography>
            )}
          </Box>
        </DialogContent>
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <IconButton
            disabled={!newComment.trim()}
            onClick={handleCommentSubmit}
            color="primary"
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Dialog>

      {/* Likes Dialog */}
      <Dialog open={likeDialog} onClose={() => setLikeDialog(false)}>
        <DialogTitle>Liked by</DialogTitle>
        <DialogContent>
          {likedData.length === 0 ? (
            <DialogContentText>No likes yet</DialogContentText>
          ) : (
            likedData.map((user, index) => (
              <Typography key={index}>{user.userName}</Typography>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLikeDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SinglePost;