import React, { Component } from 'react'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import AdminUpdateForm from '../settings/AdminUpdateForm'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { updateAdminProfile } from '../../components/auth/authenticationReducer'
import gql from 'graphql-tag'

const updateAdminMutation = gql`
  mutation($id: ID!, $data: UpdateAdminInput!) {
    updateAdmin(id: $id, data: $data) {
      id,
      firstName,
      lastName,
      email
    }
  }
`

class AdminEdit extends Component {
  handleSubmit (values) {
    if (values.newPassword) {
      if (values.newPassword === values.confirmPassword) {
        let updatedValues = Object.assign({confirmedPassword: values.newPassword}, values)
        this.submitForm(this.props.currentAdmin.id, updatedValues)
      } else {
        window.swal('Error', 'The passwords do not match', 'error')
      }
    } else {
      this.submitForm(this.props.currentAdmin.id, values)
    }
  }

  submitForm (id, values) {
    this.props.mutate({
      variables: {
        id: id,
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.confirmedPassword
        }
      }
    }).then(({ data }) => {
      window.swal('Success', 'Successfully updated your profile', 'success')
      this.props.updateAdminProfile(data.updateAdmin)
    }).catch((error) => {
      console.log(error)
      if (error.graphQLErrors.length > 0) {
        window.swal('Error', error.graphQLErrors[0].message, 'error')
      } else {
        window.swal('Error', 'There was an error updating your account', 'error')
      }
    })
  }

  render () {
    return (
      <Page title='Page' breadcrumbs={[
        {title: 'Home', url: '/admin'},
        {title: 'Account', url: '/admin/account', active: true}
      ]}>
        <div className='row'>
          <div className='col-md-6'>
            <Card title='Account'>
              <InitializeAdminForm onSubmit={this.handleSubmit.bind(this)} />
            </Card>
          </div>
        </div>
      </Page>
    )
  }
}

let InitializeAdminForm = reduxForm({
  form: 'update-admin-account',
  enableReinitialize: true
})(AdminUpdateForm)

InitializeAdminForm = connect(
  state => ({
    initialValues: state.auth.admin
  }), null, null, {withRef: true}
)(InitializeAdminForm)

const mapDispatchToProps = {
  updateAdminProfile
}
const mapStateToProps = (state) => ({
  currentAdmin: state.auth.admin
})

const ReduxAdminEdit = connect(mapStateToProps, mapDispatchToProps)(AdminEdit)

export default graphql(updateAdminMutation)(ReduxAdminEdit)
