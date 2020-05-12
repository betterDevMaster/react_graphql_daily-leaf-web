import React, { Component } from 'react'

class Card extends Component {
  render () {
    return (
      <div className={`card ${this.props.cardClassName ? this.props.cardClassName : ''}`}>
        {this.props.title ? <div className='card-header'>{this.props.title}</div> : null}
        <div className='card-body'>
          { this.props.children }
        </div>
        <div className='card-footer'>
          { this.props.footer }
        </div>
      </div>
    )
  }
}

export default Card
