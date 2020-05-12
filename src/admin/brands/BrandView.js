import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import DataTable from '../common/DataTable'
import server from '../../config/server'
import ReactDOM from 'react-dom'
import ImageGallery from 'react-image-gallery'

const swal = window.swal

class BrandView extends Component {
  componentDidMount () {
    window.ga('send', 'event', 'Brand', 'View', `Brand-${this.props.match.params.id}`)
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
      const brand = data.singleBrand

      this.props.sendMessage({
        variables: {
          data: {
            id: brand.id,
            message: text
          }
        }
      })
      swal('Success', 'Message successfully sent', 'success')
    }
  }

  render () {
    const { data } = this.props
    const brand = data.singleBrand
    const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))

    if (data.networkStatus === 1 || !brand) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    const breadCrumbs = [
      {title: 'Home', url: '/admin'},
      {title: 'Brands', url: '/admin/brands'},
      {title: brand.name, active: true}
    ]

    const menuItems = [
      
      {title: 'Preview', icon: 'now-ui-icons tech_tv', link: `/brands/${brand.slug}`},
      {title: 'Edit', icon: 'now-ui-icons design-2_ruler-pencil', link: `/admin/brand/${brand.id}/edit`},
      {title: 'Analytics', icon: 'now-ui-icons business_chart-bar-32', link: `/admin/brand/${brand.id}/analytics`},
      {
        title: 'Delete',
        icon: 'now-ui-icons ui-1_simple-remove',
        onClick: (e) => {
          e.preventDefault()
          window.swal({
            title: 'Are you sure you want to delete this brand?',
            text: 'You will not be able to undo this action.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'No, keep it'
          }).then((result) => {
            if (result.value) {
              window.swal(
                'Deleted!',
                'Your brand has been deleted.',
                'success'
              )
              this.props.mutate({
                variables: {
                  id: brand.id
                }
              }).then(() => {
                window.location = '/admin/brands'
              }).catch((error) => {
                console.log(error)
                window.swal('Error', 'There was an error deleting this brand.', 'error')
              })
            // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            } else if (result.dismiss === 'cancel') {
            }
          })
        }}
    ]

    menuItems.unshift({title: 'Message', icon: 'now-ui-icons ui-2_chat-round', onClick: () => this.onMessageClick()})

    let imageGalleryImages = []
    for (var i = 0; i < brand.images.length; i++) {
      imageGalleryImages.push({
        original: brand.images[i],
        thumbnail: brand.images[i]
      })
    }

    return (
      <Page title={brand.name} menuItems={menuItems} breadcrumbs={breadCrumbs}>
        <div className='row'>
          <div className='col-md-12 mr-auto ml-auto'>
            <Card title='Details'>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Slug</th>
                    <th>State</th>
                    <th>Website</th>
                    <th>Product Layout</th>
                    <th>Image Layout</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{brand.id}</td>
                    <td>{brand.slug}</td>
                    <td>{brand.states.join(', ')}</td>
                    <td>{brand.website}</td>
                    <td>{brand.productLayout}</td>
                    <td>{brand.imageLayout}</td>
                    <td>{brand.active ? 'TRUE' : 'FALSE'}</td>
                  </tr>
                </tbody>
              </table>
            </Card>
            <Card title='Owners'>
              <DataTable id='brandAdmins' data={{id: brand.id}} columns={adminColumns} source={`${server.url}/datatables/brand-admins`} />
            </Card>
          </div>
          <div className='col-md-8'>
            <Card title='Description'>
              <h5>{brand.descTitle}</h5>
              {brand.desc ? <p>{brand.desc}</p> : <p><i>No Description Available</i></p>}
            </Card>

            <div className='card'>
              <div className='card-header no-padding'>
                <ul className='nav nav-tabs' role='tablist'>
                  <li className='nav-item'>
                    <a className='nav-link active' data-toggle='tab' href='#dispensaries' role='tab'>
                      Dispensaries
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' data-toggle='tab' href='#deals' role='tab'>
                      Deals
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' data-toggle='tab' href='#products' role='tab'>
                      Products
                    </a>
                  </li>
                </ul>
              </div>
              <div className='card-body'>
                <div className='tab-content'>
                  <div className='tab-pane active' id='dispensaries' role='tabpanel'>
                    <DataTable id='brandTable' data={{id: brand.id}} columns={dispensaryColumns} source={`${server.url}/datatables/brand-dispensaries`} />
                  </div>
                  <div className='tab-pane' id='deals' role='tabpanel'>
                    <DataTable id='brandDeals' data={{id: brand.id}} columns={dealColumns} source={`${server.url}/datatables/brand-deals`} />
                  </div>
                  <div className='tab-pane' id='products' role='tabpanel'>
                    <DataTable id='brandProducts' data={{id: brand.id}} columns={productColumns} source={`${server.url}/datatables/brand-products`} />
                  </div>
                </div>
              </div>
            </div>

            <Card title='Images'>
              <ImageGallery items={imageGalleryImages} showPlayButton={false} />
            </Card>

            {(admin && admin.role === 'super') ? <Card title='SEO Metadata'>
              <p><b>Title:</b> {brand.seo ? brand.seo.title : brand.name }</p>
              <p><b>Description:</b> {brand.seo ? brand.seo.desc : '' }</p>
              <p><b>Keywords:</b> {brand.seo ? brand.seo.tags : '' }</p>
            </Card> : null}

          </div>
          <div className='col-md-4'>
            <Card title='QR Code'>
              <a href={brand.qrCode} download>
                <img width={'100%'} src={brand.qrCode} alt='' />
                <div style={{textAlign: 'center'}}><button className='btn btn-primary'>Download</button></div>
              </a>
            </Card>
            <Card title='Images'>
              <h5>Logo</h5>
              {brand.logo ? <img className='img-thumbnail' src={brand.logo} alt='' /> : <p><i>No Image Provided</i></p>}
              <br /><br />
              <h5>Header</h5>
              {brand.header ? <img className='img-thumbnail' src={brand.header} alt='' /> : <p><i>No Image Provided</i></p>}
              <br /><br />
              <h5>Featured</h5>
              {brand.featuredImage ? <img className='img-thumbnail' src={brand.featuredImage} alt='' /> : <p><i>No Image Provided</i></p>}
            </Card>

          </div>
        </div>
      </Page>
    )
  }
}

