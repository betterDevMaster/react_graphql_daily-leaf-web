import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import gql from 'graphql-tag'
import DealList from '../deals/DealList'
import Map from '../components/map/Map'
import { showLogin } from '../components/auth/authenticationReducer'
import moment from 'moment'
import './Dispensary.css'
import _ from 'lodash'

let query = gql`
  query($slug: String!) {
    singleDispensaryBySlug(slug: $slug) {
      id
      slug
      name
      address
      images
      desc
      phone
      favorite
      directions
      coordinates {
        lat
        lng
      }
      hours {
        order
        day
        startTime
        endTime
      }
      seo {
        title
        desc
        tags
      }
      deals {
        id
        name
        slug
        price
        discount
        active
        expires
        claimCount
        image
        claimed
        link
        linkName
        dispensaries {
          id
          slug
          directions
          phone
        }
      },
      relatedLocations {
        id
        slug
        name
        address
      }
    }
  }
`

const favoriteDispensary = gql`
  mutation ($dispId: ID!) {
    favoriteDispensary(dispensaryId: $dispId) {
      id
    }
  }
`

const unfavoriteDispensary = gql`
  mutation ($dispId: ID!) {
    unfavoriteDispensary(dispensaryId: $dispId) {
      id
    }
  }
`

const RelatedLocation = ({ slug, name, address }) => (
  <div>
    <p className='related-location-title'><a href={`/dispensary/${slug}`} >{name}</a></p>
    <p className='related-location-details'>{address}</p>
  </div>
)

