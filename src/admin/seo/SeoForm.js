
import React, { Component } from 'react'
import { Field } from 'redux-form'
import Card from '../../components/Card'
import { TextField, EditorTextArea } from '../common/FormInputs'

class SEOForm extends Component {
  // ({handleSubmit, submitting, onSubmit, imageChanged, dispensaries, otherImageChanged}) => (
  render () {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
        <Card title='SEO'>
          <Field component={TextField} className='form-control' name='title' label='Title' />
          <Field component={EditorTextArea} className='form-control' name='desc' label='Description' />
          <Field component={EditorTextArea} className='form-control' name='tags' label='Keywords' />
        </Card>
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    )
  }
}

export default SEOForm
