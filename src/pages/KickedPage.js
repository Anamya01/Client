import React from 'react'
import '../styles/Style.css';
function KickedPage() {
  return (
    <div className='kicked-page'>
      <div className="brand-header kick-badge">
          <div className="brand-badge">
            <span className="brand-icon">★</span>
            <span className="brand-text">Intervue Poll</span>
          </div>
          <div className='info'>
            <h1>You've been Kicked out !</h1>
            <p>Looks like the teacher had removed you from the poll system .Please 
            Try again sometime.</p>
          </div>
        </div>
    </div>
  )
}

export default KickedPage
