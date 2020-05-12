import React from 'react'
import { Field, reduxForm } from 'redux-form'
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'

const LoginForm = ({ handleSubmit, submitting, onSubmit, createAccountClicked, facebookCallback, googleCallback, googleFailure }) => (
  <div className='card card-signup'>
    <div className='card-body'>
      <h4 className='card-title text-center'>Register</h4>
      <div className='social text-center'>
        <GoogleLogin
          clientId='443876270159-a8stu1drumfroio2rmqus6n9nt0ea4m2.apps.googleusercontent.com'
          buttonText=''
          className='btn btn-icon btn-round btn-google'
          onSuccess={googleCallback}
          onFailure={googleFailure}>
          <i className='fa fa-google' />
        </GoogleLogin>
        <FacebookLogin
          appId='503836790003423'
          textButton=''
          fields='name,email,picture'
          callback={facebookCallback}
          cssClass='btn btn-icon btn-round btn-facebook'
          icon='fa-facebook'
        />
        <h5 className='card-description'><a className='account-link' onClick={createAccountClicked}> or create an account</a> </h5>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='input-group'>
          <span className='input-group-addon'>
            <i className='now-ui-icons ui-1_email-85' />
          </span>
          <Field component='input' className='form-control' name='email' placeholder='Email' />
        </div>
        <div className='input-group'>
          <span className='input-group-addon'>
            <i className='now-ui-icons ui-1_lock-circle-open' />
          </span>
          <Field component='input' type='password' className='form-control' name='password' placeholder='Password' />
        </div>
        <div className='text-center'>
          <button type='submit' className='btn btn-primary btn-round btn-lg'>Submit</button>
        </div>
      </form>
    </div>
  </div>
)

let InitLoginForm = reduxForm({
  form: 'login-form',
  enableReinitialize: true
})(LoginForm)

export default InitLoginForm
