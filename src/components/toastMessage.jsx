const ToastMessage = ({ color, msg }) => {
  return (
    <div style={{ background: color }}>
      <p>{msg}</p>
    </div>
  )
}

export default ToastMessage