import React, { Component } from 'react'
import './DealCard.css'
import { graphql, compose } from 'react-apollo'
import moment from 'moment'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { showLogin } from '../../components/auth/authenticationReducer'
// import weedEmptyIcon from '../img/weed-empty-icon.svg'
// import weedWhiteIcon from '../img/weed-white-icon.svg'
// import weedIcon from '../img/weed-icon.svg'
import LazyLoad from 'react-lazyload'

/*
import ReactGA from 'react-ga'
ReactGA.initialize('UA-000000-01', {
  debug: true,
  titleCase: false,
  gaOptions: {
    userId: 123
  }
})
*/

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

const HeartIcon = (props) => (
  <span>
    <i className='fa fa-heart' aria-hidden='true' /> {props.count}
  </span>
)

const DistanceIcon = (props) => {
  return (<span>
    <i className='fa fa-map-marker stats' aria-hidden='true' /> {props.distance.toFixed(1)}mi
  </span>)
}

const ExpiresIcon = (props) => {
  return (<span>
    <i className='fa fa-clock-o stats' aria-hidden='true' /> {props.expires}
  </span>)
}

class DealCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hovered: false,
      claimed: null,
      claimCount: null
    }
  }

  componentDidMount () {
    const { deal } = this.props
    window.ga('send', 'event', 'Deal', 'List', `Deal-${deal.id}`)
  }

  onHovered (e) {
    const { deal } = this.props
    if (this.state.claimed === null) {
      this.setState({
        claimed: deal.claimed,
        claimCount: deal.claimCount
      })
    }
    this.setState({
      hovered: true
    })
  }

  onLeaveHover (e) {
    this.setState({
      hovered: false
    })
  }

  onClaimClick (e) {
    const { user } = this.props
    if (!user) {
      showLogin()
    } else {
      const { deal } = this.props
      window.ga('send', 'event', 'Deal', 'Claim', `Deal-${deal.id}`)
      this.props.claimDeal({variables: {dealId: deal.id}}).then(() => {
        this.setState({
          claimed: true,
          claimCount: this.state.claimCount + 1
        })
      })
    }
  }

  onUnClaimClick (e) {
    const { user } = this.props
    if (!user) {
      showLogin()
    } else {
      const { deal } = this.props
      window.ga('send', 'event', 'Deal', 'Unclaim', `Deal-${deal.id}`)
      this.props.unclaimDeal({variables: {dealId: deal.id}}).then(() => {
        this.setState({
          claimed: false,
          claimCount: this.state.claimCount - 1
        })
      })
    }
  }

  onMapClick (e) {
    const { deal } = this.props
    window.ga('send', 'event', 'Deal', 'Get Directions', `Deal-${deal.id}`)
    let directionsLink = `${deal.dispensaries[0].directions}`
    let coordinates = deal.dispensaries[0].coordinates
    if ((navigator.platform.indexOf('iPhone') !== -1) ||
       (navigator.platform.indexOf('iPod') !== -1) ||
       (navigator.platform.indexOf('iPad') !== -1)) {
      if (directionsLink.indexOf('place_id') !== -1) {
        let placeId = directionsLink.split('place_id:')[1]
        // directionsLink = `maps://www.google.com/maps/search/?api=1&query_place_id=${placeId}`
        directionsLink = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}&query_place_id=${placeId}`
      }
    }
    window.open(directionsLink, '_blank')
    // (deal.dispensaries.length > 0) ? window.location = deal.dispensaries[0].directions : null
  }

  onPhoneClick (e) {
    const { deal } = this.props
    window.location = `tel:${deal.dispensaries[0].phone.replace(/\s/g, '')}`
    window.ga('send', 'event', 'Deal', 'Call', `Deal-${this.props.match.params.id}`)
  }

  onImageClick (e) {
    window.location = `/deals/${this.props.deal.slug}`
  }

  render () {
    const { deal } = this.props
    var percentage = 0
    if (deal.discount && deal.price) {
      percentage = 100 - parseInt((deal.discount / deal.price) * 100, 10)
    }
    return (
      <div className='card deal-card' onMouseOver={this.onHovered.bind(this)} onMouseOut={this.onLeaveHover.bind(this)}>
        <div className='card-image'>
          {
            (percentage !== 0) ? <div className='card-percentage'>
              {`${percentage}%`}
            </div> : ''
          }
          <div className={`card-quick-buttons deal-quicklinks-opacity deal-qmuicklinks-position ${this.state.hovered ? 'quicklinks-active' : 'quicklinks-inactive'}`}>
            <div className='btn-group' role='group' aria-label='Quick Links'>
              {(this.state.claimed === true) ? <button onClick={this.onUnClaimClick.bind(this)} type='button' className='btn quick-unlock-button'><i className='fa fa-heart' /></button>
                : <button onClick={this.onClaimClick.bind(this)} type='button' className='btn quick-unlock-button'><i className='fa fa-heart-o' /></button>
              }
              <button onClick={this.onMapClick.bind(this)} type='button' className='btn quick-map-button'><i className='fa fa-map' /></button>
              <button onClick={this.onPhoneClick.bind(this)} type='button' className='btn quick-phone-button'><i className='fa fa-phone' /></button>
            </div>
          </div>
          <LazyLoad height={240}>
            <img onClick={this.onImageClick.bind(this)} className={`img rounded deal-card-image ${this.state.hovered ? 'deal-faded' : ''}`} src={deal.image} alt='' />
          </LazyLoad>
        </div>
        <div className='card-body deal-card-body'>
          {deal.categories ? deal.categories.map(category => {
            return (<h6 className='category text-primary'>{category.name}</h6>)
          }) : null}
          <h5 className='card-title deal-title'>
            <a className='deal-title-link' href={`/deals/${deal.slug}`}>
              {deal.name}
            </a>
          </h5>
          {(deal.discount !== 0 && deal.price !== 0)
          ? <p className='deal-price'>${deal.discount.toFixed(2)} <small>${deal.price.toFixed(2)}</small></p>
          : <p className='deal-price' />}

          {(deal.link && deal.linkName) ? <p className='deal-price'><a onClick={() => {
            window.ga('send', 'event', 'Deal', 'Get Directions', `Deal-${deal.id}`)
          }} href={deal.link}>{deal.linkName}</a></p> : null}

          <p className='deal-card-more-info'><a className='btn btn-sm btn-primary' href={`/deals/${deal.slug}`}>Details</a></p>
          <div className='card-footer'>
            <div className='pull-left stats'>
              {deal.distance ? <DistanceIcon distance={deal.distance} /> : null}
            </div>
            <div className='pull-right stats'>
              {deal.expires ? <ExpiresIcon expires={moment(deal.expires).fromNow()} /> : null}
              <HeartIcon count={this.state.claimCount ? this.state.claimCount : deal.claimCount} />
              {/* <img className='weed-icon-footer' src={weedIcon} alt='' /> {this.state.claimCount ? this.state.claimCount : deal.claimCount } */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

DealCard.defaultProps = {
  deal: {
    categories: [],
    name: '',
    image: 'https://picsum.photos/800',
    discount: 0,
    price: 0,
    id: 0
  }
}

const mapDispatchToProps = {}
const mapStateToProps = (state) => ({
  user: state.auth.user
})

const ReduxDealCard = connect(mapStateToProps, mapDispatchToProps)(DealCard)

export default compose(
  graphql(claimMutation, { name: 'claimDeal' }),
  graphql(unclaimMutation, { name: 'unclaimDeal' }))(ReduxDealCard)
