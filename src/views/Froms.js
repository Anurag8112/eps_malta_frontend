import { useState, useEffect } from "react";
import FormModal from "../components/FormModal/FromModal.js";
import React from "react";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import axios from "axios";

function Forms() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const [formDataEdit, setFormDataEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchFormData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("forms/view");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setFormData(data);
      // console.log("setFormData", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  const onFormDataAdd = () => {
    setDialogOpen(true);
  };

  const onFormDataEdit = (formEdit) => {
    setFormDataEdit(formEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormDataEdit("");
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
      dataField: "formName",
      text: "Form Name",
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
              onFormDataEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
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
                  <Card.Title as="h4">Forms</Card.Title>
                  <p className="card-category">Show All Forms</p>
                </div>
                <Button variant="primary" onClick={onFormDataAdd}>
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
                    keyField="type"
                    data={formData}
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
      <FormModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        fetchFormData={fetchFormData}
        formDataEdit={formDataEdit}
        setFormDataEdit={setFormDataEdit}
      />
    </>
  );
}

export default Forms;
