import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ClientModal from "components/ClientModel/ClientModel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClientName() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientData, setClientData] = useState([]);
  const [clientEdit, setClientEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchClient = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("client/view");
      const data = response.data.result.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setClientData(data);
      // console.log("data", response.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientDelete = async (clientId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this client?"
      );
      if (confirmDelete) {
        await axios.delete(`client/delete/${clientId}`);
        const updatedClient = clientData.filter(
          (client) => client.id !== clientId
        );
        setClientData(updatedClient);
        toast.success("Client deleted successfully!");
        fetchClient();
      }
    } catch (error) {
      toast.error("Failed to delete client.");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClient();
  }, []);

  const onClientAdd = () => {
    setDialogOpen(true);
  };

  const onClientEdit = (clientEdit) => {
    setClientEdit(clientEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setClientEdit("");
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
      dataField: "clientName",
      text: "Client Name",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "200px" },
    },
    {
      dataField: "email",
      text: "Email",
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
              onClientEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleClientDelete(row.id)}
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
                  <Card.Title as="h4">Client Name</Card.Title>
                  <p className="card-category">Show All Name</p>
                </div>
                <Button variant="primary" onClick={onClientAdd}>
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
                    data={clientData}
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
      <ClientModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        clientEdit={clientEdit}
        setClientEdit={setClientEdit}
        fetchClient={fetchClient}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default ClientName;
