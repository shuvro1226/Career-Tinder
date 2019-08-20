import React from "react";
import * as ROUTES from "../../constants/routes";
import "./profile.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { passwordChange } from "../../store/actions/profileAction";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null
};

var newLoad;

class ChangePassword extends React.Component {
  // state = { ...INITIAL_STATE };

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
    this.props.passwordChange(this.state.passwordOne);
    newLoad = false;
    this.setState({
      passwordOne: "",
      passwordTwo: ""
    });
  };

  render() {
    const { passwordOne, passwordTwo } = this.state;
    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";
    const { auth, authStatus, authMsg } = this.props;

    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    return (
      <div className="container page-wrapper">
        <h3 className="text-center font-weight-bold mt-4">
          <i className="fas fa-key" />
          <br />
          Change your password{" "}
        </h3>
        <div className="row">
          <div className="col-12 col-md-6">
            <form
              onSubmit={this.handleSubmit}
              className="profile-form mt-4 mb-4"
            >
              <div className="form-group">
                <label className="form-label" htmlFor="passwordOne">
                  Enter new Password
                </label>
                <input
                  type="password"
                  id="passwordOne"
                  name="passwordOne"
                  value={passwordOne}
                  className="form-control form-control-lg"
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="passwordTwo">
                  Re-enter new Password
                </label>
                <input
                  type="password"
                  id="passwordTwo"
                  name="passwordTwo"
                  value={passwordTwo}
                  className="form-control form-control-lg"
                  onChange={this.handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-info w-100 mt-4"
                disabled={isInvalid}
              >
                <i className="fas fa-exchange-alt" /> Change
              </button>
              {newLoad === false ? (
                <div
                  className={
                    authStatus === "OK"
                      ? "text-center green-text"
                      : "text-center red-text"
                  }
                >
                  <h6 className="mt-4">{authMsg}</h6>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const auth = state.firebase.auth;
  const users = state.firestore.data.users;
  const user = users ? users[auth.uid] : null;
  return {
    auth: auth,
    authStatus: state.profile.authStatus,
    authMsg: state.profile.authMsg,
    user: user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    passwordChange: newPassword => dispatch(passwordChange(newPassword))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([
    {
      collection: "users"
    }
  ])
)(ChangePassword);
