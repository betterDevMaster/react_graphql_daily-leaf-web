import React, { Component } from 'react'
import { Field } from 'redux-form'
import Card from '../../components/Card'
import { TextField, Checkbox, SelectField, EditorTextArea, TextArea } from '../common/FormInputs'
import ImageManager from '../../components/ImageManager/ImageManager'
import ProductLayoutImage from './productLayout.png'
import ImageLayoutImage from './imageLayout.png'
import _ from 'lodash'

class BrandForm extends Component {
  render () {
    let imageLayoutOptions = [
      { value: 'full', label: 'Full Image Size' },
      { value: 'centered', label: 'Centered & Resized' },
      { value: 'half', label: '2 Images Per Row' },
      { value: 'thirds', label: '3 Images Per Row' },
      { value: 'forths', label: '4 Images Per Row' }
    ]

    let productLayoutOptions = [
      { value: 'vertical', label: 'Vertical' },
      { value: 'half', label: '2 Products Per Row' },
      { value: 'thirds', label: '3 Products Per Row' },
      { value: 'forths', label: '4 Products Per Row' }
    ]

    const states = [
      {value: 'ALL', label: 'All'},
      // {value: 'AL', label: 'Alabama'},
      {value: 'AK', label: 'Alaska'},
      {value: 'AZ', label: 'Arizona'},
      {value: 'AR', label: 'Arkansas'},
      {value: 'CA', label: 'California'},
      {value: 'CO', label: 'Colorado'},
      {value: 'CT', label: 'Connecticut'},
      {value: 'DE', label: 'Delaware'},
      {value: 'FL', label: 'Florida'},
      // {value: 'GA', label: 'Georgia'},
      {value: 'HI', label: 'Hawaii'},
      // {value: 'ID', label: 'Idaho'},
      {value: 'IL', label: 'Illinois'},
      // {value: 'IN', label: 'Indiana'},
      // {value: 'IA', label: 'Iowa'},
      // {value: 'KS', label: 'Kansas'},
      // {value: 'KY', label: 'Kentucky'},
      // {value: 'LA', label: 'Louisiana'},
      {value: 'ME', label: 'Maine'},
      {value: 'MD', label: 'Maryland'},
      {value: 'MA', label: 'Massachusetts'},
      {value: 'MI', label: 'Michigan'},
      {value: 'MN', label: 'Minnesota'},
      {value: 'MS', label: 'Mississippi'},
      {value: 'MO', label: 'Missouri'},
      {value: 'MT', label: 'Montana'},
      {value: 'NE', label: 'Nebraska'},
      {value: 'NV', label: 'Nevada'},
      {value: 'NH', label: 'New Hampshire'},
      {value: 'NJ', label: 'New Jersey'},
      {value: 'NM', label: 'New Mexico'},
      {value: 'NY', label: 'New York'},
      {value: 'NC', label: 'North Carolina'},
      {value: 'ND', label: 'North Dakota'},
      {value: 'OH', label: 'Ohio'},
      {value: 'OK', label: 'Oklahoma'},
      {value: 'OR', label: 'Oregon'},
      {value: 'PA', label: 'Pennsylvania'},
      {value: 'RI', label: 'Rhode Island'},
      // {value: 'SC', label: 'South Carolina'},
      {value: 'SD', label: 'South Dakota'},
      // {value: 'TN', label: 'Tennessee'},
      // {value: 'TX', label: 'Texas'},
      {value: 'UT', label: 'Utah'},
      {value: 'VT', label: 'Vermont'},
      // {value: 'VA', label: 'Virginia'},
      {value: 'WA', label: 'Washington'},
      {value: 'WV', label: 'West Virginia'}
      // {value: 'WI', label: 'Wisconsin'},
      // {value: 'WY', label: 'Wyoming'}
    ]

    console.log(this.props.brand)
    return (
      <div className='row'>
        <div className='col-md-6'>
          <Card title='Details'>
            <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
              <Field component={TextField} name='name' label='Name' required />
              {this.props.showsSlug ? <Field component={TextField} name='slug' label='Slug' /> : null }
              <Field component={TextField} name='website' label='Website' type='url' />
              <Field component={TextField} name='video' label='Video' type='url' placeholder='Youtube Video URL' />
              <Field component={SelectField} name='states' label='States' multi placeholder='' options={states} />
              <Field component={TextField} name='descTitle' label='Description Title' placeholder='Mission' />
              <Field component={EditorTextArea} name='desc' label='Description' cols='5' />
              <Field component={Checkbox} name='active' checkboxTitle='Active' />
              <button type='submit' className='btn btn-primary'>Submit</button>
            </form>
          </Card>
        </div>
        <div className='col-md-6'>
          <Card title='Layout'>
            <label>Product Layout</label>
            <img src={ProductLayoutImage} alt='' />
            <Field component={SelectField} name='productLayout' label='' options={productLayoutOptions} />
            <br />
            <br />
            <label>Image Layout</label>
            <img src={ImageLayoutImage} alt='' />
            <Field component={SelectField} name='imageLayout' label='' options={imageLayoutOptions} />
          </Card>
          <Card title='Logo (400 x 400)'>
            <ImageManager ref={(logoManager) => { this.logoManager = logoManager }} onFilesUpdated={this.props.logoChanged} photos={this.props.brand ? _.compact([this.props.brand ? this.props.brand.logo : null]) : []} />
          </Card>

          <Card title='Header (1110 x 350)'>
            <ImageManager ref={(headerManager) => { this.headerManager = headerManager }} onFilesUpdated={this.props.headerChanged} photos={_.compact([this.props.brand ? this.props.brand.header : null])} />
          </Card>

          <Card title='Featured Image (1100 X 350)'>
            <ImageManager ref={(featuredManager) => { this.featuredManager = featuredManager }} onFilesUpdated={this.props.featuredChanged} photos={_.compact([this.props.brand ? this.props.brand.featuredImage : null])} />
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
export default BrandForm
