import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import Page from '../common/page/Page'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { editDispensary } from '../../dispensary/dispensaryReducer'
import CreateDispensaryForm, {DAYS} from './DispensaryCreateForm'
import _ from 'lodash'
import BlockUI from 'react-block-ui'

const createDispensaryMutation = gql`
  mutation($id: ID!, $data: DispensaryInput!) {
    editDispensary(id: $id, data: $data) {
      id
    }
  }
`

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
    }
  }
`

class DispensaryCreate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      photos: null,
      loading: false,
      image: {
        file: null,
        url: null
      }
    }
  }

  componentDidMount () {
    var self = this
    this.props.data.refetch({id: this.props.match.params.id}).then((result) => {
      let dispensary = Object.assign({}, result.data.singleDispensary)
      dispensary.lat = dispensary.coordinates.lat
      dispensary.lng = dispensary.coordinates.lng
      if (dispensary && dispensary.seo) {
        dispensary.seoTitle = dispensary.seo.title
        dispensary.seoDesc = dispensary.seo.desc
        dispensary.seoTags = dispensary.seo.tags
      }
      self.props.editDispensary(dispensary)
    })
  }

  getHours (values) {
    let hours = []
    DAYS.forEach((dayData) => {
      let startTime = values[`startTime${dayData.order}`]
      let endTime = values[`endTime${dayData.order}`]
      if (startTime && endTime) {
        hours.push({
          day: dayData.name,
          order: dayData.order,
          startTime: startTime.value,
          endTime: endTime.value
        })
      }
    })
    return hours
  }

  handleGalleryUpdate (photos) {
    this.setState({
      photos: _.map(photos, 'src')
    })
  }

  handleSubmit (values) {
    this.setState({loading: true})
    if (this.props.editingDispensary.images) {
      values.images = this.props.editingDispensary.images
    }
    delete values.streetNumber
    delete values.streetAddress
    var self = this
    let editableParams = Object.assign({}, values)
    if (editableParams.description && !editableParams.desc) {
      editableParams.desc = editableParams.description
    }
    delete editableParams.description

    editableParams.hours = this.getHours(values)
    if (this.state.photos) {
      editableParams.images = this.state.photos
    }

    DAYS.forEach((dayData) => {
      delete editableParams[`startTime${dayData.order}`]
      delete editableParams[`endTime${dayData.order}`]
      delete values[`startTime${dayData.order}`]
      delete values[`endTime${dayData.order}`]
    })

    if (this.dispForm.imageManager.fileCount() > 0) {
      this.dispForm.imageManager.upload().then((images) => {
        editableParams.images = _.compact(_.concat(editableParams.images, images))
        self.submitForm(editableParams)
      })
    } else {
      this.submitForm(editableParams)
    }
  }

  handleSelectPlace (addressData) {
    this.props.updateSelectedAddress(addressData)
  }

  submitForm (values) {
    this.props.mutate({
      variables: {
        id: values.id,
        data: {
          name: values.name,
          desc: values.desc,
          expires: values.expires,
          address: values.address,
          phone: values.phone,
          hours: values.hours,
          lat: values.lat,
          lng: values.lng,
          url: values.url,
          city: values.city,
          state: values.state,
          zip: values.zip,
          directions: values.directions,
          seoTitle: values.seoTitle,
          seoDesc: values.seoDesc,
          seoTags: values.seoTags,
          images: values.images
        }
      }
    }).then(({ data }) => {
      this.setState({loading: false})
      this.props.history.push(`/admin/dispensary/${data.editDispensary.id}`)
    }).catch((error) => {
      console.log(error)
      this.setState({loading: false})
      window.swal('Error', 'There was an error creating the dispensary', 'error')
    })
  }

  render () {
    const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
    let photos = []
    if (this.props.editingDispensary) {
      photos = this.props.editingDispensary.images
    }
    if (this.state.photos) {
      photos = this.state.photos
    }
    return (
      <Page title='Edit Dispensary' breadcrumbs={breadCrumbs}>
        <BlockUI blocking={this.state.loading}>
          <InitializeDispForm
            showsSlug={admin ? (admin.role === 'super') : false}
            ref={(dispForm) => { this.dispForm = dispForm ? dispForm.wrappedInstance.wrappedInstance : null }}
            onSubmit={this.handleSubmit.bind(this)}
            images={photos}
            handleGalleryUpdate={this.handleGalleryUpdate.bind(this)}
            handleSelectPlace={this.handleSelectPlace.bind(this)} />
        </BlockUI>
      </Page>
    )
  }
}

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'Dispensaries', url: '/admin/dispensaries'},
  {title: 'New', active: true}
]

let InitializeDispForm = reduxForm({
  form: 'create-dispensary',
  enableReinitialize: true
})(CreateDispensaryForm)

InitializeDispForm = connect(
  state => ({
    initialValues: state.dispensary.editingDispensary
  }), null, null, {withRef: true}
)(InitializeDispForm)

const mapDispatchToProps = {
  editDispensary
}
const mapStateToProps = (state) => ({
  editingDispensary: state.dispensary.editingDispensary
})

const DispCreate = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(DispensaryCreate)
const CreateDispensary = compose(graphql(query, {options: {variables: {id: 0}}}), graphql(createDispensaryMutation))(DispCreate)

export default CreateDispensary
