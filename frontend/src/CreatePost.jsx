import React, { useState } from "react";
import { Button, TextField, Box, Typography, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";

export default function CreatePost() {
  const [comment, setComment] = useState("");
  const [media, setMedia] = useState(null);
  const jwt1 = JSON.parse(localStorage.getItem("jwt"));
    const header={
        headers:{
            Authorization:`Bearer ${jwt1}`,
            "Content-Type": "application/json"
        }
    } 
  console.log(jwt1);
  const [message, setMessage] = useState("");

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; 
        setMedia(base64String);
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      content: comment,
      mediaUrl: media, 
    };

    console.log("Post submitted:", postData);

    try {
        const response=await axios.post(`http://localhost:8080/createPost`, postData, header);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }

    setComment("");
    setMedia(null);
  };

  return message ? (
    <Typography variant="h4">{message}</Typography>
  ) : (
    <Box
      sx={{
        p: 3,
        maxWidth: 400,
        mx: "auto",
        textAlign: "center",
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Create Post
      </Typography>
      <input
        accept="image/*,video/*"
        style={{ display: "none" }}
        id="media-upload"
        type="file"
        onChange={handleMediaUpload}
      />
      <label htmlFor="media-upload">
        <IconButton color="primary" component="span">
          <PhotoCamera fontSize="large" />
        </IconButton>
      </label>
      {media && (
        <img
          src={`data:image/png;base64,${media}`}
          alt="preview"
          style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
        />
      )}
      <TextField
        fullWidth
        multiline
        rows={2}
        variant="outlined"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
        Post
      </Button>
    </Box>
  );
}
