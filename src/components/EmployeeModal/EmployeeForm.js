import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
import SkillsModal from "components/SkillsModal/SkillsModal";
import QualificationsModal from "components/QualificationsModal/QualificationsModal";
import LanguagesModal from "components/LanguagesModal/LanguagesModal";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";


function EmployeeForm({
  handleClose,
  fetchEmployees,
  employeeEdit,
  setEmployeeEdit,
}) {
  const [username, setUserName] = useState(employeeEdit.username || "");
  const [role, setRole] = useState(employeeEdit.role || "2");
  const [email, setEmail] = useState(employeeEdit.email || "");
  const [mobile, setMobile] = useState(employeeEdit.mobile || "");
  const [summaryDetails, setSummaryDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQualifications, setSelectedQualifications] = useState(
    employeeEdit.qualifications || []
  );
  const [selectedSkills, setSelectedSkills] = useState(
    employeeEdit.skills || []
  );
  const [selectedLanguages, setSelectedLanguages] = useState(
    employeeEdit.languages || []
  );
  const employeeId = employeeEdit.id;
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [qualificationsDialogOpen, setQualificationsDialogOpen] =
    useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);

  const handleSkillDialogOpen = () => {
    setSkillDialogOpen(true);
  };

  const handleQualificationDialogOpen = () => {
    setQualificationsDialogOpen(true);
  };

  const handleLanguageDialogOpen = () => {
    setLanguageDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSkillDialogOpen(false);
    setQualificationsDialogOpen(false);
    setLanguageDialogOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity()) {
      setIsLoading(true);

      const payload = {
        username,
        email,
        mobile,
        role,
        qualifications: selectedQualifications.map((q) => ({
          qualification_id: q.value,
        })),
        skills: selectedSkills.map((s) => ({
          skill_id: s.value,
        })),
        languages: selectedLanguages.map((l) => ({
          language_id: l.value,
        })),
      };

      try {
        if (employeeId) {
          // Perform a PUT request if employeeEdit has an ID
          await axios.put(`user/edit/${employeeId}`, payload);
          setEmployeeEdit("");
          toast.success("Profile updated successfully!");
        } else {
          // Perform a POST request if employeeEdit doesn't have an ID
          await axios.post("user/register", payload);
          toast.success("Profile created successfully!");
        }

        handleClose();
        fetchEmployees();
        setIsLoading(false);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 ||
            error.response.status === 409 ||
            error.response.status === 400 ||
            error.response.status === 500)
        ) {
          toast.error(error.response.data.error);
        }
        setIsLoading(false);
      }
    }

    form.classList.add("was-validated");
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

  return (
    <>
      <Modal.Header>
        <Modal.Title>
          {employeeId ? "Edit Employee" : "Add Employee"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit} className="needs-validation">
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  name="username"
                  className="form-control mb-2"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a username.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  className="form-control mb-2"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a email.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mobile</Form.Label>
                <PhoneInput
                  placeholder="Mobile"
                  value={mobile}
                  onChange={setMobile}
                  defaultCountry="US" // Set the default country code
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid mobile number.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-control mb-2"
                  required
                >
                  <option value="1">Admin</option>
                  <option value="3">Manager</option>
                  <option value="2">Employee</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please provide a role.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group>
                <Form.Label>Skills</Form.Label>
                {summaryDetails.skills && (
                  <MultiSelect
                    options={summaryDetails.skills.map((skill) => ({
                      label: skill.skills,
                      value: skill.id,
                    }))}
                    name="skills"
                    value={selectedSkills}
                    labelledBy="Select"
                    onChange={setSelectedSkills}
                  />
                )}
              </Form.Group>
              <Link className="link-tag" onClick={handleSkillDialogOpen}>
                + Add Skill
              </Link>
            </Col>
            <Col md="6">
              <Form.Group>
                <Form.Label>Qualification</Form.Label>
                {summaryDetails.qualifications && (
                  <MultiSelect
                    options={summaryDetails.qualifications.map(
                      (qualification) => ({
                        label: qualification.qualifications,
                        value: qualification.id,
                      })
                    )}
                    name="qualification"
                    value={selectedQualifications}
                    labelledBy="Select"
                    onChange={setSelectedQualifications}
                  />
                )}
              </Form.Group>
              <Link
                className="link-tag"
                onClick={handleQualificationDialogOpen}
              >
                + Add Qualification
              </Link>
            </Col>
            <Col md="6">
              <Form.Group>
                <Form.Label>Languages</Form.Label>
                {summaryDetails.languages && (
                  <MultiSelect
                    options={summaryDetails.languages.map((language) => ({
                      label: language.languages,
                      value: language.id,
                    }))}
                    name="languages"
                    value={selectedLanguages}
                    labelledBy="Select"
                    onChange={setSelectedLanguages}
                  />
                )}
              </Form.Group>
              <Link className="link-tag" onClick={handleLanguageDialogOpen}>
                + Add Language
              </Link>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="primary" type="submit">
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </>
            ) : employeeId ? (
              "UPDATE"
            ) : (
              "SAVE"
            )}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <SkillsModal
        show={skillDialogOpen}
        handleClose={handleDialogClose}
        onSaveCallBack={fetchSummaryData}
      />
      <QualificationsModal
        show={qualificationsDialogOpen}
        handleClose={handleDialogClose}
        onSaveCallBack={fetchSummaryData}
      />
      <LanguagesModal
        show={languageDialogOpen}
        handleClose={handleDialogClose}
        onSaveCallBack={fetchSummaryData}
      />
    </>
  );
}

export default EmployeeForm;
