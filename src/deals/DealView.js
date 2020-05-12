import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import gql from 'graphql-tag'
import Map from '../components/map/Map'
import moment from 'moment'
import DealList from './DealList'
import { showLogin } from '../components/auth/authenticationReducer'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
// import weedIconWhite from '../deals/img/weed-white-icon.svg'
// import weedIconFull from '../deals/img/weed-empty-icon.svg'

import './Deals.css'

const query = gql`
  query ($slug: String!) {
    singleDealBySlug(slug: $slug) {
      id
      name
      image
      otherImages
      desc
      discount
      claimed
      expires
      link
      linkName
      price
      seo {
        title
        desc
        tags
      }
      categories {
        id
        name
      }
      nearbyDeals {
        id
        name
        image
        discount
        slug
        price
        claimed
        expires
        claimCount
        dispensaries {
          id
          slug
          directions
          phone
        }
      },
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
  }
`

const claimMutation = gql`
  mutation ($dealId:ID!) {
    claimDeal(dealId: $dealId) {
      id
    }
  }
`

const unclaimMutation = gql`
  mutation ($dealId:ID!) {
    unclaimDeal(dealId: $dealId) {
      id
    }
  }
`

const DealDispensaryView = ({dispensary}) => (
  <div className='row'>
    <div className='col-6'>
      <p className='deal-dispensary-name'><a href={`/dispensary/${dispensary.slug}`}>{dispensary.name}</a></p>
      <p className='deal-dispensary-address'>{dispensary.address}</p>
    </div>
    <div className='col-6'>
      <Map height={128} dispensaries={[dispensary]} center={dispensary.coordinates} />
    </div>
  </div>
)

