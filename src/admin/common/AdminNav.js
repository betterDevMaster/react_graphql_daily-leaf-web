import React, { Component } from 'react'
import { connect } from 'react-redux'
import { adminLogout } from '../../components/auth/authenticationReducer'
import './AdminCommon.css'
import Logo from '../../components/nav/images/logo.png'

let navItems = [
  {title: 'Dashboard', link: '/admin'},
  {title: 'Brands', link: '/admin/brands'},
  {title: 'Dispensaries', link: '/admin/dispensaries'},
  {title: 'Deals', link: '/admin/deals'}
]
const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
if (admin && admin.role === 'super') {
  navItems.push({title: 'People', link: '/admin/people'})
  navItems.push({title: 'Account', link: '/admin/account'})
  navItems.push({title: 'Settings', link: '/admin/settings'})
} else {
  navItems.push({title: 'Account', link: '/admin/account'})
}
navItems.push({title: 'FAQs',
  items: [
    {title: 'How To Manage Dispensaries', link: 'https://dailyleafdeals.com/how-to-videos-dispensary/'},
    {title: 'How To Manage Brands', link: 'https://dailyleafdeals.com/how-to-video-brand/'}
  ]})

class AdminNav extends Component {
  logout (e) {
    e.preventDefault()
    this.props.adminLogout()
  }

  render () {
    return (
      <nav id='admin-nav' className='col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar'>
        <div id='admin-logo' align='center' className='center'>
          <a href='/'><img className='logo' src={Logo} height='50' alt='Admin Logo' /></a>
        </div>
        <ul className='nav nav-pills flex-column'>
          {navItems.map((nav) => {
            if (!nav.items) {
              return (
                <li key={nav.title} className='nav-item'>
                  <a className='nav-link' href={nav.link} >{nav.title}</a>
                </li>
              )
            } else {
              return (
                <li key={nav.title} className='nav-item dropdown'>
                  <a className='nav-link dropdown-toggle' data-toggle='dropdown' href='' role='button' aria-haspopup='true' aria-expanded='false'>{nav.title}</a>
                  <div className='dropdown-menu'>
                    {nav.items.map((subNavItem) => (
                      <a className='dropdown-item' href={subNavItem.link}>{subNavItem.title}</a>
                    ))}
                  </div>
                </li>
              )
            }
          })}
          <li className='nav-item'>
            <a href='/admin/logout' className='nav-link' onClick={this.logout.bind(this)}>Logout</a>
          </li>
        </ul>
      </nav>
    )
  }
}

const mapDispatchToProps = {
  adminLogout
}

const mapStateToProps = (state) => ({
})

const ReduxAdminNav = connect(mapStateToProps, mapDispatchToProps)(AdminNav)

export default ReduxAdminNav
