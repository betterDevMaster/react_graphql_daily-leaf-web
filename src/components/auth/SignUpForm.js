import React from 'react'
import { Field, reduxForm } from 'redux-form'

const SignUpForm = ({ handleSubmit, submitting, onSubmit, createAccountClicked }) => (
  <div className='card card-signup'>
    <div className='card-body'>
      <h4 className='card-title text-center'>Register</h4>
      <div className='social text-center'>
        <button className='btn btn-icon btn-round btn-google'>
          <i className='fa fa-google' />
        </button>
        <button className='btn btn-icon btn-round btn-facebook'>
          <i className='fa fa-facebook' />
        </button>
        <h5 className='card-description'><a className='account-link' onClick={createAccountClicked}> or login</a> </h5>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='input-group'>
          <span className='input-group-addon'>
            <i className='now-ui-icons users_circle-08' />
          </span>
          <Field component='input' className='form-control' name='first' placeholder='First Name' />
        </div>
        <div className='input-group'>
          <span className='input-group-addon'>
            <i className='now-ui-icons users_circle-08' />
          </span>
          <Field component='input' className='form-control' name='last' placeholder='Last Name' />
        </div>
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
        <div className='form-check'>
        By creating an account you agree to the <a href='/terms'>terms</a> and <a href='/conditions'>conditions</a>.
        </div>
        <div className='text-center'>
          <button type='submit' className='btn btn-primary btn-round btn-lg'>Submit</button>
        </div>
      </form>
    </div>
  </div>
)

let InitSignUpForm = reduxForm({
  form: 'sign-up-form',
  enableReinitialize: true
})(SignUpForm)

export default InitSignUpForm
