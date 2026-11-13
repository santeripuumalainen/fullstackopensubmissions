import { Alert } from '@mui/material'

// 5.30: ilmoitukset MUI:n Alert-komponentilla
const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <Alert
      severity={notification.type}
      className={notification.type}
      sx={{ my: 2 }}
    >
      {notification.message}
    </Alert>
  )
}

export default Notification
