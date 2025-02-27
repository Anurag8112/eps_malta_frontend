import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Form } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Spinner from "react-bootstrap/Spinner";
import LicenseReportModal from "components/LicenseReportModal/LicenseReportModal.js";
import { Link } from "react-router-dom";
import { Images } from "react-bootstrap-icons";
import moment from "moment";

function LicenseReport() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [licenseData, setLicenseData] = useState([]);
  const [licenseReportEdit, setLicenseReportEdit] = useState({});
  const [formData, setFormData] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("");
  const [paid, setPaid] = useState("");
  const [category, setCategory] = useState("");
  const [types, setTypes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataFound, setIsDataFound] = useState(true);
  const [totalCount, setTotalCount] = useState();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [licenseDetails, setLicenseDetails] = useState();

  const params = {
    year,
    month,
    status,
    paid,
    category,
    types,
    page,
    perPage,
  };

  const fetchLicenseData = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get("license/report/view", { params });
      const { data, totalData } = response.data;
      setLicenseData(data);
      setTotalCount(totalData);
      // Check if data is found
      if (response.data.data.length === 0) {
        setIsDataFound(false);
      } else {
        setIsDataFound(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      const response = await axios.get("forms/view");
      const data = response.data;
      setFormData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchlicenseDetails = async () => {
    try {
      const response = await axios.get("license/report/licenseDetails");
      const data = response.data;
      setLicenseDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLicenseData();
    fetchFormData();
    fetchlicenseDetails();
  }, [year, month, status, paid, category, types, page, perPage]);

  // Function to clear all filters
  const handleClearFilters = () => {
    setYear("");
    setMonth("");
    setStatus("");
    setPaid("");
    setCategory("");
    setTypes("");
  };

  const onLicenseAdd = () => {
    setDialogOpen(true);
  };

  const onLicenseEdit = (licenseReportEdit) => {
    setLicenseReportEdit(licenseReportEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setLicenseReportEdit("");
  };

  const columns = [
    {
      dataField: "tracker_id",
      text: "ID",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "40px" },
      formatter: (cellContent, row) => (
        <Link
          onClick={() => {
            onLicenseEdit(row);
          }}
        >
          <b> {row.tracker_id}</b>
        </Link>
      ),
    },
    {
      dataField: "year",
      text: "Year",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "45px" },
    },
    {
      dataField: "month",
      text: "Mon",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "40px" },
      formatter: (cell) => {
        const date = new Date();
        date.setMonth(cell - 1); // Assuming cell contains the month number (1-12)
        return date.toLocaleString("default", { month: "short" });
      },
    },
    {
      dataField: "username",
      text: "Name",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "phone_number",
      text: "Phone",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
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
      dataField: "categoryType",
      text: "Category",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "80px" },
    },
    {
      dataField: "types",
      text: "Type",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "80px" },
    },
    {
      dataField: "ref_number",
      text: "Ref.Num",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "58px" },
      formatter: (cellContent, row) =>
        row.status === 1 ? "Active" : row.status === 2 ? "Expiring" : "Expired",
    },
    {
      dataField: "paid",
      text: "Paid",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "50px" },
    },
    {
      dataField: "receipt",
      text: "Receipt",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      formatter: (cellContent, row) => (
        <a
          href={`${process.env.REACT_APP_API_URL}${row.receipt}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Images size={26} />
        </a>
      ),
    },
  ];
  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Row className="mb-2">
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="locationId"
                    className="form-control-filter"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="">Years</option>
                    {licenseDetails?.map((year) => (
                      <option key={year.year} value={year.year}>
                        {year.year}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="month"
                    className="form-control-filter"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option value="">Months</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Form.Control>
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
                    <option value="2">Expiring</option>
                    <option value="3">Expired</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="paid"
                    className="form-control-filter"
                    value={paid}
                    onChange={(e) => setPaid(e.target.value)}
                  >
                    <option value="">Paid</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="category"
                    className="form-control-filter"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Category</option>
                    {formData.map((form, index) => (
                      <option key={index} value={form.type}>
                        {form.formName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="types"
                    className="form-control-filter"
                    value={types}
                    onChange={(e) => setTypes(e.target.value)}
                  >
                    <option value="">Type</option>
                    {formData.map((item) =>
                      item.fields.map((field) => {
                        if (
                          field.field === "cbLicenseType" &&
                          field.dd_values
                        ) {
                          const values = field.dd_values.split(",");
                          return values.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ));
                        }
                        return null;
                      })
                    )}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Card className="stripped-table-with-hover">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title as="h4">License Report</Card.Title>
                  <p className="card-category">Show License Report</p>
                </div>
                <div>
                  <Button className="btn-info" onClick={handleClearFilters}>
                    CLEAR
                  </Button>{" "}
                  <Button variant="primary" onClick={onLicenseAdd}>
                    ADD LICENSE
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                {isLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Spinner animation="border" role="status" />
                  </div>
                ) : (
                  <>
                    {isDataFound ? (
                      <BootstrapTable
                        keyField="tracker_id"
                        data={licenseData}
                        columns={columns}
                        pagination={paginationFactory({
                          sizePerPage: perPage,
                          sizePerPageList: [15, 25, 50, 75],
                          page,
                          totalSize: totalCount,
                          onPageChange: (newPage, _) => setPage(newPage),
                          onSizePerPageChange: (newSize, _) =>
                            setPerPage(newSize),
                        })}
                        noDataIndication="data not found."
                        striped
                        hover
                      />
                    ) : (
                      <p className="card-category text-center">
                        No data found.
                      </p>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <LicenseReportModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        licenseReportEdit={licenseReportEdit}
        setLicenseReportEdit={setLicenseReportEdit}
        fetchLicenseData={fetchLicenseData}
      />
    </>
  );
}

export default LicenseReport;
