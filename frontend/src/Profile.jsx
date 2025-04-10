import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Avatar,
  Box,
  Grid,
  Card,
  CardMedia,
} from "@mui/material";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import Navbar from "./Navbar";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [allUsersData, setAllUsers] = useState([]);
  const [followerUsernames, setFollowerUsernames] = useState([]);
  const [followerDialogOpen, setFollowerDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);

  useEffect(() => {
    const getAllUsersData = async () => {
      try {
        const response3 = await axios.get("http://localhost:8080/getAllUsers", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setAllUsers(response3.data);
      } catch (error) {
        console.log("error fetching all users data");
      }
    };
    getAllUsersData();

    const getUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/getFullUser/${userId}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:",error);
      }
    };

    getUserData();

    const getFollowing = async () => {
      try {
        const response1 = await axios.get(
          `http://localhost:8080/following/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        setFollowing(response1.data);
      } catch (error) {
        console.log("error fetching following data",error);
      }
    };
    getFollowing();

    const getFollower = async () => {
      try {
        const response2 = await axios.get(
          `http://localhost:8080/follow/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        setFollowers(response2.data);
      } catch {
        console.log("error fetching follower count",error);
      }
    };
    getFollower();
  }, [jwt]);

  const handleFollowersClick = () => {
    const matchingUsers = followers
      .filter((f) => f.followingId === userData.id)
      .map((f) => allUsersData.find((u) => u.id === f.followerId))
      .filter(Boolean);

    setFollowerUsernames(matchingUsers);
    setFollowerDialogOpen(true);
  };

  const handleFollowingClick = () => {
    const matched = following
      .filter((f) => f.followerId === userData.id)
      .map((f) => allUsersData.find((u) => u.id === f.followingId))
      .filter(Boolean);

    setFollowingUsers(matched);
    setFollowingDialogOpen(true);
  };

  if (!userData) return <Typography>Loading...</Typography>;

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            mb: 4,
          }}
        >
          <Avatar
            src={`data:image/png;base64,${userData.imageData}`}
            sx={{ width: 120, height: 120, border: "2px solid #ddd" }}
          />
          <Box>
            <Typography variant="h5">{userData.userName}</Typography>
            <Box sx={{ display: "flex", gap: 4, mt: 1 }}>
              <Typography variant="body1">
                <strong>{userData.posts.length}</strong> posts
              </Typography>
              <Typography
                variant="body1"
                onClick={handleFollowersClick}
                sx={{ cursor: "pointer" }}
              >
                <strong>{followers.length}</strong> followers
              </Typography>
              <Dialog
                open={followerDialogOpen}
                onClose={() => setFollowerDialogOpen(false)}
                fullWidth
                maxWidth="xs"
              >
                <DialogTitle>Followers</DialogTitle>
                <DialogContent dividers>
                  {followerUsernames.length > 0 ? (
                    followerUsernames.map((user, idx) => (
                      <Box
                        key={idx}
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          src={`data:image/png;base64,${user.imageData}`}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Typography variant="body1">{user.userName}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography>No followers found</Typography>
                  )}
                </DialogContent>
              </Dialog>

              <Typography
                variant="body1"
                onClick={handleFollowingClick}
                sx={{ cursor: "pointer" }}
              >
                <strong>{following.length}</strong> following
              </Typography>
              <Dialog
                open={followingDialogOpen}
                onClose={() => setFollowingDialogOpen(false)}
                fullWidth
                maxWidth="sm"
              >
                <DialogTitle>Following</DialogTitle>
                <DialogContent dividers>
                  {followingUsers.length > 0 ? (
                    followingUsers.map((user, idx) => (
                      <Box
                        key={idx}
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          src={`data:image/png;base64,${user.imageData}`}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Typography variant="body1">
                          {user.userName}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography>No following users found</Typography>
                  )}
                </DialogContent>
              </Dialog>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={1}>
          {userData.posts && userData.posts.length > 0 ? (
            userData.posts.map((post, index) => (
              <Grid item xs={4} key={index}>
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {post.mediaUrl && (
                    <Link to={`/post/${post.id}`}>
                      <CardMedia
                        component="img"
                        image={`data:image/png;base64,${post.mediaUrl}`}
                        sx={{
                          width: "100%",
                          height: "200px",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                        }}
                      />
                    </Link>
                  )}
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No posts available</Typography>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Profile;
