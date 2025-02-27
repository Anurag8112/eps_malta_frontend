import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import moment from "moment";
import paginationFactory from "react-bootstrap-table2-paginator";

function TimeSheetLog() {
  const [timesheetLog, setTimesheetLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTimesheetLog = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("timesheet/log/details");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setTimesheetLog(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheetLog();
  }, []);

  const columns = [
    {
      dataField: "S NO.",
      text: "S NO.",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "60px" },
    },
    {
      dataField: "timesheetId",
      text: "Entry ID",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "action",
      text: "Action",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "createdByUsername",
      text: "Created By",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "createdAt",
      text: "Created At",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
      formatter: (cell) => moment(cell).format("DD/MM/YYYY HH:mm"),
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
                  <Card.Title as="h4">Timesheet Log</Card.Title>
                  <p className="card-category">Show All Timesheet Log</p>
                </div>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                {isLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Spinner animation="border" role="status" />
                  </div>
                ) : (
                  <BootstrapTable
                    keyField="id"
                    data={timesheetLog}
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
    </>
  );
}

export default TimeSheetLog;
