package com.app.socialmedia.controller;

import com.app.socialmedia.dto.UserDto;
import com.app.socialmedia.model.Users;
import com.app.socialmedia.service.JWTService;
import com.app.socialmedia.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @Autowired
    private final JWTService jwtService;

    @PostMapping("/addUser")
    public ResponseEntity<Users> addUser(@RequestParam("image") MultipartFile image,
                                         @RequestParam("fullName") String fullName,
                                         @RequestParam("userName") String userName,
                                         @RequestParam("email") String email,
                                         @RequestParam("password") String password) {
        try {
            Users savedUser = userService.userAdd(image, fullName, userName, email, password);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getUser")
    public ResponseEntity<UserDto> getUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String username = jwtService.extractUserName(authHeader.substring(7));
        return new ResponseEntity<>(userService.getuser(username), HttpStatus.OK);
    }

    @GetMapping("getFullUser/{userId}")
    public ResponseEntity<Users> getFullUser(@PathVariable long userId) {
        return new ResponseEntity<>(userService.getfulluser(userId), HttpStatus.OK);
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<Users>> getAllUsers() {
        return new ResponseEntity<>(userService.getallUsers(), HttpStatus.OK);
    }

    @GetMapping("/searchUser")
    public ResponseEntity<List<Users>> getSearchUser(){
        return new ResponseEntity<>(userService.searchUser(),HttpStatus.OK);
    }
}

