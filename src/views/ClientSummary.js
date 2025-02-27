import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";
import moment from "moment";

function ClientSummary() {
  const [reportData, setReportData] = useState([]);
  const [grandTotal, setGrandTotal] = useState({ shift: 0, hours: 0, cost: 0 });
  const currentYear = moment().format("YYYY");
  const currentMonth = moment().format("MMM");
  const [years, setYears] = useState(currentYear);
  const [months, setMonths] = useState(currentMonth);
  const [location, setLocation] = useState("");
  const [clientId, setClientId] = useState("");
  const [rate, setRate] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [perPage, setPerPage] = useState(100);
  const [employeeData, setEmployeeData] = useState({
    year: [],
    month: [],
    locations: [],
    client: [],
  });
  const [currentFilter, setCurrentFilter] = useState(null);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        year: years,
        month: months,
        locationId: location,
        rate,
        clientId,
        page,
        perPage,
      });

      const response = await axios.get("timesheet/client/summary/report", {
        params: params,
      });

      const { reports, grandTotal, pagination } = response.data;
      setReportData(reports);
      setGrandTotal(grandTotal);
      setTotalPages(pagination.totalPages);
      setError(null);
      // console.log("response.data", response.data.reports);
    } catch (error) {
      console.error("Error retrieving employee data:", error);
      setError("Data Not Found !");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const params = {};

      if (years) params.year = years;
      if (months) params.month = months;
      if (location) params.locationId = location;
      if (clientId) params.clientId = clientId;

      const response = await axios.get("timesheet/filter/employee/details", {
        params: params,
      });
      const newData = response.data;

      // Update the state with new data, preserving the part related to selectKey
      setEmployeeData((prevData) => {
        const mergedData = { ...prevData, ...newData };

        // Preserve the selectKey part to keep previous data
        if (currentFilter) {
          // If currentFilter is one of the arrays to be preserved, don't update it with new data
          if (
            ["locations", "month", "year", "client"].includes(currentFilter)
          ) {
            mergedData[currentFilter] = prevData[currentFilter];
          }
        }

        return mergedData;
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    setYears(currentYear);
    setMonths(currentMonth);
    setLocation("");
    setRate("");
    setClientId("");
    setPage(1);
    fetchEmployeeDetails();
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [years, months, location, rate, clientId, page, perPage]);

  const handleChangePerPage = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };

  const handleChangePage = (page) => {
    setPage(page);
  };

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
                    value={years}
                    onChange={(e) => {
                      setYears(e.target.value);
                      setCurrentFilter("year");
                    }}
                  >
                    <option value="">Years</option>
                    {employeeData.year.map((year) => (
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
                    value={months}
                    onChange={(e) => {
                      setMonths(e.target.value);
                      setCurrentFilter("month");
                    }}
                  >
                    <option value="">Months</option>
                    {employeeData.month.map((month) => (
                      <option key={month.month} value={month.month}>
                        {month.month}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="location"
                    className="form-control-filter"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setCurrentFilter("locations");
                    }}
                  >
                    <option value="">Location</option>
                    {employeeData.locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.location}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="rate"
                    className="form-control-filter"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  >
                    <option value="">Rate</option>
                    <option value="normal">Normal</option>
                    <option value="double">Double</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="clientName"
                    className="form-control-filter"
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value);
                      setCurrentFilter("client");
                    }}
                  >
                    <option value="">Client Name</option>
                    {employeeData.client.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.client}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Button
                  className="btn-info filter-btn"
                  onClick={handleClearFilters}
                >
                  CLEAR
                </Button>
              </Col>
            </Row>
            <Card className="stripped-table-with-hover">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title as="h4">Client Summary</Card.Title>
                  <p className="card-category">Show All Client Summary</p>
                </div>
              </Card.Header>
              <Card.Body className="table-responsive px-0">
                {isLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Spinner animation="border" role="status" />
                  </div>
                ) : error ? (
                  <p className="card-category text-center">{error}</p>
                ) : (
                  <Table responsive>
                    <thead>
                      <tr>
                        <td colSpan="3">
                          <b>Grand Total</b>
                        </td>
                        <td>
                          <b>{grandTotal.shift}</b>
                        </td>
                        <td>
                          <b>{grandTotal.hours?.toFixed(2)}</b>
                        </td>
                        <td>
                          <b>{grandTotal.cost?.toFixed(2)}</b>
                        </td>
                      </tr>
                      <tr className="table-secondary">
                        <th>Client</th>
                        <th>Location</th>
                        <th>Rate</th>
                        <th>Shift</th>
                        <th>Hours</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((report) => (
                        <React.Fragment key={report.client}>
                          {report.records.map((locationWise, locationIndex) => (
                            <React.Fragment key={locationWise.locationId}>
                              {locationWise.records.map(
                                (rateWise, rateIndex) => (
                                  <React.Fragment key={rateWise.rate}>
                                    {rateWise.records.map((item, index) => (
                                      <tr key={item.timesheet_id}>
                                        <td>
                                          {index === 0 &&
                                            locationIndex === 0 &&
                                            rateIndex === 0 &&
                                            (report.client !== null
                                              ? report.client
                                              : "N/A")}
                                        </td>
                                        <td>
                                          {index === 0 && rateIndex === 0
                                            ? locationWise.location
                                            : ""}
                                        </td>{" "}
                                        <td>
                                          {index === 0
                                            ? item.rate === "normal"
                                              ? "Normal"
                                              : "Double"
                                            : ""}
                                        </td>
                                        <td>{"1"}</td>
                                        <td>{item.hours}</td>
                                        <td>{item.cost}</td>
                                      </tr>
                                    ))}
                                    <tr>
                                      <td></td>
                                      <td></td>
                                      <td>
                                        <b>
                                          {rateWise.rate === "normal"
                                            ? "Normal"
                                            : "Double"}{" "}
                                          Total
                                        </b>
                                      </td>
                                      <td>
                                        <b>{rateWise.total.shift}</b>
                                      </td>
                                      <td>
                                        <b>
                                          {rateWise.total.hours?.toFixed(2)}
                                        </b>
                                      </td>
                                      <td>
                                        <b>{rateWise.total.cost?.toFixed(2)}</b>
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                )
                              )}
                              <tr>
                                <td></td>
                                <td>
                                  <b>{locationWise.location} Total</b>
                                </td>
                                <td></td>
                                <td>
                                  <b>{locationWise.total.shift}</b>
                                </td>
                                <td>
                                  <b>{locationWise.total.hours?.toFixed(2)}</b>
                                </td>
                                <td>
                                  <b>{locationWise.total.cost?.toFixed(2)}</b>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                          <tr className="table-secondary">
                            <td>
                              <b>
                                {report.client !== null ? report.client : "N/A"}{" "}
                                Total
                              </b>
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                              <b>{report.total.shift}</b>
                            </td>
                            <td>
                              <b>{report.total.hours?.toFixed(2)}</b>
                            </td>
                            <td>
                              <b>{report.total.cost?.toFixed(2)}</b>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
              {error ? null : (
                <Row>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={perPage}
                      onChange={handleChangePerPage}
                      className="float-right"
                    >
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="500">500</option>
                    </Form.Control>
                  </Col>
                  <Col>
                    <ReactPaginate
                      pageCount={totalPages}
                      pageRangeDisplayed={5}
                      marginPagesDisplayed={2}
                      previousLabel={"<"}
                      nextLabel={">"}
                      breakLabel={"..."}
                      onPageChange={(selected) =>
                        handleChangePage(selected.selected + 1)
                      }
                      forcePage={page - 1}
                      containerClassName={"react-pagination"}
                      activeClassName={"active"}
                    />
                  </Col>
                </Row>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ClientSummary;
