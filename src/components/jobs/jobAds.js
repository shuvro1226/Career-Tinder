import React, { Component } from "react";
import * as ROUTES from "../../constants/routes";
import $ from "jquery/src/jquery";
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect, NavLink } from "react-router-dom";
import "./jobs.css";
import "./jobs.scss";
import {
  getjobposting,
  saveUserChoice
} from "../../store/actions/jobAdActions";
import { firestoreConnect } from "react-redux-firebase";
import _ from "lodash";
import { Animated } from "react-animated-css";
import addScoreToJobPost from "./jobAdRelevancyFactorCalculator";
import moment from "moment";
import ReactMoment from "react-moment";

const jobSeekerChoiceEntity = {
  jobAdId: null,
  jobSeekerId: null,
  isLiked: Boolean
};

class JobAds extends Component {
  constructor(props) {
    super(props);
    this.props.getjobposting();

    this.state = {
      badges: ["primary", "warning", "info", "danger", "success"]
    };

    this.slideAdUp = this.slideAdUp.bind(this);
    this.slideAdDown = this.slideAdDown.bind(this);
  }

  //function to save on DB the relation between job add and user's like or dislike:
  processLikeDisLike(userAction, jobAdId, jobSeekerId, jobseeker) {
    //userAction: true ->User likes company // false->user dislikes company
    const job = this.props.userJobPosting.filter(jobAd => jobAd.id === jobAdId);

    var jobSeekerChoice = jobSeekerChoiceEntity;
    jobSeekerChoice.jobAdId = jobAdId;
    jobSeekerChoice.jobSeekerId = jobSeekerId;
    jobSeekerChoice.isLiked = userAction;
    jobSeekerChoice.jobseekerEmail = jobseeker.jobSeekerEmail
      ? jobseeker.jobSeekerEmail
      : "";
    if (job && job.length) {
      jobSeekerChoice.employerEmail = job[0].employeremail
        ? job[0].employeremail
        : "";
    }
    this.props.saveUserChoice(jobSeekerChoice);
  }

  slideAdUp = id => {
    this.processLikeDisLike(
      true,
      id,
      this.props.auth.uid,
      this.props.jobseeker
    );
  };

  slideAdDown = id => {
    this.processLikeDisLike(
      false,
      id,
      this.props.auth.uid,
      this.props.jobseeker
    );
  };

