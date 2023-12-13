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
      if (selectedChatInfo?.isGroupChat) {
        setUserData({ ...selectedChatInfo, users: selectedChatInfo?.users });
      } else {
        const filteredUsers = selectedChatInfo?.users?.filter(
          (user: any) => user._id !== userId
        );
        setUserData({ ...selectedChatInfo, users: filteredUsers });
      }
    }
  }, [selectedChatInfo, userId]);

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
            <Box>
              {userData?.users?.map((user: any) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    height: "50px",
                    width: "100%",
                    margin: "10px 0",
                  }}
                  key={user._id}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexDirection: "row",
                    }}
                  >
                    <img
                      src={user.pic}
                      alt={user.name}
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                      }}
                    />
                    <Box>
                      <SubHeading>{user.name}</SubHeading>
                      <SubHeading
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        Email:{" "}
                        <span
                          style={{
                            fontWeight: "normal",
                          }}
                        >
                          {user.email}
                        </span>
                      </SubHeading>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatInfo;
