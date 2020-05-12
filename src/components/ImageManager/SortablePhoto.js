import React from 'react'

const imgStyle = {
  display: 'block',
  objectFit: 'cover'
}

const cont = {
  backgroundColor: '#eee',
  cursor: 'pointer',
  overflow: 'hidden',
  float: 'left',
  position: 'relative'
}

export default ({ photo, margin }) => {
  return (<div style={{ margin, width: photo.width, ...cont }}>
    <img style={{ ...imgStyle }} alt='' {...photo} />
  </div>
  )
}
