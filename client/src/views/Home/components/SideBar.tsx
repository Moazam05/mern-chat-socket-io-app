// React Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoPencil } from "react-icons/go";
// Hooks
import useTypedSelector from "../../../hooks/useTypedSelector";
// Redux Imports
import {
  selectedUserAvatar,
  selectedUserId,
  selectedUserName,
} from "../../../redux/auth/authSlice";
// MUI Imports
import { Box, Tooltip } from "@mui/material";
// Custom Imports
import { Heading, SubHeading } from "../../../components/Heading";
import SearchBar from "../../../components/SearchBar";
// React Icons
import { BiLogOutCircle } from "react-icons/bi";
import { useGetAllUsersQuery } from "../../../redux/api/userApiSlice";
import DotLoader from "../../../components/Spinner/dotLoader";
import {
  useCreateChatMutation,
  useGetChatQuery,
} from "../../../redux/api/chatApiSlice";
import ToastAlert from "../../../components/ToastAlert/ToastAlert";
import Spinner from "../../../components/Spinner";

const SideBar = () => {
  const navigate = useNavigate();
  const userName = useTypedSelector(selectedUserName);
  const userAvatar = useTypedSelector(selectedUserAvatar);
  const userId = useTypedSelector(selectedUserId);
  // state
  const [searchText, setSearchText] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any>([]);
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  // console.log("selectedChat", selectedChat);

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  // GET CHATS
  const { data: getChat, isLoading: getChatLoading } =
    useGetChatQuery(selectedChat);

  useEffect(() => {
    if (getChat?.chat) {
      const isChatExist = chats.some(
        (existingChat: { _id: any }) => existingChat._id === getChat?.chat._id
      );

      if (!isChatExist) {
        setChats((prevChats: any) => [...prevChats, getChat?.chat]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  // CREATE CHAT
  const [createChat, { isLoading: chatLoading }] = useCreateChatMutation();

  const createChatHandler = async (receiverId: string) => {
    const payload = {
      userId: receiverId,
    };
    try {
      const chat: any = await createChat(payload);

      if (chat?.data?.status) {
        const newChat = chat?.data?.chat;
        const isChatExist = chats.some(
          (existingChat: { _id: any }) => existingChat._id === newChat._id
        );

        if (!isChatExist) {
          // Chat does not exist, add it to both selectedUser and chats arrays
          setSelectedUser(newChat);
          setSelectedChat(newChat._id);
          setChats((prevChats: any) => [...prevChats, newChat]);
          setSearchText("");
        }
      }

      if (chat?.error) {
        setToast({
          ...toast,
          message: chat?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Create Chat Error:", error);
      setToast({
        ...toast,
        message: "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };
  const handleSearch = (event: any) => {
    let value = event.target.value.toLowerCase();
    setSearchText(value);
  };

  // SEARCH API QUERY
  const { data, isLoading } = useGetAllUsersQuery(searchText);

  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src={userAvatar}
          alt="avatar"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "1px solid #513dea",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Heading sx={{ fontSize: "20px", color: "#513dea" }}>
            {userName}
          </Heading>
          <Tooltip title="Edit Profile" placement="bottom">
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/profile");
              }}
            >
              <GoPencil />
            </Box>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ margin: "25px 0" }}>
        <SearchBar
          placeholder="Search Friends"
          color="#fff"
          searchText={searchText}
          handleSearch={handleSearch}
          onChange={handleSearch}
          value={searchText}
        />
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <DotLoader color="#828389" />
          </Box>
        ) : searchText?.length > 0 && data?.users?.length === 0 ? (
          <Heading
            sx={{
              fontSize: "15px",
              color: "#828389",
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            No user found
          </Heading>
        ) : (
          searchText?.length > 0 &&
          data?.users?.map((user: any, index: number) => {
            return (
              <Box
                sx={{
                  padding: index === 0 ? "12px 0px" : "0 0 12px 0",
                  marginTop: index === 0 ? "10px" : "0",
                  display: "flex",
                  background: "#fff",
                  borderRadius: "5px",
                }}
                key={index}
                onClick={() => {
                  createChatHandler(user._id);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    height: "50px",
                    width: "100%",
                    padding: "0 15px",
                    "&:hover": {
                      background: "#f3f4f6",
                      borderRadius: "5px",
                      cursor: "pointer",
                      margin: "0 7px",
                      padding: "0 8px",
                    },
                  }}
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
                  {chatLoading && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                      }}
                    >
                      <Spinner size={20} />
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Chat Friend List */}
      {chats.length > 0 &&
        chats.map((chat: any, index: number) => (
          <Box key={index}>
            {chat?.users
              ?.filter((user: any) => user._id !== userId)
              .map((friend: any) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "20px 0",
                      cursor: "pointer",
                      background: selectedChat === friend._id ? "orange" : "",
                    }}
                    onClick={() => {
                      setSelectedChat(chat._id);
                      alert("Chat Selected");
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={friend?.pic}
                        alt={friend?.name}
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                        }}
                      />
                      <SubHeading sx={{ color: "#513dea" }}>
                        {friend?.name}
                      </SubHeading>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                        gap: "5px",
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: "12px",
                          color: "gray",
                        }}
                      >
                        10:45 PM
                      </Box>
                      <Box
                        sx={{
                          background: "#513dea",
                          borderRadius: "50%",
                          width: "15px",
                          height: "15px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          color: "#fff",
                        }}
                      >
                        {index + 1}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        ))}

      <Tooltip title="Logout" placement="right">
        <Box
          sx={{
            position: "fixed",
            bottom: "10px",
            background: "#334155",
            color: "#fff",
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          <BiLogOutCircle />
        </Box>
      </Tooltip>
      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={handleCloseToast}
      />
    </Box>
  );
};

export default SideBar;
