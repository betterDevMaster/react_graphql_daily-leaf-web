import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import DataTable from '../common/DataTable'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import server from '../../config/server'

class BrandList extends Component {
  viewBrand (brandID) {
    this.props.history.push(`/admin/brands/${brandID}`)
  }

  render () {
    return (
      <Page title='Brands' menuItems={menuItems} breadcrumbs={breadCrumbs}>
        <div className='row'>
          <div className='col-md-12 mr-auto ml-auto'>
            <Card title='Brands'>
              <DataTable id='brandTable' order={order} columns={dataColumns} source={`${server.url}/datatables/all-brands`} />
            </Card>
          </div>
        </div>
      </Page>
    )
  }
}

export default BrandList

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'Brands', url: '/admin/brands', active: true}
]
const menuItems = [
  {title: 'New', icon: 'now-ui-icons ui-1_simple-add', link: '/admin/brands/new'}
]
const order = [[0, 'desc']]
const dataColumns = [
  {data: 'id', 'title': 'ID'},
  {
    data: 'logo',
    title: 'Logo',
    width: '120px',
    sortable: false,
    searchable: false,
    render: (data, type, row) => {
      return `<img style="height: 50px" src='${data}' className='img-thumbnail' />`
    }},
  {
    data: 'header',
    title: 'Header',
    sortable: false,
    searchable: false,
    render: (data, type, row) => {
      return `<img style="height: 50px" src='${data}' className='img-thumbnail' />`
    }},
    {data: 'name', title: 'Name'},
    {data: 'website', title: 'Website'},
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
          <a className='dropdown-item' href={`/admin/brand/${rowData.id}/edit`}>Edit</a>
        </div>
      </div>, td)
  }
]
