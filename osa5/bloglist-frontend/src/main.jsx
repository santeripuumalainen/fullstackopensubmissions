import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { CssBaseline } from '@mui/material'

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    {/* MUI:n perustyylit: yhtenäinen tausta, fontti ja marginaalit */}
    <CssBaseline />
    <App />
  </Router>
)
