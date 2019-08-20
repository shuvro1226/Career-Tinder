import React from "react";
import "./profile.css";
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect, withRouter } from "react-router-dom";
import { Alert } from "reactstrap";
import { editEmployerProfile } from "../../store/actions/profileAction";
import * as ROUTES from "../../constants/routes";
import { firestoreConnect } from "react-redux-firebase";
import $ from "jquery/src/jquery";

class EditEmployerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleEmployerSubmit = this.handleEmployerSubmit.bind(this);
    this.onShowAlert = this.onShowAlert.bind(this);
  }
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleEmployerSubmit = e => {
    e.preventDefault();

    var employerProfileEntity = {};
    employerProfileEntity.employerName = $("#employerName").val();
    employerProfileEntity.industryName = $("#industryName").val();
    employerProfileEntity.employerAddress = $("#employerAddress").val();
    employerProfileEntity.employerDescription = $("#employerDescription").val();
    employerProfileEntity.contactName = $("#contactName").val();
    employerProfileEntity.contactEmail = $("#contactEmail").val();
    employerProfileEntity.contactPhone = $("#contactPhone").val();

    this.props.editEmployerProfile(employerProfileEntity);
    this.onShowAlert();
  };

  onShowAlert = () => {
    this.setState({ visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false });
        this.props.history.push(ROUTES.JOBS);
      }, 3000);
    });
  };

  render() {
    const { auth, response, message } = this.props;
    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    return (
      <div className="employer-profile">
        <Alert color={response} isOpen={this.state.visible}>
          <i
            className={response === "success" ? "fas fa-check" : "fas fa-times"}
          />{" "}
          {message}
        </Alert>
        <div className="profile-form-wrapper">
          <h3 className="text-center font-weight-bold mt-4">
            <i className="far fa-edit" />
            <br />
            Edit your Employer profile
          </h3>
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              <form
                className="profile-form mt-4"
                onSubmit={this.handleEmployerSubmit}
              >
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="employerName">
                        <i className="fas fa-file-signature" /> Company name
                      </label>
                      <input
                        type="text"
                        id="employerName"
                        name="employerName"
                        defaultValue={
                          this.props.employer &&
                          this.props.employer.employerName
                        }
                        className="form-control form-control-lg"
                        onChange={this.handleChange}
                        placeholder="Career Tinder"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="industryName">
                        <i className="fas fa-industry" /> Industry
                      </label>
                      <input
                        type="text"
                        id="industryName"
                        name="industryName"
                        defaultValue={
                          this.props.employer &&
                          this.props.employer.industryName
                        }
                        className="form-control form-control-lg"
                        onChange={this.handleChange}
                        placeholder="IT"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="employerAddress">
                        <i className="fas fa-map-marker-alt" /> Address
                      </label>
                      <input
                        type="text"
                        id="employerAddress"
                        name="employerAddress"
                        defaultValue={
                          this.props.employer &&
                          this.props.employer.employerAddress
                        }
                        className="form-control form-control-lg"
                        onChange={this.handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="employerDescription"
                      >
                        <i className="fas fa-sticky-note" /> Description
                      </label>
                      <input
                        type="text"
                        id="employerDescription"
                        name="employerDescription"
                        defaultValue={
                          this.props.employer &&
                          this.props.employer.employerDescription
                        }
                        className="form-control form-control-lg"
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row text-center mt-4 mb-4">
                  <div className="col-5">
                    <hr />
                  </div>
                  <div className="col-2">
                    <i className="fas fa-tty" />
                  </div>
                  <div className="col-5">
                    <hr />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactName">
                        <i className="fas fa-user-check" /> Contact person
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        defaultValue={
                          this.props.employer && this.props.employer.contactName
                        }
                        className="form-control form-control-lg"
                        onChange={this.handleChange}
                        placeholder="Jane Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactEmail">
                        <i className="fas fa-envelope" /> Contact email
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        defaultValue={
                          this.props.employer &&
                          this.props.employer.contactEmail
                        }
                        className="form-control form-control-lg"
                        onChange={this.handleChange}
                        placeholder="contact@career-tinder.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactPhone">
                        <i className="fas fa-mobile-alt" /> Contact number
                      </label>
                      <input
                        type="text"
                        id="contactPhone"
                        name="contactPhone"
                        defaultValue={
                          this.props.employer &&
                          this.props.employer.contactPhone
                        }
                        className="form-control form-control-lg"
                        onChange={this.handleChange}
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-lg btn-info w-100 mt-4"
                    >
                      <i className="fas fa-save" /> Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const employers = state.firestore.data.employer;
  const auth = state.firebase.auth;
  const employer = employers ? employers[auth.uid] : null;
  return {
    auth: auth,
    employer: employer,
    response: state.profile.response,
    message: state.profile.message
  };
};

const mapDispatchToPropsEmployer = dispatch => {
  // console.log(state);
  return {
    editEmployerProfile: profile => dispatch(editEmployerProfile(profile))
  };
};

export default withRouter(
  compose(
    connect(
      mapStateToProps,
      mapDispatchToPropsEmployer
    ),
    firestoreConnect([
      {
        collection: "employer"
      }
    ])
  )(EditEmployerProfile)
);
