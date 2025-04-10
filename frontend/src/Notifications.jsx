import { useEffect, useState } from "react";
import useNotifications from "./useNotifications";
import axios from "axios";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const Notifications = () => {
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const [notifications, setNotifications] = useState([]);
  const [userId,setUserId]=useState(0);

  useEffect(() => {

    const fetchUserData=async()=>{
        try{
            const response = await axios.get(`http://localhost:8080/getUser`, {
                headers: { Authorization: `Bearer ${jwt}` },
              });
            setUserId(response.data.id);
        }
        catch(error){
            console.log("error fetching userdata");
        }
    }
    fetchUserData();
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/user/${userId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
  }, []); 

  useNotifications(userId, (newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  });

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h5">Notifications</Typography>
      <List>
        {notifications.map((notif, index) => (
          <ListItem key={index}>
            <ListItemText primary={notif.content} secondary={new Date(notif.timeStamp).toLocaleString()} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Notifications;
