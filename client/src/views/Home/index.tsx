// React Imports
import { useState } from "react";
import { IoMdPerson } from "react-icons/io";
// Material UI Imports
import { Box } from "@mui/system";
// Custom Imports
import SideBar from "./components/SideBar";
import ChatInfo from "./components/ChatInfo";
import Chat from "./components/Chat";
import { SubHeading } from "../../components/Heading";
// Lodash Imports
import { uniqBy } from "lodash";

const Home = () => {
  // States
  const [searchText, setSearchText] = useState<string>("");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedChatInfo, setSelectedChatInfo] = useState<any>(null);
  const [chats, setChats] = useState<any>([]);
  const [notifications, setNotifications] = useState<any>([]);
  const [newMessageUsers, setNewMessageUsers] = useState({});

  const withoutDuplicatesNotifications = uniqBy(notifications, "_id");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
      }}
    >
      <Box sx={{ flex: 1, background: "#f3f4f6" }}>
        <SideBar
          searchText={searchText}
          setSearchText={setSearchText}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          chats={chats}
          setChats={setChats}
          setSelectedChatInfo={setSelectedChatInfo}
          notifications={withoutDuplicatesNotifications}
          setNotifications={setNotifications}
          newMessageUsers={newMessageUsers}
          setNewMessageUsers={setNewMessageUsers}
        />
      </Box>
      <Box sx={{ flex: 2, background: "#fff" }}>
        <Chat
          selectedChatInfo={selectedChatInfo}
          selectedChat={selectedChat}
          notifications={notifications}
          setNotifications={setNotifications}
          setNewMessageUsers={setNewMessageUsers}
        />
      </Box>
      <Box sx={{ flex: 1, background: "#f3f4f6" }}>
        {selectedChat === null ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <SubHeading
              sx={{
                color: "#b1b3b5",
                fontWeight: "normal",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <IoMdPerson fontSize={20} />
              No Person Selected
            </SubHeading>
          </Box>
        ) : (
          <ChatInfo selectedChatInfo={selectedChatInfo} />
        )}
      </Box>
    </Box>
  );
};

export default Home;
