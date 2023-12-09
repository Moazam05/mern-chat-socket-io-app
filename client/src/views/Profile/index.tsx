// React Imports
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// MUI Imports
import { Box, Button, Tooltip } from "@mui/material";
// Redux Imports
import {
  selectedUserAvatar,
  selectedUserEmail,
  selectedUserName,
  setUser,
} from "../../redux/auth/authSlice";
import { useUpdateUserMutation } from "../../redux/api/userApiSlice";
// Hooks
import useTypedSelector from "../../hooks/useTypedSelector";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// Yup Imports
import * as Yup from "yup";
// Utils Imports
import { onKeyDown } from "../../utils";
// Custom Imports
import ToastAlert from "../../components/ToastAlert/ToastAlert";
import { Heading, SubHeading } from "../../components/Heading";
import DotLoader from "../../components/Spinner/dotLoader";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";

// Yup Validation Schema
const profileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").nullable(),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .nullable(),
  pic: Yup.string(),
});

// Form Values Interface
interface ISProfileForm {
  name: string;
  email: string;
  pic: string;
}

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null | any>(null);
  const userAvatar = useTypedSelector(selectedUserAvatar);
  const userName = useTypedSelector(selectedUserName);
  const userEmail = useTypedSelector(selectedUserEmail);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<ISProfileForm>({
    name: userName,
    email: userEmail,
    pic: "",
  });
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });
  const [file, setFile] = useState<any>("");
  const [image, setImage] = useState<any>("");

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file.size > 1024 * 1024) {
      return setToast({
        ...toast,
        message: "Image size is too large (Max: 1mb)",
        appearence: true,
        type: "error",
      });
    } else {
      setFileToBase(file);
      setFile(file);
    }
  };

  const setFileToBase = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  // UPDATE PROFILE API CALL
  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const ProfileHandler = async (data: ISProfileForm) => {
    const userData = localStorage.getItem("user");
    const currentUser = JSON.parse(userData!);

    const payload = {
      name: data.name,
      email: data.email,
      pic: image ? image : userAvatar,
      fileName: file?.name,
    };

    try {
      const user: any = await updateProfile(payload);
      const updatedUser = {
        ...currentUser,
        data: {
          ...currentUser.data,
          user: {
            ...currentUser.data.user,
            name: user?.data?.data?.user?.name,
            email: user?.data?.data?.user?.email,
            pic: user?.data?.data?.user?.pic,
          },
        },
      };
      if (user?.data?.status) {
        setToast({
          ...toast,
          message: "User Updated Successfully",
          appearence: true,
          type: "success",
        });
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
      if (user?.error) {
        setToast({
          ...toast,
          message: user?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      setToast({
        ...toast,
        message: "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Heading>Profile</Heading>
        <Tooltip title="Upload Image" placement="right">
          <Box sx={{ marginTop: "30px", cursor: "pointer" }}>
            <input
              onChange={handleImage}
              hidden
              ref={fileRef}
              type="file"
              accept="image/*"
              name=""
              id=""
            />
            <img
              onClick={() => fileRef.current.click()}
              height={95}
              width={95}
              src={image || userAvatar}
              alt="user"
              style={{ borderRadius: "50%" }}
            />
          </Box>
        </Tooltip>
        <Box>
          <Formik
            initialValues={formValues}
            onSubmit={(values: ISProfileForm) => {
              ProfileHandler(values);
            }}
            validationSchema={profileSchema}
            enableReinitialize
          >
            {(props: FormikProps<ISProfileForm>) => {
              const { values, touched, errors, handleBlur, handleChange } =
                props;

              return (
                <Form onKeyDown={onKeyDown} style={{ width: "400px" }}>
                  <Box sx={{ height: "95px", marginTop: "20px" }}>
                    <SubHeading sx={{ marginBottom: "5px" }}>Name</SubHeading>
                    <PrimaryInput
                      type="text"
                      label=""
                      name="name"
                      placeholder="Name"
                      value={values.name}
                      helperText={
                        errors.name && touched.name ? errors.name : ""
                      }
                      error={errors.name && touched.name ? true : false}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                  <Box sx={{ height: "95px" }}>
                    <SubHeading sx={{ marginBottom: "5px" }}>Email</SubHeading>
                    <PrimaryInput
                      type="text"
                      label=""
                      name="email"
                      placeholder="Email"
                      value={values.email}
                      helperText={
                        errors.email && touched.email ? errors.email : ""
                      }
                      error={errors.email && touched.email ? true : false}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={true}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isLoading}
                      sx={{
                        padding: "5px 30px",
                        textTransform: "capitalize",
                        margin: "0 0 20px 0",
                        background: "#334155",
                        height: "40px",
                        color: "#fff",
                        lineHeight: "0",
                        "&:hover": {
                          background: "#334155",
                        },
                      }}
                    >
                      {isLoading ? (
                        <DotLoader color="#fff" size={12} />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>
      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={handleCloseToast}
      />
    </>
  );
};

export default Profile;
