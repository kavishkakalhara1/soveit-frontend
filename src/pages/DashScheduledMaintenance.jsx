import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Datepicker,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { useSelector } from "react-redux";

function DashScheduledMaintenance() {
  const { currentUser } = useSelector((state) => state.user);
  const [scheduledMaintenanceList, setScheduledMaintenanceList] = useState([]);
  const [openAddNewModal, setOpenAddNewModal] = useState(false);
  const [openModalView, setOpenModalView] = useState(false);
  const [openModalApprove, setOpenModalApprove] = useState(false);
  const [selectedScheduledMaintenance, setSelectedScheduledMaintenance] =
    useState(null);
  const [supervisorNotes, setSupervisorNotes] = useState("");

  const handleOpenModal = (isOpen, schedulemaintenance) => {
    setOpenModalView(isOpen);
    setSelectedScheduledMaintenance(schedulemaintenance);
  };

  const handleopenAddNewModal = (isOpen) => {
    setOpenAddNewModal(true);
  };
  const handleOpenModalApprove = (isOpen, schedulemaintenance) => {
    setOpenModalApprove(isOpen);
    setSelectedScheduledMaintenance(schedulemaintenance);
  };

  useEffect(() => {
    const fetchScheduledMaintenance = async () => {
      const res = await fetch("/api/scheduled/get-scheduled-maintenance");
      const data = await res.json();
      setScheduledMaintenanceList(data.scheduledMaintenance);
    };
    fetchScheduledMaintenance();
  }, []);

  console.log(scheduledMaintenanceList);

  const handleApprove = async (scheduleMaintenanceId) => {
    const approvedSupervisor = currentUser.fullname;
    const timeApproved = new Date();
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/scheduled/approve-scheduled-maintenance/${scheduleMaintenanceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supervisorNotes,
            approvedSupervisor,
            timeApproved,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setScheduledMaintenanceList((prevState) =>
          prevState.map((schedulemaintenance) =>
            schedulemaintenance.scheduleMaintenanceId === scheduleMaintenanceId
              ? { ...schedulemaintenance, approval: "Approved" }
              : schedulemaintenance
          )
        );
        setOpenModalApprove(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReview = async (scheduleMaintenanceId) => {
    try {
      const res = await fetch(
        `/api/scheduled/review-scheduled-maintenance/${scheduleMaintenanceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supervisorNotes,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setScheduledMaintenanceList((prevState) =>
          prevState.map((schedulemaintenance) =>
            schedulemaintenance.scheduleMaintenanceId === scheduleMaintenanceId
              ? { ...schedulemaintenance, supervisorNotes }
              : schedulemaintenance
          )
        );
        setOpenModalApprove(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <Breadcrumb aria-label="Default breadcrumb example" className="ml-5">
          <Link to="/">
            <Breadcrumb.Item icon={HiHome}>Home</Breadcrumb.Item>
          </Link>

          <Breadcrumb.Item href="/dashboard?tab=dash">
            Dashboard
          </Breadcrumb.Item>

          <Breadcrumb.Item href="/dashboard?tab=machines">
            Machines
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="flex mx-auto mt-10 ml-20">
        <div className="justify-center w-full max-w-4xl p-1 mb-10 md:flex-row">
          <h1 className="mb-10 text-4xl font-semibold text-center">
            Scheduled Maintenance
          </h1>
          <div>
            <Button
              className="mb-10 bg-primary focus:ring-0 hover:bg-secondary w-60"
              onClick={() => handleopenAddNewModal(true)}
            >
              Add New
            </Button>
          </div>

          <div className="flex gap-10">
            <Table hoverable striped className="shadow-2xl rounded-3xl">
              <Table.Head>
                {/* <Table.HeadCell className="text-white bg-primary">
                  Machine ID
                </Table.HeadCell> */}
                <Table.HeadCell className="text-white bg-primary">
                  Maintenance ID
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Machine
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Due Date
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Fixing Start
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Time Fixed
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Approval
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary"></Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary"></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {scheduledMaintenanceList
                  .slice()
                  .reverse()
                  .map((schedulemaintenance) => (
                    <Table.Row key={schedulemaintenance._id}>
                      <Table.Cell>
                        {schedulemaintenance.scheduleMaintenanceId}
                      </Table.Cell>
                      <Table.Cell>{schedulemaintenance.machinename}</Table.Cell>
                      <Table.Cell>
                        {new Date(schedulemaintenance.dueDate).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(
                          schedulemaintenance.fixingStartTime
                        ).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(
                          schedulemaintenance.timeFixed
                        ).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>{schedulemaintenance.approval}</Table.Cell>
                      <Table.Cell>
                        <Button
                          className="bg-primary hover:bg-green-600"
                          onClick={() =>
                            handleOpenModal(true, schedulemaintenance)
                          }
                        >
                          View
                        </Button>
                      </Table.Cell>
                      <Table.Cell>
                        {schedulemaintenance.approval === "Pending" ? (
                          <Button
                            className="w-20 px-2 bg-red-500 hover:bg-red-600"
                            onClick={() =>
                              handleOpenModalApprove(true, schedulemaintenance)
                            }
                          >
                            Approve
                          </Button>
                        ) : (
                          <Button
                            className="w-20 px-2 bg-red-500 hover:bg-red-600"
                            disabled
                          >
                            Approved
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

      <Modal
        show={openAddNewModal}
        onClose={() => setOpenAddNewModal(false)}
        popup
        size="3xl"
      >
        <Modal.Header className="p-5 text-xl font-medium text-gray-900 dark:text-white">
          Add New Scheduled Maintenance
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-5">
            <Label>
              Machine
              <TextInput placeholder="Machine Name" />
            </Label>
            <div>
              <Label value="Due Date" />
              <Datepicker
                id="dueDate"
                onChange={"handleChange"}
                minDate={new Date()}
                maxDate={new Date(2030, 3, 30)}
              />
            </div>
            <div>
              <Label value="Fixing Start" />
              <Datepicker
                id="fixingstart"
                onChange={"handleChange"}
                minDate={new Date()}
                maxDate={new Date(2030, 3, 30)}
              />
            </div>
          </div>
          <div className="flex mt-5">
            <Button className="w-full bg-primary">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {openModalView && selectedScheduledMaintenance && (
        <Modal
          show={openModalView}
          onClose={() => setOpenModalView(false)}
          size="3xl"
          popup
          dismissible
        >
          <Modal.Header className="mt-5 mb-5 ml-5">
            Scheduled Maintenance Details
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <table className="w-full text-left table-auto">
                  <tbody>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Machine Name</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.machinename}
                      </td>
                    </tr>
                  
                   
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Maintenance Impact</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.impactofBreakdown}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Maintenance Description</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.description}
                      </td>
                    </tr>
                  
                   
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Fixing Start Time</strong>
                      </td>
                      <td className="p-2">
                        {new Date(
                          selectedScheduledMaintenance.fixingStartTime
                        ).toLocaleTimeString()}{" "}
                        -{" "}
                        {new Date(
                          selectedScheduledMaintenance.fixingStartTime
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Machine Name</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.machinename}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Last Maintenance ID</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.lastMaintainanceID}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Fixing Start Time</strong>
                      </td>
                      <td className="p-2">
                        {new Date(
                          selectedScheduledMaintenance.fixingStartTime
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Participants to Fix</strong>
                      </td>
                      <td className="p-2">
                        <ul>
                          {selectedScheduledMaintenance.participantstoFixed.map(
                            (participant, index) => (
                              <li key={index}>{participant}</li>
                            )
                          )}
                        </ul>
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Used Materials</strong>
                      </td>
                      <td className="p-2">
                        <ul>
                          {selectedScheduledMaintenance.usedMaterials.map(
                            (material) => (
                              <li key={material._id}>
                                {material.materialname} - {material.quantity}{" "}
                                {material.unit}
                              </li>
                            )
                          )}
                        </ul>
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Maintenance Informed By</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.maintenanceInformedBy}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Special Note</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.specialNote}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Time Fixed</strong>
                      </td>
                      <td className="p-2">
                        {new Date(
                          selectedScheduledMaintenance.timeFixed
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Approval</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.approval}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Supervisor Approved</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.supervisorApproved}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Time Approved</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.timeApproved
                          ? new Date(
                              selectedScheduledMaintenance.timeApproved
                            ).toLocaleString()
                          : "Not Approved Yet"}
                      </td>
                    </tr>
                    <tr className=" odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Supervisor Notes</strong>
                      </td>
                      <td className="p-2">
                        {selectedScheduledMaintenance.supervisorNotes}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default DashScheduledMaintenance;
