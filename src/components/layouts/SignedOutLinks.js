import React from "react";
import { NavLink } from "react-router-dom";
import * as ROUTES from '../../constants/routes';

const SignedOutLinks = (props) => {
  return (
    <ul className="navbar-nav ct-nav-collapsible">
      <li className="nav-item">
        <NavLink exact className="nav-link" to={ROUTES.LANDING} onClick={props.closeMenu}>
          <i className="fas fa-user-plus text-info" /> Register
        </NavLink>
      </li>
    </ul>
  );
};

export default SignedOutLinks;
