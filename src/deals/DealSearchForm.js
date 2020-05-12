import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import Nouislider from 'react-nouislider'
import Geosuggest from 'react-geosuggest'
import './Deals.css'

class DealSearchForm extends Component {
  state = {
    miles: 20
  }

  sliderChanged = (value) => {
    let self = this
    if (this.state.miles !== parseInt(value[0], 10)) {
      this.setState({
        miles: parseInt(value[0], 10)    
      })
      self.props.onRadiusChanged(parseInt(value[0], 10))
    }
  }

  render () {
    const { handleSubmit, onSubmit, handleSelectPlace, categories } = this.props
    const { miles } = this.state

  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='row'>
          <div className='col-md-4'>
            <div className='form-group'>
              <Field component='input' className='form-control search-input' name='query' placeholder='What are you looking for?' />
            </div>
          </div>
          <div className='col-md-4'>
            <div className='form-group'>
            <Geosuggest
              onSuggestSelect={handleSelectPlace}
              placeholder='Portland, OR'
              inputClassName='form-control search-input' />
            </div>
          </div>
  
          <div className='col-md-4'>
            <div className='form-group'>
              <Field name='categories' component='select' className='form-control search-input'>
                <option value={-1}>All Categories</option>
                {categories.map(cat => {
                  return (<option key={cat.id} value={cat.id}>{cat.name}</option>)
                })}
              </Field>
            </div>
          </div>
  
        </div>
        <div className='row'>
          <div className='col-md-8'>
            <p className='radius-text'>Radius: <span className='radius-miles'>{miles}mi</span></p>
            <Nouislider
              className='slider-primary'
              range={{min: 0, max: 100}}
              connect={[true, false]}
              step={1}
              onUpdate={this.sliderChanged.bind(this)}
              start={[miles]} />
          </div>
  
          <div className='col-md-4'>
            <button type='submit' id='deal-search-button' className='btn btn-primary btn-block'>SEARCH</button>
          </div>
          <div className='col-md-6'>
            <p className='deal-results-text'>{0} RESULTS</p>
          </div>
          <div id='sortByRow' className='col-md-2'>
            <p className='sort-by-text'>Sort by</p>
          </div>
          <div className='col-md-4'>
            <Field name='order' component='select' className='form-control sort-by-select'>
              <option value='new'>New Arrivals</option>
              <option value='query'>Relevance </option>
              <option value='price-asc'>Price: Low to High </option>
              <option value='price-desc'>Price: High to Low</option>
            </Field>
          </div>
        </div>
      </form>
    )
  }
}

let InitializedDealSearchForm = reduxForm({
  form: 'deal-search-form',
  enableReinitialize: true
})(DealSearchForm)

InitializedDealSearchForm = connect(
  state => ({
    initialValues: state.search
  })
)(InitializedDealSearchForm)

export default InitializedDealSearchForm
