import { useEffect, useState } from "react";
import { Button, Table, Breadcrumb } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { use } from "react";

export default function DashboardComp() {
  const [breakdowns, setBreakdowns] = useState([]);
  const [machines, setMachines] = useState([]);

  const fetchMachines = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/machine/get-machines`
      );

      const res = await response.json();

      setMachines(res.machines.slice(0, 10));
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const fetchBreakdowns = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/machine/get-breakdowns`
      );

      const res = await response.json();

      setBreakdowns(res.breakdowns);
    } catch (error) {
      console.error("Error fetching breakdowns:", error);
    }
  };

  useEffect(() => {
    fetchMachines(); // Initial fetch
  });

  useEffect(() => {
    fetchBreakdowns(); // Initial fetch
    const interval = setInterval(fetchBreakdowns, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <div>
        <Breadcrumb aria-label="Default breadcrumb example" className="ml-5 ">
          <Link to="/">
            <Breadcrumb.Item icon={HiHome}>Home</Breadcrumb.Item>
          </Link>

          <Breadcrumb.Item href="/dashboard?tab=dash">
            Dashboard
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="p-10 mx-auto">
        <h1 className="flex justify-center mx-auto mb-10 text-4xl font-semibold">
          Dashboard
        </h1>
        <div className="flex p-10 mx-auto bg-gray-100 shadow-md mx rounded-3xl">
          <div className="p-10 bg-white shadow-2xl rounded-2xl">
            <span className="flex flex-row justify-between mb-5">
              <h1 className="mb-10 text-3xl font-bold text-start">Machines</h1>
              <Link to="/dashboard?tab=machines">
                <Button className="items-center h-10 bg-primary focus:ring-0 hover:bg-green-600">
                  See All
                </Button>
              </Link>
            </span>
            <div className="overflow-x-auto">
              <Table hoverable striped>
                <Table.Head>
                  <Table.HeadCell className="text-white bg-primary">
                    Machine Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Status
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {machines &&
                    machines.map((machines) => (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Link to={`/dashboard/machines/${machines._id}`}>
                          <Table.Cell className="text-gray-900 whitespace-nowrap dark:text-white">
                            {machines.machinename}
                          </Table.Cell>
                        </Link>
                        <Table.Cell className="text-green-500">
                          Working
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
          </div>
          <div className="p-10 ml-10 bg-white shadow-2xl flex-2 rounded-2xl">
            <span className="flex flex-row justify-between mb-5">
              <h1 className="mb-10 text-3xl font-bold text-start">
                Ongoing Maintenance
              </h1>
              <Link to="/dashboard?tab=breakdowns">
                <Button className="items-center h-10 bg-red-600 focus:ring-0 hover:bg-red-700">
                  See All
                </Button>
              </Link>
            </span>
            <div className="overflow-x-auto">
              <Table hoverable striped>
                <Table.Head>
                  <Table.HeadCell className="text-white bg-red-600">
                    Machine Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-600">
                    Status
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-600">
                    Issue
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-red-600"></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {breakdowns &&
                    breakdowns.map((breakdown) => (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {breakdown.machinename}
                        </Table.Cell>
                        <Table.Cell className="text-red-600">
                          {breakdown.status}
                        </Table.Cell>
                        <Table.Cell className="">
                          {breakdown.scaleofBreakdown}
                        </Table.Cell>
                        <Table.Cell>
                          <Link to="/dashboard?tab=breakdowns">
                            <Button className="bg-red-600 focus:ring-0 hover:bg-primary">
                              Check
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
    </div>
  );
}
