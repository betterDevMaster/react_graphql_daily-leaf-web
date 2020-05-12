import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { adminLogin, forgotPassword } from '../../components/auth/authenticationReducer'
import Logo from '../../components/nav/images/logo@3x.png'

class AdminLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isForgotPassword: false
    }
  }
  handleSubmit (values) {
    if (!this.state.isForgotPassword) {
      this.props.adminLogin(values)
    } else {
      this.props.forgotPassword(values)
    }
  }

  handleForgotPasswordClick (e) {
    e.preventDefault()
    this.setState({
      isForgotPassword: !this.state.isForgotPassword
    })
  }

  render () {
    return (
      <div className='page-header' filter-color='orange'>
        <div className='page-header-image' style={{backgroundImage: 'url(../assets/img/login.jpg)'}} />
        <div className='content-center login-page'>
          <div className='container'>
            <div className='col-md-4 content-center'>
              <div className='card card-login card-plain'>
                <ReduxAdminLoginForm handleForgotPasswordClick={this.handleForgotPasswordClick.bind(this)} isForgotPassword={this.state.isForgotPassword} onSubmit={this.handleSubmit.bind(this)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const AdminLoginForm = ({ handleSubmit, onSubmit, isForgotPassword, handleForgotPasswordClick }) => (
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className='card-header text-center'>
      <div className='logo-container'>
        <img src={Logo} alt='' />
      </div>
    </div>
    <div className='card-body'>
      <div className='input-group form-group-no-border input-lg'>
        <span className='input-group-addon'>
          <i className='now-ui-icons ui-1_email-85' />
        </span>
        <Field component='input' name='email' type='email' className='form-control login-input' placeholder='Email' required />
      </div>
      {isForgotPassword ? null : <div className='input-group form-group-no-border input-lg'>
        <span className='input-group-addon'>
          <i className='now-ui-icons ui-1_lock-circle-open' />
        </span>
        <Field component='input' name='password' className='form-control login-input' type='password' placeholder='Password' required />
      </div>}
    </div>
    <div className='card-footer login-footer text-center'>
      <button type='submit' className='btn btn-primary btn-round btn-lg btn-block'>{isForgotPassword ? 'Reset Password' : 'Login'}</button>
    </div>
    <div className='pull-left'>
      <h6>
        <a href='' onClick={handleForgotPasswordClick} className='link footer-link'>Forgot Password?</a>
      </h6>
    </div>
    <div className='pull-right'>
      <h6>
        <a href='/contact' className='link footer-link'>Need Help?</a>
      </h6>
    </div>
  </form>
)

let ReduxAdminLoginForm = reduxForm({
  form: 'admin-login',
  enableReinitialize: true
})(AdminLoginForm)

const mapDispatchToProps = {
  adminLogin,
  forgotPassword
}
const mapStateToProps = (state) => ({
  admin: state.auth.admin
})

const ReduxAdminLogin = connect(mapStateToProps, mapDispatchToProps)(AdminLogin)

export default ReduxAdminLogin
