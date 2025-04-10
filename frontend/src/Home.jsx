import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import Media from "./Media";

const Home = () => {
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const [userName1, setUserName] = useState("");
  const [userId, setUserId] = useState(0);
  const [followList, SetFollowList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response1 = await axios.get("http://localhost:8080/getUser", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setUserName(response1.data.username);
        setUserId(response1.data.id);
      } catch (error) {
        console.log("Error in fetchUserName");
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response4 = await axios.get("http://localhost:8080/getAllUsers", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setAllUsers(response4.data);
      } catch (error) {
        console.log("Error fetching all users");
      }
    };

    fetchUserName();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (userId !== 0) {
      const fetchFollowList = async () => {
        try {
          const response2 = await axios.get(
            `http://localhost:8080/getFollow/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          SetFollowList(response2.data);
        } catch (error) {
          console.log("Error fetching follow list");
        }
      };
      fetchFollowList();
    }
  }, [userId]);

  const followingIds = followList.map((follow) => follow.followingId);
  followingIds.push(userId);
  const followedUsers = allUsers.filter((user) =>
    followingIds.includes(user.id)
  );

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {[...followedUsers]
          .flatMap((user) =>
            user.posts.map((post) => ({
              ...post,
              userName: user.userName,
              profilePic: user.imageData,
              userId1: user.id,
            }))
          )
          .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
          .map((post, index) => (
            <Media
              key={`${post.userId1}-${post.id}-${index}`}
              userName={post.userName}
              profilePic={post.profilePic}
              content={post.content}
              postImage={post.mediaUrl}
              postId={post.id}
              userId1={post.userId1}
              timeStamp={post.timeStamp}
            />
          ))}
      </div>
    </>
  );
};

export default Home;
