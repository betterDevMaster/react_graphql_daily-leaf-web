import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import _ from 'lodash'
import { connect } from 'react-redux'
import { setSearchLocation } from '../dispensary/dispensaryReducer'
import DealList from './DealList'
import DealSearchForm from './DealSearchForm'
import Map from '../components/map/Map'
import './Deals.css'

import queryString from 'query-string'

var mapRef = null
let query = gql`
query ($data: DealSearchInput!) {
  searchDeals(data: $data) {
    id
    name
    image
    slug
    price
    discount
    expires
    distance
    claimCount
    claimed
    dispensaries {
      id
      slug
      name
      address
      city
      state
      zip
      phone
      directions
      coordinates {
        lat
        lng
      }
    }
  }
  allCategories {
    id
    name
  }
}
`

class DealSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      radius: 12,
      query: '',
      category: -1,
      map: null,
      limit: 96,
      centerCoords: null
    }
  }

  handleSelectPlace (selectedPlace) {
    if (selectedPlace) {
      this.props.setSearchLocation(selectedPlace.location)
      this.handleSearch({
        query: this.state.query,
        coordinates: selectedPlace.location,
        categories: this.state.category
      })
    }
  }

  handleSearch (values) {
    const { userLocation, searchLocation } = this.props
    const { radius } = this.state
    this.setState({...this.state, query: values.query, category: values.categories})
    this.setMapCenter(searchLocation || userLocation)
    this.props.data.refetch({data: {
      query: values.query,
      coordinates: searchLocation || userLocation,
      radius: radius,
      categories: [values.categories],
      order: values.order
    }}).then(function (data) {
      return data
    })
  }

  onMapLoaded (mapObject) {
    if (!this.state.map) {
      mapRef = mapObject
      // this.setState({ map: mapObject})
    }
  }

  handleSliderUpdate (value) {
    this.setState({ radius: value })
    if (mapRef) {
      mapRef.setZoom(Math.round(14 - Math.log(value) / Math.LN2))
    }
  }

  setMapCenter (latLng) {
    if (mapRef) {
      mapRef.setCenter(latLng)
    }
  }

  componentDidMount () {
    const { userLocation } = this.props
    const { radius } = this.state
    let query = queryString.parse(window.location.search)
    if (query && ((query.lat && query.lng) || query.query || query.categories)) {
      this.props.data.refetch({data: {
        query: query.query,
        coordinates: {
          lat: parseFloat(query.lat),
          lng: parseFloat(query.lng)
        },
        categories: [query.categories],
        radius: radius
      }}).then(data => {
        return data
      })
    } else {
      this.props.data.refetch({data: {
        query: '',
        coordinates: userLocation,
        radius: radius
      }}).then(function (data) {
        return data
      })
    }
  }

  render () {
    const { data } = this.props
    const { searchDeals, allCategories } = data
    const { radius } = this.state

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    return (
      <div className='wrapper'>
        <div className='container-fluid deal-search-header-container'>
          <div className='row'>
            <div className='col-md-6'>
              <div className='container'>
                <div className='row deal-header-row'>
                  <div className='col-12'>
                    <p className='brand-view-section-title'>SEARCH</p>
                    <DealSearchForm
                      handleSelectPlace={this.handleSelectPlace.bind(this)}
                      onSubmit={this.handleSearch.bind(this)}
                      onRadiusChanged={this.handleSliderUpdate.bind(this)}
                      categories={allCategories}
                      sliderValues={this.state.sliderValues} />
                  </div>
                </div>
              </div>
            </div>
            <div className='deal-search-map-container'>
              <Map
                ref={(map) => { this.map = map }}
                height={707}
                deals={searchDeals}
                center={this.state.centerCoords}
                onMapLoaded={this.onMapLoaded.bind(this)}
                zoom={radius} />
            </div>
          </div>
        </div>
        <div className='container top-two-deals'>
          {searchDeals.length === 1 ? (<DealList deals={[searchDeals[0]]} />) : null}
          {searchDeals.length >= 2 ? (<DealList deals={[searchDeals[0], searchDeals[1]]} />) : null }
        </div>
        <div className='container'>
          <DealList deals={_.slice(searchDeals, 2)} />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setSearchLocation
}
const mapStateToProps = (state) => ({
  userLocation: state.dispensary.userLocation,
  searchLocation: state.dispensary.searchLocation
})

const DSearch = connect(mapStateToProps, mapDispatchToProps)(DealSearch)

export default graphql(query, {
  options: {
    variables: {
      data: {
        query: '',
        coordinates: {
          lat: 0,
          lng: 0
        }
      }
    }
  }
})(DSearch)
