import React from 'react'
import { createRoot } from 'react-dom/client'
import QueueApp from './pages/QueueApp.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueueApp />
  </React.StrictMode>
)
