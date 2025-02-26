import { Breadcrumb, Button, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import { Link } from "react-router-dom";

function DashInventory() {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      const res = await fetch("/api/inventory/get-inventory-item");
      const data = await res.json();
      setInventoryItems(data.inventoryItems);
    };
    fetchInventoryItems();
  }, []);
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

          <Breadcrumb.Item href="/dashboard?tab=inventory">
            Inventory
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="flex mx-auto mt-10 ml-20">
        <div className="justify-center w-full max-w-4xl p-1 mb-10 md:flex-row">
          <h1 className="mb-10 text-4xl font-semibold text-center">
            Inventory
          </h1>
          <Link to="/dashboard/inventory/add-inventory-item" className="">
              <Button className="mt-5 mb-5 bg-primary focus:ring-0 hover:bg-secondary h-15">
                Add New Inventory Item
              </Button>
            </Link>
          <div className="flex gap-10">
            <Table hoverable striped className="shadow-2xl rounded-3xl">
              <Table.Head>
                {/* <Table.HeadCell className="text-white bg-primary">
                  Machine ID
                </Table.HeadCell> */}
                <Table.HeadCell className="text-white bg-primary">
                  Material Name
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Material Code
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Category
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Quantity Available
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Reorder Level
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Last Updated
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Location
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Cost per Unit
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Status
                </Table.HeadCell>
                <Table.HeadCell className="text-white bg-primary">
                  Supplier Details
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {inventoryItems.map((inventoryItem) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={inventoryItem._id}
                  >
                    
                    <Table.Cell className="">
                      {inventoryItem.materialname}
                    </Table.Cell>
                    <Table.Cell className="">
                      {inventoryItem.materialcode}
                    </Table.Cell>
                    <Table.Cell className="">
                      {inventoryItem.category}
                    </Table.Cell>
                    <Table.Cell className="">
                      {inventoryItem.quantityavailable}
                    </Table.Cell>
                    <Table.Cell className="">
                      {inventoryItem.reorderlevel}
                    </Table.Cell>
                    <Table.Cell className="">
                      {inventoryItem.lastupdated}
                    </Table.Cell>
                    <Table.Cell className="">
                      {inventoryItem.location}
                    </Table.Cell>
                    <Table.Cell className="">
                      {inventoryItem.costperunit}
                    </Table.Cell>
                    <Table.Cell className="">{inventoryItem.status}</Table.Cell>
                    <Table.Cell className="">
                      {Array.isArray(inventoryItem.supplierdetails) && inventoryItem.supplierdetails[1] 
                        ? inventoryItem.supplierdetails[1] 
                        : "N/A"}
                    </Table.Cell>

                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashInventory;