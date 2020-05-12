import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import Page from '../common/page/Page'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { updateSelectedAddress } from '../../dispensary/dispensaryReducer'
import CreateDispensaryForm, {DAYS} from './DispensaryCreateForm'
import _ from 'lodash'
import BlockUI from 'react-block-ui'
import 'react-block-ui/style.css'

const createDispensaryMutation = gql`
  mutation($data: DispensaryInput!) {
    createDispensary(data: $data) {
      id
    }
  }
`

class DispensaryCreate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      image: {
        file: null,
        url: null
      }
    }
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

  handleSubmit (values) {
    this.setState({loading: true})
    if (this.props.address.images) {
      values.images = this.props.address.images
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

    DAYS.forEach((dayData) => {
      delete editableParams[`startTime${dayData.order}`]
      delete editableParams[`endTime${dayData.order}`]
      delete values[`startTime${dayData.order}`]
      delete values[`endTime${dayData.order}`]
    })

    editableParams.seoTitle = values.seoTitle
    editableParams.seoDesc = values.seoDesc
    editableParams.seoTags = values.seoTags

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
        data: values
      }
    }).then(({ data }) => {
      this.setState({loading: false})
      this.props.history.push(`/admin/dispensary/${data.createDispensary.id}`)
    }).catch((error) => {
      console.log(error)
      this.setState({loading: false})
      window.swal('Error', 'There was an error creating the dispensary', 'error')
    })
  }

  render () {
    const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
    return (
      <Page title='New Dispensary' breadcrumbs={breadCrumbs}>
        <BlockUI blocking={this.state.loading}>
          <InitializeDispForm
            showsSlug={admin ? (admin.role === 'super') : false}
            searchable
            ref={(dispForm) => { this.dispForm = dispForm ? dispForm.wrappedInstance.wrappedInstance : null }}
            onSubmit={this.handleSubmit.bind(this)}
            images={this.props.address ? this.props.address.images || [] : []}
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
    initialValues: state.dispensary.address
  }), null, null, {withRef: true}
)(InitializeDispForm)

const mapDispatchToProps = {
  updateSelectedAddress
}
const mapStateToProps = (state) => ({
  address: state.dispensary.address
})

const DispCreate = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(DispensaryCreate)
const CreateDispensary = graphql(createDispensaryMutation)(DispCreate)

export default CreateDispensary
