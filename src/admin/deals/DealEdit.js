import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Page from '../common/page/Page'
import CreateDealForm from './DealForm'
import Promise from 'bluebird'
import _ from 'lodash'
import { editDeal } from '../../deals/dealReducer'
import moment from 'moment'
import BlockUI from 'react-block-ui'

const createBrandMutation = gql`
  mutation($id: ID!, $data: DealInput!) {
    editDeal(id: $id, data: $data) {
      id
    }
  }
`
const query = gql`
  query($id: ID!) {
    allDispensaries {
      id
      name
      address
    }
    allCategories {
      id
      name
    }
    allTotalBrands {
      id
      name
    }

    seoForDeal(id: $id) {
      id
      title,
      desc,
      tags
    }

    singleDeal(id: $id) {
      id
      name
      image
      slug
      otherImages
      featured
      desc
      discount
      claimed
      expires
      price
      categories {
        id
        name
      }
      dispensaries {
        id
        name
        address
      }
      brands {
        id
        name
      }
    }
  }
`

class DealEdit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      images: null,
      loading: false
    }
  }
  componentDidMount () {
    var self = this
    this.props.data.refetch({id: this.props.match.params.id}).then((result) => {
      let deal = Object.assign({}, result.data.singleDeal)
      deal.categories = _.map(deal.categories, 'id')
      deal.dispensaries = _.map(deal.dispensaries, 'id')
      deal.brands = _.map(deal.brands, 'id')
      let seo = Object.assign({}, result.data.seoForDeal)
      if (result.data.seoForDeal) {
        deal.seoTitle = seo.title
        deal.seoDesc = seo.desc
        deal.seoTags = seo.tags
      }
      self.props.editDeal(deal)
    })
  }

  handleGalleryUpdate (photos) {
    this.setState({
      images: photos
    })
  }

  handleSubmit (values) {
    let uploads = {}
    let shouldUploadImages = false
    var self = this
    this.setState({loading: true})
    if (this.dealForm.featuredManager.fileCount() > 0) {
      uploads['image'] = this.dealForm.featuredManager.upload()
      shouldUploadImages = true
    }

    if (this.dealForm.otherManager.fileCount() > 0) {
      uploads['otherImages'] = this.dealForm.otherManager.upload()
      shouldUploadImages = true
    }

    if (this.state.images) {
      values.otherImages = this.state.images
    }

    if (shouldUploadImages) {
      Promise.props(uploads).then((images) => {
        values.image = (images.image && images.image.length > 0) ? images.image[0] : null
        values.otherImages = (images.otherImages) ? images.otherImages : null
        self.submitForm(values)
      })
    } else {
      self.submitForm(values)
    }
  }

  submitForm (values) {
    if (values.price && typeof values.price === 'string') {
      values.price = parseFloat(values.price.replace(/\D/g,''))
    }
    values.price *= 100

    if (values.discount && typeof values.discount === 'string') {
      values.discount = parseFloat(values.discount.replace(/\D/g,''))
    }
    values.discount *= 100

    if (values.otherImages && values.otherImages.length === 0) {
      // delete values.otherImages
    }

    if (values.dispensaries) {
      if (values.dispensaries.length > 0) {
        if (typeof values.dispensaries[0] === 'object') {
          values.dispensaries = _.map(values.dispensaries, 'value')
        }
      }
    }

    if (values.categories) {
      if (values.categories.length > 0) {
        if (typeof values.categories[0] === 'object') {
          values.categories = _.map(values.categories, 'value')
        }
      }
    }

    if (values.brands) {
      if (values.brands.length > 0) {
        if (typeof values.brands[0] === 'object') {
          values.brands = _.map(values.brands, 'value')
        }
      }
    }
    if (values.dispensaries.length === 0) {
      window.swal('Error', 'Please select a dispensary', 'error')
    } else {
      this.props.mutate({
        variables: {
          id: values.id,
          data: {
            name: values.name,
            desc: values.desc,
            slug: values.slug,
            price: values.price,
            discount: values.discount,
            seoTitle: values.seoTitle,
            seoDesc: values.seoDesc,
            seoTags: values.seoTags,
            image: values.image,
            expires: values.expires ? moment(new Date(values.expires)).format('YYYY-MM-DD HH:mm:ssZ') : null,
            otherImages: values.otherImages ? _.compact(values.otherImages) : null,
            featured: values.featured,
            dispensaries: values.dispensaries ? _.compact(values.dispensaries) : null,
            categories: values.categories ? _.compact(values.categories) : null,
            link: values.link,
            linkName: values.linkName,
            brands: values.brands ? _.compact(values.brands) : null
          }
        }
      }).then(({ data }) => {
        this.setState({loading: false})
        this.props.history.push(`/admin/deal/${data.editDeal.id}`)
      }).catch((error) => {
        console.log(error)
        this.setState({loading: false})
        window.swal('Error', 'There was an error creating the deal', 'error')
      })
    }
  }

  render () {
    const { data } = this.props
    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }
    let deal = Object.assign({}, data.singleDeal)
    if (this.state.images) {
      deal.otherImages = this.state.images
    }
    let seo = Object.assign({}, data.seoForDeal)
    if (data.seoForDeal) {
      deal.seoTitle = seo.title
      deal.seoDesc = seo.desc
      deal.seoTags = seo.tags
    }
    const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
    return (
      <Page title='Create Deal'>
        <BlockUI blocking={this.state.loading}>
          <InitializeDealForm
            ref={(dealForm) => {
              if (dealForm) {
                this.dealForm = dealForm.wrappedInstance.wrappedInstance
              }
            }}
            showsSlug={admin ? (admin.role === 'super') : false}
            onSubmit={this.handleSubmit.bind(this)}
            deal={deal}
            seo={seo}
            dispensaries={data.allDispensaries}
            categories={data.allCategories}
            handleGalleryUpdate={this.handleGalleryUpdate.bind(this)}
            brands={data.allTotalBrands} />
          </BlockUI>
      </Page>
    )
  }
}

let InitializeDealForm = reduxForm({
  form: 'create-deal',
  enableReinitialize: true
})(CreateDealForm)

InitializeDealForm = connect(
  state => ({
    initialValues: state.deals.editingDeal
  }), null, null, {withRef: true}
)(InitializeDealForm)

const mapDispatchToProps = {
  editDeal
}
const mapStateToProps = (state) => ({
  editingDeal: state.deals.editingDeal
})

const ReduxDealCreate = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(DealEdit)

const CreateDeal = compose(graphql(query, {options: {variables: {id: 0}}}), graphql(createBrandMutation))(ReduxDealCreate)

export default CreateDeal
