import { Box } from "@mui/material";
import { SubHeading } from "../../../components/Heading";

const ChatInfo = () => {
  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <img
          src="https://www.w3schools.com/howto/img_avatar.png"
          alt="Avatar"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: "1px solid #513dea",
          }}
        />
        <SubHeading sx={{ margin: "20px 0 5px 0", color: "#828389" }}>
          John Doe
        </SubHeading>
        <SubHeading sx={{ color: "#828389", fontWeight: "normal" }}>
          John@gmail.com
        </SubHeading>
      </Box>
    </Box>
  );
};

export default ChatInfo;
