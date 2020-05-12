import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import { generateLineGraph } from '../graphs/Graphs'

class DealAnalytics extends Component {
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
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Deal;ga:eventAction==List;ga:eventLabel==Deal-${dealId}`, 'chart-1-container'))
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Deal;ga:eventAction==View;ga:eventLabel==Deal-${dealId}`, 'chart-2-container'))
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Deal;ga:eventAction==Claim;ga:eventLabel==Deal-${dealId}`, 'chart-3-container'))
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Deal;ga:eventAction==Get%20Directions;ga:eventLabel==Deal-${dealId}`, 'chart-4-container'))
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Deal;ga:eventAction==Unclaim;ga:eventLabel==Deal-${dealId}`, 'chart-5-container'))
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Deal;ga:eventAction==Call;ga:eventLabel==Deal-${dealId}`, 'chart-6-container'))

      graphs.forEach(g => {
        g.execute()
      })
    })
  }

  render () {
    const { data } = this.props
    const deal = data.singleDeal

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    this.renderGraphs(data.serviceAuthToken)

    const breadCrumbs = [
      {title: 'Home', url: '/admin'},
      {title: 'Deals', url: '/admin/deals'},
      {title: deal.name, url: `/admin/deal/${deal.id}`},
      {title: 'Analtyics', active: true}
    ]

    const menuItems = []
    return (
      <Page title={deal.name} menuItems={menuItems} breadcrumbs={breadCrumbs}>
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
            <Card title='Deal UnClaims'>
              <div id='chart-5-container' />
            </Card>
          </div>

          <div className='col-md-6'>
            <Card title='Deal Directions'>
              <div id='chart-4-container' />
            </Card>
          </div>

          <div className='col-md-6'>
            <Card title='Deal Calls'>
              <div id='chart-6-container' />
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
    singleDeal(id: $id) {
      id
      name
    }
  }
`
export default compose(graphql(query, {options: {variables: {id: 0}}}))(DealAnalytics)
