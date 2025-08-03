import React from 'react'
import ReactDOM from 'react-dom/client'
import SymptomAI from '../app/symptomai-frontend'
import '../app/app.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SymptomAI />
  </React.StrictMode>,
)
