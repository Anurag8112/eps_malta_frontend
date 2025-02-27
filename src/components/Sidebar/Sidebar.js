import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Nav, Collapse } from "react-bootstrap";
import { useTokenInfo } from "../../authRoutes/PrivateRoutes.js";

function Sidebar({ color, image, routes }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState({});
  const { userEmail } = useTokenInfo();

  const toggleMenu = (index) => {
    const updatedMenuState = { ...menuOpen };
    updatedMenuState[index] = !menuOpen[index];
    setMenuOpen(updatedMenuState);
  };

  const activeRoute = (routeName) =>
    location.pathname === routeName ? "active" : "";

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a href="/" className="simple-text logo-mini mx-1">
            <div className="logo-img">
              <img src={require("assets/img/malta-logo.webp")} alt="..." />
            </div>
          </a>
          <a className="simple-text" href="/">
            Employees
          </a>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (
              prop.redirect ||
              (prop.name === "Companies" && userEmail !== "info@epsmalta.com")
            ) {
              return null;
            }
            if (prop.subMenu) {
              const isMenuOpen = menuOpen[key];
              return (
                <li key={key}>
                  <NavLink
                    onClick={() => toggleMenu(key)}
                    className="nav-link"
                    aria-expanded={isMenuOpen ? "true" : "false"}
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                    <b className={`caret ${isMenuOpen ? "open" : ""}`}></b>
                  </NavLink>
                  <Collapse in={isMenuOpen}>
                    <div>
                      {prop.subMenu.map((subMenuRoute, subMenuKey) => {
                        if (subMenuRoute.redirect) return null;
                        return (
                          <li
                            className={activeRoute(
                              subMenuRoute.layout + subMenuRoute.path
                            )}
                            key={subMenuKey}
                          >
                            <NavLink
                              to={subMenuRoute.layout + subMenuRoute.path}
                              className="sub-menu-nav-link"
                              activeclassname="active"
                            >
                              {/* <span className="sidebar-mini">
                                {subMenuRoute.icon}
                              </span> */}
                              <span className="sidebar-normal">
                                {subMenuRoute.name}
                              </span>
                            </NavLink>
                          </li>
                        );
                      })}
                    </div>
                  </Collapse>
                </li>
              );
            } else {
              return (
                <li
                  className={
                    prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path)
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeclassname="active"
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            }
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
