import React from 'react'
import './Page.css'

const Page = (props) => (
  <div className='wrapper'>
    <div className='container'>
      {props.children}
    </div>
  </div>
)

export default Page
