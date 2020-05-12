import React, { Component } from 'react'
import './AdminCommon.css'
// import { Breadcrumb } from 'react-bootstrap'

class AdminHeader extends Component {
  render () {
    return (
      <nav className='navbar navbar-expand-lg bg-white'>
        <div className='container'>
          <div className='navbar-translate'>
            <a className='navbar-brand'>
              {this.props.title}
            </a>
            <button
              className='navbar-toggler'
              type='button'
              data-toggle='collapse'
              data-target='#example-navbar-primary'
              aria-controls='navbarSupportedContent'
              aria-expanded='false'
              aria-label='Toggle navigation'>
              <span className='navbar-toggler-bar bar1' />
              <span className='navbar-toggler-bar bar2' />
              <span className='navbar-toggler-bar bar3' />
            </button>
          </div>
          <div className='collapse navbar-collapse' id='example-navbar-primary' data-nav-image='./assets/img/blurred-image-1.jpg'>
            <ul className='navbar-nav ml-auto'>
              {this.props.menuItems ? this.props.menuItems.map((menu, index) => {
                return (<li className='nav-item' key={index}>
                  <a className='nav-link' href={menu.link} onClick={menu.onClick}>
                    <i className={menu.icon} /><p> {menu.title} </p></a>
                </li>)
              }) : null}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default AdminHeader
