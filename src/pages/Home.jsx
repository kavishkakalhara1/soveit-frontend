import {
  Button,
  Datepicker,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

function Home() {
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [formData, setFormData] = useState({
    app: "",
    severity: "low",
    type: "issue",
    description: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleOpenAddIssueModal = () => {
    setShowAddIssueModal(true);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  console.log(formData);

  const handleReportIssue = async (e) => {
    const reportedBy = currentUser._id;
    setFormData({ ...formData, reportedBy });
    e.preventDefault();
    if (
      !formData.app ||
      !formData.severity ||
      !formData.type 
    ) {
      setErrorMessage("Please fill out all fields.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // Ensure 'reportedBy' is included
    const requestData = {
      ...formData,
      reportedBy: currentUser._id, // Add this explicitly
    };
      const res = await fetch("/api/issues/add-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log(res);
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage("An error occurred. Please try again.");
        setTimeout(() => setErrorMessage(null), 3000);
      }
      setLoading(false);
      if (res.ok) {
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
                Issue Reported Successfully
              </strong>
             
            </div>
          </div>,
          {
            style: {
              borderRadius: "10px",
              background: "red",
              color: "#fff",
              padding: "10px",
              minWidth: "250px",
            },
          }
        );
        setShowAddIssueModal(false);
        setFormData({
          app: "",
          severity: "low",
          type: "issue",
          description: "",
        });
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Toaster position="top-right"/>
      <section className="relative flex items-center justify-center w-full h-screen px-6 text-center text-white bg-gradient-to-r from-primary to-indigo-800">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-extrabold leading-tight sm:text-6xl">
            Track, Manage, and Solve Issues with{" "}
            <span className="text-yellow-400">SolveIt</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl opacity-90">
            A modern issue tracking system designed for seamless collaboration,
            efficiency, and rapid resolution.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <div
              onClick={handleOpenAddIssueModal}
              className="px-6 py-3 text-lg font-semibold text-blue-900 transition-all bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300 hover:cursor-pointer"
            >
              Get Started
            </div>
            <a
              href=""
              className="px-6 py-3 text-lg transition-all border border-white rounded-lg hover:bg-white hover:text-blue-900"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <Modal
        show={showAddIssueModal}
        onClose={() => setShowAddIssueModal(false)}
      >
        <Modal.Header>Report New Issue</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleReportIssue}>
            <div className="flex flex-col gap-5">
              <div>
                <Label value="Select Your App" />
                <TextInput
                  placeholder="App Name"
                  id="app"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label value="Severity" />
                <Select id="severity" onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>
              <div>
                <Label value="Type" />
                <Select id="type" onChange={handleChange}>
                  <option value="issue">Issue</option>
                  <option value="systemfailure">System Failure</option>
                  <option value="bug">Bug</option>
                </Select>
              </div>
              <div>
                <Label value="Description" />
                <TextInput
                  placeholder="Description"
                  id="description"
                  onChange={handleChange}
                />
              </div>
            </div>
            {errorMessage && (
              <div className="mt-5 text-red-500">{errorMessage}</div>
            )}
            <div className="flex mt-5">
              <Button
                className="w-full bg-primary hover:bg-secondary"
                
                type="submit"
              >
                Report
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Home;
