import React, { Component } from 'react'
import { Field } from 'redux-form'
import Card from '../../components/Card'
import Geosuggest from 'react-geosuggest'
import { TextField, TextArea, SelectField } from '../common/FormInputs'
import ImageManager from '../../components/ImageManager/ImageManager'

export const DAYS = [
  {
    name: 'Sunday',
    order: 0
  },
  {
    name: 'Monday',
    order: 1
  },
  {
    name: 'Tuesday',
    order: 2
  },
  {
    name: 'Wednesday',
    order: 3
  },
  {
    name: 'Thursday',
    order: 4
  },
  {
    name: 'Friday',
    order: 5
  },
  {
    name: 'Saturday',
    order: 6
  }
]

class CreateDispensaryForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
        <div className='row'>
          {this.props.searchable ? <div className='col-md-12'>
            <Card title='Address Search'>
              <div>
                <Geosuggest
                  onSuggestSelect={this.props.handleSelectPlace}
                  placeholder='Search'
                  inputClassName='form-control' />
              </div>
            </Card>
          </div>
          : null}
          <div className='col-md-6'>
            <Card title='Details'>
              <Field component={TextField} name='name' label='Name' required />
              {this.props.showsSlug ? <Field component={TextField} name='slug' label='Slug' /> : null }
              <Field component={TextArea} name='desc' label='Description' />
              <Field component={TextField} name='address' label='Address' required />
              <Field component={TextField} name='city' label='City' required />
              <Field component={TextField} name='state' label='State' required />
              <Field component={TextField} name='zip' label='Zip' required />
              <Field component={TextField} name='url' label='Website' />
              <Field component={TextField} name='phone' label='Phone' />
              <Field component={TextField} name='directions' label='Directions URL' />
              <div className='form-group'>
                <label htmlFor='coordinates'>Coordinates</label>
                <Field component='input' className='form-control' name='lat' label='coordinates' type='number' step='any' placeholder='latitude' />
                <Field component='input' className='form-control' name='lng' label='coordinates' type='number' step='any' placeholder='longitude' />
              </div>
            </Card>
            <Card title='Hours'>
              {DAYS.map((dayData, idx) => (
                <div key={idx} className='row'>
                  <div className='col-md-12'><h6>{dayData.name}</h6></div>
                  <div className='col-md-6'>
                    <Field component={SelectField} className='form-control' options={selectTimes} name={`startTime${dayData.order}`} label='Start Time' />
                  </div>
                  <div className='col-md-6'>
                    <Field component={SelectField} className='form-control' options={selectTimes} name={`endTime${dayData.order}`} label='End Time' />
                  </div>
                </div>
              ))}
            </Card>
            <button type='submit' className='btn btn-primary'>Submit</button>
          </div>

          <div className='col-md-6 '>
            <Card title='Featured Image'>
              <div className='form-group'>
                <ImageManager multi ref={(imageManager) => { this.imageManager = imageManager }} photos={this.props.images} handleGalleryUpdate={this.props.handleGalleryUpdate} />
              </div>
            </Card>

            {this.props.showsSlug ? <Card title='SEO Metadata'>
              <Field component={TextField} className='form-control' name='seoTitle' label='Title' />
              <Field component={TextArea} className='form-control' name='seoDesc' label='Description' />
              <Field component={TextArea} className='form-control' name='seoTags' label='Keywords' />
            </Card> : null}
          </div>
        </div>
      </form>
    )
  }
}

export default CreateDispensaryForm

var selectTimes = []
let startHour = 12
for (var i = 0; i < 96; i++) {
  let postFix = 'AM'
  if (i >= 48) {
    postFix = 'PM'
  }
  var hour = (startHour + parseInt(i / 4, 10))
  var normHours = (hour % 12)
  if (normHours === 0) {
    normHours = '12'
  }
  let minutes = ((i % 4) * 15)
  if (minutes === 0) {
    minutes = '00'
  }
  selectTimes.push({
    value: `${hour - 12}:${minutes}`,
    label: `${normHours}:${minutes} ${postFix}`
  })
}
