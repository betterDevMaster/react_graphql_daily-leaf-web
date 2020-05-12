import React, { Component } from 'react'
import Logo from './images/logo@3x.png'
import { connect } from 'react-redux'
import { login, signUp, logout, facebookLogin, googleLogin } from '../auth/authenticationReducer'
import './Nav.css'
import SignUpForm from '../auth/SignUpForm'
import LoginForm from '../auth/LoginForm'
import request from 'superagent'
import server from '../../config/server'
const BLOG_URL = server.blog
class NavItem {
  constructor (title, url = '', children = []) {
    this.title = title
    this.url = url
    this.children = children
  }
}

class Nav extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loggingIn: true,
      navItems: [
        new NavItem('Deals', '/deals'),
        new NavItem('Brands', '/deals'),
        new NavItem('News', '/deals', [
          new NavItem('Articles', '/articles'),
          new NavItem('Press', '/press')
        ]),
        new NavItem('FAQs', '/faqs'),
        new NavItem('Events', '/events'),
        new NavItem('Contact', '/contact')
      ]
    }

    request.get(`${BLOG_URL}/wp-json/dailyleaf/v1/menu/?`).then(response => {
      if (response.body) {
        this.parseNavItems(response.body)
      }
    })
  }

  parseNavItems (navItems) {
    let topLevelItems = navItems.filter(item => item.menu_item_parent === '0')
    let subMenuItems = navItems.filter(item => item.menu_item_parent !== '0')
    let newNavItems = []
    topLevelItems.forEach(item => {
      let navItem = new NavItem(item.title, item.url)
      let subs = subMenuItems.filter(sub => parseInt(sub.menu_item_parent, 10) === item.ID)
      subs.forEach(s => {
        navItem.children.push(new NavItem(s.title, s.url))
      })
      newNavItems.push(navItem)
    })
    this.setState({
      navItems: newNavItems
    })
  }

  showLogin (e) {
    e.preventDefault()
    window.$('#myModal').modal('show')
  }

  createAccountClicked () {
    let loggingIn = !this.state.loggingIn
    this.setState({
      loggingIn: loggingIn
    })
  }

  handleGoogleSuccess (values) {
    let profile = Object.assign({}, values.profileObj)
    profile.id = values.googleId
    profile.accessToken = values.accessToken
    this.props.googleLogin(profile)
  }

  handleGoogleFailure (error) {
    console.log(error)
  }

  handleFacebook (values) {
    this.props.facebookLogin(values)
  }

  handleLogout (e) {
    e.preventDefault()
    this.props.logout()
    window.location = '/'
  }

  handleSubmit (values) {
    if (this.state.loggingIn) {
      this.props.login(values)
    } else {
      this.props.signUp(values)
    }
    window.$('#myModal').modal('hide')
  }

  render () {
    // let loginButton = (
    //   <li className='nav-item'>
    //     <a className='nav-link' href='/' onClick={e => this.showLogin(e)}>
    //       <i className='now-ui-icons users_single-02' /> login
    //     </a>
    //   </li>
    // )

    let loginButton = (
      <li className='nav-item dropdown'>
        <a href='/' className='nav-link dropdown-toggle' data-toggle='dropdown'>
          <i className='now-ui-icons users_single-02' /> Login
        </a>
        <div className='dropdown-menu dropdown-menu-right'>
          <a className='dropdown-item' onClick={e => this.showLogin(e)}>
            <i className='fa fa-user' /> User
          </a>
          <a href='/admin' className='dropdown-item'>
            <i className='fa fa-briefcase' /> Owner
          </a>
        </div>
      </li>
    )

    var userProfileButton = null

    if (this.props.loggedIn && this.props.user) {
      userProfileButton = (
        <li className='nav-item dropdown'>
          <a href='/' className='nav-link dropdown-toggle' data-toggle='dropdown'>
            <i className='now-ui-icons users_single-02' /> {this.props.user.firstName}
          </a>
          <div className='dropdown-menu dropdown-menu-right'>
            <a className='dropdown-item' href='/profile'>
              <i className='fa fa-user' /> Profile
            </a>
            <a onClick={this.handleLogout.bind(this)} className='dropdown-item' href='/logout'>
              <i className='fa fa-sign-out' /> Logout
            </a>
          </div>
        </li>
      )
    }

    return (
      <div>
        <nav className='navbar navbar-expand-lg bg-white'>
          <div className='container'>
            <div className='navbar-translate'>
              <a className='navbar-brand' href='/'>
                <img id='logo' alt='Daily Leaf Deals Logo' height={76} width={76.4} src={Logo} />
              </a>
              <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navigation' aria-controls='navigation-index' aria-expanded='false' aria-label='Toggle navigation'>
                <span className='navbar-toggler-bar bar1' />
                <span className='navbar-toggler-bar bar2' />
                <span className='navbar-toggler-bar bar3' />
              </button>
            </div>
            <div className='collapse navbar-collapse' data-nav-image='../assets/img/blurred-image-1.jpg' data-color='orange'>
              <ul className='navbar-nav m-auto'>
                {this.state.navItems.map((navItem, idx) => {
                  if (navItem.children.length === 0) {
                    return (
                      <li key={idx} className='nav-item'>
                        <a className='nav-link' href={navItem.url}>
                          <p>{navItem.title}</p>
                        </a>
                      </li>
                    )
                  } else {
                    return (
                      <div key={idx} className='nav-item'>
                        <li className='nav-item dropdown'>
                          <a href='/' className='nav-link dropdown-toggle' data-toggle='dropdown'>
                            {navItem.title}
                          </a>
                          <div className='dropdown-menu dropdown-menu-right'>
                            {navItem.children.map((subItem, index) => {
                              return (
                                <a key={index} className='dropdown-item' href={subItem.url}>
                                  {subItem.title}
                                </a>
                              )
                            })}
                          </div>
                        </li>
                      </div>
                    )
                  }
                })}
              </ul>
              <ul className='navbar-nav r-auto'>
                <li className='nav-item'>
                  <a className='nav-link' href='https://www.facebook.com/dailyleafdeals'>
                    <i className='fa fa-facebook' />
                  </a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link' href='https://twitter.com/the_dailyleaf'>
                    <i className='fa fa-twitter' />
                  </a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link' href='https://www.instagram.com/the.dailyleaf/'>
                    <i className='fa fa-instagram' />
                  </a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link' href='https://www.youtube.com/channel/UC7tEs-h52jMQaYwVfwIt0Jg'>
                    <i className='fa fa-youtube' />
                  </a>
                </li>
                {this.props.loggedIn ? userProfileButton : loginButton}
              </ul>
            </div>
          </div>
        </nav>
        <div id='myModal' className='modal fade' role='dialog'>
          <div id='login-modal' className='modal-dialog'>
            <div className='text-center'>
              {this.state.loggingIn ? <LoginForm
                createAccountClicked={this.createAccountClicked.bind(this)}
                onSubmit={this.handleSubmit.bind(this)}
                googleCallback={this.handleGoogleSuccess.bind(this)}
                googleFailure={this.handleGoogleFailure.bind(this)}
                facebookCallback={this.handleFacebook.bind(this)} /> : <SignUpForm
                  createAccountClicked={this.createAccountClicked.bind(this)}
                  onSubmit={this.handleSubmit.bind(this)} />}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  login,
  signUp,
  logout,
  facebookLogin,
  googleLogin
}
const mapStateToProps = (state) => ({
  user: state.auth.user,
  loggedIn: state.auth.loggedIn
})

const Navigation = connect(mapStateToProps, mapDispatchToProps)(Nav)
export default Navigation
