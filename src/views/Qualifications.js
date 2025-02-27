import { useState, useEffect } from "react";
import QualificationsModel from "../components/QualificationsModal/QualificationsModal.js";
import React from "react";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function Qualifications() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [qualificationData, setQualificationData] = useState([]);
  const [qualificationDataEdit, setQualificationDataEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchQualificationData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("qualification/view");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));

      setQualificationData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQualificationData();
  }, []);

  const handleQualificationDelete = async (Id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Qualification?"
      );
      if (confirmDelete) {
        await axios.delete(`qualification/delete/${Id}`);
        const updatedQualifications = qualificationData.filter(
          (qualificationsData) => qualificationsData.id !== Id
        );
        setQualificationData(updatedQualifications);
        toast.success("Qualification deleted successfully!");
        fetchQualificationData();
      }
    } catch (error) {
      toast.error("Failed to delete Qualification.");
      console.log(error);
    }
  };

  const onQualificationDataAdd = () => {
    setDialogOpen(true);
  };

  const onQualificationDataEdit = (qualificationEdit) => {
    setQualificationDataEdit(qualificationEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setQualificationDataEdit("");
  };

  const columns = [
    {
      dataField: "S NO.",
      text: "S NO.",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "200px" },
    },
    {
      dataField: "qualifications",
      text: "Qualifications",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
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
              onQualificationDataEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleQualificationDelete(row.id)}
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
                  <Card.Title as="h4">Qualifications</Card.Title>
                  <p className="card-category">Show All Qualifications</p>
                </div>
                <Button variant="primary" onClick={onQualificationDataAdd}>
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
                    data={qualificationData}
                    columns={columns}
                    pagination={paginationFactory()}
                    noDataIndication="data not found."
                    striped
                    hover
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <QualificationsModel
        show={dialogOpen}
        handleClose={handleDialogClose}
        fetchQualificationData={fetchQualificationData}
        qualificationDataEdit={qualificationDataEdit}
        setQualificationDataEdit={setQualificationDataEdit}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Qualifications;
