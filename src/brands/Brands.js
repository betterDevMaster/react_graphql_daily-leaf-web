import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import './Brands.css'
import _ from 'lodash'
import { geocodeFromCoordinates } from '../lib/GeocodeService'
import Select from 'react-select'

const query = gql`
query ($state: String) {
  stateBrands(state: $state) {
    id
    name
    slug
    logo
    header
  }
}
`

class BrandCard extends Component {
  render () {
    const { brand } = this.props
    return (
      <div key={brand.id} className='col-md-4'>
        <a href={`/brands/${brand.slug}`}>
          <div className='card card-background brand-card'>
            <img className='contained-image contained-brand-image' src={brand.logo} alt='' />
          </div>
        </a>
      </div>
    )
  }
}

class BrandFeatured extends Component {
  render () {
    const { brand } = this.props
    return (
      <div className='col-md-12'>
        <a href={`/brands/${brand.slug}`}>
          <div className='card card-background brand-card brand-card-featured' style={{backgroundImage: `url(${brand.header})`}} />
        </a>
      </div>
    )
  }
}

class Brands extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stateValue: 'ALL'
    }
  }

  componentDidMount () {
    console.log(this.props.address)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.setCurrentLocation(pos.lat, pos.lng)
      }, function (err) {
        console.log(err)
      })
    } else {
      this.setCurrentLocation(this.props.userLocation.lat, this.props.userLocation.lng)
    }
  }

  setCurrentLocation (lat, lng) {
    geocodeFromCoordinates(lat, lng).then((state) => {
      this.props.data.refetch({
        state: state
      }).then((result) => {
        console.log('Result', result)
      })
      this.setState({
        stateValue: state
      })
    })
  }

  setNewValue (state) {
    if (state) {
      this.setState({
        stateValue: state.value
      })
      this.props.data.refetch({
        state: state.value
      })
    }
  }

  render () {
    const { data } = this.props

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    let brands = Object.assign([], data.stateBrands)
    console.log(data)
    let featuredBrand = brands.shift()
    let randomBrands = _.shuffle(brands)
    return (
      <div className='wrapper'>
        <div className='container'>
          <div className='section brand-section'>
            <div className='row'>
              <div style={{zIndex: 9999}}><div className='brandTextHeader'><span className='brandTextHeaderTitle'>Pick your state</span><Select style={{width: 200, zIndex: 999, backgroundColor: 'transparent', border: 'none'}} name='states' label='States' value={this.state.stateValue} placeholder='' onChange={this.setNewValue.bind(this)} options={states} /></div></div>
              {featuredBrand ? <BrandFeatured brand={featuredBrand} /> : null}
              {randomBrands.map((brand) => {
                return (
                  <BrandCard key={brand.id} brand={brand} />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
}

const mapStateToProps = (state) => ({
  userLocation: state.dispensary.userLocation,
  address: state.dispensary.address
})

const BrandRedux = connect(mapStateToProps, mapDispatchToProps)(Brands)

export default graphql(query, {
  options: {
    variables: {
      state: 'OR'
    }
  }
})(BrandRedux)

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
