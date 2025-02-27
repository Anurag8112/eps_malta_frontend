import React from "react";
import { Link } from "react-router-dom";
import PageNotFoundImage from "../../assets/img/page.jpg";

function PageNotFound() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-sm-6 text-center" style={{ marginTop: "80px" }}>
          <img src={PageNotFoundImage} alt="Oops" width="200" />
          <h3 className="h2">
            Oops! We couldn't find what you're looking for.
          </h3>
          <p>You can go back to the or explore other parts of our website.</p>
          <Link to="/login">Go to Back</Link>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
