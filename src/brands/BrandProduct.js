import React from 'react'

import './Brands.css'

const BrandProduct = (props) => (
  <div className='row'>
    <div className='col-md-6'>
      <div className='card brand-product-image-container'>
        <img alt='' className='brand-product-image' src={`${props.product.image}`} />
      </div>
    </div>
    <div className='col-md-6'>
      <h3 className='brand-product-title'>{props.product.name}</h3>
      <div className='brand-product-description' dangerouslySetInnerHTML={{__html: props.product.desc}} />
    </div>
  </div>
)

const VerticalProduct = (props) => (
  <div className='card brand-product-image-container'>
    <img alt='' className='brand-product-image' src={`${props.product.image}`} />
    <h3 className='brand-product-title'>{props.product.name}</h3>
    <div className='brand-product-description' dangerouslySetInnerHTML={{__html: props.product.desc}} />
  </div>
)

export const VerticalBrandProduct = (props) => (
  <div className='col-md-12'>
    <VerticalProduct {...props} />
  </div>
)

export const HalfBrandProduct = (props) => (
  <div className='col-md-6'>
    <VerticalProduct {...props} />
  </div>
)

export const ThirdBrandProduct = (props) => (
  <div className='col-md-4'>
    <VerticalProduct {...props} />
  </div>
)

export const ForthBrandProduct = (props) => (
  <div className='col-md-3'>
    <VerticalProduct {...props} />
  </div>
)
export default BrandProduct
