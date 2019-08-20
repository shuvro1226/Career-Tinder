import React from "react";
import oops from "../../assets/images/oops.png";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error });
  }
  render() {
    if (this.state.error) {
      return (
        <div className="snap">
          <img src={oops} alt="" />
          <div className="snap-message">
            <p>We're sorry - something has gone wrong.</p>
          </div>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
