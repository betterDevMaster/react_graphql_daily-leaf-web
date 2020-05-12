import React from 'react'
import { Field, reduxForm } from 'redux-form'
import ImageUpload from '../common/ImageUpload'
import { connect } from 'react-redux'
import { EditorTextArea } from '../common/FormInputs'

const BrandProductForm = ({handleSubmit, submitting, onSubmit, product, brand, imageChanged}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='form-group'>
        <label htmlFor='name'>Title</label>
        <Field component='input' className='form-control' name='name' />
      </div>
      <div className='form-group'>
        <label htmlFor='website'>Description</label>
        <Field component={EditorTextArea} className='form-control' name='desc' />
      </div>
      <div className='form-group'>
        <label htmlFor='logo'>Logo</label>
        <br />
        {product ? <img src={product.image} className='img-thumbnail' alt='' /> : ''}
        <ImageUpload name='logo' onChange={imageChanged} />
      </div>
      <button type='submit' className='btn btn-primary'>Submit</button>
    </form>
  )
}

let InitializedBrandProductForm = reduxForm({
  form: 'brand-product-form',
  enableReinitialize: true
})(BrandProductForm)

InitializedBrandProductForm = connect(
  state => ({
    initialValues: state.brands.editingProduct
  })
)(InitializedBrandProductForm)

export default InitializedBrandProductForm