const deleteBrandMutation = gql`
  mutation ($id: ID!) {
    deleteBrand(id: $id) {
      id
    }
  }
`

const sendMessageMutation = gql`
mutation ($data: MessageInput) {
  sendBrandMessage(data: $data)
}
`

const query = gql`
  query($id: ID!) {
    singleBrand(id: $id) {
      id
      name
      header
      states
      logo
      website
      slug
      active
      featuredImage
      seo {
        title
        desc
        tags
      }
      favorite
      order
      desc
      images
      descTitle
      productLayout
      qrCode
      imageLayout
      dispensaries {
        id
        slug
        name
        address
        city
        state
        zip
        directions
        coordinates {
          lat
          lng
        }
      }
      deals {
        id
        name
        image
        discount
        price
      }
      products {
        name
        image
        desc
      }
    }
  }
`
export default compose(
  graphql(deleteBrandMutation),
  graphql(sendMessageMutation, {name: 'sendMessage'}),
  graphql(query, {options: {variables: {id: 0}}}))(BrandView)

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

const productColumns = [
  {data: 'id', 'title': 'ID', width: '30px'},
  {data: 'name', title: 'Name'}
]

const adminColumns = [
  {data: 'id', 'title': 'ID', width: '30px'},
  {data: 'first_name', title: 'First Name'},
  {data: 'last_name', title: 'Last Name'},
  {data: 'email', title: 'Email'}
]
