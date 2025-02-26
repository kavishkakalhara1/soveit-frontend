import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  setLoadingState,
} from "../redux/user/userSlice";
import Logo from "../assets/logo.png";
import { HiEye, HiEyeOff } from "react-icons/hi";
import axios from "axios";
import { requestFCMToken } from "../firebase";
import toast, { Toaster } from "react-hot-toast";

export default function SignIn() {
  const [formData, setFormData] = useState({
    phonenumber: "",
    password: "",
  });
  const { loading } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState(null);
  const [token2, setToken2] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    dispatch(setLoadingState(false));
    setErrorMessage(null)
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

   

  useEffect(() => {
    const getToken = async () => {
      const fcmtoken = await requestFCMToken();
      setToken2(fcmtoken);
      console.log("Device2 Token:", fcmtoken);
      // You can send this token to your backend for testing
    };

    getToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phonenumber || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`,
        { ...formData, token2 },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = await res.data;
      
    

      if (res.status == 200) {
        dispatch(signInSuccess(data));
        toast(
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* {image && (
              <img
                src={image}
                alt="Notification"
                style={{ width: "40px", height: "30px", borderRadius: "5px" }}
              />
            )} */}
            <div>
              <strong style={{ fontSize: "14px", display: "block" }}>
                Login Successful
              </strong>
             
            </div>
          </div>,
          {
            style: {
              borderRadius: "10px",
              background: "green",
              color: "#fff",
              padding: "10px",
              minWidth: "250px",
            },
          }
        );
        navigate("/");
      }
    } catch (error) {
     
      console.log(error.response.data.message);
      setErrorMessage(error.response.data.message)
      dispatch(signInFailure(error.response.data.error));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <Toaster position="top-right"/>
      <div className="flex flex-col max-w-3xl gap-5 p-3 mx-auto md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1 ">
          <Link to="/" className="text-4xl font-bold dark:text-white ">
         
             <h1 className="content-center font-semibold text-7xl">
            {" "}
            <span className="font-light">Solve</span>IT
          </h1>
          </Link>
          {/* <p className="mt-5 text-sm">
            Join Us to Reconnect, Collaborate, and Celebrate the Legacy of
            Engineering.
          </p> */}
        </div>
        {/* right */}

        <div className="flex-1 p-10 mt-20 ml-10 border-2 shadow-2xl border-primary rounded-3xl backdrop-blur-3xl">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label
                value="Your Phone Number"
                className="text-xl font-semibold"
              />
              <TextInput
                type="number"
                placeholder="0711234567"
                id="phonenumber"
                onChange={handleChange}
                style={{ width: "300px", marginTop: "10px" }}
              />
            </div>
            <div>
              <Label value="Your password" className="text-xl font-semibold " />
              <span className="flex justify-between mt-4">
                <TextInput
                  type={passwordVisible ? "text" : "password"}
                  placeholder="**********"
                  id="password"
                  onChange={handleChange}
                  className="w-11/12"
                />

                <Button
                  type="button"
                  className="right-0 flex items-center ml-1 text-sm bg-blue-100 nset-y-0 focus:ring-0"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <HiEye className="w-5 h-5 text-gray-500" />
                  ) : (
                    <HiEyeOff className="w-5 h-5 text-gray-500" />
                  )}
                </Button>
              </span>
            </div>
            <Button
              className="bg-primary hover:secondary ring-0 focus:ring-transparent hover:shadow-2xl"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-2 text-sm">Don't You have an Account? &nbsp;</div>
          <Link to="/sign-up" className="mt-1 text-sm text-teal-700 hover:font-medium">Create Account</Link>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
