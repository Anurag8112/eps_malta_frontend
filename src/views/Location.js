import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import LocationModal from "../components/LocationModal/LocaltionModal.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Location() {
  const [locations, setLocations] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [locationEdit, setLocationEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("location/view");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setLocations(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleLocationDelete = async (locationId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this employee?"
      );
      if (confirmDelete) {
        await axios.delete(`location/delete/${locationId}`);
        const updatedLocations = locations.filter(
          (location) => location.id !== locationId
        );
        setLocations(updatedLocations);
        toast.success("Location deleted successfully!");
        fetchLocations();
      }
    } catch (error) {
      toast.error("Failed to delete location.");
      console.log(error);
    }
  };

  const onLocationAdd = () => {
    setDialogOpen(true);
  };

  const onLocationEdit = (locationEdit) => {
    setLocationEdit(locationEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setLocationEdit("");
  };

  const columns = [
    {
      dataField: "S NO.",
      text: "S NO.",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "location",
      text: "Location",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "200px" },
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "380px" },
    },
    {
      dataField: "rate",
      text: "Rate",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "80px" },
      formatter: (cellContent, row) => {
        return row.rate === "double" ? "Double" : "Normal";
      },
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
              onLocationEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleLocationDelete(row.id)}
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
                  <Card.Title as="h4">Location</Card.Title>
                  <p className="card-category">Show All Location</p>
                </div>
                <Button variant="primary" onClick={onLocationAdd}>
                  ADD
                </Button>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                {isLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Spinner animation="border" role="status" />
                  </div>
                ) : (
                  <BootstrapTable
                    keyField="id"
                    data={locations}
                    columns={columns}
                    striped
                    hover
                    condensed
                    noDataIndication="data not found."
                    pagination={paginationFactory()}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <LocationModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        fetchLocations={fetchLocations}
        locationEdit={locationEdit}
        setLocationEdit={setLocationEdit}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Location;
