import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./login.css";
import * as ROUTES from "../../constants/routes";
import { signIn } from "../../store/actions/authActions";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Animated } from "react-animated-css";
import $ from "jquery/src/jquery";

const INITIAL_STATE = {
  email: "",
  password: ""
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = e => {
    sessionStorage.setItem("popupLoaded", "0");
    e.preventDefault();
    if ($(".collapsenav").hasClass("show")) {
      $(".hamburger-button__button").click();
    }
    this.props.signIn(this.state);
  };

  render() {
    const { authError, auth } = this.props;
    if (auth.uid && auth.emailVerified) return <Redirect to={ROUTES.JOBS} />;
    return (
      <div className="container page-wrapper">
        <h3 className="text-center font-weight-bold mt-4">
          <i className="fas fa-sign-in-alt" />
          <br />
          Start using
          <br /> Career Tinder
        </h3>
        <div className="row">
          <div className="col-md-6 col-12">
            <form className="mt-4 mb-4 login-form" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <i className="fas fa-envelope" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={this.state.email}
                  className="form-control form-control-lg"
                  onChange={this.changeHandler}
                  placeholder="career-tinder@gmail.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  <i className="fas fa-key" /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={this.state.password}
                  className="form-control form-control-lg"
                  onChange={this.changeHandler}
                  placeholder="******"
                  required
                />
                <Link
                  className="text-info float-right font-weight-bold mt-2"
                  to={ROUTES.FORGOT_PASSWORD}
                >
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="btn btn-lg btn-info w-100 mt-4">
                <i className="fas fa-sign-in-alt" /> Sign In
              </button>
              <div className="text-center mt-4 black-text">
                <div className="center red-text">
                  {authError ? <p>{authError}</p> : null}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="text-center">
          <span>Don't have an account? </span>
          <Animated animationIn="pulse infinite" isVisible={true}>
            <NavLink
              className="nav-link text-danger font-weight-bold"
              to={ROUTES.LANDING}
            >
              <i className="fas fa-user-plus" /> Register
            </NavLink>
          </Animated>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: creds => dispatch(signIn(creds))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
