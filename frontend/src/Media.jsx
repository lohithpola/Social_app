import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';

export default function Media({ userName, profilePic, content, postImage, postId, userId1,timeStamp }) {
    const formattedTime = new Date(timeStamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
  return (
    <Card sx={{ width: '100%', maxWidth: 600, m: 2 }}>
      <Link to={`/profile/${userId1}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardHeader
          avatar={<Avatar alt={userName} src={`data:image/png;base64,${profilePic}`} />}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={userName}
          subheader={formattedTime}
        />
      </Link>

      <Link to={`/post/${postId}`}>
        <CardMedia
          component="img"
          height="400"
          image={`data:image/png;base64,${postImage}`}
          alt="Post"
        />
      </Link>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
}
