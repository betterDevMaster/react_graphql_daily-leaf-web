import React, { Component } from 'react'
import Promise from 'bluebird'
import _ from 'lodash'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
const token = window.localStorage.getItem('DailyLeaf::AdminToken')
const $ = window.$

const deleteDealMutation = gql`
  mutation ($id: ID!) {
    editDeal(id: $id, data: {active: false}) {
      id
    }
  }
`

class DataTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataTable: null,
      showsArchive: false
    }
  }
  componentDidMount () {
    const { selectable } = this.props
    let dataTable = $(this.refs.main).DataTable({
      processing: true,
      serverSide: true,
      paginate: true,
      responsive: true,
      scrollY: this.props.scrollY || '500px',
      scrollCollapse: true,
      rowReorder: this.props.reorder || false,
      sort: true,
      search: {
        caseInsensitive: true
      },
      order: this.props.order || [[0, 'asc']],
      pagingType: 'full_numbers',
      ajax: {
        beforeSend: (request) => {
          request.setRequestHeader('authorization', token ? `Bearer ${token}` : null)
        },
        data: this.props.data || {},
        url: $(`#${this.props.id}`).data('source'),
        type: 'POST'
      },
      lengthMenu: [[25, 50, 100, -1], [25, 50, 100, 'All']],
      columns: this.props.columns
    })
    const self = this
    if (selectable) {
      dataTable.on('click', 'tr', function () {
        $(this).toggleClass('selectedRow')
        let len = dataTable.rows('.selectedRow').data().length
        if (len > 0) {
          $('.button-actions').show()
        } else {
          $('.button-actions').hide()
        }
      })
    }
    dataTable.on('row-reorder', (e, diff, edit) => {
      Promise.map(diff, (diffy) => {
        var rowData = dataTable.row(diffy.node).data()
        if (self.props.onRowReorder) {
          return self.props.onRowReorder(rowData, diffy, diff, edit)
        }
      }).then(() => {
        if (dataTable.ajax) {
          dataTable.ajax.reload()
        }
      })
    })
    this.internalTable = dataTable
    this.setState({dataTable})
  }

  archiveDeals () {
    const self = this
    let dealIds = _.map(this.state.dataTable.rows('.selectedRow').data(), 'id')
    Promise.map(dealIds, (dealId) => {
      return this.props.mutate({
        variables: {
          id: dealId
        }
      })
    }).then((data) => {
      self.state.dataTable.ajax.reload()
    })
  }

  clearSelection () {
    $('.selectedRow').removeClass('selectedRow')
    $('.button-actions').hide()
  }
  componentWillUnmount () {
    $('.data-table-wrapper')
      .find('table')
      .DataTable()
      .destroy(true)
  }

  // shouldComponentUpdate (props, a, b, c) {
  //   return false
  // }

  render () {
    return (
      <div>
        <button onClick={() => this.archiveDeals()} id='achive-button' style={{display: 'none', marginLeft: 10}} className='btn btn-sm btn-danger button-actions'>Archive</button>
        <button onClick={() => this.clearSelection()} id='achive-button' style={{display: 'none', marginLeft: 10}} className='btn btn-sm button-actions'>Clear Selection</button>
        <table id={this.props.id} className='table table-striped' ref='main' data-source={this.props.source} />
      </div>
    )
  }
}

export default compose(graphql(deleteDealMutation, {withRef: true}))(DataTable)
