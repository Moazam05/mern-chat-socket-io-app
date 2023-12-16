import { useEffect, useState, useRef } from "react";
import { Avatar, Box, Divider, Tooltip } from "@mui/material";
import { SubHeading } from "../../../components/Heading";
import PrimaryInput from "../../../components/PrimaryInput/PrimaryInput";
import { LuSendHorizonal } from "react-icons/lu";
import useTypedSelector from "../../../hooks/useTypedSelector";
import { selectedUserId } from "../../../redux/auth/authSlice";
import { GoPencil } from "react-icons/go";
import CreateGroupChatModal from "./CreateGroupChatModal";
import { MdLibraryBooks } from "react-icons/md";
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
} from "../../../redux/api/messageApiSlice";
import ToastAlert from "../../../components/ToastAlert/ToastAlert";
import OverlayLoader from "../../../components/Spinner/OverlayLoader";
import Spinner from "../../../components/Spinner";
import { formatTime, generateColorForName } from "../../../utils";
import io from "socket.io-client";
import DotLoader from "../../../components/Spinner/dotLoader";

interface ChatProps {
  selectedChatInfo: any;
  selectedChat: any;
  notifications: any;
  setNotifications: any;
  newMessageUsers?: any;
  setNewMessageUsers?: any;
}

// SOCKET.IO IMPLEMENTATION
const ENDPOINT = "http://localhost:5000";
let socket: any | undefined;
let selectedChatCompare: any;

const Chat: React.FC<ChatProps> = ({
  selectedChatInfo,
  selectedChat,
  notifications,
  setNotifications,
  newMessageUsers,
  setNewMessageUsers,
}) => {
  const userId = useTypedSelector(selectedUserId);
  const messageBoxRef = useRef<any>(null);

  const [newMessage, setNewMessage] = useState<string>("");
  const [userData, setUserData] = useState<any>({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  // GET USER FROM LOCAL STORAGE
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    // Create the socket connection
    socket = io(ENDPOINT);

    // Emit the "setup" event to the server
    socket.emit("setup", user?.data?.user);

    // Listen for the "connected" event from the server
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    // Listen for the "typing" event from the server
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // Listen for the "message received" event from the server
    socket.on("message received", (newMessage: any) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        const isNotificationExists = notifications.some(
          (notification: any) =>
            notification?.sender?._id === newMessage?.sender?._id
        );
        if (!isNotificationExists) {
          setNotifications((prev: any) => [...prev, newMessage]);
        }
        // Extract sender information from the new message
        const senderId = newMessage?.sender?._id;

        // Check if the user is the sender (to avoid counting own messages)
        if (senderId && senderId !== user?.data?.user?._id) {
          // Update the newMessageUsers state
          setNewMessageUsers((prev: any) => {
            const userCount = prev[newMessage.chat._id] || 0;
            return { ...prev, [newMessage.chat._id]: userCount + 1 };
          });
        }
      } else {
        setChatMessages((prev) => {
          const isMessageExists = prev.some(
            (msg) => msg._id === newMessage._id
          );
          return isMessageExists ? prev : [...prev, newMessage];
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GET ALL MESSAGES API CALL
  const { data: messagesData, isLoading: messagesLoading } =
    useGetMessagesQuery(userData._id, {
      refetchOnMountOrArgChange: true,
    });

  useEffect(() => {
    if (messagesData?.messages) {
      // Socket Enable when fetching messages
      socket.emit("join chat", userData._id);

      setChatMessages(messagesData?.messages);
      selectedChatCompare = userData;
    }
  }, [messagesData?.messages, userData]);

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
    socket.emit("stop typing", userData._id);
    try {
      const message: any = await sendMessage(payload);
      if (message?.data?.status) {
        socket.emit("new message", message?.data?.message);
      }
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

  const typingHandler = (e: any) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", userData._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", userData._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <>
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
            Click on a user to start chatting
          </SubHeading>
        </Box>
      ) : (
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
              minHeight: isTyping ? "67vh" : "72vh",
            }}
          >
            <Box
              ref={messageBoxRef}
              sx={{
                margin: "20px 0",
                width: "100%",
                maxHeight: isTyping ? "67vh" : "72vh",
                overflowY: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
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
                // if same user send multiple messages then show only one avatar
                if (index > 0) {
                  if (chat.sender._id === chatMessages[index - 1].sender._id) {
                    return (
                      <Box
                        key={chat._id}
                        sx={{
                          textAlign:
                            chat.sender._id === userId ? "right" : "left",
                          width: chat.sender._id === userId ? "50%" : "50%",
                          background:
                            chat.sender._id === userId ? "#513dea" : "#f3f4f6",
                          color: chat.sender._id === userId ? "#fff" : "#000",
                          padding: "10px",
                          borderRadius: "10px",
                          marginBottom: "10px",
                          maxWidth: "300px",
                          marginRight: "15px",
                          marginLeft:
                            chat.sender._id === userId ? "auto" : "45px",
                        }}
                      >
                        <Box> {chat.content}</Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            fontSize: "10px",
                            marginTop: "5px",
                            color: chat.sender._id === userId ? "#fff" : "#000",
                          }}
                        >
                          {formatTime(chat.createdAt)}
                        </Box>
                      </Box>
                    );
                  }
                }
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
                            marginBottom: "10px",
                          }}
                        />
                      </Box>
                    )}
                    <Box
                      key={chat._id}
                      sx={{
                        textAlign:
                          chat.sender._id === userId ? "right" : "left",
                        width: chat.sender._id === userId ? "50%" : "50%",
                        background:
                          chat.sender._id === userId ? "#513dea" : "#f3f4f6",
                        color: chat.sender._id === userId ? "#fff" : "#000",
                        padding: "10px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                        maxWidth: "300px",
                        marginRight: "15px",
                        marginLeft:
                          chat.sender._id === userId ? "auto" : "none",
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          fontSize: "10px",
                          marginTop: "5px",
                          color: chat.sender._id === userId ? "#fff" : "#000",
                        }}
                      >
                        {formatTime(chat.createdAt)}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: 15,
              width: "100%",
              maxWidth: "48vw",
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
                <Box
                  sx={{
                    flexGrow: 1,
                    position: "relative",
                  }}
                >
                  {isTyping && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: "#f3f4f6",
                        width: "fit-content",
                        padding: "5px 10px",
                        borderRadius: "30px",
                        marginBottom: "10px",
                      }}
                    >
                      <DotLoader color="#828389" size={12} />
                    </Box>
                  )}
                  <PrimaryInput
                    placeholder="Type a message..."
                    background="#f3f4f6"
                    borderRadius="30px"
                    value={newMessage}
                    onChange={typingHandler}
                  />
                </Box>
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
                    marginTop: isTyping ? "35px" : "0",
                    marginRight: "10px",
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
      )}
    </>
  );
};

export default Chat;