  render() {
    const { auth, userJobPosting, jobseeker } = this.props;

    if (userJobPosting && userJobPosting.length && jobseeker) {
      addScoreToJobPost(jobseeker, userJobPosting);
      userJobPosting.sort(function(a, b) {
        return (
          b.relevancyScore - a.relevancyScore ||
          moment(b.createdAt) - moment(a.createdAt)
        );
      });
    }

    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    return (
      <div className="page-wrapper">
        <h4 className="mt-4 text-center font-weight-bold">
          <i className="fas fa-street-view" /> Recommended Jobs
        </h4>
        {userJobPosting && userJobPosting.length > 0 ?
          (
            <div className="demo seeker-ads-card">
              <div className="demo__content">
                <div className="demo__card-cont">
                  {userJobPosting &&
                    userJobPosting.map(item => {
                      return (
                        <div
                          id={item.id}
                          key={item.id}
                          className="demo__card shadow rounded text-left"
                        >
                          <div className="job-ad-wrapper">
                            <div className="card job-ad text-body">
                              <div className="card-header bg-info text-white font-weight-bold">
                                <div className="row">
                                  <div className="col-12 text-center">
                                    <i className="fas fa-thumbtack" />{" "}
                                    {item.jobtitle}
                                  </div>
                                </div>
                              </div>
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-12">
                                    <b>
                                      <i className="fas fa-building" />
                                    </b>{" "}
                                    {item.employername ? (
                                      item.employername
                                    ) : (
                                      <i className="fas fa-ban text-muted" />
                                    )}
                                  </div>
                                  <div className="col-12">
                                    <b className="mr-2">
                                      <i className="fas fa-universal-access" />
                                    </b>
                                    {item.neededskills &&
                                    item.neededskills.length > 0 ? (
                                      item.neededskills.map((child, i) => {
                                        i = i % 5;
                                        return (
                                          <span
                                            key={child.value}
                                            className={"badge badge-danger mr-2"}
                                          >
                                            {child.label}
                                          </span>
                                        );
                                      })
                                    ) : (
                                      <i className="fas fa-ban text-muted" />
                                    )}
                                  </div>
                                  <div className="col-12">
                                    <b>
                                      <i className="fas fa-certificate" />
                                    </b>{" "}
                                    {(item.applyfulltime && item.applyfulltime
                                      ? "Full Time"
                                      : "Part Time") ||
                                      (item.applypartime && item.applypartime
                                        ? "Part Time"
                                        : "Full Time")}
                                  </div>
                                  <div className="col-12">
                                    <b>
                                      <i className="fas fa-euro-sign" />
                                    </b>{" "}
                                    {item.minsalary || item.maxsalary ? (
                                      item.minsalary + " - " + item.maxsalary
                                    ) : (
                                      <i className="fas fa-ban text-muted" />
                                    )}
                                  </div>
                                  <div className="col-12">
                                    <b>
                                      <i className="fas fa-calendar-alt" /> Start
                                    </b>{" "}
                                    {item.expectedstartdate &&
                                    item.expectedstartdate
                                      .toDate()
                                      .toLocaleString() ? (
                                      <ReactMoment format="MMM DD, YYYY">
                                        {item.expectedstartdate
                                          .toDate()
                                          .toLocaleString()}
                                      </ReactMoment>
                                    ) : (
                                      <i className="fas fa-ban text-muted" />
                                    )}
                                  </div>
                                  <div className="col-12">
                                    <b>
                                      <i className="fas fa-calendar-alt" /> Expires
                                    </b>{" "}
                                    {item.expirationdate &&
                                    item.expirationdate
                                      .toDate()
                                      .toLocaleString() ? (
                                      <ReactMoment format="MMM DD, YYYY">
                                        {item.expirationdate
                                          .toDate()
                                          .toLocaleString()}
                                      </ReactMoment>
                                    ) : (
                                      <i className="fas fa-ban text-muted" />
                                    )}
                                  </div>
                                  <div className="col-12">
                                    <b>
                                      <i className="fas fa-graduation-cap" />{" "}
                                      Education
                                    </b>{" "}
                                    {item.education ? (
                                      item.education.label
                                    ) : (
                                      <i className="fas fa-ban text-muted" />
                                    )}
                                  </div>
                                  <hr />
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
                <div className="demo__tip text-danger font-weight-bold">
                  <Animated animationIn="pulse infinite" isVisible={true}>
                    <i className="fas fa-angle-double-left" /> Swipe left or right{" "}
                    <i className="fas fa-angle-double-right" />
                  </Animated>
                </div>
              </div>
            </div>
          )
          : (
            <h5 className="text-center mt-4">
              There are no recommended jobs for you at this moment.
              You can either check out all the
              <NavLink className="text-info mr-2 ml-2 font-weight-bold" to={ROUTES.JOB_SEEKER_MATCHES}>
                <i className="fas fa-handshake" /> Matches
              </NavLink>
              or you can update your 
              <NavLink
                className="text-info mr-2 ml-2 font-weight-bold"
                to={ROUTES.UPDATE_PROFILE}
              >
                <i className="fas fa-user" /> Profile
              </NavLink> 
              to help us recommend jobs matching your profile.
            </h5>
          )}        
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
        _.slideAdUp(id);
        $card.addClass("to-right");
      } else if (pullDeltaX <= -decisionVal) {
        _.slideAdDown(id);
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
  const auth = state.firebase.auth;
  const jobposting = state.jobAd.data;
  const jobseekerChoice = state.firestore.ordered.jobSeekerChoice; //console.log(auth)
  let userid = auth.uid;
  let jobseekers = state.firestore.data.jobseeker;
  let jobseeker = jobseekers && userid ? jobseekers[userid] : null;
  const userJobPosting = _.differenceWith(jobposting, jobseekerChoice, function(
    jobpost,
    jobseekerchoice
  ) {
    return jobpost.id === jobseekerchoice.jobAdId;
  });

  //fill the education item name instead if the key
  const allEducationData = state.firestore.data.education;
  if (
    allEducationData !== undefined &&
    userJobPosting !== undefined &&
    userJobPosting.length > 0
  ) {
    $.each(userJobPosting, function(index, jobAd) {
      var educationItem = allEducationData[jobAd.education];
      if (educationItem !== undefined) jobAd.education = educationItem.name;
    });
  }
  return {
    userJobPosting: userJobPosting,
    uid: auth.uid,
    auth: auth,
    jobseeker: jobseeker
  };
};

const mapDispatchToPropsJobseeker = dispatch => {
  return {
    getjobposting: () => dispatch(getjobposting()),
    saveUserChoice: jobSeekerChoice => dispatch(saveUserChoice(jobSeekerChoice))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToPropsJobseeker
  ),
  firestoreConnect(props => {
    return [
      {
        collection: "jobSeekerChoice",
        where: [["jobSeekerId", "==", props.uid || null]]
      },
      {
        collection: "education"
      }
    ];
  })
)(JobAds);
