import React, { Component } from 'react'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import ReactDOM from 'react-dom'
import DataTable from '../common/DataTable'
import server from '../../config/server'
import AdminForm from './AdminForm'
import { reduxForm } from 'redux-form'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'People', url: '/admin/people', active: true}
]

class PeopleView extends Component {
  handleAdminSubmit (values) {
    this.props.mutate({
      variables: {
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          role: values.role.value
        }
      }
    }).then((data) => {
      window.location = `/admin/people/admins/${data.data.inviteAdmin.id}`
    }).catch((error) => {
      console.log(error)
      window.swal('Error', error.graphQLErrors[0].message, 'error')
    })
  }

  showModal () {
    window.$('#newAdminModal').modal('show')
  }

  hideModal () {
    window.$('#newAdminModal').modal('hide')
  }

  render () {
    const menuItems = [
      {
        title: 'Invite Admin',
        icon: 'now-ui-icons users_single-02',
        onClick: (e) => {
          e.preventDefault()
          this.showModal()
        }
      }
    ]

    return (
      <Page title='People' breadcrumbs={breadCrumbs} menuItems={menuItems} >
        <Card title='People'>
          <DataTable id='userTable' ref={(table) => { this.userTable = table }} columns={userColumns} source={`${server.url}/datatables/users`} />
        </Card>

        <Card title='Administrators / Owners'>
          <DataTable ref={(table) => { this.adminTable = table }} id='adminsTable' columns={adminColumns} source={`${server.url}/datatables/admins`} />
        </Card>

        <div className='modal fade' id='newAdminModal' tabIndex='-1' role='dialog' aria-labelledby='newAdminModalLabel' style={{display: 'none'}} aria-hidden='true'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header justify-content-center'>
                <button type='button' className='close' data-dismiss='modal' aria-hidden='true'>
                  <i className='now-ui-icons ui-1_simple-remove' />
                </button>
                <h4 className='title title-up'>Invite Admin</h4>
              </div>
              <div className='modal-body'>
                <ReduxAdminForm onSubmit={this.handleAdminSubmit.bind(this)} />
              </div>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

const mutation = gql`
  mutation ($data: AdminInput) {
    inviteAdmin(data: $data) {
      id
    }
  }
`

export default graphql(mutation)(PeopleView)

const ReduxAdminForm = reduxForm({
  form: 'invite-admin',
  enableReinitialize: true
})(AdminForm)

const userColumns = [
  {data: 'id', 'title': 'ID', width: '30px'},
  {data: 'first_name', title: 'First Name'},
  {data: 'last_name', title: 'Last Name'},
  {data: 'email', title: 'Email'}
]

const adminColumns = [
  {data: 'id', 'title': 'ID', width: '30px'},
  {data: 'first_name', title: 'First Name'},
  {data: 'last_name', title: 'Last Name'},
  {data: 'email', title: 'Email'},
  {data: 'role', title: 'Role'},
  {
    data: null,
    title: 'Actions',
    sortable: false,
    searchable: false,
    createdCell: (td, cellData, rowData, row, col) =>
      ReactDOM.render(
        <div>
          <a className='btn btn-sm btn-info' href={`/admin/people/admins/${rowData.id}`}>
            Manage
          </a>
        </div>, td)}
]