const HeaderDetails = ({dispensary, favorite, unfavorite}) => {
  return (
    <div className='page-header dispensary-page-header'>
      <div className='content-center'>
        <div className='container dispensary-header-container'>
          <p className='dispensary-title'>{dispensary.name}</p>
          <p className='dispensary-address'>{dispensary.address}</p>
          <div className='row'>
            <div className='col-3'>
              <div className='row'>
                <div className='col-md-6'>
                  {
                  dispensary.favorite ? (
                    <button onClick={unfavorite} className='btn btn-secondary hero-button brand-favorite-button' type='button'>
                      <i className='now-ui-icons ui-2_favourite-28 brand-favorite-icon' /> UNFOLLOW
                    </button>) : (
                      <button onClick={favorite} className='btn btn-primary hero-button brand-favorite-button' type='button'>
                        <i className='now-ui-icons ui-2_favourite-28 brand-favorite-icon' /> FOLLOW
                      </button>
                    )
                  }
                </div>
                <div className='col-md-6'>
                  <a href={dispensary.directions} className='btn btn-primary hero-button brand-favorite-button'>
                    <i className='fa fa-compass brand-favorite-icon' /> DIRECTIONS
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DefaultCarouselImage = () => (
  <div className='carousel-item active'>
    <div className='page-header header-filter'>
      <div className='page-header-image' />
    </div>
  </div>
)

class DispensaryView extends Component {
  componentDidMount () {
    this.props.data.refetch({slug: this.props.match.params.slug})
  }

  componentWillReceiveProps (props) {
    const { singleDispensaryBySlug } = props.data
    const dispensary = singleDispensaryBySlug
    if (dispensary) {
      window.ga('send', 'event', 'Dispensary', 'View', `Dispensary-${dispensary.id}`)
    }
  }

  favorite () {
    const { user } = this.props
    if (!user) {
      showLogin()
    } else {
      const { data } = this.props
      const disp = data.singleDispensaryBySlug
      window.ga('send', 'event', 'Dispensary', 'Favorite', `Dispensary-${disp.id}`)
      this.props.favorite({variables: {dispId: disp.id}}).then(() => {
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
      const disp = data.singleDispensaryBySlug
      window.ga('send', 'event', 'Dispensary', 'Unfavorite', `Dispensary-${disp.id}`)
      this.props.unfavorite({variables: {dispId: disp.id}}).then(() => {
        this.props.data.refetch({id: this.props.match.params.id})
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

    const { singleDispensaryBySlug } = data
    const dispensary = singleDispensaryBySlug

    return (
      <div className='wrapper'>
        <Helmet>
          <title>{dispensary.seo ? dispensary.seo.title : dispensary.name}</title>
          <meta name='description' content={dispensary.seo ? dispensary.seo.desc : dispensary.desc} />
          <meta name='keywords' content={dispensary.seo ? dispensary.seo.tags : ''} />
          <meta property='og:image' content={dispensary.images.length > 0 ? dispensary.images[0] : ''} />
          <meta property='og:title' content={dispensary.seo ? dispensary.seo.title : dispensary.name} />
          <meta property='og:description' content={dispensary.seo ? dispensary.seo.desc : dispensary.desc} />
          <meta property='fb:app_id' content='503836790003423' />
          <meta property='og:type' content='website' />
        </Helmet>
        <div id='carouselExampleIndicators' className='carousel slide'>
          <ol className='carousel-indicators'>
            {dispensary.images.map((image, idx) => {
              if (idx === 0) {
                return (
                  <li
                    key={idx}
                    data-target='#carouselExampleIndicators'
                    data-slide-to={`${idx}`} className='active' />
                )
              } else {
                return (
                  <li
                    key={idx}
                    data-target='#carouselExampleIndicators'
                    data-slide-to={`${idx}`} />
                )
              }
            })}
          </ol>
          <div className='carousel-inner' role='listbox'>
            {dispensary.images.length > 0 ? dispensary.images.map((image, idx) => {
              if (idx === 0) {
                return (
                  <div key={idx} className='carousel-item active'>
                    <div className='page-header header-filter'>
                      <div className='page-header-image active' style={{backgroundImage: `url(${image})`, backgroundSize: 'cover'}} />
                    </div>
                  </div>
                )
              } else {
                return (
                  <div key={idx} className='carousel-item'>
                    <div className='page-header header-filter'>
                      <div className='page-header-image' style={{backgroundImage: `url(${image})`, backgroundSize: 'cover'}} />
                    </div>
                  </div>
                )
              }
            }) : <DefaultCarouselImage />}
          </div>
          <a className='carousel-control-prev' href='#carouselExampleIndicators' role='button' data-slide='prev'>
            <i className='now-ui-icons arrows-1_minimal-left' />
          </a>
          <a className='carousel-control-next' href='#carouselExampleIndicators' role='button' data-slide='next'>
            <i className='now-ui-icons arrows-1_minimal-right' />
          </a>
        </div>
        <HeaderDetails dispensary={dispensary} favorite={this.favorite.bind(this)} unfavorite={this.unfavorite.bind(this)} />
        <div className='container'>
          <section className='section dispensary-details'>
            <div className='row'>
              <div className='col-md-8'>
                <div className='card dispensary-card'>
                  <div className='card-body'>
                    <p className='dispensary-about-title'>About</p>
                    <div className='dispensary-about'>
                      {dispensary.desc}
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='card dispensary-card dispensary-sidebar'>
                  <div className='card-body'>
                    <Map height={128} dispensaries={[dispensary]} center={dispensary.coordinates} />
                    <hr />
                    <p className='dispensary-sidebar-header'>Hours</p>
                    {dispensary.hours
                    ? <table>
                      <tbody>
                        {_.sortBy(dispensary.hours, 'order').map(hour => {
                          return (
                            <tr>
                              <td>{hour.day}</td>
                              <td>{moment(new Date(`01/01/2000 ${hour.startTime}`)).format('hh:mm A')} - {moment(new Date(`01/01/2000 ${hour.endTime}`)).format('hh:mm A')}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                      : null}
                    <hr />
                    <p className='dispensary-sidebar-header'>Phone</p>
                    <p>{dispensary.phone}</p>
                    <hr />
                    <p className='dispensary-sidebar-header'>Related Locations</p>
                    {dispensary.relatedLocations.map(location => {
                      return (<RelatedLocation {...location} />)
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <DealList title='DEALS' deals={dispensary.deals.filter(deal => (deal.active))} />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {}
const mapStateToProps = (state) => ({
  user: state.auth.user
})

const ReduxDispensaryView = connect(mapStateToProps, mapDispatchToProps)(DispensaryView)

export default compose(
  graphql(favoriteDispensary, {name: 'favorite'}),
  graphql(unfavoriteDispensary, {name: 'unfavorite'}),
  graphql(query, {options: {variables: {id: 0}}}))(ReduxDispensaryView)
