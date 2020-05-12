
import React, { Component } from 'react'
import { Field } from 'redux-form'
import Card from '../../components/Card'
import { TextField, SelectField, DatePickerField, CurrencyField, Checkbox, EditorTextArea, TextArea } from '../common/FormInputs'
import ImageManager from '../../components/ImageManager/ImageManager'
import _ from 'lodash'

class CreateDealForm extends Component {
  // ({handleSubmit, submitting, onSubmit, imageChanged, dispensaries, otherImageChanged}) => (
  render () {
    let dispensaries = []
    _.each(this.props.dispensaries, (dispensary) => {
      dispensaries.push({ value: dispensary.id, label: `${dispensary.name} (${dispensary.address})` })
    })

    let categories = []
    _.each(this.props.categories, (cat) => {
      categories.push({ value: cat.id, label: cat.name })
    })

    let brands = []
    _.each(this.props.brands, (brand) => {
      brands.push({ value: brand.id, label: brand.name })
    })

    return (
      <div className='row'>
        <div className='col-md-6'>
          <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
            <Card title='Details'>
              <Field component={TextField} className='form-control' name='name' label='Name' />
              {this.props.showsSlug ? <Field component={TextField} name='slug' label='Slug' /> : null }
              <Field component={EditorTextArea} className='form-control' name='desc' label='Description' />
              <br />
              <div className='row'>
                <div className='col-md-6'>
                  <Field component={CurrencyField} className='form-control' name='price' label='Original Price' />
                </div>
                <div className='col-md-6'>
                  <Field component={CurrencyField} className='form-control' name='discount' label='Discounted Price' />
                </div>
              </div>
              <Field component={TextField} className='form-control' type='url' name='link' label='Deal Link' />
              <Field component={TextField} maxLength='12' className='form-control' name='linkName' label='Deal Link Name' />
              <Field component={DatePickerField} className='form-control' showTimeSelect name='expires' label='Expires' />
              {this.props.showsSlug ? <Field component={Checkbox} name='featured' checkboxTitle='Featured' /> : null }
              <Field name='categories' component={SelectField} multi options={categories} label='Categories' />
              <Field name='dispensaries' component={SelectField} multi options={dispensaries} label='Dispensaries' />
              <Field name='brands' component={SelectField} multi options={brands} label='Brands' />
            </Card>
            <button type='submit' className='btn btn-primary'>Submit</button>
          </form>
        </div>
        <div className='col-md-6'>
          <Card title='Featured Image'>
            <ImageManager multi={false} ref={(featuredManager) => { this.featuredManager = featuredManager }} onFilesUpdated={this.props.logoChanged} photos={this.props.deal ? _.compact([this.props.deal ? this.props.deal.image : null]) : []} />
          </Card>

          <Card title='Additional Images'>
            <ImageManager multi ref={(otherManager) => { this.otherManager = otherManager }} onFilesUpdated={this.props.headerChanged} handleGalleryUpdate={this.props.handleGalleryUpdate} photos={_.compact(this.props.deal ? this.props.deal.otherImages : [])} />
          </Card>
          {this.props.showsSlug ? <Card title='SEO Metadata'>
            <Field component={TextField} className='form-control' name='seoTitle' label='Title' />
            <Field component={TextArea} className='form-control' name='seoDesc' label='Description' />
            <Field component={TextArea} className='form-control' name='seoTags' label='Keywords' />
          </Card> : null}
        </div>
      </div>
    )
  }
}

export default CreateDealForm
