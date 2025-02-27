import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import LocationTypeModal from "../components/LicenseTypeModal/LicenseTypeModal.js";
import axios from "axios";

function LicenseType() {
  const [license, setLicense] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linceseEdit, setLinceseEdit] = useState({});

  const fetchLicense = async () => {
    try {
      const response = await axios.get("license/view");
      //   console.log("license", response.data);
      setLicense(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLincenseDelete = async (licenseId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this employee?"
      );
      if (confirmDelete) {
        await axios.delete(`license/delete/${licenseId}`);
        const updatedLicense = license.filter(
          (license) => license.id !== licenseId
        );
        setLicense(updatedLicense);
        toast.success("License deleted successfully!");
        fetchLicense();
      }
    } catch (error) {
      toast.error("Failed to delete License.");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLicense();
  }, []);

  const onLicenseAdd = () => {
    setDialogOpen(true);
  };

  const onLicenseEdit = (linceseEdit) => {
    setLinceseEdit(linceseEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setLinceseEdit("");
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "licenseType",
      text: "License Type",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "400px" },
    },
    {
      dataField: "actions",
      text: "Actions",
      headerClasses: "border-0",
      classes: "border-0",
      formatter: (cell, row) => (
        <>
          <Button
            variant="info"
            size="sm"
            onClick={() => {
              onLicenseEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleLincenseDelete(row.id)}
          >
            DELETE
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Card className="stripped-table-with-hover">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title as="h4">License Type</Card.Title>
                  <p className="card-category">Show All License Type</p>
                </div>
                <Button variant="primary" onClick={onLicenseAdd}>
                  ADD
                </Button>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <BootstrapTable
                  keyField="id"
                  data={license}
                  columns={columns}
                  pagination={paginationFactory()}
                  noDataIndication="data not found."
                  striped
                  hover
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <LocationTypeModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        linceseEdit={linceseEdit}
        setLinceseEdit={setLinceseEdit}
        fetchLicense={fetchLicense}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default LicenseType;
