import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import SkillsModal from "../components/SkillsModal/SkillsModal.js";
import paginationFactory from "react-bootstrap-table2-paginator";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function Skills() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [skillsData, setSkillsData] = useState([]);
  const [skillsDataEdit, setSkillsDataEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchSkillsData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("skill/view");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setSkillsData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const handleSkillDelete = async (Id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Skill?"
      );
      if (confirmDelete) {
        await axios.delete(`skill/delete/${Id}`);
        const updatedSkills = skillsData.filter(
          (skillsData) => skillsData.id !== Id
        );
        setSkillsData(updatedSkills);
        toast.success("Skills deleted successfully!");
        fetchSkillsData();
      }
    } catch (error) {
      toast.error("Failed to delete Skills.");
      console.log(error);
    }
  };

  const onSkillsDataAdd = () => {
    setDialogOpen(true);
  };

  const onSkillsDataEdit = (skillsEdit) => {
    setSkillsDataEdit(skillsEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSkillsDataEdit("");
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
      dataField: "skills",
      text: "Skills",
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
              onSkillsDataEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleSkillDelete(row.id)}
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
                  <Card.Title as="h4">Skills</Card.Title>
                  <p className="card-category">Show All Skills</p>
                </div>
                <Button variant="primary" onClick={onSkillsDataAdd}>
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
                    data={skillsData}
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
      <SkillsModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        fetchSkillsData={fetchSkillsData}
        skillsDataEdit={skillsDataEdit}
        setSkillsDataEdit={setSkillsDataEdit}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Skills;
