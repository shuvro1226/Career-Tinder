import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../profile/profile.css";
import * as ROUTES from "../../constants/routes";
import JobDetails from "./JobDetails";
import { Animated } from "react-animated-css";

class JobsList extends Component {
  constructor() {
    super();
    this.state = {
      showFixedCreate: false
    }    
    this.listenToScroll = this.listenToScroll.bind(this);
  }  

  componentDidMount() {
    window.addEventListener('scroll', this.listenToScroll, true)
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll, true)
  }
  
  listenToScroll = () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

    if(winScroll > 30) {
      this.setState({
        showFixedCreate: true,
      });
    } else {
      this.setState({
        showFixedCreate: false,
      });
    }
  }


  render() {
    const { jobs } = this.props;   
    
    return (
      <div onScroll={this.listenToScroll}>
        <div className="page-wrapper">
          <div className="job-ads-header row mt-2">
            <div className="col-12">
              <h6 className="jobs-heading float-left"><i className="fas fa-list"></i> Jobs List</h6>
              <Animated animationIn="pulse" isVisible={true}>
                <NavLink
                  className="btn btn-info btn-sm nav-link float-right"
                  to={ROUTES.CREATE_JOB_AD}
                >
                  <i className="fas fa-plus"></i> Create Job Ad
                </NavLink>
              </Animated>
            </div>
          </div>
          <div className="row">
            {jobs &&
              jobs.map(job => {
                return <JobDetails job={job} key={job.id} />;
              })}
          </div>
          <div className={this.state.showFixedCreate ? "job-ad-create-floater":"job-ad-create-floater d-none"}>
            <Animated animationIn="pulse infinite" isVisible={true}>
              <NavLink
                className="btn btn-warning btn-circle"
                to={ROUTES.CREATE_JOB_AD}
              >
                <i className="fas fa-plus"></i>
              </NavLink>
            </Animated>
          </div>
        </div>
      </div>
    );
  }
}

export default JobsList;
