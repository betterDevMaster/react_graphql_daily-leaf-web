import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import { generateLineGraph } from '../graphs/Graphs'

class DispensaryAnalytics extends Component {
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
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Dispensary;ga:eventAction==View;ga:eventLabel==Dispensary-${dealId}`, 'chart-1-container'))
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Dispensary;ga:eventAction==Favorite;ga:eventLabel==Dispensary-${dealId}`, 'chart-2-container'))
      graphs.push(generateLineGraph('ga:totalEvents', `ga:eventCategory==Dispensary;ga:eventAction==UnFavorite;ga:eventLabel==Dispensary-${dealId}`, 'chart-3-container'))
      graphs.forEach(g => {
        g.execute()
      })
    })
  }

  render () {
    const { data } = this.props
    const dispensary = data.singleDispensary

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    this.renderGraphs(data.serviceAuthToken)

    const breadCrumbs = [
      {title: 'Home', url: '/admin'},
      {title: 'Dispensaries', url: '/admin/dispensaries'},
      {title: dispensary.name, url: `/admin/dispensary/${dispensary.id}`},
      {title: 'Analtyics', active: true}
    ]

    const menuItems = []
    return (
      <Page title={dispensary.name} menuItems={menuItems} breadcrumbs={breadCrumbs}>
        <div className='row'>
          <div className='col-md-6'>
            <Card title='Dispensary Views'>
              <div id='chart-1-container' />
            </Card>
          </div>

          <div className='col-md-6'>
            <Card title='Dispensary Favorites'>
              <div id='chart-2-container' />
            </Card>
          </div>

          <div className='col-md-6'>
            <Card title='Dispensary Un Favorites'>
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
    singleDispensary(id: $id) {
      id
      name
    }
  }
`
export default compose(graphql(query, {options: {variables: {id: 0}}}))(DispensaryAnalytics)
