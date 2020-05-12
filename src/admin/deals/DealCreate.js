import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Page from '../common/page/Page'
import CreateDealForm from './DealForm'
import Promise from 'bluebird'
import _ from 'lodash'
import BlockUI from 'react-block-ui'
import moment from 'moment'
import 'react-block-ui/style.css'

const createBrandMutation = gql`
  mutation($data: DealInput!) {
    createDeal(data: $data) {
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
  allCategories {
    id
    name
  }
  allTotalBrands {
    id
    name
  }
}
`

class DealCreate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }
  handleSubmit (values) {
    this.setState({ loading: true })
    let uploads = {}
    let shouldUploadImages = false
    var self = this

    if (this.dealForm.featuredManager.fileCount() > 0) {
      uploads['image'] = this.dealForm.featuredManager.upload()
      shouldUploadImages = true
    }

    if (this.dealForm.otherManager.fileCount() > 0) {
      uploads['otherImages'] = this.dealForm.otherManager.upload()
      shouldUploadImages = true
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
      values.price *= 100
    }

    if (values.discount && typeof values.discount === 'string') {
      values.discount = parseFloat(values.discount.replace(/\D/g,''))
      values.discount *= 100
    }

    if (values.otherImages && values.otherImages.length === 0) {
      delete values.otherImages
    }

    if (values.dispensaries) {
      values.dispensaries = _.map(values.dispensaries, 'value')
    }

    if (values.categories) {
      values.categories = _.map(values.categories, 'value')
    }

    if (values.brands) {
      values.brands = _.map(values.brands, 'value')
    }
    // if (values.dispensaries.length === 0) {
    //   window.swal('Error', 'Please select a dispensary', 'error')
    // } else {
    this.props.mutate({
      variables: {
        data: {
          name: values.name,
          desc: values.desc,
          slug: values.slug,
          price: values.price,
          seoTitle: values.seoTitle,
          seoDesc: values.seoDesc,
          seoTags: values.seoTags,
          discount: values.discount,
          expires: (values.expires ? moment(new Date(values.expires)).format('YYYY-MM-DD HH:mm:ssZ') : null),
          image: values.image,
          otherImages: values.otherImages,
          featured: values.featured,
          dispensaries: values.dispensaries,
          categories: values.categories,
          link: values.link,
          linkName: values.linkName,
          brands: values.brands
        }
      }
    }).then(({ data }) => {
      this.setState({ loading: false })
      this.props.history.push(`/admin/deal/${data.createDeal.id}`)
    }).catch((error) => {
      console.log(error)
      this.setState({ loading: false })
      window.swal('Error', 'There was an error creating the deal', 'error')
    })
    // }
  }

  render () {
    const { data } = this.props
    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }
    const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
    return (
      <Page title='Create Deal'>
        <BlockUI blocking={this.state.loading}>
          <InitializeDealForm
            showsSlug={admin ? (admin.role === 'super') : false}
            ref={(dealForm) => {
              if (dealForm) {
                this.dealForm = dealForm.wrappedInstance
              }
            }}
            onSubmit={this.handleSubmit.bind(this)}
            dispensaries={data.allDispensaries}
            categories={data.allCategories}
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

const CreateDeal = compose(graphql(query), graphql(createBrandMutation))(DealCreate)

export default CreateDeal
