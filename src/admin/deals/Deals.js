import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import DataTable from '../common/DataTable'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import server from '../../config/server'

import './Deals.css'

let menuItems = [
  {title: 'New', icon: 'now-ui-icons ui-1_simple-add', link: '/admin/deals/new'}
]

const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
if (admin && admin.role === 'super') {
  menuItems.push({title: 'Archived', icon: 'now-ui-icons shopping_box', link: '/admin/deals/archived'})
}

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'Deals', url: '/admin/deals', active: true}
]

class Deals extends Component {
  render () {
    return (
      <Page title='Deals' breadcrumbs={breadCrumbs} menuItems={menuItems} >
        <Card title='Deals'>
          <DataTable selectable id='dealTable' order={order} columns={dataColumns} source={`${server.url}/datatables/all-deals`} />
        </Card>
      </Page>
    )
  }
}

export default Deals
const order = [[0, 'desc']]
const dataColumns = [
  {
    data: 'id',
    title: 'ID'
  },
  {
    data: 'name',
    title: 'Name',
    createdCell: (td, cellData, rowData, row, col) =>
    ReactDOM.render(
      <a href={`/admin/deal/${rowData.id}`}>
        {cellData}
      </a>, td)
  },
  {
    data: 'price',
    title: 'Price',
    searchable: false,
    render: (data, type, row) => {
      return `$${(data / 100).toFixed(2)}`
    }
  },
  {
    data: 'discount',
    title: 'Discount',
    searchable: false,
    render: (data, type, row) => {
      return `$${(data / 100).toFixed(2)}`
    }},
  {
    data: 'featured',
    title: 'Featured',
    searchable: false,
    render: (data, type, row) => {
      if (data) {
        return 'TRUE'
      } else {
        return 'FALSE'
      }
    }},
  {
    title: 'Actions',
    width: '30px',
    sortable: false,
    searchable: false,
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
        </div>
      </div>, td)
  }
]
