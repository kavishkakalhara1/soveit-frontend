import {
  Alert,
  Button,
  Label,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  

 
  return (
    <div>
      <Breadcrumb aria-label="Default breadcrumb example" className="ml-5 ">
        <Link to="/">
          <Breadcrumb.Item icon={HiHome}>Home</Breadcrumb.Item>
        </Link>

        <Breadcrumb.Item href="/dashboard?tab=dash">Dashboard</Breadcrumb.Item>

        <Breadcrumb.Item href="/dashboard?tab=profile">Profile</Breadcrumb.Item>
      </Breadcrumb>
      <div className="justify-center p-10 mx-auto w-[40rem] ml-10 ">
        <h1 className="flex justify-center mx-auto mb-10 text-4xl font-semibold">
          Profile Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-10 shadow-xl bg-gray-50 rounded-xl"
        >
         

          <hr className="mb-5" />

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="firstname">First Name:</Label>
            <TextInput
              type="text"
              placeholder="Your First Name"
              className="w-[20rem] no-focus-ring"
              id="firstname"
              defaultValue={currentUser.firstname}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="lastname">Last Name:</Label>
            <TextInput
              type="text"
              defaultValue={currentUser.lastname}
              className="w-[20rem]"
              placeholder="Your Last Name"
              id="lastname"
              onChange={handleChange}
            />
          </div>
        

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="internationaltelephonenumber">Contact No:</Label>
            <TextInput
              type="text"
              defaultValue={currentUser.phonenumber}
              placeholder="Phone Number"
              className="w-[20rem]"
              id="phonenumber"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="email">Email:</Label>
            <TextInput
              type="email"
              defaultValue={currentUser.email}
              className="w-[20rem]"
              placeholder="Email"
              id="email"
              onChange={handleChange}
            />
          </div>
          {/* <div className="flex items-center justify-between gap-4">
            <Label htmlFor="password">Password:</Label>
            <TextInput
              type="password"
              defaultValue={currentUser.password}
              className="w-[20rem]"
              placeholder="Password"
              id="password"
              onChange={handleChange}
            />
          </div> */}

          <Button
            type="submit"
            className="mt-10 bg-green-500 hover:bg-green-800 hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
          {/* {currentUser.isAdmin && (
        <Link to={"/create-post"}>
          <Button
            type="button"
            className="w-full bg-refaa-blue hover:bg-red-800 hover:shadow-xl"
          >
            Create a Post
          </Button>
        </Link>
      )} */}
        </form>

        {updateUserSuccess && (
          <Alert color="success" className="mt-5">
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color="failure" className="mt-5">
            {error}
          </Alert>
        )}
       
        
      </div>
    </div>
  );
}
