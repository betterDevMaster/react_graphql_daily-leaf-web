import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import DataTable from '../common/DataTable'
import server from '../../config/server'
import Select from 'react-select'
import _ from 'lodash'
import ReactDOM from 'react-dom'

const addAdmin = gql`
  mutation ($brandId: ID!, $adminId: ID!) {
    addAdminToBrand(brandId: $brandId, adminId: $adminId) {
      id
    }
  }
`

const removeAdmin = gql`
mutation ($brandId: ID!, $adminId: ID!) {
  removeAdminFromBrand(brandId: $brandId, adminId: $adminId) {
    id
  }
}
`

const query = gql`{
  allOwners {
    id
    firstName
    lastName
    email
  }
}
`

class BrandOwners extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  handleSubmit (values) {
    this.submitForm(values)
  }

  handleAddAdmin (admin) {
    window.$('#brandModal').modal('hide')
    var self = this
    this.props.addAdmin({
      variables: {
        adminId: admin.value,
        brandId: self.props.brand.id
      }
    }).then((data) => {
      self.table.wrappedInstance.state.dataTable.ajax.reload()
    }).catch((error) => {
      console.log(error)
    })
  }

  removeAdmin (admin) {
    var self = this
    this.props.removeAdmin({
      variables: {
        adminId: admin.id,
        brandId: self.props.brand.id
      }
    }).then((data) => {
      self.table.wrappedInstance.state.dataTable.ajax.reload()
    }).catch((error) => {
      console.log(error)
    })
  }

  render () {
    let selectOptions = []
    const { data } = this.props

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    _.each(data.allOwners, (admin) => {
      selectOptions.push({ value: admin.id, label: admin.firstName + ' ' + admin.lastName + ` (${admin.email})` })
    })

    const adminColumns = [
      {data: 'id', 'title': 'ID', width: '30px'},
      {data: 'first_name', title: 'First Name'},
      {data: 'last_name', title: 'Last Name'},
      {data: 'email', title: 'Email'},
      {
        data: null,
        title: 'Actions',
        sortable: false,
        searchable: false,
        createdCell: (td, cellData, rowData, row, col) =>
          ReactDOM.render(
            <div className='dropdown'>
              <button className='btn btn-sm btn-info' onClick={(e) => this.removeAdmin(rowData)} type='button' aria-expanded='false'>
                Remove
              </button>
            </div>, td)}
    ]

    return (
      <div>
        <section>
          <button className='btn btn-primary' data-toggle='modal' data-target='#ownerModal'>
            <i className='now-ui-icons files_single-copy-04' /> Add Owner
          </button>
        </section>
        <section>
          <DataTable ref={(table) => { this.table = table }} id='brandAdmins' data={{id: this.props.brand.id}} columns={adminColumns} source={`${server.url}/datatables/brand-admins`} />
        </section>
        <div className='modal fade' id='ownerModal' tabIndex='-1' role='dialog' aria-labelledby='myModalLabel' style={{display: 'none'}} aria-hidden='true'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header justify-content-center'>
                <button type='button' className='close' data-dismiss='modal' aria-hidden='true'>
                  <i className='now-ui-icons ui-1_simple-remove' />
                </button>
                <h4 className='title title-up'>Add Owner</h4>
              </div>
              <div className='modal-body'>
                <Select
                  name='restaurants'
                  onChange={this.handleAddAdmin.bind(this)}
                  options={selectOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(graphql(query), graphql(removeAdmin, {name: 'removeAdmin'}), graphql(addAdmin, {name: 'addAdmin'}))(BrandOwners)
