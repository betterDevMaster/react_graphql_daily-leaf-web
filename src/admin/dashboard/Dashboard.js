import React, { Component } from 'react'
import Page from '../common/page/Page'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Card from '../../components/Card'
import './Dashboard.css'
import { generateLineGraph, Stat } from '../graphs/Graphs'

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'Dashboard', url: '/admin/dashboard', active: true}
]

class Dashboard extends Component {
  componentWillMount () {
    const admin = JSON.parse(window.localStorage.getItem('DailyLeaf::Admin'))
    if (admin && admin.role === 'owner') {
      window.location = '/admin/deals'
    }
  }

  renderGraphs (token) {
    window.gapi.analytics.ready(() => {
      window.gapi.analytics.auth.authorize({
        'serverAuth': {
          'access_token': token
        }
      })
      let graphs = []
      graphs.push(generateLineGraph('ga:totalEvents', 'ga:eventCategory==Deal;ga:eventAction==List', 'chart-1-container'))
      graphs.push(generateLineGraph('ga:totalEvents', 'ga:eventCategory==Deal;ga:eventAction==View', 'chart-2-container'))
      graphs.push(generateLineGraph('ga:totalEvents', 'ga:eventCategory==Deal;ga:eventAction==Claim', 'chart-3-container'))
      graphs.push(generateLineGraph('ga:totalEvents', 'ga:eventCategory==Deal;ga:eventAction==Get%20Directions', 'chart-4-container'))
      graphs.push(generateLineGraph('ga:totalEvents', 'ga:eventCategory==Brand;ga:eventAction==View', 'chart-5-container'))
      graphs.push(generateLineGraph('ga:totalEvents', 'ga:eventCategory==Brand;ga:eventAction==Favorite', 'chart-6-container'))
      graphs.push(generateLineGraph('ga:totalEvents', 'ga:eventCategory==Dispensary;ga:eventAction==View', 'chart-7-container'))
      graphs.push(generateLineGraph('ga:totalEvents', 'ga:eventCategory==Dispensary;ga:eventAction==Favorite', 'chart-8-container'))

      graphs.forEach(g => {
        g.execute()
      })
    })
  }

  render () {
    const { data } = this.props
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }

    this.renderGraphs(data.serviceAuthToken)

    const { deals, dispensaries, activeDeals, claimedDeals, inactiveDeals, users, events, brands } = data.topLevelAnalytics
    return (
      <Page title='People' breadcrumbs={breadCrumbs} menuItems={[]} >
        <div className='col-md-12'>
          <div className='row'>
            <Stat icon='now-ui-icons business_chart-bar-32' value={users} title='Users' />
            <Stat icon='now-ui-icons business_chart-bar-32' value={dispensaries} title='Dispensaries' />
            <Stat icon='now-ui-icons business_chart-bar-32' value={brands} title='Brands' />
            <Stat icon='now-ui-icons business_chart-bar-32' value={events} title='Events' />
            <Stat icon='now-ui-icons business_chart-bar-32' value={deals} title='Deals' />
            <Stat icon='now-ui-icons business_chart-bar-32' value={claimedDeals} title='Claimed Deals' />
            <Stat icon='now-ui-icons business_chart-bar-32' value={activeDeals} title='Active Deals' />
            <Stat icon='now-ui-icons business_chart-bar-32' value={inactiveDeals} title='Inactive Deals' />
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <Card title='Deal Impressions'>
                <div id='chart-1-container' />
              </Card>
            </div>

            <div className='col-md-6'>
              <Card title='Deal Page Views'>
                <div id='chart-2-container' />
              </Card>
            </div>

            <div className='col-md-6'>
              <Card title='Deal Claims'>
                <div id='chart-3-container' />
              </Card>
            </div>

            <div className='col-md-6'>
              <Card title='Deal Directions'>
                <div id='chart-4-container' />
              </Card>
            </div>

            <div className='col-md-6'>
              <Card title='Brand Views'>
                <div id='chart-5-container' />
              </Card>
            </div>

            <div className='col-md-6'>
              <Card title='Brand Favorites'>
                <div id='chart-6-container' />
              </Card>
            </div>

            <div className='col-md-6'>
              <Card title='Dispensary Views'>
                <div id='chart-7-container' />
              </Card>
            </div>

            <div className='col-md-6'>
              <Card title='Dispensary Favorites'>
                <div id='chart-8-container' />
              </Card>
            </div>

          </div>
        </div>
      </Page>
    )
  }
}

const query = gql`{
  topLevelAnalytics {
    deals
    dispensaries
    activeDeals
    inactiveDeals
    claimedDeals
    users
    events
    brands
    dispensaries
  }
  serviceAuthToken
}
`

export default graphql(query)(Dashboard)
