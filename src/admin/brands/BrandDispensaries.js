import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import DataTable from '../common/DataTable'
import server from '../../config/server'
import Select from 'react-select'
import _ from 'lodash'
import ReactDOM from 'react-dom'

const addDispensary = gql`
  mutation ($brandId: ID!, $dispensaryId: ID!) {
    addDispensaryToBrand(brandId: $brandId, dispensaryId: $dispensaryId) {
      id
    }
  }
`

const removeDispensary = gql`
mutation ($brandId: ID!, $dispensaryId: ID!) {
  removeDispensaryFromBrand(brandId: $brandId, dispensaryId: $dispensaryId) {
    id
  }
}
`

const query = gql`{
  allDispensaries {
    id
    name
    address
  }
}
`

class BrandDispensaries extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  handleSubmit (values) {
    this.submitForm(values)
  }

  handleAddDispensary (disp) {
    window.$('#brandModal').modal('hide')
    var self = this
    this.props.addDispensary({
      variables: {
        dispensaryId: disp.value,
        brandId: self.props.brand.id
      }
    }).then((data) => {
      self.table.wrappedInstance.state.dataTable.ajax.reload()
    }).catch((error) => {
      console.log(error)
    })
  }

  removeDispensary (disp) {
    var self = this
    this.props.removeDispensary({
      variables: {
        dispensaryId: disp.id,
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

    _.each(data.allDispensaries, (dispensary) => {
      selectOptions.push({ value: dispensary.id, label: dispensary.name + ` (${dispensary.address})` })
    })

    const dispensaryColumns = [
      {data: 'id', 'title': 'ID', width: '30px'},
      {data: 'name', title: 'Name'},
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
              <a className='dropdown-item' href='/' onClick={(e) => {
                e.preventDefault()
                this.removeDispensary(rowData)
              }}>Remove</a>
            </div>
          </div>, td)}
    ]

    return (
      <div>
        <section>
          <button className='btn btn-primary' data-toggle='modal' data-target='#brandModal'>
            <i className='now-ui-icons files_single-copy-04' /> Add Dispensary
          </button>
        </section>
        <section>
          <DataTable id='brandTable' ref={(dataTable) => { this.table = dataTable }} data={{id: this.props.brand.id}} columns={dispensaryColumns} source={`${server.url}/datatables/brand-dispensaries`} />
        </section>
        <div className='modal fade' id='brandModal' tabIndex='-1' role='dialog' aria-labelledby='myModalLabel' style={{display: 'none'}} aria-hidden='true'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header justify-content-center'>
                <button type='button' className='close' data-dismiss='modal' aria-hidden='true'>
                  <i className='now-ui-icons ui-1_simple-remove' />
                </button>
                <h4 className='title title-up'>Add Dispensary</h4>
              </div>
              <div className='modal-body'>
                <Select
                  name='dispensaries'
                  onChange={this.handleAddDispensary.bind(this)}
                  options={selectOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(graphql(query), graphql(removeDispensary, {name: 'removeDispensary'}), graphql(addDispensary, {name: 'addDispensary'}))(BrandDispensaries)
