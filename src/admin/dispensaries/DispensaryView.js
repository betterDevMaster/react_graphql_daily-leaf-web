import React, { Component } from 'react'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import ImageGallery from 'react-image-gallery'
import DataTable from '../common/DataTable'
import server from '../../config/server'
import ReactDOM from 'react-dom'
import moment from 'moment'
import _ from 'lodash'
const swal = window.swal
let query = gql`
  query($id: ID!) {
    singleDispensary(id: $id) {
      id
      slug
      name
      address
      images
      desc
      phone
      favorite
      city
      state
      zip
      directions
      seo {
        title
        desc
        tags
      }
      coordinates {
        lat
        lng
      }
      hours {
        order
        day
        startTime
        endTime
      }
      deals {
        id
        name
        price
        discount
        expires
        slug
        claimCount
        image
        claimed
        dispensaries {
          id
          directions
          phone
        }
      },
      relatedLocations {
        id
        slug
        name
        address
      }
      qrCode
    }
  }
`

const deleteDispensaryMutation = gql`
  mutation ($id: ID!) {
    deleteDispensary(id: $id) {
      id
    }
  }
`

const sendMessageMutation = gql`
mutation ($data: MessageInput) {
  sendDispensaryMessage(data: $data)
}
`

class DispensaryView extends Component {
  componentDidMount () {
    this.props.data.refetch({id: this.props.match.params.id})
  }

  async onMessageClick () {
    const {value: text} = await swal({
      title: 'Message',
      text: 'Send a message to your followers',
      input: 'textarea',
      showCancelButton: true
    })

    if (text) {
      if (text === false) return false

      if (text === '') {
        return false
      }
      const { data } = this.props
      const dispensary = data.singleDispensary
      this.props.sendMessage({
        variables: {
          data: {
            id: dispensary.id,
            message: text
          }
        }
      })
      swal('Success', 'Message successfully sent', 'success')
    }
  }

  render () {
    const { data } = this.props
    const dispensary = data.singleDispensary
    const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
    if (data.networkStatus === 1 || !dispensary) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    const breadCrumbs = [
      {title: 'Home', url: '/admin'},
      {title: 'Dispensaries', url: '/admin/dispensaries'},
      {title: dispensary.name, active: true}
    ]

    const menuItems = [
      {title: 'Preview', icon: 'now-ui-icons tech_tv', link: `/dispensary/${dispensary.slug}`},
      {title: 'Edit', icon: 'now-ui-icons design-2_ruler-pencil', link: `/admin/dispensary/${dispensary.id}/edit`},
      {title: 'Analytics', icon: 'now-ui-icons business_chart-bar-32', link: `/admin/dispensary/${dispensary.id}/analytics`},
      {
        title: 'Delete',
        icon: 'now-ui-icons ui-1_simple-remove',
        onClick: (e) => {
          e.preventDefault()
          window.swal({
            title: 'Are you sure you want to delete this dispensary?',
            text: 'You will not be able to undo this action.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'No, keep it'
          }).then((result) => {
            if (result.value) {
              window.swal(
                'Deleted!',
                'Your dispensary has been deleted.',
                'success'
              )
              this.props.mutate({
                variables: {
                  id: dispensary.id
                }
              }).then(() => {
                window.location = '/admin/dispensaries'
              }).catch((error) => {
                console.log(error)
                window.swal('Error', 'There was an error deleting this dispensary.', 'error')
              })
            // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            } else if (result.dismiss === 'cancel') {
            }
          })
        }}
    ]

    menuItems.unshift({title: 'Message', icon: 'now-ui-icons ui-2_chat-round', onClick: () => this.onMessageClick()})

    let imageGalleryImages = []
    for (var i = 0; i < dispensary.images.length; i++) {
      imageGalleryImages.push({
        original: dispensary.images[i],
        thumbnail: dispensary.images[i]
      })
    }

    const productColumns = [
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

    return (
      <Page title={dispensary.name} breadcrumbs={breadCrumbs} menuItems={menuItems}>
        <div className='row'>
          <div className='col-md-12'>
            <Card title={dispensary.name}>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Zip</th>
                    <th>Coordinates</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{dispensary.id}</td>
                    <td>{dispensary.phone}</td>
                    <td>{dispensary.address}</td>
                    <td>{dispensary.city}</td>
                    <td>{dispensary.state}</td>
                    <td>{dispensary.zip}</td>
                    <td>{dispensary.coordinates.lat}, {dispensary.coordinates.lng}</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
          <div className='col-md-8'>
            <Card title='Description'>
              <p>{dispensary.desc}</p>
            </Card>
            <Card title='Deals'>
              <ul className='nav nav-tabs' role='tablist'>
                <li className='nav-item'>
                  <a className='nav-link active' data-toggle='tab' href='#active' role='tab' aria-expanded='false'>Active</a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link' data-toggle='tab' href='#archived' role='tab' aria-expanded='false'>Archived</a>
                </li>
              </ul>
              <div className='tab-content'>
                <div className='tab-pane active' id='active' role='tabpanel' aria-expanded='false'>
                  <DataTable id='brandProducts' data={{id: dispensary.id}} columns={productColumns} source={`${server.url}/datatables/dispensary-deals`} />
                </div>
                <div className='tab-pane active' id='archived' role='tabpanel' aria-expanded='false'>
                  <DataTable id='brandProducts2' data={{id: dispensary.id}} columns={productColumns} source={`${server.url}/datatables/dispensary-deals-archived`} />
                </div>
              </div>
            </Card>
            <Card title='Images'>
              <ImageGallery items={imageGalleryImages} showPlayButton={false} />
            </Card>
            {(admin && admin.role === 'super') ? <Card title='SEO Metadata'>
              <p><b>Title:</b> {dispensary.seo ? dispensary.seo.title : dispensary.name }</p>
              <p><b>Description:</b> {dispensary.seo ? dispensary.seo.desc : '' }</p>
              <p><b>Keywords:</b> {dispensary.seo ? dispensary.seo.tags : '' }</p>
            </Card> : null}
          </div>
          <div className='col-md-4'>
            <Card title='QR Code'>
              <a href={dispensary.qrCode} download>
                <img width={'100%'} src={dispensary.qrCode} alt='' />
                <div style={{textAlign: 'center'}}><button className='btn btn-primary'>Download</button></div>
              </a>
            </Card>
            <Card title='Hours'>
              <table>
                <tbody>
                  {_.sortBy(dispensary.hours, 'order').map(hour => {
                    return (
                      <tr>
                        <td>{hour.day}</td>
                        <td>{moment(new Date(`01/01/2000 ${hour.startTime}`)).format('hh:mm A')} - {moment(new Date(`01/01/2000 ${hour.endTime}`)).format('hh:mm A')}</td>
                        {/* <td>{hour.startTime} - {hour.endTime}</td> */}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </Page>
    )
  }
}

const InitializedDispensaryView = compose(
  graphql(deleteDispensaryMutation),
  graphql(sendMessageMutation, {name: 'sendMessage'}),
  graphql(query, {options: {variables: {id: 0}}}))(DispensaryView)

export default InitializedDispensaryView
