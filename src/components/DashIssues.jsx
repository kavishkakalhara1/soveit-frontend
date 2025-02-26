import { Breadcrumb, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import { Link } from "react-router-dom";

function DashIssues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch("/api/issues/get-issues");
        const data = await res.json();

        setIssues(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchIssues();
  }, []);

  console.log("Issue: " + issues);

  return (
    <div>
      <div>
        <Breadcrumb
          aria-label="Default breadcrumb example"
          className="fixed z-20 mt-10 ml-10"
        >
          <Link to="/">
            <Breadcrumb.Item icon={HiHome}>Home</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item href="/dashboard?tab=dash">
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/dashboard?tab=issues">Issues</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="flex mx-auto mt-10 ml-20">
        <div className="justify-center w-full max-w-4xl p-1 mb-10 md:flex-row">
          <h1 className="mt-5 mb-10 text-4xl font-semibold text-center">
            Issues
          </h1>

          {/* <Link to="/dashboard/machines/add-machine">
              <Button className="mb-10 bg-primary focus:ring-0 hover:bg-secondary w-60">
                Add New Machine
              </Button>
            </Link> */}

          <div className="flex gap-10">
            <div>
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
                    App
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Severity
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Type
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Description
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Reported By
                  </Table.HeadCell>
                  <Table.HeadCell className="text-white bg-primary">
                    Assigned To
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {issues.map((issue) => (
                    <Table.Row key={issue._id}>
                      <Table.Cell>{issue.app}</Table.Cell>
                      <Table.Cell>{issue.severity}</Table.Cell>
                      <Table.Cell>{issue.type}</Table.Cell>
                      <Table.Cell>{issue.description}</Table.Cell>
                      <Table.Cell>{issue.reportedBy}</Table.Cell>
                      <Table.Cell>{issue.assignedTo}</Table.Cell>
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

export default DashIssues;
