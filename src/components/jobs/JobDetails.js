import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../profile/profile.css";
import { jobDeleteActions } from "../../store/actions/jobAdActions";
import swal from "sweetalert";
import { connect } from "react-redux";
import * as ROUTES from "../../constants/routes";

class JobDetails extends Component {
  handleDeleteAction = jobId => {
    swal({
      text: "Are you sure you want to delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete && jobId !== null) {
        this.props.jobDeleteActions(jobId);
        swal("Job Ad Deleted Successfully!", {
          icon: "success"
        });
      }
    });
  };

  render() {
    const { job } = this.props;
    return (
      <div className="col-12 col-md-6 col-lg-4">
        <div className="job-ad-admin-wrapper">
          <h6 className="job-ad-heading text-info text-center">
            {job.jobtitle}
          </h6>
          <div className="job-ad-links">
            <div className="job-ad-link">
              <Link
                id="btnMatch"
                className="btn btn-outline-info text-info w-100 m-0 mb-2"
                to={{
                  pathname: ROUTES.EMPLOYER_MATCHES + "/" + job.id,
                  job: job
                }}
              >
                <i className="far fa-thumbs-up" /><br/> Matches
              </Link>
            </div>
            <div className="job-ad-link">
              <Link
                className="btn btn-outline-info text-info w-100 m-0"
                to={{
                  pathname: ROUTES.JOB_SEEKERS_LIST_FOR_EMPLOYER + "/" + job.id,
                  job: job
                }}
              >
                <i className="fas fa-users" /><br/> Recommendations
              </Link>
            </div>
          </div>
          <div className="job-ad-actions">
            <div className="job-ad-action">
              <Link
                className="btn btn-info btn-sm w-100 m-0 font-weight-bold"
                to={{
                  pathname: "/create-job-ad",
                  job: job
                }}
              >
                <i className="fas fa-edit" />
                <br /> Edit
              </Link>
            </div>
            <div className="job-ad-action">
              <button
                type="button"
                id="btnDelete"
                className="btn btn-danger btn-sm w-100 m-0"
                onClick={e => this.handleDeleteAction(job.id)}
              >
                <i className="fas fa-trash-alt" />
                <br /> Remove
              </button>
            </div>
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

const mapDispatchToProps = dispatch => {
  return {
    jobDeleteActions: jobAd => dispatch(jobDeleteActions(jobAd))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobDetails);
