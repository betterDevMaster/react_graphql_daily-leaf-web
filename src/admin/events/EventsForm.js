
import React, { Component } from 'react'
import { Field } from 'redux-form'
import Card from '../../components/Card'
import { TextField, TextArea, DatePickerField, CurrencyField } from '../common/FormInputs'
import ImageManager from '../../components/ImageManager/ImageManager'
import _ from 'lodash'

class EventForm extends Component {
  render () {
    return (
      <div className='row'>
        <div className='col-md-6'>
          <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
            <Card title='Details'>
              <Field component={TextField} className='form-control' name='name' label='Name' />
              <Field component={TextArea} className='form-control' name='desc' label='Description' />
              <Field component={CurrencyField} className='form-control' name='price' label='Price' />
              <Field component={CurrencyField} className='form-control' name='discount' label='Discount' />
              <Field component={DatePickerField} className='form-control' showTimeSelect name='expires' label='Expires' />
              <Field component={TextField} className='form-control' name='featured' label='Featured' type='checkbox' />
            </Card>
            <button type='submit' className='btn btn-primary'>Submit</button>
          </form>
        </div>
        <div className='col-md-6'>
          <Card title='Image'>
            <ImageManager multi={false} ref={(featuredManager) => { this.featuredManager = featuredManager }} onFilesUpdated={this.props.logoChanged} photos={this.props.deal ? _.compact([this.props.deal ? this.props.deal.image : null]) : []} />
          </Card>
        </div>
      </div>
    )
  }
}

export default EventForm
