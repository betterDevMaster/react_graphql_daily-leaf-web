import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import { generateLineGraph } from '../graphs/Graphs'

class BrandAnalytics extends Component {
  componentDidMount () {
    this.props.data.refetch({id: this.props.match.params.id})
  }

  renderGraphs (token) {
    const dealId = this.props.match.params.id
    window.gapi.analytics.ready(() => {
      window.gapi.analytics.auth.authorize({
        'serverAuth': {
          'access_token': token
        }
      })
      let graphs = []
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Brand;ga:eventAction==View;ga:eventLabel==Brand-${dealId}`, 'chart-1-container'))
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Brand;ga:eventAction==Favorite;ga:eventLabel==Brand-${dealId}`, 'chart-2-container'))
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Brand;ga:eventAction==UnFavorite;ga:eventLabel==Brand-${dealId}`, 'chart-3-container'))
      graphs.forEach(g => {
        g.execute()
      })
    })
  }

  render () {
    const { data } = this.props
    const brand = data.singleBrand

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    this.renderGraphs(data.serviceAuthToken)

    const breadCrumbs = [
      {title: 'Home', url: '/admin'},
      {title: 'Brands', url: '/admin/brands'},
      {title: brand.name, url: `/admin/brand/${brand.id}`},
      {title: 'Analtyics', active: true}
    ]

    const menuItems = []
    return (
      <Page title={brand.name} menuItems={menuItems} breadcrumbs={breadCrumbs}>
        <div className='row'>
          <div className='col-md-6'>
            <Card title='Brand Views'>
              <div id='chart-1-container' />
            </Card>
          </div>

          <div className='col-md-6'>
            <Card title='Brand Favorites'>
              <div id='chart-2-container' />
            </Card>
          </div>

          <div className='col-md-6'>
            <Card title='Brand Un Favorites'>
              <div id='chart-3-container' />
            </Card>
          </div>

        </div>
      </Page>
    )
  }
}

const query = gql`
  query($id: ID!) {
    serviceAuthToken
    singleBrand(id: $id) {
      id
      name
      header
      logo
    }
  }
`
export default compose(graphql(query, {options: {variables: {id: 0}}}))(BrandAnalytics)
