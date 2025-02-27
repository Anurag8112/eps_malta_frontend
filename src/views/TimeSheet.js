import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import moment from "moment";
import { Link } from "react-router-dom";
import { useTokenInfo } from "../authRoutes/PrivateRoutes.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TimeSheetModal } from "components/TimeSheet/TimeSheetModal.js";

const TimeSheet = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sheetEdit, setSheetEdit] = useState({});
  const [invoice, setInvoice] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const { userRole } = useTokenInfo();

  const onTimeSheetAdd = () => {
    setDialogOpen(true);
  };

  const onTimeSheetEdit = (sheetEdit) => {
    setSheetEdit(sheetEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSheetEdit("");
  };

  const fetchEmployeeData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("timesheet/employee/entryview", {
        params: {
          invoiced: invoice,
        },
      });
      const preSelectedRows = response.data.employees
        .filter((emp) => emp.invoiced === 1)
        .map((emp) => emp.timesheet_id);

      setEmployeeData(response.data.employees);
      setSelectedRows(preSelectedRows);
    } catch (error) {
      setEmployeeData([]);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [invoice]);

  const handleOnSelect = (row, isSelect) => {
    if (row.invoiced === 1) {
      return;
    }
    if (isSelect) {
      setSelectedRows([...selectedRows, row.timesheet_id]);
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== row.timesheet_id));
    }
  };

  const handleMarkedAsInvoiced = async () => {
    const selectedEmployeeData = employeeData.filter(
      (emp) => selectedRows.includes(emp.timesheet_id) && emp.invoiced !== 1
    );

    if (selectedEmployeeData.length === 0) {
      toast.error("Please select at least one row");
      return;
    }

    const dataToSend = selectedEmployeeData.map(({ timesheet_id }) => ({
      timesheet_id,
      invoiced: 1,
    }));

    try {
      await axios.put("timesheet/employee/update/invoiced", dataToSend);
      const updatedEmployeeData = employeeData.map((emp) =>
        selectedRows.includes(emp.timesheet_id) ? { ...emp, invoiced: 1 } : emp
      );
      setEmployeeData(updatedEmployeeData);
      const preSelectedRows = updatedEmployeeData
        .filter((emp) => emp.invoiced === 1)
        .map((emp) => emp.timesheet_id);
      setSelectedRows(preSelectedRows);
      toast.success("Successfully updated invoiced status.");
    } catch (error) {
      console.error("Error sending data:", error);
      toast.error("Error updating invoiced status. Please try again.");
    }
  };

  const columns = [
    {
      dataField: "timesheet_id",
      text: "ID",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
      formatter: (cellContent, row) => {
        if (userRole !== "2") {
          return (
            <Link
              onClick={() => {
                onTimeSheetEdit(row);
              }}
            >
              <b> {row.timesheet_id}</b>
            </Link>
          );
        } else {
          return <b>{row.timesheet_id}</b>;
        }
      },
    },
    {
      dataField: "username",
      text: "Employees",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "150px" },
    },
    {
      dataField: "date",
      text: "Date",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "120px" },
      formatter: (cell) => moment(cell).format("DD/MM/YYYY"),
    },
    {
      dataField: "clientName",
      text: "Client",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
      formatter: (cell) => (cell === null ? "N/A" : cell),
    },
    {
      dataField: "location",
      text: "Location",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "120px" },
    },
    {
      dataField: "events",
      text: "Event",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "tasks",
      text: "Task",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "startTime",
      text: "Start",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "60px" },
      formatter: (cell) => moment(cell, "HH:mm").format("HH:mm"),
    },
    {
      dataField: "endTime",
      text: "End",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "60px" },
      formatter: (cell) => moment(cell, "HH:mm").format("HH:mm"),
    },
    {
      dataField: "ratePerHour",
      text: "Rate",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "60px" },
    },
    {
      dataField: "hours",
      text: "Hours",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "65px" },
    },
    {
      dataField: "cost",
      text: "Cost",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "60px" },
    },
    {
      dataField: "year",
      text: "Year",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "60px" },
    },
    {
      dataField: "month",
      text: "Month",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "65px" },
    },
    {
      dataField: "week",
      text: "Week",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "60px" },
    },
    {
      dataField: "rate",
      text: "Rate Type",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
      formatter: (cell) => (cell === "normal" ? "Normal" : "Double"),
    },
    {
      dataField: "invoiced",
      text: "invoiced",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "80px" },
      formatter: (cell) => (cell === 1 ? "Yes" : "No"),
    },
    {
      dataField: "createdByUsername",
      text: "Created By",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "180px" },
    },
    {
      dataField: "createdAt",
      text: "Created At",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "120px" },
      formatter: (cell) =>
        moment(cell, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm"),
    },
    {
      dataField: "lastModifiedByUsername",
      text: "Last Modified By",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "140px" },
    },
    {
      dataField: "lastModifiedAt",
      text: "Last Modified At",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "140px" },
      formatter: (cell) =>
        cell
          ? moment(cell, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm")
          : "",
    },
  ];

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    hideSelectColumn: userRole !== "3",
    selected: selectedRows,
    onSelect: handleOnSelect,
    onSelectAll: (isSelect, rows) => {
      if (isSelect) {
        const newSelectedRows = rows
          .filter((row) => row.invoiced !== 1)
          .map((row) => row.timesheet_id);
        setSelectedRows(newSelectedRows);
      } else {
        setSelectedRows([]);
      }
    },
    nonSelectable: employeeData
      .filter((row) => row.invoiced === 1)
      .map((row) => row.timesheet_id),
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Card className="stripped-table-with-hover">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title as="h4">Employee Time Sheet</Card.Title>
                  <p className="card-category">Show All Shift</p>
                </div>
                <div className="d-flex justify-content-end align-items-center">
                  {userRole === "3" ? (
                    <Button
                      variant="primary"
                      style={{ marginLeft: "10px" }}
                      onClick={handleMarkedAsInvoiced}
                      size="sm"
                    >
                      Mark as Invoiced
                    </Button>
                  ) : null}
                  <Form.Group as={Col} md="auto">
                    <Form.Control
                      as="select"
                      name="invoice"
                      className="form-control-filter"
                      value={invoice}
                      onChange={(e) => setInvoice(e.target.value)}
                      required
                    >
                      <option value="">All</option>
                      <option value="1">Invoiced</option>
                      <option value="0">Non Invoiced</option>
                    </Form.Control>
                  </Form.Group>

                  {userRole === "1" || userRole === "3" ? (
                    <Button variant="primary" onClick={onTimeSheetAdd}>
                      ADD SHIFT
                    </Button>
                  ) : null}
                </div>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                {isLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Spinner animation="border" role="status" />
                  </div>
                ) : (
                  <BootstrapTable
                    keyField="timesheet_id"
                    data={employeeData}
                    columns={columns}
                    selectRow={selectRow}
                    pagination={paginationFactory()}
                    noDataIndication="data not found."
                    striped
                    hover
                    wrapperClasses="scrollable-table"
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <TimeSheetModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        sheetEdit={sheetEdit}
        setSheetEdit={setSheetEdit}
        onSaveCallBack={fetchEmployeeData}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
};

export default TimeSheet;
