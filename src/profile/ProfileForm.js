import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'

class ProfileForm extends Component {
  componentDidMount () {
    window.$('.bootstrap-switch').bootstrapSwitch()
  }
  render () {
    const { handleSubmit, onSubmit } = this.props
    return (
      <div>
        <h3>Settings</h3>
        <form onSubmit={handleSubmit(onSubmit)} className='form-horizontal'>
          <div className='form-group'>
            <label className='col-lg-3 control-label'>First name</label>
            <div className='col-lg-8'>
              <Field name='firstName' component='input' className='form-control' />
            </div>
          </div>
          <div className='form-group'>
            <label className='col-lg-3 control-label'>Last name</label>
            <div className='col-lg-8'>
              <Field name='lastName' component='input' className='form-control' />
            </div>
          </div>
          <div className='form-group'>
            <label className='col-lg-3 control-label'>Email</label>
            <div className='col-lg-8'>
              <Field name='email' component='input' className='form-control' />
            </div>
          </div>

          <div className='form-group'>
            <label className='col-md-3 control-label'>Receive Push Notifications</label>
            <div className='col-md-8'>
              <input type='checkbox' name='allowPushNotifications' className='bootstrap-switch' data-on-label='ON' data-off-label='OFF' />
            </div>
          </div>
          <div className='form-group'>
            <label className='col-md-3 control-label'>Receive Emails</label>
            <div className='col-md-8'>
              <input type='checkbox' name='allowEmails' className='bootstrap-switch' data-on-label='ON' data-off-label='OFF' />
            </div>
          </div>
          <div className='form-group'>
            <label className='col-md-3 control-label'>Password</label>
            <div className='col-md-8'>
              <Field name='password' type='password' component='input' className='form-control' autocomplete='off' />
            </div>
          </div>
          <div className='form-group'>
            <label className='col-md-3 control-label'>Confirm password</label>
            <div className='col-md-8'>
              <Field name='confirmPassword' type='password' component='input' className='form-control' autocomplete='off' />
            </div>
          </div>
          <div className='form-group'>
            <label className='col-md-3 control-label' />
            <div className='col-md-8'>
              <input type='submit' className='btn btn-primary' value='Save Changes' />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

let ReduxProfileForm = reduxForm({
  form: 'profile-form',
  enableReinitialize: true
})(ProfileForm)

let InitializedReduxProfileForm = connect(
  state => ({
    initialValues: state.auth.user
  })
)(ReduxProfileForm)

export default InitializedReduxProfileForm
