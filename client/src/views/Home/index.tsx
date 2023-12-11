import { useState } from "react";
import { Box } from "@mui/system";
import SideBar from "./components/SideBar";
import ChatInfo from "./components/ChatInfo";
import Chat from "./components/Chat";
import { SubHeading } from "../../components/Heading";
import { MdLibraryBooks } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";

const Home = () => {
  // States for SideBar
  const [searchText, setSearchText] = useState<string>("");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any>([]);

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
        />
      </Box>
      <Box sx={{ flex: 2, background: "#fff" }}>
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
              <MdLibraryBooks fontSize={20} />
              No Conversation Selected
            </SubHeading>
          </Box>
        ) : (
          <Chat />
        )}
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
          <ChatInfo />
        )}
      </Box>
    </Box>
  );
};

export default Home;
