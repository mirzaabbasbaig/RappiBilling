import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DynamicBillingForm_1 from './test.jsx'
// import DynamicBillingForm_1 from './test_!.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <DynamicBillingForm_1/>
  </StrictMode>,
)
