// React Imports
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Material UI Imports
import { Box, Button } from "@mui/material";
// React Icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// Utils Imports
import { onKeyDown } from "../../utils";
// Redux Imports
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { setUser } from "../../redux/auth/authSlice";
// Component Imports
import { Heading, SubHeading } from "../../components/Heading";
import DotLoader from "../../components/Spinner/dotLoader";
import { loginSchema } from "./components/validationSchema";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import ToastAlert from "../../components/ToastAlert/ToastAlert";

interface ISLoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // states
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<ISLoginForm>({
    email: "",
    password: "",
  });

  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const hideShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  // Sign Up Api Bind
  const [loginUser, { isLoading }] = useLoginMutation();

  const LoginHandler = async (data: ISLoginForm) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    try {
      const user: any = await loginUser(payload);

      if (user?.data?.status) {
        dispatch(setUser(user?.data));
        localStorage.setItem("user", JSON.stringify(user?.data));
        navigate("/");
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
            <Heading>Hello! Welcome Back</Heading>
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
              onSubmit={(values: ISLoginForm) => {
                LoginHandler(values);
              }}
              validationSchema={loginSchema}
            >
              {(props: FormikProps<ISLoginForm>) => {
                const { values, touched, errors, handleBlur, handleChange } =
                  props;

                return (
                  <Form onKeyDown={onKeyDown} style={{ width: "100%" }}>
                    <Box sx={{ height: "95px", marginTop: "20px" }}>
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
                    <Box sx={{ height: "95px" }}>
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
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: "15px",
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
                          "Login"
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
                      Don't Have an account?
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
                          navigate("/signup");
                        }}
                      >
                        Sign Up
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

export default Login;
