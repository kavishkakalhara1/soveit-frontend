import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import emailjs from "@emailjs/browser";

export default function DashMail() {
  const { currentUser } = useSelector((state) => state.user);
  const form = useRef();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    to: "kavishkakalharapro@gmail.com",
    subject: "",
    // message: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  

  

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/mail/mail2all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formData.to,
          subject: formData.subject,
          htmlContent: `${formData.message}`, 
          // htmlContent: "", 
        }),
      });

      console.log(response);
      
      if (response.ok) {
        // Check if the response is in JSON format
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          console.log("Email sent successfully:", result);
          // Handle success (e.g., showing a success message)
        } else {
          // If not JSON, log or handle the plain text response
          const textResult = await response.text();
          console.log("Response received:", textResult);
        }
      } else {
        // Handle server errors or invalid responses
        console.error("Failed to send email");
      }
    } catch (error) {
      // Handle network errors
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="grid mx-auto ">
      <div className="items-center justify-center w-full max-w-4xl gap-10 p-1 mx-auto mb-20 md:flex">
        <div className="p-10 mt-20 border-t-4 border-b-4 shadow-xl md:pt-20 border-refaa-red rounded-2xl">
          <h1 className="mb-10 text-2xl font-semibold text-center md:text-3xl">
            Send Emails to All Members
          </h1>
          <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="mailSubject">Subject:</Label>
              <TextInput
                type="text"
                placeholder="Mail Subject"
                className="focus:ring-red-800 focus:border-red-800"
                id="mailSubject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                style={{ zIndex: 0 }}
                required
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="firstname">Message:</Label>
              <Textarea
                type="text"
                placeholder="Mail Body"
                className="focus:ring-red-800 focus:border-red-800"
                id="mailBody"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="mt-10 bg-refaa-red hover:bg-red-800 hover:shadow-xl ring-0 ring-transparent"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
