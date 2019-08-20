import React, { Component } from "react";
import $ from "jquery/src/jquery";
import { firestoreConnect } from "react-redux-firebase";
import "../profile/profile.css";
import * as ROUTES from "../../constants/routes";
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { Button } from "reactstrap";
import "../app/app.css";
import {
  getjobseekers,
  saveEmployerChoice
} from "../../store/actions/jobAdActions";
import _ from "lodash";
import addScoreToJobSeeker from "./jobSeekerRelevancyFactorCalculator";
import { Animated } from "react-animated-css";

class JobSeekers extends Component {
  constructor(props) {
    super(props);
    this.props.getjobseekers(this.props.jobAdId);
    this.slideSeekerUp = this.slideSeekerUp.bind(this);
    this.slideSeekerDown = this.slideSeekerDown.bind(this);
  }
  processLikeDisLike(userAction, jobSeekerId) {
    const employerChoiceEntity = {
      employerId: null,
      jobAdId: null,
      jobSeekerId: null,
      isLiked: Boolean
    };
    console.log(this.props.employer)
    var employerChoice = employerChoiceEntity;
    employerChoice.employerId = this.props.auth.uid;
    if(this.props.employer)
      employerChoice.employerEmail = this.props.employer.contactEmail ? this.props.employer.contactEmail : this.props.employer.employerEmail;
    if(!employerChoice.employerEmail) employerChoice.employerEmail = "";
    employerChoice.jobAdId = this.props.jobAdId;
    employerChoice.jobSeekerId = jobSeekerId;
    employerChoice.isLiked = userAction;
    this.props.saveEmployerChoice(employerChoice);
  }

  slideSeekerUp = id => {
    this.processLikeDisLike(true, id);
  };

  slideSeekerDown = id => {
    this.processLikeDisLike(false, id);
  };

  likeSeekerUp = e => {
    var id = $(e.target)[0].closest(".job-seeker-wrapper").id;
    $("#" + id).find('.card').addClass('bg-success').delay(1000)
    $("#" + id)
      .animate({ left: "2000px" }, "slow")
      .slideUp(500);
    //call the managment of (Dis)Likes to be store on DB:
    setTimeout(
      function() {
        //Start the timer
        this.processLikeDisLike(true, id);
      }.bind(this),
      1000
    );
  };

  dislikeSeekerDown = e => {
    var id = $(e.target)[0].closest(".job-seeker-wrapper").id;
    
    $("#" + id).find('.card').addClass('bg-danger').delay(1000)
    $("#" + id)
      .animate({ right: "2000px" }, "slow")
      .slideUp(500);
      
    //call the managment of (Dis)Likes to be store on DB:
    setTimeout( 
      function() {
        //Start the timer
        this.processLikeDisLike(false, id);
      }.bind(this),
      1000
    );
  };

