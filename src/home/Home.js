import React, { Component } from 'react'
import headerImage from './img/homeHeader.png'
import HomeSearch from './HomeSearch'
import Map from '../components/map/Map'
import DealList from '../deals/DealList'
import { connect } from 'react-redux'
import { setSearchLocation, getGPSLocation } from '../dispensary/dispensaryReducer'
import HomeBrandList from './HomeBrandList'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import _ from 'lodash'
import './Home.css'
import firebase from 'firebase'

export const askForPermissioToReceiveNotifications = async (sendTokenToServer) => {
  try {
    const messaging = firebase.messaging()
    messaging.usePublicVapidKey('BL0O11gBa9zh4-nCbTIWBDuOUul2geo79kM5jTb2Xvc8cYF9fXcZv9fto8M-6rIvPxtf1LW0aH1-4vTdcPrkbp4')
    console.log(messaging)
    messaging.onMessage((payload) => {
      console.log('Message received. ', payload)
    })
    // messaging.setBackgroundMessageHandler((payload) => {
    //   console.log('[firebase-messaging-sw.js] Received background message ', payload)
    //   // Customize notification here
    //   var notificationTitle = 'Daily Leaf Deals'
    //   var notificationOptions = {
    //     body: 'Background Message body.',
    //     icon: '/firebase-logo.png'
    //   }
    //   return window.registration.showNotification(notificationTitle,
    //     notificationOptions)
    // })
    messaging.onTokenRefresh(() => {
      messaging.getToken().then((refreshedToken) => {
        console.log('Token refreshed.')
        sendTokenToServer(refreshedToken)
      }).catch((err) => {
        console.log('Unable to retrieve refreshed token ', err)
      })
    })
    await messaging.requestPermission()
    try {
      const token = await messaging.getToken()
      console.log('token', token)
      sendTokenToServer(token)
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.error(error)
  }
}

var bgStyle = {
  backgroundImage: `url(${headerImage})`
}

const updateUser = gql`
mutation ($userInput:UserInput) {
  updateUser(data:$userInput) {
    id
  }
}`

let query = gql`
query($coordinates: CoordinateInput, $limit: Int) {
  appSettings {
    title
    subtitle
    heroImage
    adUrl
    adImage
  }
  me {
    id
  }
  
  allCategories {
    id
    name
  }

  claimedDealCount
  claimedDealAmount

  topTenDeals(coordinates: $coordinates) {
    id
    name
    image
    price
    slug
    discount
    claimed
    claimCount
    expires
    distance
    dispensaries {
      id
      slug
      name
      address
      city
      phone
      directions
      state
      zip
      coordinates {
        lat
        lng
      }
    }
  }

  mapDeals(coordinates: $coordinates, limit: $limit) {
    id
    name
    image
    price
    discount
    slug
    claimCount
    expires
    claimed
    distance
    dispensaries {
      id
      slug
      name
      phone
      directions
      address
      city
      state
      zip
      coordinates {
        lat
        lng
      }
    }
  }
  
  homeDeals(coordinates: $coordinates, limit: $limit) {
    id
    name
    image
    price
    discount
    slug
    claimCount
    expires
    claimed
    distance
    dispensaries {
      id
      slug
      name
      phone
      directions
      address
      city
      state
      zip
      coordinates {
        lat
        lng
      }
    }
  }
}
`
let firstSet = true

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      renderMap: false
    }
    this.props.getGPSLocation()
  }

  componentDidMount () {
    const { searchLocation, userLocation, user } = this.props
    if (user) {
      window.addEventListener('serviceWorkerLoaded', () => {
        console.log('asking for permissions')
        askForPermissioToReceiveNotifications((token) => {
          this.props.updateUser({
            variables: {
              userInput: {
                webToken: token
              }
            }
          })
          console.log(token)
        })
      })
    }
    const currentLat = parseFloat(searchLocation ? searchLocation.lat : userLocation.lat)
    const currentLng = parseFloat(searchLocation ? searchLocation.lng : userLocation.lng)
    this.props.data.refetch({
      coordinates: {lat: currentLat, lng: currentLng},
      limit: 8
    }).then(() => {
      this.setState({
        renderMap: true
      })
    })
  }

  handleSearch (values) {
    let query = ''
    let category = '-1'
    if (values.query) {
      query = values.query
    }
    if (values.categories) {
      category = values.categories
    }
    const { searchLocation, userLocation } = this.props
    const currentLat = parseFloat(searchLocation ? searchLocation.lat : userLocation.lat)
    const currentLng = parseFloat(searchLocation ? searchLocation.lng : userLocation.lng)
    window.location = `/deals?query=${query}&lat=${currentLat}&lng=${currentLng}&category=${category}`
  }

  handleSelectPlace (selectedPlace) {
    if (selectedPlace) {
      this.props.setSearchLocation(selectedPlace.location)
    }
  }

  fetchNextPage (page) {
    return this.props.data.fetchMore({
      variables: {
        coordinates: {lat: parseFloat(this.props.searchLocation.lat), lng: parseFloat(this.props.searchLocation.lng)},
        page: page,
        limit: 24
      },
      updateQuery: (previousResult, { fetchMoreResult, variables }) => {
        return {
          ...previousResult,
          homeDeals: [...previousResult.homeDeals, ...fetchMoreResult.homeDeals]
        }
      }
    })
  }

  renderMap () {
    var allDeals = []
    const { data } = this.props
    const { topTenDeals, homeDeals, mapDeals } = data
    _.merge(allDeals, topTenDeals, homeDeals, mapDeals)
    const { searchLocation, userLocation } = this.props
    const currentLat = parseFloat(searchLocation ? searchLocation.lat : userLocation.lat)
    const currentLng = parseFloat(searchLocation ? searchLocation.lng : userLocation.lng)
    if (this.state.renderMap) {
      return (<Map center={{lat: currentLat, lng: currentLng}} deals={allDeals} />)
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

    const { searchLocation, userLocation } = this.props

    const currentLat = parseFloat(searchLocation ? searchLocation.lat : userLocation.lat)
    const currentLng = parseFloat(searchLocation ? searchLocation.lng : userLocation.lng)

    if (this._map) {
      this._map.setCenter({lat: currentLat, lng: currentLng})
    }

    const { topTenDeals, homeDeals, mapDeals, claimedDealAmount, claimedDealCount, appSettings } = data
    var allDeals = []
    _.merge(allDeals, topTenDeals, homeDeals, mapDeals)

    let categories = []
    if (data.allCategories) {
      categories = data.allCategories
    }
    if (appSettings.heroImage && appSettings.heroImage.length > 0 && firstSet) {
      firstSet = false
      bgStyle.backgroundImage = `url(${appSettings.heroImage})`
    }

    return (
      <div className='wrapper'>
        <div className='page-header header-filter home-header' filter-color='black'>
          <div className='page-header-image' data-parallax='true' style={bgStyle} />
          <div className='content-center'>
            <div className='container'>
              <p className='home-title'>{appSettings.title}</p>
              <h1 className='home-subtitle'>{appSettings.subtitle}</h1>
              <p className='home-header-stats'>{(39493 + claimedDealCount).toLocaleString()} <small>Deals Redeemed</small></p>
              <p className='home-header-stats'>${(100923 + claimedDealAmount).toLocaleString() } <small>Saved</small></p>
              <HomeSearch categories={categories} onSubmit={this.handleSearch.bind(this)} handleSelectPlace={this.handleSelectPlace.bind(this)} />
            </div>
          </div>
        </div>

        {this.renderMap()}
        <div className='container'>
          <section className='section featured-brand'>
            <a href={appSettings.adUrl} target='_blank'>
              <img src={appSettings.adImage} alt='placholder' />
            </a>
          </section>
          <DealList title='NEW ARRIVALS' deals={_.take(homeDeals, 8)} />
          <div style={{textAlign: 'center'}}>
            <a href='/deals' className='btn btn-primary btn-lg'>Find More Deals</a>
          </div>
          <br />
          <br />
        </div>
        <div className='featured-brand-container'>
          <div className='container'>
            <HomeBrandList />
          </div>
        </div>
        <div className='container'>
          {topTenDeals.length > 0 ? <DealList title='DAILY LEAF TOP 10' deals={topTenDeals} slider /> : null}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setSearchLocation,
  getGPSLocation
}
const mapStateToProps = (state) => ({
  user: state.auth.user,
  searchLocation: state.dispensary.searchLocation,
  userLocation: state.dispensary.userLocation,
  address: state.dispensary.address
})

const HomeRedux = connect(mapStateToProps, mapDispatchToProps)(Home)

export default compose(
  graphql(query, {options: {variables: {limit: 8}}}),
  graphql(updateUser, {name: 'updateUser'})
)(HomeRedux)
