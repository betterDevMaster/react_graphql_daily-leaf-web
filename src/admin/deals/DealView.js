import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import DataTable from '../common/DataTable'
import server from '../../config/server'
import ReactDOM from 'react-dom'
import ImageGallery from 'react-image-gallery'
import _ from 'lodash'
import moment from 'moment'
import { Label } from 'react-bootstrap'

class DealView extends Component {
  componentDidMount () {
    this.props.data.refetch({id: this.props.match.params.id})
  }

  deleteDeal () {

  }

  render () {
    const { data } = this.props
    const deal = data.singleDeal
    const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    const breadCrumbs = [
      {title: 'Home', url: '/admin'},
      {title: 'Deals', url: '/admin/deals'},
      {title: deal.name, active: true}
    ]

    const menuItems = [
      {title: 'Preview', icon: 'now-ui-icons tech_tv', link: `/deals/${deal.slug}`},
      {title: 'Edit', icon: 'now-ui-icons design-2_ruler-pencil', link: `/admin/deal/${deal.id}/edit`},
      {title: 'Analytics', icon: 'now-ui-icons business_chart-bar-32', link: `/admin/deal/${deal.id}/analytics`},
      {
        title: 'Archive',
        icon: 'now-ui-icons ui-1_simple-remove',
        onClick: (e) => {
          e.preventDefault()
          window.swal({
            title: 'Are you sure you want to delete this deal?',
            text: '',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, archive it',
            cancelButtonText: 'No, keep it'
          }).then((result) => {
            if (result.value) {
              window.swal(
                'Archived!',
                'Your deal has been archived.',
                'success'
              )
              this.props.mutate({
                variables: {
                  id: deal.id
                }
              }).then(() => {
                window.location = '/admin/deals'
              }).catch((error) => {
                console.log(error)
                window.swal('Error', 'There was an error deleting this deal.', 'error')
              })
            // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            } else if (result.dismiss === 'cancel') {
            }
          })
        }}
    ]

    let imageGalleryImages = []
    let allImages = _.compact(_.concat([], deal.otherImages))
    for (var i = 0; i < allImages.length; i++) {
      imageGalleryImages.push({
        original: allImages[i],
        thumbnail: allImages[i]
      })
    }

    return (
      <Page title={deal.name} menuItems={menuItems} breadcrumbs={breadCrumbs}>
        <div className='row'>
          <div className='col-md-12 mr-auto ml-auto'>
            <Card title={deal.name}>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Active</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{deal.id}</td>
                    <td>{deal.price}</td>
                    <td>{deal.discount}</td>
                    <td>{deal.active ? <span className='tag badge text-success'>TRUE</span> : <span className='tag badge text-danger'>FALSE</span>}</td>
                    <td>{deal.expires ? moment(deal.expires).format('MM/DD/YYYY h:mm a') : 'No Expiry'}</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
          <div className='col-md-8'>
            <Card title='Description'>
              <h5>Description</h5>
              {deal.desc ? <div dangerouslySetInnerHTML={{__html: deal.desc}} /> : <p><i>No Description Available</i></p>}

              <h5>Categories</h5>
              {deal.categories.map((category, idx) => {
                return (
                  <span key={idx}>
                    <Label bsStyle='primary'>{category.name}</Label> <span />
                  </span>
                )
              })}
              {!deal.categories || (deal.categories && deal.categories.length === 0) ? <p><i>No Associated Categories</i></p> : null }
            </Card>

            <Card title='Dispensaries'>
              <DataTable id='dispensaryDeals' data={{id: deal.id}} columns={dispensaryColumns} source={`${server.url}/datatables/deal-dispensaries`} />
            </Card>

            <Card title='Brands'>
              <DataTable id='dealBrands' data={{id: deal.id}} columns={brandColumns} source={`${server.url}/datatables/deal-brands`} />
            </Card>
            {(admin && admin.role === 'super') ? <Card title='SEO Metadata'>
              <p><b>Title:</b> {deal.seo ? deal.seo.title : deal.name }</p>
              <p><b>Description:</b> {deal.seo ? deal.seo.desc : '' }</p>
              <p><b>Keywords:</b> {deal.seo ? deal.seo.tags : '' }</p>
            </Card> : null}
          </div>
          <div className='col-md-4'>
            <Card title='Images'>
              <h5>Featured Image</h5>
              {deal.image ? <img className='img-thumbnail' src={deal.image} alt='' /> : <p><i>No Image Provided</i></p>}
              <br /><br />
              <ImageGallery items={imageGalleryImages} showPlayButton={false} />
            </Card>
          </div>
        </div>
      </Page>
    )
  }
}

const deleteDealMutation = gql`
  mutation ($id: ID!) {
    editDeal(id: $id, data: {active: false}) {
      id
    }
  }
`

const query = gql`
  query($id: ID!) {
    singleDeal(id: $id) {
      id
      name
      image
      slug
      otherImages
      featured
      active
      desc
      discount
      claimed
      expires
      price
      seo {
        title
        desc
        tags
      }
      categories {
        id
        name
      }
    }
  }
`
export default compose(graphql(deleteDealMutation), graphql(query, {options: {variables: {id: 0}}}))(DealView)

const dispensaryColumns = [
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
          <a className='btn btn-sm btn-info' href={`/admin/dispensary/${rowData.id}`}>View</a>
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
        <div>
          <a className='btn btn-sm btn-info' href={`/admin/brand/${rowData.id}`}>View</a>
        </div>, td)
  }
]