class DealView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentImage: null
    }
  }

  componentDidMount () {
    var self = this
    this.props.data.refetch({slug: this.props.match.params.slug}).then(function (data) {
      const deal = data.data.singleDealBySlug
      if (deal) {
        window.ga('send', 'event', 'Deal', 'View', `Deal-${deal.id}`)
        self.setState({
          currentImage: deal.image
        })
      }
      return data
    })
  }

  setImage (image) {
    this.setState({
      currentImage: image
    })
  }

  onDealClick (values) {

  }

  linkClicked () {
    window.ga('send', 'event', 'Deal', 'Link Clicked', `Deal-${this.props.match.params.id}`)
  }

  claimDeal () {
    const { user } = this.props
    if (!user) {
      showLogin()
    } else {
      const { data } = this.props
      const deal = data.singleDealBySlug
      window.ga('send', 'event', 'Deal', 'Claim', `Deal-${deal.id}`)
      this.props.claimDeal({variables: {dealId: deal.id}}).then(() => {
        this.props.data.refetch({id: this.props.match.params.id})
      })
    }
  }

  unclaimDeal () {
    const { user } = this.props
    if (!user) {
      showLogin()
    } else {
      const { data } = this.props
      const deal = data.singleDealBySlug
      window.ga('send', 'event', 'Deal', 'Unclaim', `Deal-${deal.id}`)
      this.props.unclaimDeal({variables: {dealId: deal.id}}).then(() => {
        this.props.data.refetch({id: this.props.match.params.id})
      })
    }
  }

  directionsClick (link) {
    window.ga('send', 'event', 'Deal', 'Get Directions', `Deal-${this.props.match.params.id}`)
    window.open(
      link,
      '_blank'
    )
  }

  render () {
    const { data } = this.props
    const deal = data.singleDealBySlug
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    if (data.networkStatus === 1 || !deal) {
      return <p>Loading</p>
    }

    var percentage = 0
    if (deal.discount && deal.price) {
      percentage = 100 - parseInt((deal.discount / deal.price) * 100, 10)
    }

    let imageGalleryImages = []

    if (deal.image) {
      imageGalleryImages.push({
        original: deal.image,
        thumbnail: deal.image
      })
    }
    for (var i = 0; i < deal.otherImages.length; i++) {
      imageGalleryImages.push({
        original: deal.otherImages[i],
        thumbnail: deal.otherImages[i]
      })
    }

    return (
      <div>
        <Helmet>
          <title>{deal.seo ? deal.seo.title : deal.name}</title>
          <meta name='description' content={deal.seo ? deal.seo.desc : deal.desc} />
          <meta name='keywords' content={deal.seo ? deal.seo.tags : ''} />
          <meta property='og:image' content={deal.image ? deal.image : ''} />
          <meta property='og:title' content={deal.seo ? deal.seo.title : deal.name} />
          <meta property='og:description' content={deal.seo ? deal.seo.desc : deal.desc} />
          <meta property='fb:app_id' content='503836790003423' />
          <meta property='og:type' content='website' />
        </Helmet>
        <div className='wrapper'>
          <div className='container'>
            <section className='deal-top-section'>
              <div className='card deal-single-card'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-md-12 col-lg-6'>
                      {
                        (percentage !== 0) ? <div className='card-percentage-full'>
                          {`${percentage}%`}
                        </div> : ''
                      }
                      <ImageGallery items={imageGalleryImages} showThumbnails={imageGalleryImages.length > 1} showPlayButton={false} autoPlay />
                    </div>
                    <div className='col-md-12 col-lg-6'>
                      <div className='deal-single-body container'>
                        <div className=''>
                          <div className='deal-tag-container'>
                            {deal.categories.map((category, idx) => {
                              return (<span key={idx} className='tag badge badge-neutral deal-tag'>{category.name}</span>)
                            })}
                          </div>
                          <h1 className='deal-single-title'>{deal.name}</h1>
                          <p className='deal-single-discount'>${deal.discount.toFixed(2)} <small>${deal.price.toFixed()}</small></p>
                          {
                            deal.expires ? <p>Expires: {moment(deal.expires).fromNow()}</p> : null
                          }
                          <div className='deal-single-description' dangerouslySetInnerHTML={{__html: deal.desc}} />
                          <hr />
                          <div className='row'>
                            <div className='col-sm-4 deal-single-button-row'>
                              {
                               (deal.link && deal.linkName) ? <LinkButton deal={deal} /> : <DirectionsButton deal={deal} directionsClick={this.directionsClick.bind(this)} />
                              }
                            </div>
                            <div className='col-sm-4 deal-single-button-row'>
                              {
                                (deal.claimed === true) ? <button onClick={this.unclaimDeal.bind(this)} type='button' className='btn btn-secondary btn-block deal-single-button'><i className='fa fa-heart' aria-hidden='true' /> Remove</button>
                                : <button onClick={this.claimDeal.bind(this)} type='button' className='btn btn-primary btn-block deal-single-button'><i className='fa fa-heart-o' aria-hidden='true' /> Favorite</button>
                              }
                            </div>
                            <div className='col-sm-4 deal-single-button-row'>
                              {deal.dispensaries.length > 0 ? <a className='btn btn-primary btn-block deal-single-button' href={`tel:${deal.dispensaries[0].phone.replace(/\s/g, '')}`}><i className='fa fa-phone' aria-hidden='true' /> Call</a>
                              : <a className='btn btn-secondary btn-block deal-single-button'><i className='fa fa-phone' aria-hidden='true' /> Call</a>
                              }

                            </div>
                            <div className='col-sm-4 deal-single-button-row'>
                              <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target='_blank' className='btn btn-round btn-primary btn-facebook btn-block deal-single-button' rel='noopener noreferrer'><i className='fa fa-facebook' /> SHARE</a>
                            </div>
                            <div className='col-sm-4 deal-single-button-row'>
                              <a href={`https://twitter.com/share?url=${encodeURIComponent(document.URL)}`} target='_blank' rel='noopener noreferrer' className='btn btn-round btn-primary btn-twitter btn-block deal-single-button'><i className='fa fa-twitter' /> SHARE</a>
                            </div>
                            <div className='col-sm-4 deal-single-button-row' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className='deal-single-details'>
              <div className='row'>
                <div className='col-md-6 ml-auto mr-auto deal-dispensary-container'>
                  {deal.dispensaries.length > 0 ? <DealDispensaryView dispensary={deal.dispensaries[0]} /> : ''}
                </div>
              </div>
            </section>
          </div>

          <div className='single-nearby-deals-container'>
            <div className='container'>
              <DealList title='Nearby Deals' deals={deal.nearbyDeals} onDealClicked={this.onDealClick.bind(this)} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const DirectionsButton = (props) => {
  let directionsLink = `${props.deal.dispensaries[0].directions}`
  let coordinates = props.deal.dispensaries[0].coordinates
  if ((navigator.platform.indexOf('iPhone') !== -1) ||
       (navigator.platform.indexOf('iPod') !== -1) ||
       (navigator.platform.indexOf('iPad') !== -1)) {
    // directionsLink = directionsLink.replace('https://', 'maps://')
    // directionsLink = directionsLink.replace('/place/?', '/search/?')
    if (directionsLink.indexOf('place_id') !== -1) {
      let placeId = directionsLink.split('place_id:')[1]
      directionsLink = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}&query_place_id=${placeId}`
    }
  }
  return (
  props.deal.dispensaries.length > 0 ? <a target='_blank' href={directionsLink} onClick={e => {
    e.preventDefault()
    props.directionsClick(directionsLink)
  }} className='btn btn-primary btn-block deal-single-button'><i className='fa fa-map' aria-hidden='true' /> Directions</a>
  : <button type='button' className='btn btn-primary btn-block btn-neutral deal-single-button'><i className='fa fa-map' aria-hidden='true' /> Directions</button>
  )
}

const LinkButton = (props) => (
  <a href={props.deal.link} onClick={e => this.linkClicked.bind(this)} class='btn btn-primary btn-block deal-single-button'><i className='fa fa-link' aria-hidden='true' /> {props.deal.linkName}</a>
)

const mapDispatchToProps = {}
const mapStateToProps = (state) => ({
  user: state.auth.user
})

const ReduxDealView = connect(mapStateToProps, mapDispatchToProps)(DealView)

export default compose(
  graphql(claimMutation, { name: 'claimDeal' }),
  graphql(unclaimMutation, { name: 'unclaimDeal' }),
  graphql(query, {options: {variables: {id: 0}}}))(ReduxDealView)
