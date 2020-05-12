import React, { Component } from 'react'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Select from 'react-select'
import _ from 'lodash'
import ImageManager from '../../components/ImageManager/ImageManager'
import { Field, reduxForm } from 'redux-form'
import { TextField } from '../common/FormInputs'

const query = gql`{
  allBrands {
    id
    logo
    name
    header
    website
    featured
  }

  appSettings {
    title
    subtitle
    heroImage
    adUrl
    adImage
  }

}`

const updateFeaturedBrand = gql`
  mutation($brandId: ID) {
    setFeaturedBrand(brandId: $brandId)
  }
`
const updateAppSettings = gql`
  mutation($settings: AppSettingsInput) {
    updateAppSettings(data: $settings) {
      id
    }
  }
`

const menuItems = [
]

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'Settings', url: '/admin/settings', active: true}
]

class SettingsView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      featuredBrand: null,
      editingSettings: false,
      editingAd: false
    }
  }

  handleSettingsUpdate (values) {
    if (this.settingsForm.settingsImageManager.fileCount() > 0) {
      this.settingsForm.settingsImageManager.upload().then(data => {
        let vals = Object.assign({}, values)
        if (data.length > 0) {
          vals.heroImage = data[0]
          this.submitSettings(vals)
        }
      })
    } else {
      this.submitSettings(values)
    }
  }

  submitSettings (values) {
    var self = this
    this.props.updateAppSettings({
      variables: {
        settings: {
          title: values.title,
          subtitle: values.subtitle,
          heroImage: values.heroImage
        }
      }
    }).then((data) => {
      self.props.data.refetch()
      window.swal('Settings updated!', '', 'success')
      self.stopEditing()
    }).catch((error) => {
      console.log(error)
      window.swal('Error', 'There was an error featuring this brand', 'error')
    })
  }

  handleAdUpdate (values) {
    if (this.adForm.adImageManager.fileCount() > 0) {
      this.adForm.adImageManager.upload().then(data => {
        let vals = Object.assign({}, values)
        if (data.length > 0) {
          vals.adImage = data[0]
          this.submitAdUpdate(vals)
        }
      })
    } else {
      this.submitAdUpdate(values)
    }
  }

  submitAdUpdate (values) {
    var self = this
    this.props.updateAppSettings({
      variables: {
        settings: {
          adUrl: values.url,
          adImage: values.adImage
        }
      }
    }).then((data) => {
      self.props.data.refetch()
      window.swal('Ad updated!', '', 'success')
      self.stopEditing()
    }).catch((error) => {
      console.log(error)
      window.swal('Error', 'There was an error updating the settings', 'error')
    })
  }

  handleSelectNewBrand (brand) {
    let brandValue = null
    var self = this
    if (brand) {
      brandValue = brand.value
    }
    this.setState({
      featuredBrand: brandValue
    })

    this.props.updateFeaturedBrand({
      variables: {
        brandId: brandValue
      }
    }).then((data) => {
      self.props.data.refetch()
    }).catch((error) => {
      console.log(error)
      window.swal('Error', 'There was an error featuring this brand', 'error')
    })
  }

  editSettings () {
    this.setState({
      editingSettings: true,
      editingAd: false
    })
  }

  editAds () {
    this.setState({
      editingAd: true,
      editingSettings: false
    })
  }

  stopEditing () {
    this.setState({
      editingAd: false,
      editingSettings: false
    })
  }

  render () {
    let selectOptions = []
    const { data } = this.props
    const { appSettings } = data

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }
    let featuredBrand = this.state.featuredBrand
    _.each(data.allBrands, (brand) => {
      if (brand.featured && !this.state.featuredBrand) {
        featuredBrand = brand.id
      }
      selectOptions.push({ value: brand.id, label: brand.name })
    })

    return (
      <Page title='Settings' breadcrumbs={breadCrumbs} menuItems={menuItems} >
        <div className='row'>

          <div className='col-md-12'>
            <Card title='Featured Brand'>
              <Select
                name='featuredBrand'
                value={featuredBrand}
                clearable
                onChange={this.handleSelectNewBrand.bind(this)}
                options={selectOptions} />
            </Card>
          </div>

          <div className='col-md-6'>
            <Card title='Frontpage'>
              {!this.state.editingSettings ? <div id='fp'>
                <h4>Title</h4>
                <p>{appSettings.title}</p>

                <h4>Subtitle</h4>
                <p>{appSettings.subtitle}</p>

                <h4>Hero Image</h4>
                <img width='100' src={appSettings.heroImage} alt='' />
              </div>
              : null}

              {!this.state.editingSettings ? <button onClick={this.editSettings.bind(this)} className='btn btn-primary'>Edit</button>
              : <ReduxSettingsForm
                ref={(settingsForm) => { this.settingsForm = (settingsForm ? settingsForm.wrappedInstance : null) }}
                cancel={this.stopEditing.bind(this)}
                onSubmit={this.handleSettingsUpdate.bind(this)} />
              }
            </Card>
          </div>

          <div className='col-md-6'>
            <Card title='Frontpage Ad'>
              {!this.state.editingAd ? <div>
                <h4>Ad URL</h4>
                <p>{appSettings.adUrl}</p>
                <h4>Ad Image</h4>
                <img width='100' src={appSettings.adImage} alt='' />
                <br />
                <button onClick={this.editAds.bind(this)} className='btn btn-primary'>Edit</button>
              </div>
                : <ReduxAdForm
                  ref={(adForm) => { this.adForm = (adForm ? adForm.wrappedInstance : null) }}
                  cancel={this.stopEditing.bind(this)}
                  onSubmit={this.handleAdUpdate.bind(this)} />}
            </Card>
          </div>
        </div>
      </Page>
    )
  }
}

class SettingsForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
        <Field component={TextField} className='form-control' name='title' label='Title' />
        <Field component={TextField} className='form-control' name='subtitle' label='Subtitle' />
        <ImageManager multi={false} ref={(settingsImageManager) => { this.settingsImageManager = settingsImageManager }} />
        <button onClick={this.props.cancel} className='btn btn-muted'>Cancel</button>
        <button type='submit' className='btn btn-primary'>Update</button>
      </form>
    )
  }
}

class AdForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
        <Field component={TextField} className='form-control' name='url' label='URL' />
        <ImageManager multi={false} ref={(adImageManager) => { this.adImageManager = adImageManager }} />
        <button onClick={this.props.cancel} className='btn btn-muted'>Cancel</button>
        <button type='submit' className='btn btn-primary'>Update</button>
      </form>
    )
  }
}

let ReduxSettingsForm = reduxForm({
  form: 'update-frontpage',
  initialValues: {},
  enableReinitialize: true
})(SettingsForm)

let ReduxAdForm = reduxForm({
  form: 'ad-update-form',
  initialValues: {},
  enableReinitialize: true
})(AdForm)

export default compose(graphql(updateAppSettings, {name: 'updateAppSettings'}), graphql(updateFeaturedBrand, {name: 'updateFeaturedBrand'}), graphql(query))(SettingsView)
