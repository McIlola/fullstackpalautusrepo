const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.isError ? 'error' : 'notification'}>
      {message.text}
    </div>
  )
}

export default Notification