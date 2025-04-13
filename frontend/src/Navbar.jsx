import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Button,
  Badge,
} from "@mui/material";
import {
  Home,
  Search,
  AddCircleOutline,
} from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  
  const navigate = useNavigate();
  const [responseData, setData] = useState({});
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const [userId, setUserId] = useState(null);
  const header = {
    headers: { Authorization: `Bearer ${jwt}` },
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/getUser", header)
      .then((response) => {
        setData(response.data);
        setUserId(response.data.id);
        // Save user to localStorage for access in other components
        if (!localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton>
          <Link to={"/"}>
            <Home />
          </Link>
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f1f1f1",
            borderRadius: 2,
            px: 2,
          }}
        >
          <IconButton onClick={() => navigate("/search")}>
            <Search />
          </IconButton>
        </Box>

        <Link to={"/friends"}>
          <PeopleIcon />
        </Link>

        <Box>
          <IconButton>
            <Link to={"/create-post"}>
              <AddCircleOutline />
            </Link>
          </IconButton>
          <IconButton>
            <Link to={`/profile/${responseData.id}`}>
              <Avatar
                src={
                  responseData.imageData
                    ? `data:image/png;base64,${responseData.imageData}`
                    : ""
                }
              />
            </Link>
          </IconButton>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}