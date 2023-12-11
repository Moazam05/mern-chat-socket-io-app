// React Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoPencil } from "react-icons/go";
// Hooks
import useTypedSelector from "../../../hooks/useTypedSelector";
// Redux Imports
import {
  selectedUserAvatar,
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

const dummyFriends = [
  {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey, how are you?",
  },
  {
    name: "Cindy Baker",
    avatar: "https://i.pravatar.cc/150?img=8",
    lastMessage: "We should go to the movies tomorrow!",
  },
  {
    name: "Bessie Cooper",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "I'm doing fine, how about you?",
  },
];

const SideBar = () => {
  const navigate = useNavigate();
  const userName = useTypedSelector(selectedUserName);
  const userAvatar = useTypedSelector(selectedUserAvatar);
  // state
  const [searchText, setSearchText] = useState<string>("");

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
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
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
            );
          })
        )}
      </Box>

      {dummyFriends.map((friend, index) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "20px 0",
              cursor: "pointer",
            }}
            key={index}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src={friend.avatar}
                alt={friend.name}
                style={{ width: "35px", height: "35px", borderRadius: "50%" }}
              />
              <SubHeading sx={{ color: "#513dea" }}>{friend.name}</SubHeading>
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
  );
};

export default SideBar;
