// React Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// MUI Imports
import { Box, Button } from "@mui/material";
// React Icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// Utils Imports
import { onKeyDown } from "../../utils";
// Redux Imports
import { useSignupMutation } from "../../redux/api/authApiSlice";
// Components Imports
import DotLoader from "../../components/Spinner/dotLoader";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
import { signUpSchema } from "./components/validationSchema";
import { Heading, SubHeading } from "../../components/Heading";

interface ISSignUpForm {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignUp = () => {
  const navigate = useNavigate();

  // states
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<ISSignUpForm>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const hideShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const hideShowConfirmPassword = () => {
    setConfirmPasswordShow(!confirmPasswordShow);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  // Sign Up Api Bind
  const [signupUser, { isLoading }] = useSignupMutation();

  const SignUpHandler = async (data: ISSignUpForm) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      const user: any = await signupUser(payload);

      if (user?.data?.status) {
        setToast({
          ...toast,
          message: "User Successfully Created",
          appearence: true,
          type: "success",
        });
        setTimeout(() => {
          navigate("/login");
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
      console.error("SignUp Error:", error);
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
          background: "linear-gradient(to right, #2E3192, #1BFFFF)",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            background: "#fff",
            borderRadius: "6px",
            padding: "15px 25px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 10px",
            width: "500px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FaDiscord size={40} color="#35a0c1" />
            <Heading>Create an account</Heading>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Formik
              initialValues={formValues}
              onSubmit={(values: ISSignUpForm) => {
                SignUpHandler(values);
              }}
              validationSchema={signUpSchema}
            >
              {(props: FormikProps<ISSignUpForm>) => {
                const { values, touched, errors, handleBlur, handleChange } =
                  props;

                return (
                  <Form onKeyDown={onKeyDown} style={{ width: "100%" }}>
                    <Box sx={{ height: "95px", marginTop: "10px" }}>
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
                      <SubHeading sx={{ marginBottom: "5px" }}>
                        Email
                      </SubHeading>
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
                      />
                    </Box>
                    <Box
                      sx={{
                        height:
                          errors.password && touched.password
                            ? "115px"
                            : "95px",
                      }}
                    >
                      <SubHeading sx={{ marginBottom: "5px" }}>
                        Password
                      </SubHeading>
                      <PrimaryInput
                        type={showPassword ? "text" : "password"}
                        label=""
                        name="password"
                        placeholder="Password"
                        value={values.password}
                        helperText={
                          errors.password && touched.password
                            ? errors.password
                            : ""
                        }
                        error={
                          errors.password && touched.password ? true : false
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onClick={hideShowPassword}
                        endAdornment={
                          showPassword ? (
                            <AiOutlineEye color="disabled" />
                          ) : (
                            <AiOutlineEyeInvisible color="disabled" />
                          )
                        }
                      />
                    </Box>
                    <Box sx={{ height: "95px" }}>
                      <SubHeading sx={{ marginBottom: "5px" }}>
                        Confirm Password
                      </SubHeading>
                      <PrimaryInput
                        type={confirmPasswordShow ? "text" : "password"}
                        label=""
                        name="passwordConfirm"
                        placeholder="Confirm Password"
                        value={values.passwordConfirm}
                        helperText={
                          errors.passwordConfirm && touched.passwordConfirm
                            ? errors.passwordConfirm
                            : ""
                        }
                        error={
                          errors.passwordConfirm && touched.passwordConfirm
                            ? true
                            : false
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onClick={hideShowConfirmPassword}
                        endAdornment={
                          confirmPasswordShow ? (
                            <AiOutlineEye color="disabled" />
                          ) : (
                            <AiOutlineEyeInvisible color="disabled" />
                          )
                        }
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: "10px",
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
                          margin: "10px 0 20px 0",
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
                          "Sign Up"
                        )}
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        margin: "0 0 10px 0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Already have an account?
                      <Box
                        sx={{
                          marginLeft: "5px",
                          color: "#70b3f3",
                          fontWeight: 500,
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        onClick={() => {
                          navigate("/login");
                        }}
                      >
                        Login
                      </Box>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
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

export default SignUp;
