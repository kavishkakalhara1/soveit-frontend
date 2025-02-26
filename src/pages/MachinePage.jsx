import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { HiCheck, HiFire, HiHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Modal,
  Table,
  TextInput,
  Toast,
} from "flowbite-react";
import machinesample from "../assets/machinesample.png";
import axios from "axios";

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function MachinePage() {
  const { id } = useParams();
  const location = useLocation();
  const [machines, setMachines] = useState([]);
  const [machine, setMachine] = useState([]);
  const [openModalBreakdowns, setopenModalBreakdowns] = useState(false);
  const [openModalScheduledMaintenance, setopenModalScheduledMaintenance] =
    useState(false);
  const [breakdowns, setBreakdowns] = useState([]);
  const [formData, setFormData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const fetchMachineQR = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/machine/generate-qr-code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          }
        );
        const data = await response.json();
        setQrCode(data.qrCode); // Assuming the backend returns the QR code URL in the response
        console.log(data.qrCode);
        console.log(id);
      } catch (error) {
        console.error("Error fetching machine data:", error);
      }
    };

    fetchMachineQR();
  }, [id]);

  function onCloseModal() {
    setOpenModal(false);
  }

  useEffect(() => {
    if (machine) {
      setFormData(machine); // Initialize formData with machine's current details
    }
  }, [machine]);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        // Make the GET request using Axios
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/machine/get-machines`
        );
        const data = res.data;
        console.log("Fetched data:", data);

        // Update the machines state with the data received
        setMachines(data.machines);

        // Find the machine with the matching id
        const foundMachine = data.machines.find((proj) => proj._id === id);
        console.log("Found machine:", foundMachine);
        setMachine(foundMachine);
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
    };

    // Ensure id is defined before making the API call
    if (id) {
      fetchMachines();
    }
  }, [id]);

  const queryParams = new URLSearchParams(location.search);

  const fetchBreakdowns = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/machine/get-machine-breakdown?machinename=${encodeURIComponent(
          machine.machinename
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setBreakdowns(data.breakdowns);

      console.log(data.breakdowns);
    } catch (error) {}
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }

    try {
      const res = await fetch(`/api/machine/update-machine/${machine._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      } else {
        setMachine(data.machine);
        setToastMessage("Machine details updated successfully.");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("Failed to update machine details.");
      setShowToast(true); // Show the error toast
    }
  };

  const handleBreakdownsClick = async () => {
    await fetchBreakdowns(); // Fetch breakdown data
    setopenModalBreakdowns(true); // Show modal after data is fetched
  };

  const handleScheduledMaintenanceClick = async () => {
    // await fetchBreakdowns(); // Fetch breakdown data
    setopenModalScheduledMaintenance(true); // Show modal after data is fetched
  };

  //download machine QR code
  const handleDownloadQR = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = qrCode;

    image.onload = () => {
      const desiredWidth = 500; // Set desired width
      const desiredHeight = 500; // Set desired height
      canvas.width = desiredWidth;
      canvas.height = desiredHeight;
      context.drawImage(image, 0, 0, desiredWidth, desiredHeight);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg");
      link.download = `${machine.machinename}-QR.jpeg`;
      link.click();
    };
  };

  return (
    <>
      <div className="min-h-screen">
        <Breadcrumb
          aria-label="Default breadcrumb example"
          className="mt-20 ml-10"
        >
          <Link to="/">
            <Breadcrumb.Item icon={HiHome}>Home</Breadcrumb.Item>
          </Link>

          <Breadcrumb.Item href="/dashboard?tab=dash">
            Dashboard
          </Breadcrumb.Item>

          <Breadcrumb.Item href="/dashboard?tab=machines">
            Machines
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/dashboard?tab=machines">
            {machine.machinename}
          </Breadcrumb.Item>
        </Breadcrumb>
        {machine && (
          <div className="p-10 mx-auto">
            <h1 className="flex mx-auto mb-10 text-4xl font-semibold">
              {machine.machinename}
            </h1>
            <div className="flex justify-between gap-20 p-10 mx-auto bg-gray-100 shadow-md mx rounded-3xl">
              <div className="flex flex-col mx-auto">
                <div className="flex p-2 my-auto bg-white shadow-2xl rounded-2xl">
                  {qrCode ? (
                    <div>
                      <span className="flex">
                        <img
                          src={qrCode}
                          alt="QR Code"
                          width={"200"}
                          className="mx-auto my-auto"
                        />
                        <img
                          src={machinesample}
                          alt="QR Code"
                          width={"200"}
                          className="mx-auto my-auto"
                        />
                      </span>

                      <Button
                        className="m-5 bg-primary hover:bg-secondary focus:ring-0"
                        onClick={handleDownloadQR}
                      >
                        Download QR
                      </Button>
                    </div>
                  ) : (
                    <p>Loading QR Code...</p>
                  )}
                </div>
                <div className="h-40 p-5 my-auto bg-white shadow-2xl rounded-2xl w-96">
                  <h1 className="font-semibold text-center">Special Notes</h1>
                  <p className="text-center ">{machine.specialnotes}</p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="p-10 bg-white shadow-2xl rounded-2xl w-[400rem]"
              >
                <div>
                  <div className="overflow-x-auto">
                    <div className="p-4 ">
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base text-nowrap">
                        <strong>Machine Name</strong>
                        <span>: &nbsp;{machine.machinename}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base text-nowrap">
                        <strong>Machine Status</strong>
                        <span>: &nbsp;{machine.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base">
                        <strong>Model Number</strong>
                        <span>: &nbsp;{machine.modelnumber}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base">
                        <strong>Serial Number</strong>
                        <span>: &nbsp;{machine.serialnumber}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base">
                        <strong>Brand</strong>
                        <span>: &nbsp;{machine.brand}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base">
                        <strong>Process</strong>
                        <span>: &nbsp;{machine.process}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base">
                        <strong>Capacity</strong>
                        <span className="flex ">
                          : &nbsp;{" "}
                          <TextInput
                            type="text"
                            id="capacity"
                            placeholder="Capacity"
                            defaultValue={machine.capacity}
                            onChange={handleChange}
                          />
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base">
                        <strong>Power</strong>
                        <span className="flex">
                          : &nbsp;{" "}
                          <TextInput
                            type="text"
                            id="power"
                            placeholder="Power"
                            defaultValue={machine.power}
                            onChange={handleChange}
                          />
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base">
                        <strong>Current</strong>
                        <span className="flex">
                          : &nbsp;{" "}
                          <TextInput
                            type="text"
                            id="current"
                            placeholder="Current"
                            defaultValue={machine.current}
                            onChange={handleChange}
                          />
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base">
                        <strong>Voltage</strong>
                        <span className="flex">
                          : &nbsp;{" "}
                          <TextInput
                            type="text"
                            id="voltage"
                            placeholder="Voltage"
                            defaultValue={machine.voltage}
                            onChange={handleChange}
                          />
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base">
                        <strong>Operator</strong>
                        <span className="flex">
                          : &nbsp;{" "}
                          <TextInput
                            type="text"
                            id="operator"
                            placeholder="Operator"
                            defaultValue={machine.operator}
                            onChange={handleChange}
                          />
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-1 text-sm md:text-base">
                        <strong>Special Notes</strong>
                        <span className="flex">
                          : &nbsp;{" "}
                          <TextInput
                            type="text"
                            id="specialnotes"
                            placeholder="Special Notes"
                            defaultValue={machine.specialnotes}
                            onChange={handleChange}
                          />
                        </span>
                      </div>
                      <Button
                        className="mt-5 bg-primary hover:bg-secondary ring-0 ring-transparent"
                        onClick={handleSubmit}
                      >
                        Update
                      </Button>

                      {showToast && (
                        <Toast className="mt-5 border-2 border-green-500">
                          <div className="ml-3 text-sm font-normal">
                            {toastMessage}
                          </div>
                          <Toast.Toggle onDismiss={() => setShowToast(false)} />
                        </Toast>
                      )}
                    </div>
                  </div>
                </div>
              </form>

              <div className="p-10 my-auto bg-white shadow-2xl w-80 rounded-2xl">
                <div className="flex flex-col gap-10 overflow-x-auto">
                  <Link>
                    <Button
                      className="py-10 text-xl text-center text-white bg-primary rounded-3xl hover:bg-secondary w-60 focus:ring-0 "
                      onClick={handleBreakdownsClick}
                    >
                      <span className="text-xl"> Breakdowns</span>
                    </Button>
                  </Link>
                  <Link>
                    <Button
                      className="py-10 text-xl text-center text-white rounded-3xl hover:bg-secondary bg-primary focus:ring-0 w-60"
                      onClick={handleScheduledMaintenanceClick}
                    >
                      <span className="text-xl"> Scheduled</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        show={openModalBreakdowns}
        size="7xl"
        onClose={() => setopenModalBreakdowns(false)}
        popup
        dismissible
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Breakdown History
            </h3>
            <div className="overflow-x-auto">
              <Table hoverable striped id="breakdowns-table">
                <Table.Head>
                  <Table.HeadCell className="text-white bg-red-500">
                    Machine Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Status
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Scale
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Impact
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Description
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Informed By
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Time Reported
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Participants
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Used Materials
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Maintenance Responsible
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Special Notes
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Time Fixed
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Approval
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Supervisor
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Approved Time
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Supervisor Notes
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500"></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {breakdowns
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    ) // Sort by createdAt in descending order
                    .map((breakdown) => (
                      <Table.Row
                        className="bg-white border-gray-800 border-1 dark:border-gray-700 hover:bg-gray-200 hover:text-gray-900"
                        key={breakdown._id}
                      >
                        <Table.Cell className="">
                          {breakdown.machinename}
                        </Table.Cell>

                        <Table.Cell
                          className={`${
                            breakdown.status === "Broken"
                              ? "bg-red-600 text-white"
                              : breakdown.status === "Fixing"
                              ? "bg-blue-400 text-white"
                              : breakdown.status === "Fixed"
                              ? "bg-green-400 text-white"
                              : breakdown.status === "Pending"
                              ? "bg-orange-400 text-white"
                              : ""
                          }`}
                        >
                          {breakdown.status}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.scaleofBreakdown}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.impactofBreakdown}
                        </Table.Cell>
                        <Table.Cell style={{ width: "33%" }}>
                          {breakdown.description}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.breakdownInformedBy}
                        </Table.Cell>
                        <Table.Cell className="">
                          {formatDate(breakdown.timeReported)}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.participantstoFixed.join(", ")}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.usedMaterials.join(", ")}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.maintenaceInformedBy}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.specialNote}
                        </Table.Cell>
                        <Table.Cell className="">
                          {formatDate(breakdown.timeFixed)}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.approval}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.supervisorApproved}
                        </Table.Cell>
                        <Table.Cell className="">
                          {formatDate(breakdown.timeApproved)}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.supervisorNotes}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.status === "Pending" ? (
                            <Button
                              className="w-20 px-4 text-white bg-green-500 rounded hover:bg-green-600 focus:ring-0"
                              onClick={() => handleOpenModal(true, breakdown)}
                            >
                              Review
                            </Button>
                          ) : (
                            <Button className="w-20 px-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:ring-0">
                              view
                            </Button>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal: Scheduled Maintenance */}
      <Modal
        show={openModalScheduledMaintenance}
        size="7xl"
        onClose={() => setopenModalScheduledMaintenance(false)}
        popup
        dismissible
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Scheduled Maintenance
            </h3>
            <div className="overflow-x-auto">
              <Table hoverable striped id="breakdowns-table">
                <Table.Head>
                  <Table.HeadCell className="text-white bg-red-500">
                    Machine Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Status
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Scale
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Impact
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Description
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Informed By
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Time Reported
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Participants
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Used Materials
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Maintenance Responsible
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Special Notes
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Time Fixed
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Approval
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Supervisor
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Approved Time
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500">
                    Supervisor Notes
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-500"></Table.HeadCell>
                </Table.Head>
              </Table>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MachinePage;
