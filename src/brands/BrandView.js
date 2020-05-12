import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import YouTube from 'react-youtube'
import { Helmet } from 'react-helmet'
import DealList from '../deals/DealList'
import Map from '../components/map/Map'
import { VerticalBrandProduct, HalfBrandProduct, ThirdBrandProduct, ForthBrandProduct } from '../brands/BrandProduct'
import { showLogin } from '../components/auth/authenticationReducer'
import _ from 'lodash'

import './Brands.css'

const query = gql`
  query($slug: String!) {
    pinsForBrand(slug: $slug) {
      name
      address
      city
      state
      zip
      phone
      coordinates {
        lat
        lng
      }
    }
    singleBrandBySlug(slug: $slug) {
      id
      name
      header
      logo
      website
      video
      featuredImage
      imageLayout
      productLayout
      favorite
      order
      desc
      images
      descTitle
      seo {
        title
        desc
        tags
      }
      dispensaries {
        id
        slug
        name
        address
        city
        state
        zip
        directions
        coordinates {
          lat
          lng
        }
      }
      deals {
        id
        name
        slug
        image
        discount
        price
        active
      }
      products {
        name
        image
        desc
      }
    }
  }
`

const favoriteBrand = gql`
  mutation ($brandId:ID!) {
    favoriteBrand(brandId: $brandId) {
      id
    }
  }
`

const unfavoriteBrand = gql`
mutation ($brandId:ID!) {
  unfavoriteBrand(brandId: $brandId) {
    id
  }
}
`

class BrandView extends Component {
  componentDidMount () {
    this.props.data.refetch({slug: this.props.match.params.slug})
  }

  componentWillReceiveProps (props) {
    const { data } = props
    const brand = data.singleBrandBySlug
    if (brand && brand.id) {
      window.ga('send', 'event', 'Brand', 'View', `Brand-${brand.id}`)
    }
  }

  favorite () {
    const { user } = this.props
    if (!user) {
      showLogin()
    } else {
      const { data } = this.props
      const brand = data.singleBrandBySlug
      window.ga('send', 'event', 'Brand', 'Favorite', `Brand-${brand.id}`)
      this.props.favorite({variables: {brandId: brand.id}}).then(() => {
        this.props.data.refetch({id: this.props.match.params.id})
      })
    }
  }

  unfavorite () {
    const { user } = this.props
    if (!user) {
      showLogin()
    } else {
      const { data } = this.props
      const brand = data.singleBrandBySlug
      window.ga('send', 'event', 'Brand', 'UnFavorite', `Brand-${brand.id}`)
      this.props.unfavorite({variables: {brandId: brand.id}}).then(() => {
        this.props.data.refetch({id: this.props.match.params.id})
      })
    }
  }

