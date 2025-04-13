import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Media from "./Media";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import api from "./api/axios";

const Home = () => {
  const [userName1, setUserName] = useState("");
  const [userId, setUserId] = useState(0);
  const [followList, SetFollowList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Combine all data fetching into one function
  const fetchData = async () => {
    setRefreshing(true);
    try {
      // Fetch user data
      const userResponse = await api.get("/getUser");
      setUserName(userResponse.data.username || userResponse.data.userName);
      setUserId(userResponse.data.id);
      
      // Fetch all users
      const usersResponse = await api.get("/getAllUsers");
      if (Array.isArray(usersResponse.data)) {
        setAllUsers(usersResponse.data);
      } else if (usersResponse.data && typeof usersResponse.data === 'object') {
        const arrayData = Object.values(usersResponse.data);
        setAllUsers(arrayData);
      } else {
        console.error("getAllUsers did not return valid data:", usersResponse.data);
        setAllUsers([]);
      }
      
      // If we got the user ID, fetch follow list
      if (userResponse.data.id) {
        try {
          const followResponse = await api.get(`/getFollow/${userResponse.data.id}`);
          SetFollowList(followResponse.data || []);
        } catch (error) {
          console.error("Error fetching follow list:", error);
          SetFollowList([]);
        }
      }
      
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  // Safely filter users
  const followingIds = Array.isArray(followList) 
    ? followList.map((follow) => follow.followingId) 
    : [];
    
  if (userId !== 0) {
    followingIds.push(userId);
  }
  
  // Only try to filter if allUsers is an array and has items
  const followedUsers = Array.isArray(allUsers) && allUsers.length > 0
    ? allUsers.filter((user) => user && user.id && followingIds.includes(user.id))
    : [];

  // Generate posts from users
  const posts = followedUsers
    .flatMap((user) => {
      // Check if user.posts exists and is an array
      if (!user || !user.posts || !Array.isArray(user.posts)) {
        return [];
      }
      
      return user.posts.map((post) => ({
        ...post,
        userName: user.userName,
        profilePic: user.imageData,
        userId1: user.id,
      }));
    })
    .sort((a, b) => {
      // Safely handle date comparison
      try {
        return new Date(b.timeStamp) - new Date(a.timeStamp);
      } catch (e) {
        console.error("Error sorting posts by date:", e);
        return 0;
      }
    });

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 600, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h1" sx={{ ml: 2 }}>
            Home Feed
          </Typography>
          <Button 
            variant="text" 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
        </Box>
        
        {error && (
          <Box sx={{ width: '100%', maxWidth: 600, mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error.dark">{error}</Typography>
            <Button variant="outlined" onClick={handleRefresh} sx={{ mt: 1 }}>
              Try Again
            </Button>
          </Box>
        )}

        {refreshing && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {posts.length === 0 ? (
          <Box sx={{ textAlign: "center", marginTop: "50px", p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No posts to show
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Follow some users to see their posts or create your own!
            </Typography>
            <Button variant="contained" color="primary" onClick={handleRefresh}>
              Refresh
            </Button>
          </Box>
        ) : (
          posts.map((post, index) => (
            <Media
              key={`${post.userId1}-${post.id}-${index}`}
              userName={post.userName}
              profilePic={post.profilePic}
              content={post.content}
              postImage={post.mediaUrl}
              postId={post.id}
              userId1={post.userId1}
              timeStamp={post.timeStamp}
              likes={post.likes}
            />
          ))
        )}
      </Box>
    </>
  );
};

export default Home;