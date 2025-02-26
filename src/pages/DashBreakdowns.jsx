import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Breadcrumb,
  TextInput,
  Label,
  Modal,
  Textarea,
  Select,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import { saveAs } from "file-saver";
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

export default function DashBreakdowns() {
  const [breakdowns, setBreakdowns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [supervisorNotes, setSupervisorNotes] = useState("");
  const [openModalViewBreakdown, setOpenModalViewBreakdown] = useState(false);
  const fullname = currentUser.fullname;

  const [selectedBreakdown, setSelectedBreakdown] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("");

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const filteredBreakdowns = selectedStatus
    ? breakdowns.filter((breakdown) => breakdown.status === selectedStatus)
    : breakdowns;

  const handleOpenModal = (isOpen, breakdown) => {
    setOpenModal(isOpen);
    setSelectedBreakdown(breakdown);
  };

  const handleOpenModalBreakdown = (isOpen, breakdown) => {
    setOpenModalViewBreakdown(true);
    setSelectedBreakdown(breakdown);
  };

  function onCloseModal() {
    setOpenModal(false);
    // setEmail('');
  }

  const handleApprove = async (breakdownId) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/machine/breakdown/${breakdownId}`,
        {
          approvedSupervisor: fullname,
          timeApproved: new Date.now().toISOString(),
          supervisorNotes: supervisorNotes,
        }
      );
      setOpenModal(false);

      if (response.ok) {
        // Optionally, update the UI or state here
        setOpenModal(false);
      } else {
        console.error("Failed to update breakdown status");
      }
    } catch (error) {
      console.error("Error updating breakdown status:", error);
    }
  };
  const handleReview = async (breakdownId) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/machine/breakdown-review/${breakdownId}`,
        {
          approvedSupervisor: fullname,
          supervisorNotes: supervisorNotes,
        }
      );
      setOpenModal(false);

      if (response.ok) {
        // Optionally, update the UI or state here
        setOpenModal(false);
      } else {
        console.error("Failed to update breakdown review");
      }
    } catch (error) {
      console.error("Error updating breakdown review:", error);
    }
  };

  const fetchBreakdowns = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/machine/get-breakdowns`
      ); // Replace with your API endpoint
      setBreakdowns(response.data.breakdowns);
    } catch (error) {
      console.error("Error fetching breakdowns:", error);
    }
  };

  useEffect(() => {
    fetchBreakdowns(); // Initial fetch
    const interval = setInterval(fetchBreakdowns, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });
  
    // Add company logo
    const img = new Image();
    img.src = "src/assets/logo.png"; // Ensure this path is correct
    img.onload = () => {
      doc.addImage(img, "PNG", 14, 10, 30, 15); // Adjust position and size as needed
  
      // Add title
      doc.setFontSize(18);
      doc.text("Maintenance Summary", 50, 22);
  
      // Add current date to the right of the title
      const currentDate = new Date().toLocaleDateString();
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(currentDate);
      doc.text(currentDate, pageWidth - textWidth - 14, 22);
  
      // Add table with custom header row color
      doc.autoTable({
        startY: 30,
        headStyles: { fillColor: [17, 178, 172] }, // Change header row color to #11b2ac
        head: [
          [
            "Machine Name",
            "Status",
            "Scale",
            "Impact",
            "Description",
            "Informed By",
            "Time Approved",
            "Supervisor",
            "Supervisor Notes",
          ],
        ],
        body: breakdowns.map((breakdown) => [
          breakdown.machinename,
          breakdown.status,
          breakdown.scaleofBreakdown,
          breakdown.impactofBreakdown,
          breakdown.description,
          breakdown.BreakdownInformedBy,
          formatDate(breakdown.timeApproved),
          breakdown.supervisorApproved,
          breakdown.supervisorNotes,
        ]),
      });
  
      // Generate file name with current date
      const formattedDate = new Date().toISOString().split("T")[0];
      const fileName = `Breakdown-Report-Generated-on-${formattedDate}.pdf`;
  
      doc.save(fileName);
    };
  };
  


  const exportToCSV = () => {
    const fields = [
      "Machine Name",
      "Status",
      "Scale",
      "Impact",
      "Description",
      "Informed By",
      "Time Approved",
      "Supervisor",
      "Supervisor Notes",
    ];

    const data = breakdowns.map((breakdown) => ({
      "Machine Name": breakdown.machinename,
      Status: breakdown.status,
      Scale: breakdown.scaleofBreakdown,
      Impact: breakdown.impactofBreakdown,
      Description: breakdown.description,
      "Informed By": breakdown.BreakdownInformedBy,
      "Time Approved": formatDate(breakdown.timeApproved),
      Supervisor: breakdown.supervisorApproved,
      "Supervisor Notes": breakdown.supervisorNotes,
    }));

    const csv = Papa.unparse(data, { header: true });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const formattedDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const fileName = `Breakdown-Report-Generated-on-${formattedDate}.csv`;

    saveAs(blob, fileName);
  };

  return (
    <div className="overflow-scroll">
      <Breadcrumb aria-label="Default breadcrumb example" className="ml-5 ">
        <Link to="/">
          <Breadcrumb.Item icon={HiHome} className="text-white">
            Home
          </Breadcrumb.Item>
        </Link>

        <Breadcrumb.Item href="/dashboard?tab=dash">Dashboard</Breadcrumb.Item>

        <Breadcrumb.Item href="/dashboard?tab=breakdowns">
          Breakdowns
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="p-10 mx-auto ">
        <h1 className="flex mb-10 ml-40 text-4xl font-semibold">
          Machine Breakdowns
        </h1>
        <div className="flex bg-gray-100 shadow-md mx rounded-3xl">
          <div className="p-10 bg-white shadow-2xl flex-2 rounded-2xl">
            <h1 className="flex items-center gap-5 mb-10 text-3xl font-bold text-start">
              Ongoing Maintenance{" "}
              <Button
                onClick={downloadPDF}
                className="bg-primary hover:bg-secondary focus:ring-0"
              >
                Download PDF
              </Button>
              <Button
                onClick={exportToCSV}
                className="bg-primary hover:bg-secondary focus:ring-0"
              >
                Download CSV
              </Button>
            </h1>

            <div className="mt-5 mb-5 ml-5">
              <Label htmlFor="status" value="Filter by Status" />
              <Select
                id="status"
                onChange={handleStatusChange}
                value={selectedStatus}
                className="w-40 focus:ring-0"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Fixed">Approved</option>
                <option value="Breakdown">Broken</option>
              
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table hoverable striped id="breakdowns-table">
                <Table.Head>
                  <Table.HeadCell className="text-white bg-primary">
                    Machine Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Status
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Scale
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Impact
                  </Table.HeadCell>

                  <Table.HeadCell className="text-white bg-primary">
                    Informed By
                  </Table.HeadCell>

                  <Table.HeadCell className="text-white bg-primary">
                    Special Notes
                  </Table.HeadCell>

                  <Table.HeadCell className="text-white bg-primary">
                    Approval
                  </Table.HeadCell>

                  <Table.HeadCell className="text-white bg-primary">
                    Supervisor Notes
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary"></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {filteredBreakdowns
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    ) // Sort by createdAt in descending order
                    .map((breakdown) => (
                      <Table.Row
                        className="bg-white border-gray-800 border-1 dark:border-gray-700 hover:bg-gray-200 hover:text-gray-900"
                        key={breakdown._id}
                      >
                        {/* <Link to={`/dashboard/machines/${machine._id}`}>
                      <Table.Cell className="text-gray-900 whitespace-nowrap dark:text-white">
                        {machine._id}
                      </Table.Cell>
                    </Link> */}

                        <Table.Cell className="">
                          {breakdown.machinename}
                        </Table.Cell>

                        <Table.Cell
                          className={`${
                            breakdown.status === "Breakdown"
                              ? "bg-red-600 text-white"
                              : breakdown.status === "Fixing"
                              ? "bg-secondary text-white"
                              : breakdown.status === "Fixed"
                              ? "bg-primary text-white"
                              : breakdown.status === "Pending Approval"
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

                        <Table.Cell className="">
                          {breakdown.breakdownInformedBy}
                        </Table.Cell>

                        <Table.Cell className="">
                          {breakdown.specialNote}
                        </Table.Cell>

                        <Table.Cell className="">
                          {breakdown.approval}
                        </Table.Cell>

                        <Table.Cell className="">
                          {breakdown.supervisorNotes}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.status === "Pending Approval" ? (
                            <Button
                              className="w-20 px-4 text-white rounded bg-primary hover:bg-secondary focus:ring-0"
                              onClick={() => handleOpenModal(true, breakdown)}
                            >
                              Review
                            </Button>
                          ) : (
                            <Button
                              className="w-20 px-4 text-white rounded bg-secondary hover:bg-primary focus:ring-0"
                              onClick={() =>
                                handleOpenModalBreakdown(true, breakdown)
                              }
                            >
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
        </div>
      </div>
      {openModal && selectedBreakdown && (
        <Modal show={openModal} size="2xl" onClose={onCloseModal} popup>
          <Modal.Header className="p-5 text-xl font-medium text-gray-900 dark:text-white">
            Review the Breakdown
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <table className="w-full text-left table-auto">
                <tbody>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Machine Name</strong>
                    </td>
                    <td className="p-2">{selectedBreakdown.machinename}</td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Machine Status</strong>
                    </td>
                    <td className="p-2">{selectedBreakdown.status}</td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Scale of Impact</strong>
                    </td>
                    <td className="p-2">
                      {selectedBreakdown.scaleofBreakdown}
                    </td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Breakdown Impact</strong>
                    </td>
                    <td className="p-2">
                      {selectedBreakdown.impactofBreakdown}
                    </td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Breakdown Description</strong>
                    </td>
                    <td className="p-2">{selectedBreakdown.description}</td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Breakdown Informed By</strong>
                    </td>
                    <td className="p-2">
                      {selectedBreakdown.breakdownInformedBy}
                    </td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Time Report</strong>
                    </td>
                    <td className="p-2">
                      {new Date(
                        selectedBreakdown.timeReported
                      ).toLocaleTimeString()}{" "}
                      -{" "}
                      {new Date(
                        selectedBreakdown.timeReported
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Fixing Start Time</strong>
                    </td>
                    <td className="p-2">
                      {new Date(
                        selectedBreakdown.fixingStartTime
                      ).toLocaleTimeString()}{" "}
                      -{" "}
                      {new Date(
                        selectedBreakdown.fixingStartTime
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Machine Name</strong>
                    </td>
                    <td className="p-2">{selectedBreakdown.machinename}</td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Last Maintenance ID</strong>
                    </td>
                    <td className="p-2">
                      {selectedBreakdown.lastMaintainanceID}
                    </td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Fixing Start Time</strong>
                    </td>
                    <td className="p-2">
                      {new Date(
                        selectedBreakdown.fixingStartTime
                      ).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Participants to Fix</strong>
                    </td>
                    <td className="p-2">
                      <ul>
                        {selectedBreakdown.participantstoFixed.map(
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
                        {selectedBreakdown.usedMaterials.map((material) => (
                          <li key={material._id}>
                            {material.materialname} - {material.quantity}{" "}
                            {material.unit}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Maintenance Informed By</strong>
                    </td>
                    <td className="p-2">
                      {selectedBreakdown.maintenanceInformedBy}
                    </td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Special Note</strong>
                    </td>
                    <td className="p-2">{selectedBreakdown.specialNote}</td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Time Fixed</strong>
                    </td>
                    <td className="p-2">
                      {new Date(selectedBreakdown.timeFixed).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Approval</strong>
                    </td>
                    <td className="p-2">{selectedBreakdown.approval}</td>
                  </tr>

                  <tr className=" odd:bg-gray-100 even:bg-white">
                    <td className="p-2">
                      <strong>Supervisor Notes</strong>
                    </td>
                    <td className="p-2">{selectedBreakdown.supervisorNotes}</td>
                  </tr>
                </tbody>
              </table>

              <div>
                <div className="block mb-2">
                  <Label htmlFor="username" value="Your email:" />
                </div>
                <TextInput
                  id="username"
                  placeholder={"updateCurrentUser.email"}
                  value={currentUser.email}
                  disabled
                />
              </div>
              <div>
                <div className="block mb-2">
                  <Label htmlFor="supervisorNotes" value="Supervisor Notes" />
                </div>
                <Textarea
                  id="supervisorNotes"
                  type="text"
                  placeholder=""
                  className=""
                  onChange={(e) => setSupervisorNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-center gap-4 mb-10">
                <Button
                  color="failure"
                  onClick={() => handleReview(selectedBreakdown._id)}
                  className="w-40 focus:ring-0"
                >
                  Review Only
                </Button>
                <Button
                  
                  onClick={() => handleApprove(selectedBreakdown._id)}
                  className="w-40 focus:ring-0 bg-primary hover:bg-secondary"
                >
                  Approve
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {openModalViewBreakdown && selectedBreakdown && (
        <Modal
          show={openModalViewBreakdown}
          onClose={() => setOpenModalViewBreakdown(false)}
          size="3xl"
          popup
          dismissible
        >
          <Modal.Header className="mt-5 mb-5 ml-5">
            Breakdown Details
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <table className="w-full text-left table-auto">
                  <tbody>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Machine ID</strong>
                      </td>
                      <td className="p-2">{selectedBreakdown.machineId}</td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Machine Name</strong>
                      </td>
                      <td className="p-2">{selectedBreakdown.machinename}</td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Machine Status</strong>
                      </td>
                      <td className="p-2">{selectedBreakdown.status}</td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Scale of Impact</strong>
                      </td>
                      <td className="p-2">
                        {selectedBreakdown.scaleofBreakdown}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Breakdown Impact</strong>
                      </td>
                      <td className="p-2">
                        {selectedBreakdown.impactofBreakdown}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Breakdown Description</strong>
                      </td>
                      <td className="p-2">{selectedBreakdown.description}</td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Breakdown Informed By</strong>
                      </td>
                      <td className="p-2">
                        {selectedBreakdown.breakdownInformedBy}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Time Report</strong>
                      </td>
                      <td className="p-2">
                        {new Date(
                          selectedBreakdown.timeReported
                        ).toLocaleTimeString()}{" "}
                        -{" "}
                        {new Date(
                          selectedBreakdown.timeReported
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Fixing Start Time</strong>
                      </td>
                      <td className="p-2">
                        {new Date(
                          selectedBreakdown.fixingStartTime
                        ).toLocaleTimeString()}{" "}
                        -{" "}
                        {new Date(
                          selectedBreakdown.fixingStartTime
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Machine Name</strong>
                      </td>
                      <td className="p-2">{selectedBreakdown.machinename}</td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Last Maintenance ID</strong>
                      </td>
                      <td className="p-2">
                        {selectedBreakdown.lastMaintainanceID}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Fixing Start Time</strong>
                      </td>
                      <td className="p-2">
                        {new Date(
                          selectedBreakdown.fixingStartTime
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Participants to Fix</strong>
                      </td>
                      <td className="p-2">
                        <ul>
                          {selectedBreakdown.participantstoFixed.map(
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
                          {selectedBreakdown.usedMaterials.map((material) => (
                            <li key={material._id}>
                              {material.materialname} - {material.quantity}{" "}
                              {material.unit}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Maintenance Informed By</strong>
                      </td>
                      <td className="p-2">
                        {selectedBreakdown.maintenanceInformedBy}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Special Note</strong>
                      </td>
                      <td className="p-2">{selectedBreakdown.specialNote}</td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Time Fixed</strong>
                      </td>
                      <td className="p-2">
                        {new Date(selectedBreakdown.timeFixed).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Approval</strong>
                      </td>
                      <td className="p-2">{selectedBreakdown.approval}</td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Supervisor Approved</strong>
                      </td>
                      <td className="p-2">
                        {selectedBreakdown.supervisorApproved}
                      </td>
                    </tr>
                    <tr className="odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Time Approved</strong>
                      </td>
                      <td className="p-2">
                        {selectedBreakdown.timeApproved
                          ? new Date(
                              selectedBreakdown.timeApproved
                            ).toLocaleString()
                          : "Not Approved Yet"}
                      </td>
                    </tr>
                    <tr className=" odd:bg-gray-100 even:bg-white">
                      <td className="p-2">
                        <strong>Supervisor Notes</strong>
                      </td>
                      <td className="p-2">
                        {selectedBreakdown.supervisorNotes}
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
