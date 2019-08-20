import React from "react";
import { NavLink } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Animated } from "react-animated-css";
import { signUpAsEmployer } from "../../store/actions/authActions";

class RegistrationEmployer extends React.Component {
  state = {
    email: "",
    password: "",
    confirm_password: "",
    companyname: ""
  };

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.signUpAsEmployer(this.state);
  };

  render() {
    const { auth, authError } = this.props;
    const { password, confirm_password } = this.state;
    const isInvalid =
      password !== confirm_password ||
      password === "" ||
      confirm_password === "";
    if (auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.EMAIL_VERIFICATION} />;
    return (
      <div className="container page-wrapper">        
        <h3 className="text-center font-weight-bold mt-4">
          <i className="fas fa-user-tie"></i><br/>
          Register as an Employer
        </h3>
        <div className="row">
          <div className="col-md-6 col-12">
            <form className="empr-form mt-4 mb-4" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email"><i className="fas fa-pencil-alt"></i> Company Name</label>
                <input type="text" id="companyname" name="companyname" value={this.state.companyname} className="form-control form-control-lg" onChange={this.changeHandler} 
                  placeholder="Career Tinder" required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email"><i className="fas fa-envelope"></i> Email</label>
                <input type="email" id="email" name="email" value={this.state.email} className="form-control form-control-lg" onChange={this.changeHandler} 
                  placeholder="career-tinder@gmail.com" required autoComplete="false" />
              </div>     

              <div className="form-group">
                <label className="form-label" htmlFor="password"><i className="fas fa-key"></i> Password</label>
                <input type="password" id="password" name="password" value={this.state.password} className="form-control form-control-lg" onChange={this.changeHandler} 
                  required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirm_password"><i className="fas fa-key"></i> Confirm Password</label>
                <input type="password" id="confirm_password" name="confirmpassword" value={this.state.confirmpassword} className="form-control form-control-lg" onChange={this.changeHandler} 
                  required autoComplete="new-password"/>
              </div>

              <button type="submit" className="btn btn-lg btn-info w-100 mt-4" enabled={isInvalid}>
                <i className="fas fa-user-plus"></i> Sign Up
              </button> 

              <div className="text-center mt-4 black-text">
                <div className="center red-text">
                  {authError ? <p>{authError}</p> : null}
                </div>
              </div>
            </form>
            <div className="text-center font-weight-bold mt-4 mb-4">
            <Animated animationIn="pulse infinite" isVisible={true}>
              <NavLink className="text-danger"
                to={ROUTES.REGISTRATION_JOB_SEEKER}
              >
                
                <i className="fas fa-user-graduate"></i> Oops! I'm a Job Seeker!
              </NavLink>
              </Animated>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signUpAsEmployer: creds => dispatch(signUpAsEmployer(creds))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationEmployer);
