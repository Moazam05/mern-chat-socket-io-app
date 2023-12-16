
# MERN 📑 Chat App

Real-time chat application built with the MERN (MongoDB, Express.js, React, Node.js) stack, and for real-time communication, we used Scoket.io.



## Features
User Authentication
- Easily create an account with minimal information.

Friend Discovery
- Effortlessly find friends using the search bar.
- Initiate connections and expand your network.

Group Chat
- Users can create group chats for collaborative conversations.
- Receive real-time notifications for messages and updates within group chats.
- Admins have the authority to remove members from group chats for effective moderation.

Profile Update
- Easily updating your profile details.

## Tech Stack

**Client:** React, ReactTypeScript, Redux Toolkit, Material UI, Formik

**API Handlers:** RTK Query

**Server:** Node, Express

**Database:** Mongo DB

**Cloudinary:** For Image Uploading

**Real Time Communication:** Socket.io


## Screenshots

![signup](https://i.postimg.cc/90wQDG7b/Sign-Up.png)

![Sign in](https://i.postimg.cc/05hpcnc8/Login.png)

![Profile](https://i.postimg.cc/vZbxNN9d/Profile.png)

![Chat 1](https://i.postimg.cc/Cxc56LSj/Chat-1.png)

![Chat 2](https://i.postimg.cc/yNnmjzr5/Chat-2.png)

![Notification](https://i.postimg.cc/C17fYHVQ/notification.png)

![Group chat](https://i.postimg.cc/0QMCyBcB/Group-Chat.png)

![Group chat 2](https://i.postimg.cc/KvNtxbmY/Update-Group-Chat.png)

![Group Chat 3](https://i.postimg.cc/wMBRByqT/group.png)
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Backend ###

```bash
 NODE_ENV:  development
 PORT:      5000
 DATABASE:  Insert your MongoDB database connection link
 CLOUDINARY_CLOUD_NAME: 
 CLOUDINARY_API_KEY:
 CLOUDINARY_API_SECRET: 
```

### Frontend ###

```bash
 REACT_APP_API_URL:  'http://127.0.0.1:5000/api/v1/'
```
