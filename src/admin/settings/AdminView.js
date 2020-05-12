import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import DataTable from '../common/DataTable'
import server from '../../config/server'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import _ from 'lodash'

class DealView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addTitle: 'Associate Brand'
    }
  }
  componentDidMount () {
    this.props.data.refetch({id: this.props.match.params.id})
  }

  onOptionSelected (value) {
    if (this.state.addTitle === 'Associate Brand') {
      this.onBrandSelected(value)
    } else {
      this.onDispensarySelected(value)
    }
  }

  onRemoveDispensary (dispensary) {
    const { data } = this.props
    var self = this
    this.props.removeAdminFromDispensary({
      variables: {
        adminId: data.singleAdmin.id,
        dispensaryId: dispensary.id
      }
    }).then(() => {
      self.dispensaryTable.wrappedInstance.state.dataTable.ajax.reload()
    }).catch((error) => {
      console.log(error)
    })
  }

  onRemoveBrand (brand) {
    var self = this
    const { data } = this.props
    this.props.removeAdminFromBrand({
      variables: {
        adminId: data.singleAdmin.id,
        brandId: brand.id
      }
    }).then(() => {
      self.brandTable.wrappedInstance.state.dataTable.ajax.reload()
    }).catch((error) => {
      console.log(error)
    })
  }
  showModal () {
    window.$('#associateModal').modal('show')
  }

  hideModal () {
    window.$('#associateModal').modal('hide')
  }

  onBrandSelected (brand) {
    var self = this
    const { data } = this.props
    this.props.addAdminToBrand({
      variables: {
        adminId: data.singleAdmin.id,
        brandId: brand.value
      }
    }).then(() => {
      self.brandTable.wrappedInstance.state.dataTable.ajax.reload()
      self.hideModal()
    }).catch((error) => {
      console.log(error)
    })
  }

  onDispensarySelected (dispensary) {
    const { data } = this.props
    var self = this
    this.props.addAdminToDispensary({
      variables: {
        adminId: data.singleAdmin.id,
        dispensaryId: dispensary.value
      }
    }).then(() => {
      self.dispensaryTable.wrappedInstance.state.dataTable.ajax.reload()
      self.hideModal()
    }).catch((error) => {
      console.log(error)
    })
  }

  render () {
    const { data } = this.props
    const admin = data.singleAdmin

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    let adminName = `${admin.firstName} ${admin.lastName}`

    const breadCrumbs = [
      {title: 'Home', url: '/admin'},
      {title: 'People', url: '/admin/people'},
      {title: adminName, active: true}
    ]

    const menuItems = [
      {
        title: 'Associate Dispensary',
        icon: 'now-ui-icons business_bank',
        onClick: (e) => {
          e.preventDefault()
          this.setState({
            addTitle: 'Associate Dispensary'
          }, () => {
            this.showModal()
          })
        }},
      {
        title: 'Associate Brand',
        icon: 'now-ui-icons shopping_tag-content',
        onClick: (e) => {
          e.preventDefault()
          this.setState({
            addTitle: 'Associate Brand'
          }, () => {
            this.showModal()
          })
        }}
    ]

    let selectOptions = []
    if (this.state.addTitle === 'Associate Brand') {
      _.each(data.allBrands, (brand) => {
        selectOptions.push({
          value: brand.id, label: brand.name
        })
      })
    } else {
      _.each(data.allDispensaries, (dispensary) => {
        selectOptions.push({
          value: dispensary.id, label: `${dispensary.name} (${dispensary.address})`
        })
      })
    }

    const dealColumns = [
      {data: 'id', 'title': 'ID', width: '30px'},
      {data: 'name', title: 'Name'},
      {
        title: 'Actions',
        searchable: false,
        width: '30px',
        sortable: false,
        data: null,
        createdCell: (td, cellData, rowData, row, col) =>
          ReactDOM.render(
            <div>
              <a className='btn btn-sm btn-info' href={`/admin/deal/${rowData.id}`}>View</a>
            </div>, td)
      }
    ]

    const dispensaryColumns = [
      {data: 'id', 'title': 'ID', width: '30px'},
      {data: 'name', title: 'Name'},
      {data: 'address', title: 'Address'},
      {data: 'city', title: 'City'},
      {data: 'state', title: 'State'},
      {data: 'zip', title: 'Zip'},
      {
        title: 'Actions',
        searchable: false,
        width: '30px',
        sortable: false,
        data: null,
        createdCell: (td, cellData, rowData, row, col) =>
        ReactDOM.render(
          <div className='dropdown'>
            <button className='btn btn-sm btn-info dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
              Select
            </button>
            <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
              <a className='dropdown-item' href={`/admin/dispensary/${rowData.id}`}>View</a>
              <a className='dropdown-item' href='/' onClick={e => {
                e.preventDefault()
                this.onRemoveDispensary(rowData)
              }}>Remove</a>
            </div>
          </div>, td)
      }
    ]

    const brandColumns = [
      {data: 'id', 'title': 'ID', width: '30px'},
      {data: 'name', title: 'Name'},
      {
        title: 'Actions',
        searchable: false,
        width: '30px',
        sortable: false,
        data: null,
        createdCell: (td, cellData, rowData, row, col) =>
        ReactDOM.render(
          <div className='dropdown'>
            <button className='btn btn-sm btn-info dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
              Select
            </button>
            <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
              <a className='dropdown-item' href={`/admin/brand/${rowData.id}`}>View</a>
              <a className='dropdown-item' href='/' onClick={e => {
                e.preventDefault()
                this.onRemoveBrand(rowData)
              }}>Remove</a>
            </div>
          </div>, td)
      }
    ]

    return (
      <Page title={adminName} menuItems={menuItems} breadcrumbs={breadCrumbs}>
        <div className='row'>
          <div className='col-md-12 mr-auto ml-auto'>
            <Card title={adminName}>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{admin.id}</td>
                    <td>{admin.firstName}</td>
                    <td>{admin.lastName}</td>
                    <td>{admin.email}</td>
                    <td>{admin.role}</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
          <div className='col-md-12'>
            <Card title='Dispensaries'>
              <DataTable ref={(table) => { this.dispensaryTable = table; console.log('TABLE', table) }} id='adminDispensaries' data={{id: admin.id}} columns={dispensaryColumns} source={`${server.url}/datatables/admin-dispensaries`} />
            </Card>

            <Card title='Brands'>
              <DataTable ref={(table) => { this.brandTable = table }} id='adminBrands' data={{id: admin.id}} columns={brandColumns} source={`${server.url}/datatables/admin-brands`} />
            </Card>

            <Card title='Deals'>
              <DataTable ref={(table) => { this.dealTable = table }} id='adminDeals' data={{id: admin.id}} columns={dealColumns} source={`${server.url}/datatables/admin-deals`} />
            </Card>
          </div>
        </div>
        <div className='modal fade' id='associateModal' tabIndex='-1' role='dialog' aria-labelledby='associateModalLabel' style={{display: 'none'}} aria-hidden='true'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header justify-content-center'>
                <button type='button' className='close' data-dismiss='modal' aria-hidden='true'>
                  <i className='now-ui-icons ui-1_simple-remove' />
                </button>
                <h4 className='title title-up'>{this.state.addTitle}</h4>
              </div>
              <div className='modal-body'>
                <Select options={selectOptions} onChange={this.onOptionSelected.bind(this)} />
              </div>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

const addAdminToBrand = gql`
  mutation ($brandId: ID!, $adminId: ID!) {
    addAdminToBrand(brandId: $brandId, adminId: $adminId) {
      id
    }
  }
`

const removeAdminFromBrand = gql`
  mutation ($brandId: ID!, $adminId: ID!) {
    removeAdminFromBrand(brandId: $brandId, adminId: $adminId) {
      id
    }
  }
`

const addAdminToDispensary = gql`
  mutation ($dispensaryId: ID!, $adminId: ID!) {
    addAdminToDispensary(dispensaryId: $dispensaryId, adminId: $adminId) {
      id
    }
  }
`

const removeAdminFromDispensary = gql`
  mutation ($dispensaryId: ID!, $adminId: ID!) {
    removeAdminFromDispensary(dispensaryId: $dispensaryId, adminId: $adminId) {
      id
    }
  }
`

const query = gql`
  query($id: ID!) {
    singleAdmin(id: $id) {
      id
      firstName
      lastName
      email
      role
    }
    allDispensaries {
      id
      name
      address
    }
    allBrands {
      id
      name
    }
  }
`
export default compose(
  graphql(addAdminToBrand, {name: 'addAdminToBrand'}),
  graphql(removeAdminFromBrand, {name: 'removeAdminFromBrand'}),
  graphql(addAdminToDispensary, {name: 'addAdminToDispensary'}),
  graphql(removeAdminFromDispensary, {name: 'removeAdminFromDispensary'}),
  graphql(query, {options: {variables: {id: 0}}}))(DealView)