  render () {
    const { data } = this.props
    const brand = data.singleBrandBySlug
    const pins = data.pinsForBrand

    if (data.networkStatus === 1 || !brand) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    const deals = _.filter(brand.deals, (b) => b.active)
    const dispensaries = brand.dispensaries
    let allPins = _.concat(dispensaries, pins)
    let loc = this.props.location
    if (dispensaries.length > 0) {
      loc = dispensaries[0].coordinates
    }
    let ImageLayout = fullImageLayout
    if (brand.imageLayout === 'centered') ImageLayout = centeredImageLayout
    if (brand.imageLayout === 'half') ImageLayout = halfImageLayout
    if (brand.imageLayout === 'thirds') ImageLayout = thirdImageLayout
    if (brand.imageLayout === 'forths') ImageLayout = forthsImageLayout
// table.enum('product_layout', ['horizontal', 'vertical', 'half', 'thirds', 'forths'])

    let BrandLayout = VerticalBrandProduct
    if (brand.productLayout === 'vertical') BrandLayout = VerticalBrandProduct
    if (brand.productLayout === 'half') BrandLayout = HalfBrandProduct
    if (brand.productLayout === 'thirds') BrandLayout = ThirdBrandProduct
    if (brand.productLayout === 'forths') BrandLayout = ForthBrandProduct
    let videoId
    if (brand.video) {
      let videoSplit = brand.video.split('v=')
      if (videoSplit.length > 1) {
        videoId = videoSplit[1]
      }
    }
    return (
      <div>
        <Helmet>
          <title>{brand.seo ? brand.seo.title : brand.name}</title>
          <meta name='description' content={brand.seo ? brand.seo.desc : brand.desc} />
          <meta name='keywords' content={brand.seo ? brand.seo.tags : ''} />
          <meta property='og:image' content={brand.logo ? brand.logo : ''} />
          <meta property='og:title' content={brand.seo ? brand.seo.title : brand.name} />
          <meta property='og:description' content={brand.seo ? brand.seo.desc : brand.desc} />
          <meta property='fb:app_id' content='503836790003423' />
          <meta property='og:type' content='website' />
        </Helmet>
        <div className='page-header header-filter home-header' filter-color='black'>
          <div className='page-header-image' data-parallax='true' style={{ backgroundImage: `url('${brand.header}')` }} />
          <div className='content-center'>
            <div className='container'>
              <img className='brand-header-logo rounded' src={brand.logo} alt={`${brand.name} - logo`} />
              <h1 className='brand-header-title'>{brand.name}</h1>
              {
                brand.favorite ? (
                  <button onClick={this.unfavorite.bind(this)} className='btn btn-secondary brand-favorite-button' type='button'>
                    <i className='now-ui-icons ui-2_favourite-28 brand-favorite-icon' /> UNFOLLOW
                  </button>
                  ) : (
                    <button onClick={this.favorite.bind(this)} className='btn btn-primary brand-favorite-button' type='button'>
                      <i className='now-ui-icons ui-2_favourite-28 brand-favorite-icon' /> FOLLOW
                    </button>
                )
              }
            </div>
          </div>
        </div>
        <div className='wrapper'>
          <div className='container'>
            <section className='brand-view-section'>
              <div className='row'>
                <div className='col-md-6'>
                  <div className='card brand-view-card'>
                    <div className='card-header'>
                      <p className='hero brand-desc-title'>{brand.descTitle}</p>
                    </div>
                    <div className='card-body'>
                      <div className='brand-desc' dangerouslySetInnerHTML={{__html: brand.desc}} />
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <Map dispensaries={allPins} center={loc} />
                </div>
              </div>
            </section>
            {videoId ? <section className='brand-video-section'>
              <div style={{textAlign: 'center'}}>
                <YouTube videoId={videoId} />
              </div>
            </section> : null}
            {brand.images ? <section className='brand-view-section'>
              <ImageLayout images={brand.images} />
            </section>
            : null}
            <section className='brand-view-section'>
              <div className='row'>
                {brand.products.map(product => {
                  return (<BrandLayout product={product} />)
                })}
              </div>
            </section>
            <section className='brand-view-section'>
              <p className='brand-view-section-title'>DEALS</p>
              <DealList deals={deals} />
            </section>
          </div>
        </div>
      </div>
    )
  }
}
const fullImageLayout = (props) => (
  <div className='row'>
    <div className='col-md-12 mr-auto ml-auto'>
      {props.images.map(image => {
        return (<img src={image} alt='' className='image brand-page-image' />)
      })}
    </div>
  </div>
)

const centeredImageLayout = (props) => (
  <div className='row'>
    <div className='col-md-8 mr-auto ml-auto centered'>
      {props.images.map(image => {
        return (<img src={image} alt='' className='image brand-page-image' />)
      })}
    </div>
  </div>
)

const halfImageLayout = (props) => (
  <div className='row'>
    {props.images.map(image => {
      return (
        <div className='col-md-6'>
          <img src={image} alt='' className='image img-full brand-page-image' />
        </div>
      )
    })}
  </div>
)

const thirdImageLayout = (props) => (
  <div className='row'>
    {props.images.map(image => {
      return (
        <div className='col-md-4'>
          <img src={image} alt='' className='image img-full brand-page-image' />
        </div>
      )
    })}
  </div>
)

const forthsImageLayout = (props) => (
  <div className='row'>
    {props.images.map(image => {
      return (
        <div className='col-md-3'>
          <img src={image} alt='' className='image img-full brand-page-image' />
        </div>
      )
    })}
  </div>
)

const mapDispatchToProps = {}
const mapStateToProps = (state) => ({
  user: state.auth.user,
  location: state.dispensary.userLocation
})

const ReduxBrandView = connect(mapStateToProps, mapDispatchToProps)(BrandView)

export default compose(
  graphql(favoriteBrand, {name: 'favorite'}),
  graphql(unfavoriteBrand, {name: 'unfavorite'}),
  graphql(query, {options: {variables: {id: 0}}}))(ReduxBrandView)
