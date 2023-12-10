import { Box } from "@mui/system";
import SideBar from "./components/SideBar";
import ChatInfo from "./components/ChatInfo";
import Chat from "./components/Chat";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
      }}
    >
      <Box sx={{ flex: 1, background: "#f3f4f6" }}>
        <SideBar />
      </Box>
      <Box sx={{ flex: 2, background: "#fff" }}>
        <Chat />
      </Box>
      <Box sx={{ flex: 1, background: "#f3f4f6" }}>
        <ChatInfo />
      </Box>
    </Box>
  );
};

export default Home;
