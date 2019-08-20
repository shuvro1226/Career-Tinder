import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { compose } from "redux";
import * as ROUTES from "../../constants/routes";
import "./layouts.css";

const UserMenu = props => {
  const { auth } = props;
  return (
    <div className="btn-group">
      <span className="user-display-name d-none d-md-block">
        {auth && auth.displayName}
      </span>
      <span
        className="nav-link text-info user-settings"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="fas fa-user-cog dropdown-toggle" />
      </span>
      <div className="dropdown-menu dropdown-menu-right user-settings-dropdown">
        <NavLink
          className="dropdown-item close-menu"
          to={ROUTES.UPDATE_PROFILE}
        >
          <i className="fas fa-user close-menu" /> Profile
        </NavLink>
        <NavLink
          className="dropdown-item close-menu"
          to={ROUTES.CHANGE_PASSWORD}
        >
          <i className="fas fa-unlock-alt close-menu" /> Change Password
        </NavLink>
        <NavLink
          className="dropdown-item sign-out-link close-menu"
          to="#"
          onClick={props.signOut}
        >
          {" "}
          <i className="fas fa-sign-out-alt close-menu" /> Sign Out
        </NavLink>
      </div>
    </div>
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

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(UserMenu);
