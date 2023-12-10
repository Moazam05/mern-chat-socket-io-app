import { Box } from "@mui/system";
import SideBar from "./components/SideBar";

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
      <Box sx={{ flex: 2, background: "#fff" }}>50%</Box>
      <Box sx={{ flex: 1, background: "#f3f4f6" }}>25%</Box>
    </Box>
  );
};

export default Home;
