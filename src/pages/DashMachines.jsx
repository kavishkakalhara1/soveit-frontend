import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb } from "flowbite-react";
import axios from "axios";

export default function DashMachines() {
  const [machines, setMachines] = useState([]);
  const [allMachines, setAllMachines] = useState([]);
  const [selectedSection, setSelectedSection] = useState("Production Section");
  const [searchQuery, setSearchQuery] = useState(""); // Track current search query
  const [openAddMachineModal, setOpenAddMachineModal] = useState(false);
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
      !formData.section ||
      !formData.machinename ||
      !formData.status ||
      !formData.brand ||
      !formData.serialnumber ||
      !formData.modelnumber ||
      !formData.capacity ||
      !formData.power ||
      !formData.operator
    ) {
      setErrorMessage("Please fill out all fields.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/machine/add-machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log(res);
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage("An error occurred. Please try again.");
        setTimeout(() => setErrorMessage(null), 3000);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/dashboard?tab=machines");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const handleChangeSection = (e) => {
    const newSection = e.target.value;
    setSelectedSection(newSection);
    // Reset search query on section change
    setSearchQuery("");
    // Filter machines for the new section only
    const sectionMachines = allMachines.filter(
      (machine) => machine.section === newSection
    );
    setMachines(sectionMachines.slice(0, 10));
  };

  const fetchMachines = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/machine/get-machines`
      );
      setAllMachines(data.machines);
      // Filter initial machines by the default section
      const sectionMachines = data.machines.filter(
        (machine) => machine.section === selectedSection
      );
      setMachines(sectionMachines.slice(0, 10));
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query) {
      // If search is cleared, show machines only filtered by section
      const sectionMachines = allMachines.filter(
        (machine) => machine.section === selectedSection
      );
      setMachines(sectionMachines.slice(0, 10));
    } else {
      const filtered = allMachines.filter(
        (machine) =>
          machine.section === selectedSection &&
          machine.machinename.toLowerCase().includes(query)
      );
      setMachines(filtered.slice(0, 10));
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
          <h1 className="mb-10 text-4xl font-semibold text-center">Machines</h1>

          <Button
            className="mb-10 bg-primary focus:ring-0 hover:bg-secondary w-60"
            onClick={() => setOpenAddMachineModal(true)}
          >
            Add New Machine
          </Button>

          {/* <Link to="/dashboard/machines/add-machine">
            <Button className="mb-10 bg-primary focus:ring-0 hover:bg-secondary w-60">
              Add New Machine
            </Button>
          </Link> */}
          <div className="flex gap-4">
            <div className="mb-5">
              <Label value="Section" />
              <Select
                id="section"
                onChange={handleChangeSection}
                style={{ width: "300px" }}
                value={selectedSection} // Make it a controlled component
              >
                <option disabled value="Section">
                  Section
                </option>
                <option value="Production Section">Production Section</option>
                <option value="Packing Section">Packing Section</option>
                <option value="WOW-B Section">WOW-B Section</option>
                <option value="Cold Chain Section">Cold Chain Section</option>
                <option value="Outside Section">Outside Section</option>
              </Select>
            </div>
            <div className="mb-5">
              <Label value="Search Machine" />
              <TextInput
                placeholder="Search"
                onChange={handleSearch}
                value={searchQuery} // Controlled input
              />
            </div>
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
                      width: "200px",
                    }}
                    className="text-white bg-primary"
                  >
                    Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Status
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Capacity (kg)
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Power
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Voltage
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Operator
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Special Notes
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary"></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {machines.map((machine) => (
                    <Table.Row
                      key={machine._id}
                      style={{
                        backgroundColor:
                          machine.status === "Breakdown"
                            ? "#345c63"
                            : machine.status === "Fixing"
                            ? "#60a5fa"
                            : machine.status === "Fixed"
                            ? "white"
                            : machine.status === "Pending"
                            ? "#f97316"
                            : "white",
                        color: ["Breakdown"].includes(machine.status)
                          ? "white"
                          : "black",
                      }}
                    >
                      <Table.Cell
                        style={{
                          maxHeight: "10px",
                          whiteSpace: "nowrap",
                        }}
                        className="w-80"
                      >
                        <Link to={`/dashboard/machines/${machine._id}`}>
                          {machine.machinename}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{machine.status}</Table.Cell>
                      <Table.Cell>{machine.capacity}</Table.Cell>
                      <Table.Cell>{machine.power}</Table.Cell>
                      <Table.Cell>{machine.voltage}</Table.Cell>
                      <Table.Cell>{machine.operator}</Table.Cell>
                      <Table.Cell>{machine.specialnotes}</Table.Cell>
                      <Table.Cell>
                        <Link
                          to={`/dashboard/machines/${machine._id}`}
                          className="hover:text-green-500 hover:font-semibold"
                        >
                          <Button className="bg-primary focus:ring-0 hover:bg-secondary">
                            View
                          </Button>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={openAddMachineModal}
        dismissible
        onClose={() => {
          setOpenAddMachineModal(false);
        }}
      >
        <Modal.Header>Add New Machine</Modal.Header>
        <Modal.Body>
          <div className="">
            <form className="" onSubmit={handleSubmit}>
              <div className="mb-5">
                <Label value="Section" htmlFor="section" />
                <Select id="section" onChange={handleChange}>
                  <option disabled value={"Section"}>
                    Section
                  </option>
                  <option value={"Production Section"}>
                    Production Section
                  </option>
                  <option value={"Packing Section"}>Packing Section</option>
                  <option value={"WOW-B Section"}>WOW-B Section</option>
                  <option value={"Cold Chain Section"}>
                    Cold Chain Section
                  </option>
                  <option value={"Outside Section"}>Outside Section</option>
                </Select>
              </div>

              <div className="mb-5">
                <Label value="Machine Name" />
                <TextInput
                  type="text"
                  placeholder="Machine Name"
                  id="machinename"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5">
                <Label value="Serial Number" />
                <TextInput
                  type="number"
                  placeholder="Serial Number"
                  id="serialnumber"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-5">
                <Label value="Model Number" />
                <TextInput
                  type="number"
                  placeholder="Model Number"
                  id="modelnumber"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5">
                <Label value="Status" />
                <TextInput
                  type="text"
                  placeholder="Status"
                  id="status"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-5">
                <Label value="Operator" />
                <TextInput
                  type="text"
                  placeholder="Operator"
                  id="operator"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5">
                <Label value="Brand" />
                <TextInput
                  type="text"
                  placeholder="Brand"
                  id="brand"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-5">
                <Label value="Special Notes" />
                <TextInput
                  type="text"
                  placeholder="Special Notes"
                  id="specialnotes"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-5">
                <Label value="Capacity" />
                <TextInput
                  type="number"
                  placeholder="Capacity"
                  id="capacity"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5">
                <Label value="Power" />
                <TextInput
                  type="number"
                  placeholder="Power"
                  id="power"
                  onChange={handleChange}
                />
              </div>
              {errorMessage && (
              <Alert className="mt-2" color="failure">
                {errorMessage}
              </Alert>
            )}

              <Button
                className="w-full mx-auto mt-5 mb-5 bg-primary hover:bg-secondary ring-0 focus:ring-transparent"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Report Issue"
                )}
              </Button>
            </form>
          
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
