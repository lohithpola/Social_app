import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [logData, setLogData] = useState({
    userName: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(logData);
    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        logData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      window.localStorage.setItem("jwt", JSON.stringify(response.data));
      alert("Login successful");
      navigate("/");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Login Unsuccessful");
    }
  };

  const dataHandle = (e) => {
    setLogData({ ...logData, [e.target.name]: e.target.value });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        p={3}
        boxShadow={3}
        borderRadius={2}
      >
        <Typography color="primary" variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField
          name="userName"
          label="Username"
          required
          fullWidth
          margin="normal"
          onChange={dataHandle}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          required
          fullWidth
          margin="normal"
          onChange={dataHandle}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button type="submit" variant="contained">
            Log In
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/forgotpassword")}
            sx={{ mt: 1 }}
          >
            Forgot Password?
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/signup")}
            sx={{ ml: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
