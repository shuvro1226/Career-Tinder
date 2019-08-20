import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import * as ROUTES from "../../constants/routes";
import { Redirect } from "react-router-dom";

class Notifications extends React.Component {
  render() {
    const { auth, notifications } = this.props;
    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    return (
      <div className="container page-wrapper">
        <h3 className="text-center font-weight-bold mt-4">
          <i className="fas fa-bell" /> Notifications{" "}
        </h3>
        <div className="row">
          <div className="col-12 col-md-6">
            <ul className="online-users">
              {notifications &&
                notifications.map(item => {
                  return (
                    <li key={item.id}>
                      <span>{item.content}</span>
                      <div className="note-date grey-text">
                        {moment(item.time.toDate()).fromNow()}
                      </div>
                    </li>
                  );
                })}
            </ul>
            <h6 className="text-center">
              {notifications && notifications.length === 0
                ? "You have no notifications at this moment."
                : ""}
            </h6>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const auth = state.firebase.auth;
  const notification = state.firestore.ordered.notifications;
  return {
    uid: auth.uid,
    notifications: notification,
    auth: auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    return [
      {
        collection: "notifications",
        where: [["userId", "==", props.uid || null]],
        orderBy: ["time", "desc"],
        limit: 3
      }
    ];
  })
)(Notifications);
