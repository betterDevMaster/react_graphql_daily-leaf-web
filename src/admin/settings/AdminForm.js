import React, { Component } from 'react'
import { Field } from 'redux-form'
import { TextField, SelectField } from '../common/FormInputs'

class AdminForm extends Component {
  render () {
    let adminOptions = [
      { value: 'super', label: 'Super Admin' },
      { value: 'admin', label: 'Admin' },
      { value: 'owner', label: 'Owner' }
    ]
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
        <Field component={TextField} name='firstName' label='First Name' required />
        <Field component={TextField} name='lastName' label='Last Name' required />
        <Field component={TextField} name='email' label='Email' required />
        <Field component={TextField} name='password' label='Temporary Password' required />
        <Field component={SelectField} name='role' label='Role' required options={adminOptions} />
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    )
  }
}
export default AdminForm
