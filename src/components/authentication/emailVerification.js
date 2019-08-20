import React from "react";
import * as ROUTES from "../../constants/routes";
import { connect } from "react-redux";
import { verifyEmail } from "../../store/actions/authActions";
import { compose } from "recompose";
import { MDBRow, MDBBtn } from "mdbreact";
import { Redirect } from "react-router-dom";

class EmailVerification extends React.Component {
  onSendEmailVerification = () => {
    this.props.verifyEmail();
  };

  render() {
    const { auth, authError } = this.props;
    if (auth && auth.emailVerified) return <Redirect to={ROUTES.JOBS} />;
    return (
      <div className="container text-center d-flex justify-content-center black-label">
        <MDBRow>
          <div className="black-text text-center text-md-left col-md-6 mt-xl-5 mb-5">
            <h1 className="h1-responsive font-weight-bold mt-4">
              Career Tinder{" "}
            </h1>
            <hr className="hr-dark" />
            <h6 className="mb-4">
              Verify your E-Mail to use Career Tinder: Check your E-Mails (Spam
              folder included) for a confirmation E-Mail or send another
              confirmation E-Mail.
            </h6>

            <MDBBtn color="indigo" onClick={this.onSendEmailVerification}>
              {" "}
              Send confirmation E-Mail
            </MDBBtn>
            <div className="center red-text">
              {authError ? <p>{authError}</p> : null}
            </div>
          </div>
        </MDBRow>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    verifyEmail: () => dispatch(verifyEmail())
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EmailVerification);
