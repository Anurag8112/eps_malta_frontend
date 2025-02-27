import { useState, useEffect } from "react";
import LanguagesModal from "../components/LanguagesModal/LanguagesModal.js";
import React from "react";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function Languages() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [languagesData, setLanguagesData] = useState([]);
  const [languagesDataEdit, setLanguagesDataEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchLanguagesData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("language/view");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setLanguagesData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguagesData();
  }, []);

  const handleLanguageDelete = async (Id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Language?"
      );
      if (confirmDelete) {
        await axios.delete(`language/delete/${Id}`);
        const updatedLanguages = languagesData.filter(
          (languagesData) => languagesData.id !== Id
        );
        setLanguagesData(updatedLanguages);
        toast.success("Language deleted successfully!");
        fetchLanguagesData();
      }
    } catch (error) {
      toast.error("Failed to delete Language.");
      console.log(error);
    }
  };

  const onLanguageDataAdd = () => {
    setDialogOpen(true);
  };

  const onLanguageDataEdit = (languageEdit) => {
    setLanguagesDataEdit(languageEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setLanguagesDataEdit("");
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
      dataField: "languages",
      text: "Languages",
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
              onLanguageDataEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleLanguageDelete(row.id)}
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
                  <Card.Title as="h4">Languages</Card.Title>
                  <p className="card-category">Show All Languages</p>
                </div>
                <Button variant="primary" onClick={onLanguageDataAdd}>
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
                    data={languagesData}
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
      <LanguagesModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        fetchLanguagesData={fetchLanguagesData}
        languagesDataEdit={languagesDataEdit}
        setLanguagesDataEdit={setLanguagesDataEdit}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Languages;
