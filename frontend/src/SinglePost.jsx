import axios from "axios";
import { use, useEffect, useState } from "react";
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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import useNotifications from "./useNotifications";
import { useSafeLayoutEffect } from "@chakra-ui/react";

const SinglePost = () => {
  const { postId } = useParams();
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const [postData, setPostData] = useState(null);
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(0);
  const [username1, setuserName] = useState("");
  const [likedData, setLikedData] = useState([]);
  const [open, setOpen] = useState(false);
  const [commentsData, setComments] = useState({});
  const [Content, setContent] = useState("");
  const [commentOpen, setCommentOpen] = useState(false);
  const [loadComment, setCommentLoad] = useState(false);
  const [userId,setUserId]=useState(0);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response2 = await axios.get(`http://localhost:8080/getUser`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setuserName(response2.data.username);
        setUserId(response2.data.id);
      } catch (error) {
        console.log("Error fetching username");
      }
    };

    const fetchLike = async () => {
      try {
        const res1 = await axios.get(
          `http://localhost:8080/getLike/${postId}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        setLiked(res1.data);
      } catch (error) {
        console.log("Error fetching like status");
      }
    };

    fetchUsername();
    fetchLike();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const response6 = await axios.get(
        `http://localhost:8080/getComments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setComments(response6.data);
    };
    fetchComments();
  }, [loadComment]);

  const handleCommentDelete = async (id) => {
    setCommentLoad(!loadComment);
    const commentId = id;
    try {
      await axios.delete(`http://localhost:8080/deleteComment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    } catch (error) {
      console.log("error during delete comment");
    }
  };
  const handleContent = (e) => {
    const content1 = e.target.value;
    setContent(content1);
  };
  const handleComment = async () => {
    try {
      const response5 = await axios.post(
        `http://localhost:8080/setComment/${postId}`,
        { content: Content, userName: username1 },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      setComments([...commentsData, response5.data]);
      sendNotification("comment");

    } catch (error) {
      console.log("Error fetching comment");
    }
    setContent("");
  };

  const handleLikeData = async () => {
    try {
      const response4 = await axios.get(
        `http://localhost:8080/getLikeData/${postId}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setLikedData(response4.data);
    } catch (error) {
      console.log("Error fetching like data");
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
      } catch (error) {
        console.error("Error fetching post:", error);
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
        sendNotification("like");

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
    }
  };
  const stompClient = useNotifications(userId, () => {});
  const sendNotification = async(type) => {
    if (!postData) return;
  
    const payload = {
      toUserId: userId,
      type: type, // "like" or "comment"
      fromUserName: username1,
    };
    console.log(payload);
  
    stompClient.send("/app/notify", {}, JSON.stringify(payload));
  };
  

  if (!postData) return <Typography>Loading...</Typography>;

  return (
    <Card
      sx={{ maxWidth: 500, margin: "20px auto", boxShadow: 3, borderRadius: 2 }}
    >
      {postData.mediaUrl && (
        <CardMedia
          component="img"
          image={`data:image/png;base64,${postData.mediaUrl}`}
          alt="Post media"
          sx={{ maxHeight: 400, objectFit: "cover" }}
        />
      )}
      <CardHeader subheader={new Date(postData.timeStamp).toLocaleString()} />

      <CardContent>
        <Typography variant="body1">{postData.content}</Typography>
      </CardContent>

      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <IconButton color={liked ? "error" : "default"} onClick={handleLike}>
          <FavoriteIcon />
        </IconButton>
        <Typography variant="body2">
          {like}{" "}
          <Button
            onClick={() => {
              setOpen(true);
              handleLikeData();
            }}
            size="small"
            sx={{ textTransform: "none", minWidth: "auto", padding: 0 }}
          >
            Likes
          </Button>
        </Typography>
        <IconButton onClick={() => setCommentOpen(true)}>
          <CommentIcon />
        </IconButton>
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)}>
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
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent dividers>
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <input
              type="text"
              value={Content}
              onChange={handleContent}
              placeholder="Add a comment..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginRight: "8px",
              }}
            />
            <Button variant="contained" onClick={handleComment}>
              Post
            </Button>
          </div>

          {Array.isArray(commentsData) && commentsData.length > 0 ? (
            commentsData.map((comment, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {comment.userName}
                  </Typography>
                  <Typography variant="body2">{comment.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.timeStamp).toLocaleString()}
                  </Typography>
                </div>
                {comment.userName == username1 ? (
                  <>
                    <Button
                      onClick={() => handleCommentDelete(comment.id)}
                      size="small"
                      color="error"
                      variant="outlined"
                      sx={{ height: "30px" }}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))
          ) : (
            <DialogContentText>No comments yet</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SinglePost;
