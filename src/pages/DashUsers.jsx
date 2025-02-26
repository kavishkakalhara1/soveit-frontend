import React, { useEffect, useState } from "react";
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Breadcrumb } from "flowbite-react";
import axios from "axios";

export default function DashUsers() {
  const [users, setusers] = useState([]);
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedUser, setSelectedUser] = useState({});
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    setSelectedSection(e.target.value);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/getusers`
        );
        setusers(res.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenViewModal = (isOpen, user) => {
    setOpenViewModal(true);
    setSelectedUser(user);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/deleteuser/${id}`
      );
      if (res.status === 200) {
        setusers(users.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleOpenPasswordModal = (isOpen, user) => {
    setOpenPasswordModal(true);
    setSelectedUser(user);
  };

  const handleUpdatePassword = async (_id) => {
    try {
      const newPassword = password;
      if (newPassword) {
        const res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/updatePassword/${_id}`,
          { password: password }
        );
        if (res.status === 200) {
          alert("Password updated successfully");
        }
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password");
    }
  };

  return (
    <div className="">
      <div>
        <Breadcrumb aria-label="Default breadcrumb example" className="ml-5">
          <Link to="/">
            <Breadcrumb.Item icon={HiHome}>Home</Breadcrumb.Item>
          </Link>

          <Breadcrumb.Item href="/dashboard?tab=dash">
            Dashboard
          </Breadcrumb.Item>

          <Breadcrumb.Item href="/dashboard?tab=users">Users</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="flex mx-auto mt-10 ml-20">
        <div className="justify-center w-full max-w-4xl p-1 mb-10 md:flex-row">
          <h1 className="mb-10 text-4xl font-semibold text-center">Users</h1>

          <div className="mb-5">
            <Label value="Section" />
            <Select
              id="section"
              onChange={handleChange}
              style={{ width: "300px" }}
            >
              <option  value={"All"}>
                All
              </option>
              <option value={"Production Section"}>Section 1</option>
              <option value={"Packing Section"}>Section 2</option>
              <option value={"WOW-B Section"}>Section 3</option>
            </Select>
          </div>
          <div className="flex gap-10">
            <div>
              <div className="mb-4 font-medium">{selectedSection}</div>
              <Table hoverable striped className="shadow-2xl rounded-3xl">
                <Table.Head>
                  <Table.HeadCell
                    style={{
                      maxHeight: "10px",
                      whiteSpace: "nowrap",
                    }}
                    className="text-white bg-primary"
                  >
                    Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Section
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Role
                  </Table.HeadCell>

                  <Table.HeadCell className="text-white bg-primary">
                    Password
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary"></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {users.map((user) => (
                    <Table.Row
                      key={user._id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.fullname}
                      </Table.Cell>
                      <Table.Cell>{user.section}</Table.Cell>
                      <Table.Cell>{user.role}</Table.Cell>
                      <Table.Cell>
                        {" "}
                        <Button
                          className="bg-primary hover:bg-secondary"
                          onClick={() => handleOpenPasswordModal(true, user)}
                        >
                          Update
                        </Button>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          color="failure"
                          onClick={() => handleOpenViewModal(true, user)}
                        >
                          View
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      {openPasswordModal && selectedUser && (
        <Modal
          show={openPasswordModal}
          onClose={() => setOpenPasswordModal(false)}
          size="xl"
          popup
          dismissible
        >
          <Modal.Header className="mt-5 mb-5 ml-5">
            Update Password
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col">
              <div className="mb-5">
                <Label value="User Fullname" htmlFor="fullname" />
                <TextInput
                  id="fullname"
                  type="text"
                  placeholder="Enter fullname"
                  value={selectedUser.fullname}
                  className="mt-2 input input-bordered"
                  disabled
                />
              </div>
              <div className="mb-5">
                <Label value="New Password" htmlFor="password" />
                <TextInput
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 input input-bordered"
                  helperText={
                    <strong>
                      * Please recheck the user before updating the Password .
                    </strong>
                  }
                />
              </div>

              <Button
                color="success"
                onClick={() => handleUpdatePassword(selectedUser._id)}
              >
                Update Password
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
      {openViewModal && selectedUser && (
        <Modal
          show={openViewModal}
          onClose={() => setOpenViewModal(false)}
          size="xl"
          popup
          dismissible
        >
          <Modal.Header className="mt-5 mb-5 ml-5">
            {selectedUser.fullname}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col">
              

              <div className="flex items-center justify-between gap-4 mb-3">
                <Label htmlFor="firstname">First Name:</Label>
                <TextInput
                  type="text"
                  placeholder="Your First Name"
                  className="w-[20rem] no-focus-ring"
                  id="firstname"
                  defaultValue={selectedUser.firstname}
                  disabled
                />
              </div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <Label htmlFor="lastname">Last Name:</Label>
                <TextInput
                  type="text"
                  defaultValue={selectedUser.lastname}
                  className="w-[20rem]"
                  placeholder="Your Last Name"
                  id="lastname"
                  disabled
                />
              </div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <Label htmlFor="fullname">Full Name:</Label>
                <TextInput
                  type="text"
                  defaultValue={selectedUser.fullname}
                  className="w-[20rem]"
                  placeholder="Your Full Name"
                  id="fullname"
                  disabled
                />
              </div>

              <div className="flex items-center justify-between gap-4 mb-3">
                <Label htmlFor="internationaltelephonenumber">
                  Contact No:
                </Label>
                <TextInput
                  type="text"
                  defaultValue={selectedUser.phonenumber}
                  placeholder="Phone Number"
                  className="w-[20rem]"
                  id="phonenumber"
                  disabled
                />
              </div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <Label htmlFor="email">Email:</Label>
                <TextInput
                  type="email"
                  defaultValue={selectedUser.email}
                  className="w-[20rem]"
                  placeholder="Email"
                  id="email"
                  disabled
                />
              </div>

            
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
