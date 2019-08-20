import React from "react";
import "./login.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { passwordForget } from "../../store/actions/authActions";
import * as ROUTES from "../../constants/routes";

const INITIAL_STATE = {
  email: "",
  error: null,
  authMsg: null
};

var newLoad;

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    newLoad = true;
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { email } = this.state;

    this.props.passwordForget(email);
    newLoad = false;
    this.forceUpdate();
  };

  render() {
    const { email } = this.state;
    const isInvalid = email === "";
    const { auth, authStatus, authMsg } = this.props;

    if (auth.uid) return <Redirect to={ROUTES.JOBS} />;
    return (
      <div className="container page-wrapper">
        <h3 className="text-center font-weight-bold mt-4">
          <i className="fas fa-redo-alt" />
          <br />
          Reset password
        </h3>
        <div className="row">
          <div className="col-12 col-md-6">
            <h6 className="mt-4" align="center">
              Enter the e-mail address associated with your Career Tinder
              account and we'll send you instructions on how to reset your
              password.
            </h6>
            <form className="fp-form mt-4 mb-4" onSubmit={this.handleSubmit}>
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
                  onChange={this.handleChange}
                  placeholder="career-tinder@gmail.com"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-info w-100 mt-4"
                disabled={isInvalid}
              >
                <i className="far fa-paper-plane" /> Send
              </button>

              <div className="text-center mt-4 black-text">
                {newLoad === false ? (
                  <div
                    className={
                      authStatus === "OK"
                        ? "center green-text"
                        : "center red-text"
                    }
                  >
                    <p>{authMsg}</p>
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return {
    auth: state.firebase.auth,
    authStatus: state.auth.authStatus,
    authMsg: state.auth.authMsg
  };
};

const mapDispatchToProps = dispatch => {
  return {
    passwordForget: email => dispatch(passwordForget(email))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPassword);
