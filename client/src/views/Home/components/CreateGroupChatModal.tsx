// React Imports
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, IconButton } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
import { onKeyDown } from "../../../utils";
import { SubHeading } from "../../../components/Heading";
import PrimaryInput from "../../../components/PrimaryInput/PrimaryInput";
import * as Yup from "yup";
import CustomAutocomplete from "../../../components/AutoComplete";
import { useGetAllUsersQuery } from "../../../redux/api/userApiSlice";
import ToastAlert from "../../../components/ToastAlert/ToastAlert";
import {
  useAddMemberToGroupChatMutation,
  useCreateGroupChatMutation,
  useLeaveGroupChatMutation,
  useRenameGroupChatMutation,
} from "../../../redux/api/chatApiSlice";
import DotLoader from "../../../components/Spinner/dotLoader";
import useTypedSelector from "../../../hooks/useTypedSelector";
import { selectedUserId } from "../../../redux/auth/authSlice";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: "6px",
  boxShadow: 24,
  outline: "none",
};

export const groupChatSchema = Yup.object().shape({
  chatName: Yup.string().required("Chat Name is required").nullable(),
  addPeople: Yup.array().required("Minimum 2 People are required").min(1),
});

interface CreateGroupChatModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatData?: any;
  newChat?: boolean;
}

interface ChatForm {
  chatName: string;
  addPeople: string[];
}

