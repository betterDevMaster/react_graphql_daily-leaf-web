import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import swal from 'sweetalert2'
import Promise from 'bluebird'
import Page from '../common/page/Page'
import CreateBrandForm from './BrandForm'
import BlockUI from 'react-block-ui'
import _ from 'lodash'

const createBrandMutation = gql`
  mutation($data: BrandInput!) {
    createBrand(data: $data) {
      id
    }
  }
`

class BrandCreate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  handleSubmit (values) {
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
        values.header = (images.header && images.header.length > 0) ? images.header[0] : null
        values.logo = (images.logo && images.logo.length > 0) ? images.logo[0] : null
        values.featuredImage = (images.featured && images.featured.length > 0) ? images.featured[0] : null
        self.submitForm(values)
      })
    } else {
      this.submitForm(values)
    }
  }

  submitForm (values) {
    this.props.mutate({
      variables: {
        data: {
          name: values.name,
          logo: values.logo,
          states: _.map(values.states, 'value'),
          header: values.header,
          website: values.website,
          video: values.video,
          slug: values.slug,
          desc: values.desc,
          descTitle: values.descTitle,
          seoTitle: values.seoTitle,
          seoDesc: values.seoDesc,
          seoTags: values.seoTags,
          active: values.active,
          productLayout: values.productLayout ? values.productLayout.value : null,
          imageLayout: values.imageLayout ? values.imageLayout.value : null
        }
      }
    }).then(({ data }) => {
      this.setState({loading: false})
      this.props.history.push(`/admin/brand/${data.createBrand.id}`)
    }).catch((err) => {
      console.log(err)
      this.setState({loading: false})
      swal('Error', 'there was an error creating the brand', 'error')
    })
  }
  render () {
    const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
    return (
      <Page title='Create A Brand' menuItems={menuItems} breadcrumbs={breadCrumbs}>
        <BlockUI blocking={this.state.loading}>
          <InitializeBrandForm
            showsSlug={admin ? (admin.role === 'super') : false}
            ref={(brandForm) => { this.brandForm = (brandForm ? brandForm.wrappedInstance : null) }}
            onSubmit={this.handleSubmit.bind(this)} />
        </BlockUI>
      </Page>
    )
  }
}

let InitializeBrandForm = reduxForm({
  form: 'create-brand',
  enableReinitialize: true
})(CreateBrandForm)

const CreateBrand = graphql(createBrandMutation)(BrandCreate)

export default CreateBrand

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'Brands', url: '/admin/brands'},
  {title: 'New', url: '/admin/brands/new', active: true}
]
const menuItems = []
