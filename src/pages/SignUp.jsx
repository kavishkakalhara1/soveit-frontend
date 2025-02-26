import { Alert, Button, Select, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/logo.png";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Use the id of the select tag to determine which state variable to update

    const { id, value } = event.target;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      !formData.email ||
      !formData.phonenumber ||
      !formData.password ||
      !formData.confirmpassword ||
      !formData.firstname ||
      !formData.lastname
    ) {
      setErrorMessage("Please fill out all fields.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
  
    if (formData.password !== formData.confirmpassword) {
      setErrorMessage("Passwords do not match.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
  
    try {
      setLoading(true);
      setErrorMessage(null);
  
      const { data } = await axios.post("/api/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (data.success === false) {
        setErrorMessage("An error occurred. Please try again.");
        setTimeout(() => setErrorMessage(null), 3000);
      } else {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen mt-20">
      <div className="flex flex-col max-w-3xl gap-5 p-3 mx-auto md:flex-row ">
        {/* left */}
        <div className="content-center flex-1 xl:mr-40">
          <Link to="/" className="content-center text-4xl font-bold dark:text-white">
            <h1 className="content-center font-semibold text-7xl">
              {" "}
              <span className="font-light">Solve</span>IT
            </h1>
          </Link>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
            <div>
              <h1 className="text-3xl font-semibold">Sign Up</h1>
            </div>
            <div>
              <TextInput
                type="text"
                placeholder="Your First Name"
                id="firstname"
                onChange={handleChange}
              />
            </div>
            <div>
              <TextInput
                type="text"
                placeholder="Your Last Name"
                id="lastname"
                onChange={handleChange}
              />
            </div>

            <div>
              <TextInput
                type="number"
                placeholder="Phone Number"
                id="phonenumber"
                onChange={handleChange}
              />
            </div>
            <div>
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <div>
              <TextInput
                type="password"
                placeholder="Confirm Password"
                id="confirmpassword"
                onChange={handleChange}
              />
            </div>

            <Button
              className="bg-primary hover:bg-secondary ring-0 focus:ring-transparent"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 mt-5 mb-20 text-sm">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
