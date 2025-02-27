import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Form,
  FormControl,
} from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompaniesModal from "components/CompaniesModal/CompaniesModal";

function ClientName() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [companiesData, setCompaniesData] = useState([]);
  const [companiesEdit, setCompaniesEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("companies/view", {
        params: { status, name },
      });
      setCompaniesData(response.data);
      // console.log("data", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompaniesDelete = async (companiesId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Companies?"
      );
      if (confirmDelete) {
        await axios.delete(`companies/delete/${companiesId}`);
        const updatedCompanies = companiesData.filter(
          (companies) => companies.id !== companiesId
        );
        setCompaniesData(updatedCompanies);
        toast.success("Companies deleted successfully!");
        fetchCompanies();
      }
    } catch (error) {
      toast.error("Failed to delete Companies.");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [status, name]);

  const onCompaniesAdd = () => {
    setDialogOpen(true);
  };

  const onCompaniesEdit = (companiesEdit) => {
    setCompaniesEdit(companiesEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCompaniesEdit("");
  };

  const handleClearFilters = () => {
    setStatus("");
    setName("");
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "80px" },
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
    },
    {
      dataField: "mobile",
      text: "Mobile",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
    },
    {
      dataField: "domain",
      text: "Company URL",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
    },
    {
      dataField: "address",
      text: "Address",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      headerClasses: "border-0",
      formatter: (cell) => (cell === "1" ? "Active" : "Inactive"),
      classes: "border-0",
    },
    {
      dataField: "actions",
      text: "Actions",
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "150px" },
      formatter: (cell, row) => (
        <>
          <Button
            variant="info"
            size="sm"
            onClick={() => {
              onCompaniesEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleCompaniesDelete(row.id)}
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
            <Row className="mb-2">
              <Col md="4">
                <Form.Group>
                  <FormControl
                    type="search"
                    placeholder="Search Name..."
                    className="me-2 form-control-filter"
                    aria-label="Search"
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/^ +/, ""))}
                  />
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="status"
                    className="form-control-filter"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Button
                className="btn-info filter-btn"
                onClick={handleClearFilters}
              >
                CLEAR
              </Button>{" "}
            </Row>
            <Card className="stripped-table-with-hover">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title as="h4">Companies</Card.Title>
                  <p className="card-category">Show Companies</p>
                </div>
                <div>
                  <Button variant="primary" onClick={onCompaniesAdd}>
                    ADD NEW
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                {isLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Spinner animation="border" role="status" />
                  </div>
                ) : companiesData.length === 0 ? (
                  <p className="card-category text-center">No data found.</p>
                ) : (
                  <BootstrapTable
                    keyField="id"
                    data={companiesData}
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
      <CompaniesModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        fetchCompanies={fetchCompanies}
        companiesEdit={companiesEdit}
        setCompaniesEdit={setCompaniesEdit}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default ClientName;
