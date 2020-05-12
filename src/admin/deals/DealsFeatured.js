import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import DataTable from '../common/DataTable'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import server from '../../config/server'
import { graphql } from 'react-apollo'
import { isSuperAdmin } from '../auth/adminHelpers'
import gql from 'graphql-tag'
import './Deals.css'

let menuItems = [
  {title: 'New', icon: 'now-ui-icons ui-1_simple-add', link: '/admin/deals/new'}
]

if (isSuperAdmin()) {
  // menuItems.push({title: 'Featured', icon: 'now-ui-icons objects_diamond', link: '/admin/deals/featured'})
}

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'Deals', url: '/admin/deals', active: true}
]

class Deals extends Component {
  render () {
    var self = this
    const dataColumns = [
      {data: 'id', 'title': 'ID'},
      {data: 'name', 'title': 'Name'},
      {
        data: 'price',
        title: 'Price',
        render: (data, type, row) => {
          return `$${(data / 100).toFixed(2)}`
        }
      },
      {
        data: 'discount',
        title: 'Discount',
        render: (data, type, row) => {
          return `$${(data / 100).toFixed(2)}`
        }},
      {
        data: 'featured',
        title: 'Featured',
        render: (data, type, row) => {
          if (data) {
            return 'TRUE'
          } else {
            return 'FALSE'
          }
        }},
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
              <a className='dropdown-item' href={`/admin/deal/${rowData.id}`}>View</a>
              <a className='dropdown-item' href={`/admin/deal/${rowData.id}/edit`}>Edit</a>
              <a className='dropdown-item' href='/' onClick={e => {
                e.preventDefault()
                self.props.mutate({
                  variables: {
                    id: rowData.id,
                    data: {
                      featured: false
                    }
                  }
                }).then(() => {
                  self.datatable.wrappedInstance.state.dataTable.ajax.reload()
                })
              }}>Remove</a>
            </div>
          </div>, td)
      }
    ]
    return (
      <Page title='Featured Deals' breadcrumbs={breadCrumbs} menuItems={menuItems} >
        <Card title='Deals'>
          { isSuperAdmin() ? <DataTable id='dealTable' ref={(datatable) => { this.datatable = datatable }} columns={dataColumns} source={`${server.url}/datatables/featured-deals`} /> : null }
        </Card>
      </Page>
    )
  }
}

const updateDealMutation = gql`
  mutation($id: ID!, $data: DealInput!) {
    editDeal(id: $id, data: $data) {
      id
    }
  }
`

export default graphql(updateDealMutation)(Deals)
