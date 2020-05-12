import React, { Component } from 'react'
import { Field } from 'redux-form'
import { TextField } from '../common/FormInputs'

class AdminForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
        <h4>Account Details</h4>
        <Field component={TextField} name='firstName' label='First Name' required />
        <Field component={TextField} name='lastName' label='Last Name' required />
        <Field component={TextField} name='email' label='Email' required />
        <h4>Update Password</h4>
        <Field component={TextField} name='newPassword' label='Password' type='password' />
        <Field component={TextField} name='confirmPassword' label='Confirm Password' type='password' />
        <hr />
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    )
  }
}
export default AdminForm
