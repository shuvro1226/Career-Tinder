const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: 'calc(100vh - 80px)',
    position: 'absolute',
    left: '0',
    width: '100%',
    wordBreak: 'break-all',
    boxShadow: '0px 0px 2px black',
    zIndex: '9999'
  },
  listItem: {
    cursor: 'pointer'
  },
  newChatBtn: {
    borderRadius: '0px'
  },
  unreadMessage: {
    color: 'red',
    position: 'absolute',
    top: '0',
    right: '5px'
  }
});

export default styles;