  render() {
    const { auth, jobSeekersList, jobAd } = this.props;
    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    ////////////////////////////////////////////////////////////////////////////////////
    //sorting
    if (jobSeekersList && jobSeekersList.length && jobAd) {
      addScoreToJobSeeker(jobAd, jobSeekersList);
      jobSeekersList.sort(function(a, b) {
        return b.relevancyScore - a.relevancyScore;
      });
    }
    ////////////////////////////////////////////////////////////////////////////////////
    return (
      <div>
        {/* <input type="hidden" id="hdnJobAdId" value={state.jobAdId}></input> */}
        <div className="container page-wrapper">
          <div className="card-container">
            <h4 className="mt-4 text-center font-weight-bold">
              <i className="fas fa-street-view" /> Recommendations for position "{jobAd && jobAd.jobtitle}"
            </h4>
            <div className="mt-4 d-sm-block d-none">
              <div className="row" align="center">
                {jobSeekersList &&
                  jobSeekersList.map(jobSeeker => {
                    return (
                      <div
                        id={jobSeeker.id}
                        key={jobSeeker.id}
                        className="col-lg-4 col-md-6 col-12 job-seeker-wrapper mt-2"
                      >
                        <div className="card job-ad text-body shadow rounded">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-12">
                                <b className="mr-2">
                                  <i className="fas fa-universal-access"></i> Skills:
                                </b>
                                {jobSeeker.skills &&
                                jobSeeker.skills.length > 0 ? (
                                  jobSeeker.skills.map(skill => {
                                    return (
                                      <span
                                        key={jobSeeker.id + "_" + skill.value}
                                        className="badge badge-warning mr-2"
                                      >
                                        {skill.label}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                              </div>
                              <div className="col-12">
                                <b>
                                  <i className="fas fa-graduation-cap" />{" "}
                                  Education:
                                </b>{" "}
                                {jobSeeker.education ? (
                                  jobSeeker.education.label
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                              </div>
                              <div className="col-12">
                                <b className="mr-2">
                                  <i className="fas fa-check-double" /> Work
                                  Experiences:
                                </b>
                                {jobSeeker.workExperiences &&
                                jobSeeker.workExperiences.length > 0 ? (
                                  jobSeeker.workExperiences.map(exp => {
                                    return (
                                      <span
                                        key={exp.companyName + "_" + exp.jobTitle}
                                        className="badge badge-warning mr-2"
                                      >
                                        {exp.companyName}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                              </div>

                              <div className="col-12">
                                <b className="mr-2">
                                  <i className="fas fa-language" /> Languages:
                                </b>
                                {jobSeeker.languages &&
                                jobSeeker.languages.length > 0 ? (
                                  jobSeeker.languages.map(lang => {
                                    return (
                                      <span
                                        key={lang.value}
                                        className="badge badge-warning mr-2"
                                      >
                                        {lang.label}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                              </div>
                              <div className="col-12">
                                <b>
                                  <i className="fas fa-certificate" /> Desired Job
                                  Type:
                                </b>{" "}
                                {(jobSeeker.applyfulltime &&
                                jobSeeker.applyfulltime
                                  ? "Full Time"
                                  : "Part Time") ||
                                  (jobSeeker.applypartime &&
                                  jobSeeker.applypartime
                                    ? "Part Time"
                                    : "Full Time")}
                              </div>
                              <div className="col-12">
                                <b>
                                  <i className="fas fa-euro-sign" /> Min Salary:
                                </b>{" "}
                                {jobSeeker.minSalary ? (
                                  jobSeeker.minSalary
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="w-100">
                            <div className="card-buttons">
                              <Button
                                color="info"
                                className="w-100 m-0"
                                onClick={this.likeSeekerUp}
                              >
                                <i className="fas fa-thumbs-up" />
                              </Button>{" "}
                            </div>
                            <div className="card-buttons">
                              <Button
                                color="danger"
                                className="w-100 m-0"
                                onClick={this.dislikeSeekerDown}
                              >
                                <i className="fas fa-thumbs-down" />
                              </Button>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="mt-4 d-block d-sm-none">
              <div className="demo employer-rec-card">              
                <div className="demo__content">
                  <div className="demo__card-cont"></div>
                  {jobSeekersList &&
                    jobSeekersList.map(jobSeeker => {
                      return (
                        <div
                          id={jobSeeker.id}
                          key={jobSeeker.id}
                          className="demo__card shadow rounded text-left job-seeker-wrapper"
                        >
                          <div className="card job-ad text-body">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-12">
                                  <b className="mr-2">
                                    <i className="fas fa-universal-access"></i> Skills:
                                  </b>
                                  {jobSeeker.skills &&
                                  jobSeeker.skills.length > 0 ? (
                                    jobSeeker.skills.map(skill => {
                                      return (
                                        <span
                                          key={jobSeeker.id + "_" + skill.value}
                                          className="badge badge-warning mr-2"
                                        >
                                          {skill.label}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <i className="fas fa-ban text-muted" />
                                  )}
                                </div>
                                <div className="col-12">
                                  <b>
                                    <i className="fas fa-graduation-cap" />{" "}
                                    Education:
                                  </b>{" "}
                                  {jobSeeker.education ? (
                                    jobSeeker.education.label
                                  ) : (
                                    <i className="fas fa-ban text-muted" />
                                  )}
                                </div>
                                <div className="col-12">
                                  <b className="mr-2">
                                    <i className="fas fa-check-double" /> Work
                                    Experiences:
                                  </b>
                                  {jobSeeker.workExperiences &&
                                  jobSeeker.workExperiences.length > 0 ? (
                                    jobSeeker.workExperiences.map(exp => {
                                      return (
                                        <span
                                          key={exp.companyName + "_" + exp.jobTitle}
                                          className="badge badge-warning mr-2"
                                        >
                                          {exp.companyName}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <i className="fas fa-ban text-muted" />
                                  )}
                                </div>

                                <div className="col-12">
                                  <b className="mr-2">
                                    <i className="fas fa-language" /> Languages:
                                  </b>
                                  {jobSeeker.languages &&
                                  jobSeeker.languages.length > 0 ? (
                                    jobSeeker.languages.map(lang => {
                                      return (
                                        <span
                                          key={lang.value}
                                          className="badge badge-warning mr-2"
                                        >
                                          {lang.label}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <i className="fas fa-ban text-muted" />
                                  )}
                                </div>
                                <div className="col-12">
                                  <b>
                                    <i className="fas fa-certificate" /> Desired Job
                                    Type:
                                  </b>{" "}
                                  {(jobSeeker.applyfulltime &&
                                  jobSeeker.applyfulltime
                                    ? "Full Time"
                                    : "Part Time") ||
                                    (jobSeeker.applypartime &&
                                    jobSeeker.applypartime
                                      ? "Part Time"
                                      : "Full Time")}
                                </div>
                                <div className="col-12">
                                  <b>
                                    <i className="fas fa-euro-sign" /> Min Salary:
                                  </b>{" "}
                                  {jobSeeker.minSalary ? (
                                    jobSeeker.minSalary
                                  ) : (
                                    <i className="fas fa-ban text-muted" />
                                  )}
                                </div>
                              </div>
                            </div>                            
                          </div>
                          <div className="demo__card__choice m--reject" />
                          <div className="demo__card__choice m--like" />
                          <div className="demo__card__drag" />
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="demo__tip text-danger font-weight-bold">
                <Animated animationIn="pulse infinite" isVisible={true}>
                  <i className="fas fa-angle-double-left" /> Swipe left or right{" "}
                  <i className="fas fa-angle-double-right" />
                </Animated>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    var animating = false;
    var cardsCounter = 0;
    var numOfCards = 6;
    var decisionVal = 80;
    var pullDeltaX = 0;
    var deg = 0;
    var $card, $cardReject, $cardLike;
    var _ = this;

    function pullChange() {
      animating = true;
      deg = pullDeltaX / 10;
      $card.css(
        "transform",
        "translateX(" + pullDeltaX + "px) rotate(" + deg + "deg)"
      );

      var opacity = pullDeltaX / 100;
      var rejectOpacity = opacity >= 0 ? 0 : Math.abs(opacity);
      var likeOpacity = opacity <= 0 ? 0 : opacity;
      $cardReject.css("opacity", rejectOpacity);
      $cardLike.css("opacity", likeOpacity);
    }

    function release() {
      var id = $card.attr("id");
      if (pullDeltaX >= decisionVal) {
        _.slideSeekerUp(id);
        $card.addClass("to-right");
      } else if (pullDeltaX <= -decisionVal) {
        _.slideSeekerDown(id);
        $card.addClass("to-left");
      }

      if (Math.abs(pullDeltaX) >= decisionVal) {
        $card.addClass("inactive");

        setTimeout(function() {
          $card.addClass("below").removeClass("inactive to-left to-right");
          cardsCounter++;
          if (cardsCounter === numOfCards) {
            cardsCounter = 0;
            $(".demo__card").removeClass("below");
          }
        }, 300);
      }

      if (Math.abs(pullDeltaX) < decisionVal) {
        $card.addClass("reset");
      }

      setTimeout(function() {
        $card
          .attr("style", "")
          .removeClass("reset")
          .find(".demo__card__choice")
          .attr("style", "");

        pullDeltaX = 0;
        animating = false;
      }, 300);
    }

    $(document).on(
      "mousedown touchstart",
      ".demo__card:not(.inactive)",
      function(e) {
        if (animating) return;

        $card = $(this);
        $cardReject = $(".demo__card__choice.m--reject", $card);
        $cardLike = $(".demo__card__choice.m--like", $card);
        var startX = 0;
        if (e.originalEvent.touches) {
          startX = e.originalEvent.touches[0].pageX;
        } else {
          startX = e.pageX;
        }

        $(document).on("mousemove touchmove", function(e) {
          var x = 0;
          if (e.originalEvent.touches) {
            x = e.originalEvent.touches[0].pageX;
          } else {
            x = e.pageX;
          }

          pullDeltaX = x - startX;
          if (!pullDeltaX) return;
          pullChange();
        });

        $(document).on("mouseup touchend", function() {
          $(document).off("mousemove touchmove mouseup touchend");
          if (!pullDeltaX) return; // prevents from rapid click events
          release();
        });
      }
    );
  }
}

const mapStateToProps = state => {
  const urlSplit = window.location.href.split("/");
  const jobAdId = urlSplit[urlSplit.length - 1];
  const jobSeekersList = state.jobAd.data;
  const employerChoices = state.firestore.ordered.employerChoice;
  const EmployerjobSeekersList = _.differenceWith(
    jobSeekersList,
    employerChoices,
    function(jobseeker, employerChoice) {
      return (
        jobseeker.id === employerChoice.jobSeekerId &&
        jobAdId === employerChoice.jobAdId
      );
    }
  );
  //retrieving jobAd for sorting
  let jobAds = state.firestore.data.jobposting;
  let jobAd = jobAds && jobAdId ? jobAds[jobAdId] : null;

  const employers = state.firestore.data.employer;
  const auth = state.firebase.auth;
  const employer = employers ? employers[auth.uid] : null;
  return {
    auth: auth,
    authError: state.auth.authError,
    jobSeekersList: EmployerjobSeekersList,
    jobAdId: jobAdId,
    jobAd: jobAd,
    employer: employer
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getjobseekers: jobAdId => dispatch(getjobseekers(jobAdId)),
    saveEmployerChoice: employerChoice =>
      dispatch(saveEmployerChoice(employerChoice))
  };
};
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    return [
      {
        collection: "employerChoice",
        where: [["employerId", "==", props.auth.uid || null]]
      },
      {
        collection: "jobposting"
      }
    ];
  })
)(JobSeekers);
