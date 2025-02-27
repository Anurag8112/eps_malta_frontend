import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import {
  EmployeeModal,
  EmployeeViewModal,
} from "components/EmployeeModal/EmployeeModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from "react-switch";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { MultiSelect } from "react-multi-select-component";

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [employeeEdit, setEmployeeEdit] = useState({});
  const [employeeView, setEmployeeView] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [summaryDetails, setSummaryDetails] = useState([]);
  const [selectedQualifications, setSelectedQualifications] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [filters, setFilters] = useState({
    qualification: "",
    skill: "",
    language: "",
  });

  const { qualification, skill, language } = filters;

  const onEmployeeAdd = () => {
    setDialogOpen(true);
  };

  const onEmployeeEdit = (employeeEdit) => {
    setEmployeeEdit(employeeEdit);
    setDialogOpen(true);
  };

  const onEmployeeView = (employeeView) => {
    setEmployeeView(employeeView);
    setViewDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setViewDialogOpen(false);
    setEmployeeEdit("");
  };

  const handleSkillChange = (selectedSkill) => {
    setSelectedSkills(selectedSkill);
    const formattedData = selectedSkill.map((item) => item.value).join(",");
    setFilters({ ...filters, skill: formattedData });
  };

  const handleQualificationChange = (selectedQualifications) => {
    setSelectedQualifications(selectedQualifications);
    const formattedData = selectedQualifications
      .map((item) => item.value)
      .join(",");
    setFilters({ ...filters, qualification: formattedData });
  };

  const handleLanguageChange = (selectedLanguage) => {
    setSelectedLanguages(selectedLanguage);
    const formattedData = selectedLanguage.map((item) => item.value).join(",");
    setFilters({ ...filters, language: formattedData });
  };

  const fetchEmployees = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`user/view?page=${page}`, {
        params: filters,
      });
      const data = response.data.users.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setEmployees(data);
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummaryData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("user/summary/view");
      setSummaryDetails(response.data.data);
      // console.log("data", response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  const handleEmployeeDelete = async (employeeId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this employee?"
      );
      if (confirmDelete) {
        await axios.delete(`user/delete/${employeeId}`);
        const updatedEmployees = employees.filter(
          (employee) => employee.id !== employeeId
        );
        setEmployees(updatedEmployees);
        toast.success("Employee deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete employee.");
      console.log(error);
    }
  };

  const handleBlockToggle = async (employeeId, status) => {
    try {
      const statusValue = status ? "1" : "0";
      // Update local state
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId
            ? { ...employee, status: statusValue }
            : employee
        )
      );

      // Update server data
      await axios.put(`user/edit/${employeeId}`, { status: statusValue });

      // Notify success
      toast.success(
        `Employee account is ${status ? "Active!" : "Deactivated!"}`
      );
    } catch (error) {
      // Notify failure
      toast.error(`Failed to ${status ? "Active" : "Deactivate"} employee.`);
      console.error(error);
    }
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
      dataField: "username",
      text: "User Name",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "180px" },
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "200px" },
    },
    {
      dataField: "mobile",
      text: "Mobile",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "120px" },
    },
    {
      dataField: "role",
      text: "Role",
      headerClasses: "border-0",
      classes: "border-0",
      formatter: (cell) => {
        if (cell === "1") {
          return "Admin";
        } else if (cell === "2") {
          return "Employee";
        } else if (cell === "3") {
          return "Manager";
        } else {
          return ""; // Handle other cases if necessary
        }
      },
      sort: true,
      headerStyle: { width: "100px" },
    },
    {
      dataField: "status",
      text: "Status",
      headerClasses: "border-0",
      classes: "border-0",
      formatter: (cell, row) => (
        <>
          {row.role === "1" ? (
            "- - - -"
          ) : (
            <Switch
              checked={row.status === "1"}
              onColor="#86d3ff"
              offColor="#ff3a55"
              height={20}
              width={40}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              onChange={(checked) => handleBlockToggle(row.id, checked)}
            />
          )}
        </>
      ),
      headerStyle: { width: "80px" },
    },
    {
      dataField: "actions",
      text: "Action",
      headerClasses: "border-0",
      classes: "border-0",
      formatter: (cell, row) => (
        <>
          <Button
            variant="dark"
            size="sm"
            onClick={() => {
              onEmployeeView(row);
            }}
          >
            VIEW
          </Button>{" "}
          <Button
            variant="info"
            size="sm"
            onClick={() => {
              onEmployeeEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleEmployeeDelete(row.id)}
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
                  <Card.Title as="h4">Employee List</Card.Title>
                  <p className="card-category">Employee All List</p>
                </div>
                <Row>
                  <Col md="4">
                    <Form.Group style={{ width: "180px" }}>
                      <Form.Label style={{ fontSize: "10px" }}>
                        Skills
                      </Form.Label>
                      <MultiSelect
                        options={(summaryDetails.skills || []).map((skill) => ({
                          label: skill.skills,
                          value: skill.id,
                        }))}
                        value={selectedSkills}
                        onChange={handleSkillChange}
                        labelledBy={"Select"}
                      />
                    </Form.Group>
                  </Col>
                  <Col md="4">
                    <Form.Group style={{ width: "180px" }}>
                      <Form.Label style={{ fontSize: "10px" }}>
                        Qualifications
                      </Form.Label>
                      <MultiSelect
                        options={(summaryDetails.qualifications || []).map(
                          (qualification) => ({
                            label: qualification.qualifications,
                            value: qualification.id,
                          })
                        )}
                        onChange={handleQualificationChange}
                        value={selectedQualifications}
                        labelledBy={"Select"}
                      />
                    </Form.Group>
                  </Col>
                  <Col md="4">
                    <Form.Group style={{ width: "180px" }}>
                      <Form.Label style={{ fontSize: "10px" }}>
                        Languages
                      </Form.Label>
                      <MultiSelect
                        options={(summaryDetails.languages || []).map(
                          (language) => ({
                            label: language.languages,
                            value: language.id,
                          })
                        )}
                        value={selectedLanguages}
                        onChange={handleLanguageChange}
                        labelledBy={"Select"}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" onClick={onEmployeeAdd}>
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
                    data={employees}
                    columns={columns}
                    striped
                    hover
                    condensed
                    noDataIndication="data not found."
                    pagination={paginationFactory({
                      page: currentPage,
                      onPageChange: fetchEmployees,
                      sizePerPage: 10, // Change as per your requirement
                      totalSize: employees.length, // Provide the total size if known
                    })}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <EmployeeModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        fetchEmployees={fetchEmployees}
        employeeEdit={employeeEdit}
        setEmployeeEdit={setEmployeeEdit}
      />
      <EmployeeViewModal
        show={viewDialogOpen}
        handleClose={handleDialogClose}
        employeeView={employeeView}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Employee;
