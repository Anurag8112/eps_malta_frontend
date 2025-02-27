import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import TemplateModal from "components/TemplateModal/TemplateModal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Template() {
  const [template, setTemplate] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateEdit, setTemplateEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("template/view");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setTemplate(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, []);

  const handleTemplateDelete = async (templateId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this template?"
      );
      if (confirmDelete) {
        await axios.delete(`template/delete/${templateId}`);
        const updatedTemplate = template.filter(
          (template) => template.id !== templateId
        );
        setTemplate(updatedTemplate);
        toast.success("Template deleted successfully!");
        fetchTemplate();
      }
    } catch (error) {
      toast.error("Failed to delete template.");
      console.log(error);
    }
  };

  const onTemplateAdd = () => {
    setDialogOpen(true);
  };

  const onTemplateEdit = (templateEdit) => {
    setTemplateEdit(templateEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTemplateEdit("");
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
      dataField: "title",
      text: "Title",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
    },
    {
      dataField: "type",
      text: "Type",
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
              onTemplateEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleTemplateDelete(row.id)}
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
                  <Card.Title as="h4">Template</Card.Title>
                  <p className="card-category">Show All Name</p>
                </div>
                <Button variant="primary" onClick={onTemplateAdd}>
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
                    data={template}
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
      <TemplateModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        templateEdit={templateEdit}
        setTemplateEdit={setTemplateEdit}
        fetchTemplate={fetchTemplate}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Template;
