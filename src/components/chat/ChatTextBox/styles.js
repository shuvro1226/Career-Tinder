const styles = theme => ({

  sendBtn: {
    color: 'blue',
    cursor: 'pointer',
    '&:hover': {
      color: 'gray'
    }
  },

  chatTextBoxContainer: {
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden',
    width: '100%'
  },

  chatTextBox: {
    width: 'calc(100% - 25px)',
    float: 'left'
  }

});

export default styles;