import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import DataTable from '../common/DataTable'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import server from '../../config/server'
import moment from 'moment'

const menuItems = [
  {title: 'New', icon: 'now-ui-icons ui-1_simple-add', link: '/admin/events/new'}
]

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'Events', url: '/admin/events', active: true}
]

class Events extends Component {
  render () {
    return (
      <Page title='Events' breadcrumbs={breadCrumbs} menuItems={menuItems} >
        <Card title='Events'>
          <DataTable id='eventTable' columns={dataColumns} source={`${server.url}/datatables/events`} />
        </Card>
      </Page>
    )
  }
}

export default Events

const dataColumns = [
  {data: 'id', 'title': 'ID'},
  {data: 'title', 'title': 'Name'},
  {
    data: 'start_date',
    title: 'Begins',
    searchable: false,
    render: (data, type, row) => {
      return moment(data).format('MM/DD/YYYY h:mm a')
    }},
  {
    data: 'end_date',
    title: 'Ends',
    searchable: false,
    render: (data, type, row) => {
      return moment(data).format('MM/DD/YYYY h:mm a')
    }
  },
  {data: 'place', 'title': 'Place'},
  {data: 'address', 'title': 'Address'},
  {
    data: 'cost',
    title: 'Cost'
  },
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
          <a className='dropdown-item' href={`/admin/event/${rowData.id}`}>View</a>
          <a className='dropdown-item' href={`/admin/event/${rowData.id}/edit`}>Edit</a>
        </div>
      </div>, td)
  }
]
