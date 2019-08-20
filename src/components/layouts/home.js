import React from "react";
import { NavLink } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Animated } from "react-animated-css";

class Home extends React.Component {
  render() {
    const { auth } = this.props;
    if (auth.uid && auth.emailVerified) return <Redirect to={ROUTES.JOBS} />;
    return (
      <div className="container page-wrapper">
        <h3 className="text-center font-weight-bold page-heading">
          <i className="far fa-grin"></i><br/>
          Choose your role in<br/> Career Tinder
        </h3>
        <div className="row"  >
          <div className="col-12 col-md-6">
         
            <div className="row">
            
              <div className="col-6 text-center mt-4" > 
                <NavLink className="text-danger home-choose-role " to={ROUTES.REGISTRATION_JOB_SEEKER} >
                <Animated animationIn="jackInTheBox" isVisible={true}>   <i className="fas fa-user-graduate"></i><br/></Animated>
                  <span className="font-weight-bold ">I'm a Job Seeker</span>
                </NavLink>
              </div>
             
              <div className="col-6 text-center mt-4" >
                <NavLink className="text-warning home-choose-role" to={ROUTES.REGISTRATION_EMPLOYER}>
                <Animated animationIn="jackInTheBox" isVisible={true}>    <i className="fas fa-user-tie"></i><br/></Animated>
                  <span className="font-weight-bold">I'm an Employer</span>
                </NavLink>
              </div>
            </div>
            
          </div>
        </div>    
        <div className="row">
          <div className="col-12 text-center mt-4" >
            Already have an account? <br />
       

            <Animated animationIn="pulse infinite" isVisible={true}>
              <NavLink className="text-info font-weight-bold" to={ROUTES.LOG_IN} >
                <i className="fas fa-sign-in-alt " /> Log in
              </NavLink>
            </Animated>
            </div>
          </div>
        
        <div className="row d-none d-md-block mt-4 text-center">
          <div className="col-md-6">
            <i className="fas fa-flag mt-4"></i>
            <h6 className="mb-2 mt-4">
              Welcome to Career Tinder website. This website is designed for the
              companies which are looking to hire new employees, as well as people
              who are looking for job. To use the offered services by us,
              please login to your account or if you don't have an account yet,
              please select an option from above and register.
            </h6>
          </div>
        </div>
          
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};
export default connect(mapStateToProps)(Home);