const CreateGroupChatModal: React.FC<CreateGroupChatModalProps> = ({
  open,
  setOpen,
  chatData,
  newChat,
}) => {
  const userId = useTypedSelector(selectedUserId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<ChatForm>({
    chatName: "",
    addPeople: [],
  });
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });
  const [allUsers, setAllUsers] = useState<any>([]);

  const handleClose = () => setOpen(false);
  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  // USERS API QUERY
  const { data, isLoading } = useGetAllUsersQuery({});

  useEffect(() => {
    if (data?.users) {
      setAllUsers(data?.users);
    }
  }, [data]);

  // Update Group Chat
  useEffect(() => {
    if (chatData) {
      // Remove Admin from allUsers
      const removedAdmin = chatData?.users?.filter(
        (user: any) => user._id !== chatData?.groupAdmin?._id
      );

      setFormValues({
        chatName: chatData?.chatName,
        addPeople: removedAdmin,
      });
    } else {
      setFormValues({
        chatName: "",
        addPeople: [],
      });
    }
  }, [chatData]);

  // Create Group Chat Api Bind
  const [createGroupChat, { isLoading: groupChatLoading }] =
    useCreateGroupChatMutation();

  // Rename Group Chat
  const [renameGroupChat, { isLoading: renameGroupChatLoading }] =
    useRenameGroupChatMutation();

  // Add People to Group Chat
  const [addPeopleToGroupChat, { isLoading: addPeopleToGroupChatLoading }] =
    useAddMemberToGroupChatMutation();

  const GroupChatHandler = async (data: ChatForm) => {
    const idArray = data?.addPeople.map((person: any) => person._id);

    const payload = {
      chatName: data?.chatName,
      users: idArray,
    };

    // Update Group Name
    if (chatData && chatData?.groupAdmin?._id !== userId) {
      const payload = {
        chatName: data?.chatName,
      };
      try {
        const groupChat: any = await renameGroupChat({
          body: payload,
          chatId: chatData?._id,
        });
        if (groupChat?.data?.status) {
          setToast({
            ...toast,
            message: "Group Name Changed Successfully",
            appearence: true,
            type: "success",
          });
          handleClose();
        }
        if (groupChat?.error) {
          setToast({
            ...toast,
            message: groupChat?.error?.data?.message,
            appearence: true,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Rename Group Chat Error:", error);
        setToast({
          ...toast,
          message: "Something went wrong",
          appearence: true,
          type: "error",
        });
      }
      return;
    }

    // Create Group Chat & Name
    if (chatData && chatData?.groupAdmin?._id === userId) {
      const chatNamePayload = {
        chatName: data?.chatName,
      };

      const usersPayload = {
        userId: idArray,
      };

      try {
        // Change Group Name
        const groupNameChat: any = await renameGroupChat({
          body: chatNamePayload,
          chatId: chatData?._id,
        });
        // Update Group Members
        if (groupNameChat?.data?.status) {
          const groupChat: any = await addPeopleToGroupChat({
            userId: usersPayload,
            chatId: chatData?._id,
          });
          if (groupChat?.data?.status) {
            setToast({
              ...toast,
              message: groupChat?.data?.message,
              appearence: true,
              type: "success",
            });
            handleClose();
          }
          if (groupChat?.error) {
            setToast({
              ...toast,
              message: groupChat?.error?.data?.message,
              appearence: true,
              type: "error",
            });
          }
        }
      } catch (error) {
        console.error("Rename Group Chat Error:", error);
        setToast({
          ...toast,
          message: "Something went wrong",
          appearence: true,
          type: "error",
        });
      }
      return;
    }

    try {
      const groupChat: any = await createGroupChat(payload);
      if (groupChat?.data?.status) {
        setToast({
          ...toast,
          message: groupChat?.data?.message,
          appearence: true,
          type: "success",
        });
        handleClose();
      }
      if (groupChat?.error) {
        setToast({
          ...toast,
          message: groupChat?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Create Group Chat Error:", error);
      setToast({
        ...toast,
        message: "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };

  // LEAVE GROUP API CALL
  const [leaveGroup, { isLoading: leaveGroupLoading }] =
    useLeaveGroupChatMutation();

  const leaveGroupHandler = async () => {
    // alert("Leave Group");
    const payload = {
      userId: userId,
    };
    try {
      const leaveGroupChat: any = await leaveGroup({
        userId: payload,
        chatId: chatData?._id,
      });
      if (leaveGroupChat?.data?.status) {
        setToast({
          ...toast,
          message: "Group Left Successfully",
          appearence: true,
          type: "success",
        });
        handleClose();
      }
      if (leaveGroupChat?.error) {
        setToast({
          ...toast,
          message: leaveGroupChat?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Leave Group Error:", error);
      setToast({
        ...toast,
        message: "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };

  return (
    <Box>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#14539a",
              color: "#fff",
              padding: "4px 8px",
              borderTopRightRadius: "4px",
              borderTopLeftRadius: "4px",
            }}
          >
            <Typography
              sx={{ fontSize: "16px" }}
              id="modal-modal-title"
              variant="h6"
            >
              {chatData ? "Update Group Chat" : "Create Group Chat"}
            </Typography>
            <Box sx={{ cursor: "pointer" }}>
              <IconButton onClick={handleClose}>
                <AiOutlineClose style={{ color: "#fff", fontSize: "20px" }} />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ padding: "15px 10px" }}>
            <Formik
              initialValues={formValues}
              onSubmit={(values: ChatForm) => {
                GroupChatHandler(values);
              }}
              validationSchema={groupChatSchema}
              enableReinitialize
            >
              {(props: FormikProps<ChatForm>) => {
                const { values, touched, errors, handleBlur, handleChange } =
                  props;

                return (
                  <Form onKeyDown={onKeyDown} style={{ width: "100%" }}>
                    <Box sx={{ height: "95px" }}>
                      <SubHeading sx={{ marginBottom: "5px" }}>
                        Chat Name
                      </SubHeading>
                      <PrimaryInput
                        type="text"
                        label=""
                        name="chatName"
                        placeholder="Chat Name"
                        value={values.chatName}
                        helperText={
                          errors.chatName && touched.chatName
                            ? errors.chatName
                            : ""
                        }
                        error={
                          errors.chatName && touched.chatName ? true : false
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Box>
                    {(newChat || chatData?.groupAdmin?._id === userId) && (
                      <Box sx={{ minHeight: "95px" }}>
                        <SubHeading sx={{ marginBottom: "5px" }}>
                          Add People
                        </SubHeading>
                        <CustomAutocomplete
                          label="Add People"
                          name="addPeople"
                          options={allUsers}
                          formik={props}
                          isLoading={isLoading}
                          placeholder="Add People"
                        />
                        {errors.addPeople && touched.addPeople ? (
                          <Box
                            sx={{
                              color: "#D32F1B",
                              fontSize: "12px",
                              fontWeight: "400",
                              marginTop: "5px",
                            }}
                          >
                            Minimum 1 People are required
                          </Box>
                        ) : (
                          ""
                        )}
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: "10px",
                        flexDirection: "column",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="outlined"
                        fullWidth
                        disabled={groupChatLoading}
                        sx={{
                          padding: "5px 30px",
                          textTransform: "capitalize",
                          margin: "10px 0 5px 0",
                          height: "40px",
                          lineHeight: "0",
                        }}
                      >
                        {groupChatLoading ||
                        renameGroupChatLoading ||
                        addPeopleToGroupChatLoading ? (
                          <DotLoader color="#334155" size={12} />
                        ) : chatData ? (
                          "Update Group Chat"
                        ) : (
                          "Create Group Chat"
                        )}
                      </Button>
                      {chatData && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                            marginTop: "12px",
                          }}
                        >
                          <Button
                            size="small"
                            disabled={leaveGroupLoading}
                            sx={{
                              width: "fit-content",
                              textTransform: "capitalize",
                              height: "35px",
                              lineHeight: "0",
                            }}
                            variant="contained"
                            color="error"
                            onClick={leaveGroupHandler}
                          >
                            {leaveGroupLoading ? (
                              <DotLoader color="#fff" size={12} />
                            ) : (
                              "Leave Group"
                            )}
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Box>
      </Modal>
      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={handleCloseToast}
      />
    </Box>
  );
};

export default CreateGroupChatModal;
