import { useState } from "react";
import { Box, Divider } from "@mui/material";
import { SubHeading } from "../../../components/Heading";
import PrimaryInput from "../../../components/PrimaryInput/PrimaryInput";
import { LuSendHorizonal } from "react-icons/lu";

const dummyChat = [
  {
    sender: "John Doe",
    message: "Hey, how are you?",
  },
  {
    receiver: "Bessie Cooper",
    message: "I'm doing fine, how about you?",
  },
  {
    sender: "John Doe",
    message: "I'm doing great as well!",
  },
  {
    receiver: "Bessie Cooper",
    message: "We should go to the movies tomorrow!",
  },
];

const Chat = () => {
  const [newMessage, setNewMessage] = useState<string>("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(newMessage);
    setNewMessage("");
  };

  return (
    <Box
      sx={{
        padding: "20px",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="Avatar"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          />
          <SubHeading sx={{ color: "#000)" }}>John Doe</SubHeading>
          <Box
            sx={{
              background: "rgb(47 178 102)",
              borderRadius: "50%",
              width: "10px",
              height: "10px",
            }}
          ></Box>
        </Box>
        <Divider />
      </Box>
      <Box
        sx={{
          margin: "20px 0",
          width: "100%",
          height: "72vh",
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            width: "5px",
            backgroundColor: "#f3f4f6",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#513dea", // Color of the thumb
            borderRadius: "10px",
          },
        }}
      >
        {dummyChat.map((chat, index) => {
          const isSender = !!chat.sender;

          return (
            <Box
              key={index}
              sx={{
                textAlign: isSender ? "right" : "left",
                width: isSender ? "50%" : "50%",
                background: isSender ? "#513dea" : "#f3f4f6",
                color: isSender ? "#fff" : "#000",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "10px",
                maxWidth: "300px",
                marginRight: "15px",
                marginLeft: isSender ? "auto" : "none", // Adjusted margin for sender messages
              }}
            >
              {chat.message}
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <PrimaryInput
              placeholder="Type a message..."
              background="#f3f4f6"
              borderRadius="30px"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Box
              sx={{
                background: "#513dea",
                color: "#fff",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <LuSendHorizonal />
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Chat;
