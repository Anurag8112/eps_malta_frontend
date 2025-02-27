import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import moment from "moment";
import paginationFactory from "react-bootstrap-table2-paginator";

function Notification() {
  const [notificationLog, setNotificationLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotificationLog = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("license/notification/log/view");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setNotificationLog(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationLog();
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
      dataField: "licenseId",
      text: "License ID",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "username",
      text: "Employee Name",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
    },
    {
      dataField: "mail_type",
      text: "Mail Type",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      formatter: (cell, row) =>
        row.mail_type === "90_days"
          ? "Email send for 90 days"
          : row.mail_type === "60_days"
          ? "Email send for 60 days"
          : "Email send for 30 days",
    },
    {
      dataField: "exp_date",
      text: "Exp Date",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      formatter: (cell) => moment(cell).format("DD/MM/YYYY"),
    },
    {
      dataField: "createdAt",
      text: "Created At",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
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
                  <Card.Title as="h4">Notification Log</Card.Title>
                  <p className="card-category">Show All Notification Log</p>
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
                    data={notificationLog}
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

export default Notification;
