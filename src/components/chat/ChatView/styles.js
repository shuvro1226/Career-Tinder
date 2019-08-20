const styles = theme => ({

  content: {
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    width: '100%',
    position: 'relative'
  },

  userSent: {
    float: 'left',
    clear: 'both',
    padding: '20px',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
    marginTop: '10px',
    backgroundColor: '#707BC4',
    color: 'white',
    width: '300px',
    borderRadius: '10px'
  },

  friendSent: {
    float: 'right',
    clear: 'both',
    padding: '20px',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
    marginTop: '10px',
    backgroundColor: '#979FD3',
    color: 'white',
    width: '300px',
    borderRadius: '10px'
  },

  chatHeader: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#344195',
    fontSize: '14px',
    textAlign: 'center',
    color: 'white',
    padding: '10px',
    boxSizing: 'border-box'
  }

});

export default styles;