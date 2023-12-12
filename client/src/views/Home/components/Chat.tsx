import { useEffect, useState } from "react";
import { Avatar, Box, Divider } from "@mui/material";
import { SubHeading } from "../../../components/Heading";
import PrimaryInput from "../../../components/PrimaryInput/PrimaryInput";
import { LuSendHorizonal } from "react-icons/lu";
import useTypedSelector from "../../../hooks/useTypedSelector";
import { selectedUserId } from "../../../redux/auth/authSlice";

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

interface ChatProps {
  selectedChatInfo: any;
}

const Chat: React.FC<ChatProps> = ({ selectedChatInfo }) => {
  const userId = useTypedSelector(selectedUserId);
  const [newMessage, setNewMessage] = useState<string>("");
  const [userData, setUserData] = useState<any>({});

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(newMessage);
    setNewMessage("");
  };

  useEffect(() => {
    if (selectedChatInfo) {
      if (!selectedChatInfo?.isGroupChat) {
        const filteredUsers = selectedChatInfo?.users?.filter(
          (user: any) => user._id !== userId
        );
        setUserData({ ...selectedChatInfo, users: filteredUsers });
      } else {
        setUserData(selectedChatInfo);
      }
    }
  }, [selectedChatInfo, userId]);

  return (
    <Box
      sx={{
        padding: "20px",
      }}
    >
      <Box>
        {/* Simple Chat */}
        {!selectedChatInfo?.isGroupChat &&
          userData?.users?.map((user: any, index: number) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
              key={user._id}
            >
              <img
                src={user?.pic}
                alt="Avatar"
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                }}
              />
              <SubHeading sx={{ color: "#000)" }}>{user?.name}</SubHeading>
              <Box
                sx={{
                  background: "rgb(47 178 102)",
                  borderRadius: "50%",
                  width: "10px",
                  height: "10px",
                }}
              ></Box>
            </Box>
          ))}

        {/* Group Chat */}
        {selectedChatInfo?.isGroupChat && userData?.chatName && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <Avatar sx={{ width: 45, height: 45 }}>
              {userData?.chatName[0]}
            </Avatar>
            <SubHeading sx={{ color: "#000)" }}>
              {userData?.chatName}
            </SubHeading>
          </Box>
        )}

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
