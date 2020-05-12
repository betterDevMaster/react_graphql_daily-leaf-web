import React from 'react'
import Geosuggest from 'react-geosuggest'
import { Field, reduxForm } from 'redux-form'

const HomeSearch = ({handleSubmit, submitting, onSubmit, categories, handleSelectPlace}) => (
  <div className='card card-raised card-form-horizontal card-plain' data-background-color=''>
    <div className='card-body'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='row'>
          <div className='col-md-3'>
            <div className='form-group'>
              <Field component='input' className='form-control' name='query' placeholder='What are you looking for?' />
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group homepage-geosuggest'>
              <Geosuggest
                initialValue='Portland, OR'
                onSuggestSelect={handleSelectPlace}
                placeholder='Portland, OR'
                inputClassName='form-control' />
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <Field name='categories' component='select' className='form-control'>
                <option value={-1}>All Categories</option>
                {categories.map(cat => {
                  return (<option key={cat.id} value={cat.id}>{cat.name}</option>)
                })}
              </Field>
            </div>
          </div>
          <div className='col-md-3'>
            <button type='submit' className='btn btn-primary btn-block'>SEARCH</button>
          </div>
        </div>
      </form>
    </div>
  </div>
)

let InitializedHomeSearchForm = reduxForm({
  form: 'home-search',
  enableReinitialize: true
})(HomeSearch)

export default InitializedHomeSearchForm
