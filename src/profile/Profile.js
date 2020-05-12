import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import BlockUI from 'react-block-ui'
import Card from '../components/Card'
import ProfileForm from './ProfileForm'
import './Profile.css'
const query = gql`{
  me {
    id
    firstName
    lastName
  }

  myClaimedDeals {
    id
    slug
    name
    image
    desc
  }

  myFavoriteBrands {
    id
    name
    logo
    desc
  }

  myFavoriteDispensaries {
    id
    slug
    name
    images
    desc
  }
}`

const unfavoriteBrand = gql`
mutation ($brandId:ID!) {
  unfavoriteBrand(brandId: $brandId) {
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

const unfavoriteDispensary = gql`
mutation ($dispId: ID!) {
  unfavoriteDispensary(dispensaryId: $dispId) {
    id
  }
}
`

const updateUser = gql`
mutation ($userInput:UserInput) {
  updateUser(data:$userInput) {
    id
  }
}`

const DataRow = ({dataModel, handleRemove, linkPrefix}) => {
  let dataImage = dataModel.image || dataModel.logo
  if (!dataImage && dataModel.images && dataModel.images.length > 0) {
    dataImage = dataModel.images[0]
  }
  return (
    <div className='deal-row'>
      <div className='row'>
        <div className='col-md-3'>
          <a href={`${linkPrefix}/${dataModel.slug}`}>
            <img width='100%' src={dataImage} alt={`${dataModel.name} - img`} />
          </a>
        </div>
        <div className='col-md-9'>
          <p className='profile-row-title'>
            <a href={`${linkPrefix}/${dataModel.slug}`}>
              {dataModel.name}
            </a>
          </p>
          <p className='profile-row-description'>
            <div dangerouslySetInnerHTML={{__html: dataModel.desc}} />
          </p>
          <div className='deal-row-footer'>
            <p className='pull-right'>{dataModel.date}</p>
            <button onClick={e => handleRemove(dataModel.id)} className='btn btn-primary'>Remove</button>
            <div className='clearfix' />
          </div>
        </div>
      </div>
      <hr />
    </div>
  )
}

class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  removeBrand (brandId) {
    this.props.removeBrand({variables: {brandId: brandId}}).then(() => {
      this.props.data.refetch()
    })
  }

  removeDeal (dealId) {
    this.props.removeDeal({variables: {dealId: dealId}}).then(() => {
      this.props.data.refetch()
    })
  }

  removeDisp (dispId) {
    this.props.removeDispensary({variables: {dispId: dispId}}).then(() => {
      this.props.data.refetch()
    })
  }

  updateProfile (values) {
    let vals = Object.assign({}, values)
    let valid = true
    delete vals.id

    if (vals.password.length === 0) {
      delete vals.password
    }

    if (vals.password) {
      valid = (vals.password === vals.confirmPassword)
    }

    if (valid) {
      delete vals.confirmPassword
      this.setState({
        loading: true
      })
      this.props.updateUser({variables: {userInput: vals}}).then(() => {
        this.props.data.refetch()
        this.setState({
          loading: false
        })
        window.swal('Profile Updated!')
      })
    } else {
      window.swal('Passwords do not match')
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

    const { myFavoriteBrands, myClaimedDeals, myFavoriteDispensaries } = data

    return (
      <div>
        <div className='profile-header'>
          <div className='container'>
            {data.me.firstName} {data.me.lastName}
          </div>
        </div>
        <div className='wrapper'>
          <div className='container'>
            <div className='section profile-nav-section'>
              <Card cardClassName='profile-nav-card'>
                <ul className='profile-nav-pills nav nav-pills nav-pills-secondary nav-justified' role='tablist'>
                  <li className='nav-item'>
                    <a className='nav-link active' data-toggle='tab' href='#deals-tab' role='tablist' aria-expanded='false'>
                        Deals
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' data-toggle='tab' href='#brands-tab' role='tablist' aria-expanded='false'>
                        Brands
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' data-toggle='tab' href='#dispensaries-tab' role='tablist' aria-expanded='true'>
                        Dispensaries
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' data-toggle='tab' href='#settings-tab' role='tablist' aria-expanded='true'>
                        Settings
                    </a>
                  </li>
                </ul>
              </Card>
              <Card cardClassName='profile-nav-card'>
                <div className='tab-content tab-space'>
                  <div className='tab-pane active' id='deals-tab'>
                    {myClaimedDeals.map(deal => {
                      return (<DataRow key={`deal-${deal.id}`} dataModel={deal} handleRemove={this.removeDeal.bind(this)} linkPrefix='/deals' />)
                    })}
                    {(myClaimedDeals.length === 0) ? <h4 className='text-center'>You haven't claimed any deals! Search for <a href='/deals'>deals to find deals around you</a>.</h4> : ''}
                  </div>
                  <div className='tab-pane' id='brands-tab'>
                    {myFavoriteBrands.map(brand => {
                      return (<DataRow key={`brand-${brand.id}`} dataModel={brand} handleRemove={this.removeBrand.bind(this)} linkPrefix='/brands' />)
                    })}
                    {(myFavoriteBrands.length === 0) ? <h4 className='text-center'>You no favorite brands! Visit the <a href='/brands'>brands section to find a product line you love</a>.</h4> : ''}
                  </div>
                  <div className='tab-pane' id='dispensaries-tab'>
                    {myFavoriteDispensaries.map(disp => {
                      return (<DataRow key={`disp-${disp.id}`} dataModel={disp} handleRemove={this.removeDisp.bind(this)} linkPrefix='/dispensary' />)
                    })}
                    {(myFavoriteDispensaries.length === 0) ? <h4 className='text-center'>You no favorite dispensaries! Find <a href='/deals'>deals and favorite the dispensaries that have the best deals</a>.</h4> : ''}
                  </div>
                  <div className='tab-pane' id='settings-tab'>
                    <BlockUI blocking={this.state.loading}>
                      <ProfileForm onSubmit={this.updateProfile.bind(this)} />
                    </BlockUI>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(updateUser, {name: 'updateUser'}),
  graphql(unfavoriteBrand, {name: 'removeBrand'}),
  graphql(unclaimMutation, {name: 'removeDeal'}),
  graphql(unfavoriteDispensary, {name: 'removeDispensary'}),
  graphql(query))(Profile)
