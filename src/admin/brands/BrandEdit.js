import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import BlockUI from 'react-block-ui'
import { editBrand } from '../../brands/brandReducer'
import BrandProducts from './BrandProducts'
import Page from '../common/page/Page'
import EditBrandForm from './BrandForm'
import Promise from 'bluebird'
import Card from '../../components/Card'
import ImageManager from '../../components/ImageManager/ImageManager'
import _ from 'lodash'
import BrandOwners from './BrandOwners'
import BrandDispensaries from './BrandDispensaries'

const createBrandMutation = gql`
  mutation($id: ID!, $data: BrandInput!) {
    editBrand(id: $id, data: $data) {
      id
    }
  }
`

const setImagesMutation = gql`
  mutation($id: ID!, $images: [String]!) {
    setBrandImages(brandId: $id, images: $images) {
      id
    }
  }
`

const getSingleBrand = gql`
  query($id: ID!) {
    singleBrand(id: $id) {
      id
      name
      slug
      active
      website
      video
      logo
      header
      states
      featuredImage
      seo {
        title
        desc
        tags
      }
      order
      desc
      descTitle
      images
      productLayout
      imageLayout
    }
  }
`

class BrandEdit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount () {
    var self = this
    this.props.data.refetch({id: this.props.match.params.id}).then(function (result) {
      let brand = result.data.singleBrand
      let editableBrand = Object.assign({}, brand)
      if (editableBrand && editableBrand.seo) {
        editableBrand.seoTitle = editableBrand.seo.title
        editableBrand.seoDesc = editableBrand.seo.desc
        editableBrand.seoTags = editableBrand.seo.tags
      }
      self.props.editBrand(editableBrand)
    })
  }

  handleSubmit (values) {
    let editableParams = Object.assign({}, values)
    var self = this
    let uploads = {}
    let shouldUploadImages = false

    if (this.brandForm.headerManager.fileCount() > 0) {
      uploads['header'] = this.brandForm.headerManager.upload()
      shouldUploadImages = true
    }

    if (this.brandForm.logoManager.fileCount() > 0) {
      uploads['logo'] = this.brandForm.logoManager.upload()
      shouldUploadImages = true
    }

    if (this.brandForm.featuredManager.fileCount() > 0) {
      uploads['featured'] = this.brandForm.featuredManager.upload()
      shouldUploadImages = true
    }
    this.setState({loading: true})
    if (shouldUploadImages) {
      Promise.props(uploads).then((images) => {
        if (images.header && images.header.length > 0) {
          editableParams.header = images.header[0]
        } else {
          if (this.brandForm.headerManager.state.photos && this.brandForm.headerManager.state.photos.length > 0) {
            editableParams.header = this.brandForm.headerManager.state.photos[0].src
          }
        }

        if (images.logo && images.logo.length > 0) {
          editableParams.logo = images.logo[0]
        } else {
          if (this.brandForm.logoManager.state.photos && this.brandForm.logoManager.state.photos.length > 0) {
            editableParams.logo = this.brandForm.logoManager.state.photos[0].src
          }
        }

        if (images.featured && images.featured.length > 0) {
          editableParams.featuredImage = images.featured[0]
        } else {
          if (this.brandForm.featuredManager.state.photos && this.brandForm.featuredManager.state.photos.length > 0) {
            editableParams.featuredImage = this.brandForm.featuredManager.state.photos[0].src
          }
        }

        if (!editableParams.header) delete editableParams.header
        if (!editableParams.logo) delete editableParams.logo
        if (!editableParams.featuredImage) delete editableParams.featuredImage

        self.submitForm(editableParams)
      })
    } else {
      editableParams.header = (this.brandForm.headerManager.state.photos.length > 0) ? this.brandForm.headerManager.state.photos[0].src : ''
      editableParams.logo = (this.brandForm.logoManager.state.photos.length > 0) ? this.brandForm.logoManager.state.photos[0].src : ''
      editableParams.featuredImage = (this.brandForm.featuredManager.state.photos.length > 0) ? this.brandForm.featuredManager.state.photos[0].src : ''
      this.submitForm(editableParams)
    }
  }

  submitForm (values) {
    console.log(values)
    this.props.createBrand({
      variables: {
        id: values.id,
        data: {
          name: values.name,
          states: _.map(values.states, 'value'),
          logo: values.logo,
          header: values.header,
          website: values.website,
          video: values.video,
          slug: values.slug,
          desc: values.desc,
          seoTitle: values.seoTitle,
          seoDesc: values.seoDesc,
          seoTags: values.seoTags,
          descTitle: values.descTitle,
          featuredImage: values.featuredImage,
          active: values.active,
          productLayout: values.productLayout ? values.productLayout.value : null,
          imageLayout: values.imageLayout ? values.imageLayout.value : null
        }
      }
    }).then(({ data }) => {
      this.setState({loading: false})
      this.props.history.push(`/admin/brand/${data.editBrand.id}`)
    }).catch((error) => {
      console.log(error)
      this.setState({loading: false})
      window.swal('Error', 'there was an error editing the brand', 'error')
    })
  }

  handleGalleryUpdate () {
    var self = this
    const { singleBrand } = this.props.data
    this.imageManager.upload().then((images) => {
      let newImages = _.compact(_.concat(_.map(self.imageManager.state.photos, 'src'), images))
      self.props.setImages({
        variables: {
          id: singleBrand.id,
          images: newImages
        }
      }).then(() => {
        self.imageManager.removeAllFiles()
        self.props.data.refetch()
        window.swal('Success', 'The gallery has updated', 'success')
      }).catch((error) => {
        console.log(error)
      })
    })
  }

  render () {
    const { data } = this.props
    const { singleBrand } = data
    var self = this
    if (data.networkStatus === 1 || singleBrand === null) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
    const breadCrumbs = [
      {title: 'Home', url: '/admin'},
      {title: 'Brands', url: '/admin/brands'},
      {title: singleBrand.name, url: `/admin/brand/${singleBrand.id}`},
      {title: 'Edit', active: true}
    ]

    return (
      <Page title={`Editing ${singleBrand.name}`} breadcrumbs={breadCrumbs}>
        <div className='row'>
          <div className='col-md-12'>
            <ul className='nav nav-tabs' role='tablist'>
              <li className='nav-item'>
                <a className='nav-link active' data-toggle='tab' href='#details' role='tab' aria-expanded='false'>Details</a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' data-toggle='tab' href='#dispensaries' role='tab' aria-expanded='false'>Dispensaries</a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' data-toggle='tab' href='#products' role='tab' aria-expanded='false'>Products</a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' data-toggle='tab' href='#gallery' role='tab' aria-expanded='true'>Gallery</a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' data-toggle='tab' href='#owners' role='tab' aria-expanded='true'>Owners</a>
              </li>
            </ul>

            <div className='tab-content'>
              <div className='tab-pane active' id='details' role='tabpanel' aria-expanded='false'>
                <BlockUI blocking={this.state.loading}>
                  <InitializeBrandForm
                    showsSlug={admin ? (admin.role === 'super') : false}
                    ref={(brandForm) => {
                      self.brandForm = (brandForm ? brandForm.wrappedInstance.wrappedInstance : null)
                    }}
                    brand={singleBrand}
                    onSubmit={this.handleSubmit.bind(this)} />
                </BlockUI>
              </div>
              <div className='tab-pane' id='dispensaries' role='tabpanel' aria-expanded='false'>
                <Card title='Dispensaries'>
                  <BrandDispensaries brand={singleBrand} />
                </Card>
              </div>
              <div className='tab-pane' id='products' role='tabpanel' aria-expanded='false'>
                <Card title='Products'>
                  <BrandProducts brand={singleBrand} match={this.props.match} />
                </Card>
              </div>
              <div className='tab-pane' id='gallery' role='tabpanel' aria-expanded='false'>
                <Card title='Images'>
                  <ImageManager multi ref={(imageManager) => { this.imageManager = imageManager }} photos={singleBrand.images} />
                  <button onClick={this.handleGalleryUpdate.bind(this)} className='btn btn-primary'>Update</button>
                </Card>
              </div>
              <div className='tab-pane' id='owners' role='tabpanel' aria-expanded='false'>
                <Card title='Owners'>
                  <BrandOwners brand={singleBrand} />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

let InitializeBrandForm = reduxForm({
  form: 'edit-brand',
  enableReinitialize: true
})(EditBrandForm)

InitializeBrandForm = connect(
  state => ({
    initialValues: state.brands.editingBrand
  }), null, null, {withRef: true}
)(InitializeBrandForm)

const mapDispatchToProps = {
  editBrand
}
const mapStateToProps = (state) => ({
  brand: state.brands.editingBrand
})

const BEdit = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(BrandEdit)
const CreateBrand = compose(
  graphql(createBrandMutation, {name: 'createBrand'}),
  graphql(setImagesMutation, {name: 'setImages'}),
  graphql(getSingleBrand, {options: {variables: {id: 0}}})
)(BEdit)

export default CreateBrand
