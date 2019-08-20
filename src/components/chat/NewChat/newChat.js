import React from "react";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  withStyles,
  Typography
} from "@material-ui/core";
import styles from "./styles";
const firebase = require("firebase");

class NewChatComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      message: null
    };
  }
  componentDidMount = () => {
    if (this.props.redirectEmail) {
      this.setState({
        username: this.props.redirectEmail
      });
    }
  };
  componentWillReceiveProps = nextProps => {
    this.setState({ username: nextProps.redirectEmail });
  };
  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <div className={classes.paper}>
          <h3 className="text-center font-weight-bold mt-4">
            <i className="fas fa-link" />
            <br />
            Connect with anyone in Career-Tinder!
          </h3>
          <form className={classes.form} onSubmit={e => this.submitNewChat(e)}>
            <FormControl fullWidth>
              <InputLabel htmlFor="new-chat-username">
                Enter email of your desired person
              </InputLabel>
              <Input
                required
                value={this.state.username || ""}
                className={classes.input}
                onChange={e => this.userTyping("username", e)}
                id="new-chat-username"
              />
            </FormControl>
            <FormControl fullWidth className="mt-2">
              <InputLabel htmlFor="new-chat-message">
                Enter Your Message
              </InputLabel>
              <Input
                required
                className={classes.input}
                autoFocus
                multiline={true}
                onChange={e => this.userTyping("message", e)}
                id="new-chat-message"
              />
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              type="submit"
            >
              Send
            </Button>
          </form>
          {this.state.serverError ? (
            <Typography
              component="h5"
              variant="h6"
              className={classes.errorText}
            >
              Unable to locate the user
            </Typography>
          ) : null}
        </div>
      </main>
    );
  }

  componentWillMount() {
    if (!firebase.auth().currentUser) this.props.history.push("/login");
  }

  userTyping = (inputType, e) => {
    switch (inputType) {
      case "username":
        this.setState({ username: e.target.value });
        break;

      case "message":
        this.setState({ message: e.target.value });
        break;

      default:
        break;
    }
  };

  submitNewChat = async e => {
    e.preventDefault();
    const userExists = await this.userExists();
    if (userExists) {
      const chatExists = await this.chatExists();
      chatExists ? this.goToChat() : this.createChat();
    }
  };

  buildDocKey = () =>
    [firebase.auth().currentUser.email, this.state.username].sort().join(":");

  createChat = () => {
    this.props.newChatSubmitFn({
      sendTo: this.state.username,
      message: this.state.message
    });
  };

  goToChat = () =>
    this.props.goToChatFn(this.buildDocKey(), this.state.message);

  chatExists = async () => {
    const docKey = this.buildDocKey();
    const chat = await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .get();
    console.log(chat.exists);
    return chat.exists;
  };
  userExists = async () => {
    const usersSnapshot = await firebase
      .firestore()
      .collection("users")
      .get();
    const exists = usersSnapshot.docs
      .map(_doc => _doc.data().email)
      .includes(this.state.username);
    this.setState({ serverError: !exists });
    return exists;
  };
}

export default withStyles(styles)(NewChatComponent);
