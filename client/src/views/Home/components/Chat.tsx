import { useEffect, useState } from "react";
import { Avatar, Box, Divider, Tooltip } from "@mui/material";
import { SubHeading } from "../../../components/Heading";
import PrimaryInput from "../../../components/PrimaryInput/PrimaryInput";
import { LuSendHorizonal } from "react-icons/lu";
import useTypedSelector from "../../../hooks/useTypedSelector";
import { selectedUserId } from "../../../redux/auth/authSlice";
import { GoPencil } from "react-icons/go";
import CreateGroupChatModal from "./CreateGroupChatModal";
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
} from "../../../redux/api/messageApiSlice";
import ToastAlert from "../../../components/ToastAlert/ToastAlert";
import OverlayLoader from "../../../components/Spinner/OverlayLoader";
import Spinner from "../../../components/Spinner";

interface ChatProps {
  selectedChatInfo: any;
}

const Chat: React.FC<ChatProps> = ({ selectedChatInfo }) => {
  const userId = useTypedSelector(selectedUserId);
  const [newMessage, setNewMessage] = useState<string>("");
  const [userData, setUserData] = useState<any>({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
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

  // SEND MESSAGE API CALL
  const [sendMessage, { isLoading: isSendingMessage }] =
    useCreateMessageMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!newMessage) return;
    setNewMessage("");
    const payload = {
      chatId: userData._id,
      content: newMessage,
    };
    try {
      const message: any = await sendMessage(payload);
      // if (message?.data?.status) {
      // }
      if (message?.error) {
        setToast({
          ...toast,
          message: message?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Send Message Error:", error);
      setToast({
        ...toast,
        message: "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };

  // GET ALL MESSAGES API CALL
  const { data: messagesData, isLoading: messagesLoading } =
    useGetMessagesQuery(userData._id, {
      refetchOnMountOrArgChange: true,
    });

  useEffect(() => {
    if (messagesData?.messages) {
      setChatMessages(messagesData?.messages);
    }
  }, [messagesData?.messages]);

  const generateColorForName = (name: string) => {
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#ff9800",
      "#ff5722",
    ];

    const firstLetter = name[0].toUpperCase();
    const value = firstLetter.charCodeAt(0) - 65;
    const colorIndex = value % colors.length;
    return colors[colorIndex];
  };

  return (
    <Box
      sx={{
        padding: "20px",
      }}
    >
      {messagesLoading && <OverlayLoader />}
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
              justifyContent: "space-between",
            }}
          >
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
            <Box>
              <Tooltip title="Edit Group Chat" placement="right">
                <Box sx={{ cursor: "pointer" }} onClick={handleOpenModal}>
                  <GoPencil />
                </Box>
              </Tooltip>
            </Box>
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
        {chatMessages?.length === 0 && (
          <Box>
            <SubHeading sx={{ textAlign: "center" }}>
              No conversation start yet
            </SubHeading>
          </Box>
        )}
        {chatMessages?.map((chat, index) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {chat.sender._id !== userId && (
                <Box>
                  <img
                    src={chat.sender.pic}
                    alt="avatar"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      border: "1px solid #513dea",
                      marginBottom: "10px",
                    }}
                  />
                </Box>
              )}
              <Box
                key={index}
                sx={{
                  textAlign: chat.sender._id === userId ? "right" : "left",
                  width: chat.sender._id === userId ? "50%" : "50%",
                  background:
                    chat.sender._id === userId ? "#513dea" : "#f3f4f6",
                  color: chat.sender._id === userId ? "#fff" : "#000",
                  padding: "10px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  maxWidth: "300px",
                  marginRight: "15px",
                  marginLeft: chat.sender._id === userId ? "auto" : "none",
                }}
              >
                {chat.sender._id !== userId && (
                  <Box
                    sx={{
                      fontSize: "12px",
                      marginBottom: "5px",
                      fontWeight: 500,
                      color: generateColorForName(chat.sender.name),
                    }}
                  >
                    {chat.sender.name}
                  </Box>
                )}
                <Box> {chat.content}</Box>
              </Box>
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
              {isSendingMessage ? (
                <Spinner specificColor="#fff" size={14} />
              ) : (
                <LuSendHorizonal />
              )}
            </Box>
          </Box>
        </form>
      </Box>
      <CreateGroupChatModal
        open={openModal}
        setOpen={setOpenModal}
        chatData={userData}
      />
      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={handleCloseToast}
      />
    </Box>
  );
};

export default Chat;
