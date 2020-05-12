import React, { Component } from 'react'
import Page from '../common/page/Page'
import Card from '../../components/Card'

const menuItems = [
  {title: 'New', icon: 'now-ui-icons ui-1_simple-add', link: '/admin/events/new'}
]

const breadCrumbs = [
  {title: 'Home', url: '/admin'},
  {title: 'Events', url: '/admin/events', active: true}
]

class EventsCreate extends Component {
  render () {
    return (
      <Page title='Events' breadcrumbs={breadCrumbs} menuItems={menuItems} >
        <Card title='Events'>
          You do not have permission to view this page
        </Card>
      </Page>
    )
  }
}

export default EventsCreate
