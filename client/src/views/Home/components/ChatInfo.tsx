import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { SubHeading } from "../../../components/Heading";
import useTypedSelector from "../../../hooks/useTypedSelector";
import { selectedUserId } from "../../../redux/auth/authSlice";
import CustomChip from "../../../components/CustomChip";

interface ChatInfoProps {
  selectedChatInfo: any;
}

const ChatInfo: React.FC<ChatInfoProps> = ({ selectedChatInfo }) => {
  const userId = useTypedSelector(selectedUserId);
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    if (selectedChatInfo) {
      const filteredUsers = selectedChatInfo?.users?.filter(
        (user: any) => user._id !== userId
      );
      setUserData({ ...selectedChatInfo, users: filteredUsers });
    }
  }, [selectedChatInfo, userId]);

  console.log("userData", userData);

  return (
    <Box sx={{ padding: "20px" }}>
      {/* For User */}
      {!selectedChatInfo?.isGroupChat &&
        userData?.users?.map((user: any, index: number) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
            key={user._id}
          >
            <img
              src={user?.pic}
              alt="Avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
              }}
            />
            <SubHeading sx={{ margin: "20px 0 5px 0", color: "#828389" }}>
              {user?.name}
            </SubHeading>
            <SubHeading sx={{ color: "#828389", fontWeight: "normal" }}>
              {user?.email}
            </SubHeading>
          </Box>
        ))}
      {/* For Group Chat */}
      {selectedChatInfo?.isGroupChat && userData?.groupAdmin && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <img
              src={userData?.groupAdmin?.pic}
              alt="Avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
              }}
            />
            <SubHeading
              sx={{
                margin: "15px 0 5px 0",
                color: "#828389",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <CustomChip label="Admin" />
              {userData?.groupAdmin?.name}
            </SubHeading>
            <SubHeading sx={{ color: "#828389", fontWeight: "normal" }}>
              {userData?.groupAdmin?.email}
            </SubHeading>
          </Box>
          <Box
            sx={{
              margin: "50px 0",
            }}
          >
            <SubHeading>Group Members</SubHeading>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatInfo;
