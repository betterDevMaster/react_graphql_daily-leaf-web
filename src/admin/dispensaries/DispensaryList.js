import React from 'react'
import ReactDOM from 'react-dom'
import DataTable from '../common/DataTable'
import server from '../../config/server'

const DispensaryList = ({ dispensaries }) => {
  return (
    <DataTable id='dispensaryTable' order={order} columns={dataColumns} source={`${server.url}/datatables/all-dispensaries`} />
  )
}
export default DispensaryList
const order = [[0, 'desc']]
const dataColumns = [
  {data: 'id', title: 'ID'},
  {
    data: 'name',
    title: 'Name',
    createdCell: (td, cellData, rowData, row, col) =>
    ReactDOM.render(
      <a href={`/admin/dispensary/${rowData.id}`}>
        {cellData}
      </a>, td)
  },
  {data: 'address', title: 'Address'},
  {data: 'city', title: 'City'},
  {data: 'state', title: 'State'},
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
          <a className='dropdown-item' href={`/admin/dispensary/${rowData.id}`}>View</a>
          <a className='dropdown-item' href={`/admin/dispensary/${rowData.id}/edit`}>Edit</a>
        </div>
      </div>, td)
  }
]
