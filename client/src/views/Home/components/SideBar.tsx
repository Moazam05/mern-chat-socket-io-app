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
import { Avatar, Box, Button, Tooltip } from "@mui/material";
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
import { uniqBy } from "lodash";
import { FaPlus } from "react-icons/fa6";
import CreateGroupChatModal from "./CreateGroupChatModal";
import { formatTime } from "../../../utils";

interface SideBarProps {
  searchText: string;
  setSearchText: (value: string) => void;
  selectedChat: any;
  setSelectedChat: (value: any) => void;
  chats: any;
  setChats: (value: any) => void;
  setSelectedChatInfo: (value: any) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  searchText,
  setSearchText,
  selectedChat,
  setSelectedChat,
  chats,
  setChats,
  setSelectedChatInfo,
}) => {
  const navigate = useNavigate();
  const userName = useTypedSelector(selectedUserName);
  const userAvatar = useTypedSelector(selectedUserAvatar);
  const userId = useTypedSelector(selectedUserId);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => setOpenModal(true);
  // state
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  // GET CHATS
  const { data: getChat, isLoading: getChatLoading } = useGetChatQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (getChat?.chats) {
      setChats(getChat.chats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getChat, userId]);

  // CREATE CHAT
  const [createChat, { isLoading: chatLoading }] = useCreateChatMutation();

  const createChatHandler = async (receiverId: string) => {
    const payload = {
      userId: receiverId,
    };
    try {
      const chat: any = await createChat(payload);

      if (chat?.data?.status) {
        setSearchText("");
        const newChat = chat?.data?.chat;

        setSelectedChat(newChat._id);
        setChats((prevChats: any) => [...prevChats, newChat]);
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

  const chatsWithoutDuplicates = uniqBy(chats, "_id");

  return (
    <Box sx={{ padding: "20px 0" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
          padding: "0 20px",
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
      <Box sx={{ margin: "10px 0", padding: "0 20px" }}>
        <Box sx={{ margin: "10px 0", display: "flex", justifyContent: "end" }}>
          <Button
            variant="outlined"
            sx={{
              textTransform: "capitalize",
            }}
            size="small"
            startIcon={<FaPlus />}
            onClick={handleOpenModal}
          >
            New Group Chat
          </Button>
        </Box>
        <SearchBar
          placeholder="Search Friends"
          color="#fff"
          searchText={searchText}
          handleSearch={handleSearch}
          onChange={handleSearch}
          value={searchText}
        />
        {isLoading || getChatLoading ? (
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
            console.log("user", user);
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
      {chatsWithoutDuplicates.length > 0 &&
        chatsWithoutDuplicates.map((chat: any, index: number) => (
          <Box key={index}>
            {chat?.users
              ?.filter((user: any) =>
                chat?.isGroupChat ? user._id === userId : user._id !== userId
              )
              .map((friend: any) => {
                const isSelected = selectedChat === chat._id;

                console.log("friend", chat?.latestMessage?.content);

                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      borderRadius: "5px",
                      background: isSelected ? "rgba(49, 150, 147, 0.75)" : "",
                      margin: isSelected ? "10px 10px" : "20px 0",
                      padding: isSelected ? "10px" : "0 20px",
                    }}
                    onClick={() => {
                      setSelectedChat(chat._id);
                      setSelectedChatInfo(chat);
                    }}
                    key={friend._id}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {chat?.isGroupChat ? (
                        <Avatar sx={{ width: 33, height: 33 }}>
                          {chat?.chatName[0]}
                        </Avatar>
                      ) : (
                        <img
                          src={friend?.pic}
                          alt={friend?.name}
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                          }}
                        />
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <SubHeading
                          sx={{ color: isSelected ? "#fff" : "#513dea" }}
                        >
                          {chat?.isGroupChat ? chat?.chatName : friend?.name}
                        </SubHeading>
                        <Box
                          sx={{
                            fontSize: "12px",
                            color: isSelected ? "#fff" : "gray",
                          }}
                        >
                          {chat?.latestMessage?.content?.length > 40
                            ? chat?.latestMessage?.content?.slice(0, 40) + "..."
                            : chat?.latestMessage?.content}
                        </Box>
                      </Box>
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
                          color: isSelected ? "#fff" : "gray",
                        }}
                      >
                        {formatTime(chat?.latestMessage?.createdAt)}
                      </Box>
                      <Box
                        sx={{
                          background: isSelected ? "#fff" : "#513dea",
                          borderRadius: "50%",
                          width: "15px",
                          height: "15px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          color: isSelected ? "#000" : "#fff",
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

      <Box
        sx={{
          padding: "0 20px",
        }}
      >
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
      </Box>
      <CreateGroupChatModal
        open={openModal}
        setOpen={setOpenModal}
        newChat={true}
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

export default SideBar;
