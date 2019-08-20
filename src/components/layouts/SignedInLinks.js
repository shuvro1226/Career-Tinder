import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { compose } from "redux";
import * as ROUTES from "../../constants/routes";

const SignedInLinks = props => {
  return (
    <ul className="navbar-nav ct-nav-collapsible">
      <li className="nav-item d-md-none" onClick={props.closeMenu}>
        <NavLink className="nav-link" to="#" onClick={props.history.goBack}>
          <i className="fas fa-arrow-left"></i> Go Back
        </NavLink>
      </li>
      <li className="nav-item" onClick={props.closeMenu}>
        <NavLink className="nav-link" to={ROUTES.JOBS}>
          <i className="fas fa-user-md text-info" /> Jobs
        </NavLink>
      </li>
      {props.profile === "jobseeker" ? (
        <li className="nav-item" onClick={props.closeMenu}>
          <NavLink className="nav-link" to={ROUTES.JOB_SEEKER_MATCHES}>
            <i className="fas fa-handshake text-info" /> Matches
          </NavLink>
        </li>
      ) : (
        ""
      )}
        <li className="nav-item" onClick={props.closeMenu}>
        <NavLink className="nav-link" to={ROUTES.CHAT_DASHBOARD}>
          <i className="far fa-envelope text-info" /> Messages
        </NavLink>
      </li>
      <li className="nav-item" onClick={props.closeMenu}>
        <NavLink className="nav-link" to={ROUTES.NOTIFICATIONS}>
          <i className="fas fa-bell text-info" /> Notifications
        </NavLink>
      </li>
    </ul>
  );
};

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default withRouter(compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SignedInLinks));
