import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import DispensaryList from './DispensaryList'
import Page from '../common/page/Page'
import Card from '../../components/Card'
import './Dispensary.css'

const query = gql`{
  allDispensaries {
    id
    name
    address
    phone
    deals {
      id
    }
  }
}`

const menuItems = [
  {title: 'New', icon: 'now-ui-icons ui-1_simple-add', link: '/admin/dispensaries/new'}
]

class Dispensaries extends Component {
  render () {
    const { data } = this.props

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    return (
      <Page title='Dispensaries' menuItems={menuItems} breadcrumbs={breadCrumbs}>
        <Card title='Dispensaries'>
          <DispensaryList dispensaries={data.allDispensaries} />
        </Card>
      </Page>
    )
  }
}

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'Dispensaries', url: '/admin/dispensaries', active: true}
]

export default graphql(query)(Dispensaries)
