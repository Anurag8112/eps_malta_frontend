import axios from "axios";
import EmailTemplateModal from "components/EmailTemplateModal/EmailTemplateModal";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

function EmailTemplate() {
  const [emailTemplateData, setEmailTemplateData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailTemplateEdit, setEmailTemplateEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmailTemplate = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("license/email/template/view");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setEmailTemplateData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailTemplate();
  }, []);

  const handleEmailTemplateDelete = async (emailTemplateId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this email template?"
      );
      if (confirmDelete) {
        await axios.delete(`license/email/template/delete/${emailTemplateId}`);
        const updatedEmailTemplate = events.filter(
          (emailTemplate) => emailTemplate.id !== emailTemplateId
        );
        setEmailTemplateData(updatedEmailTemplate);
        toast.success("Email Template deleted successfully!");
        fetchEmailTemplate();
      }
    } catch (error) {
      toast.error("Failed to delete event.");
      console.log(error);
    }
  };

  const onEmailTemplateAdd = () => {
    setDialogOpen(true);
  };

  const onEmailTemplateEdit = (emailTemplateEdit) => {
    setEmailTemplateEdit(emailTemplateEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEmailTemplateEdit("");
    setDialogOpen(false);
  };

  const columns = [
    {
      dataField: "S NO.",
      text: "S NO.",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "50px" },
    },
    {
      dataField: "type",
      text: "Type",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "subject",
      text: "Subject",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "body",
      text: "Body",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "400px" },
    },
    {
      dataField: "createdAt",
      text: "Created",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "120px" },
      formatter: (cell) => moment(cell).format("DD/MM/YYYY HH:mm"),
    },
    {
      dataField: "actions",
      text: "Action",
      headerClasses: "border-0",
      classes: "border-0",
      formatter: (cell, row) => (
        <>
          <Button
            variant="info"
            size="sm"
            onClick={() => {
              onEmailTemplateEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleEmailTemplateDelete(row.id)}
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
                  <Card.Title as="h4">Email Template</Card.Title>
                  <p className="card-category">Show Email Template</p>
                </div>
                <Button variant="primary" onClick={onEmailTemplateAdd}>
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
                    data={emailTemplateData}
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
      <EmailTemplateModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        fetchEmailTemplate={fetchEmailTemplate}
        emailTemplateEdit={emailTemplateEdit}
        setEmailTemplateEdit={setEmailTemplateEdit}
      />
    </>
  );
}

export default EmailTemplate;
