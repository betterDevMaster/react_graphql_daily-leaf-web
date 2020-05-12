import React, { Component } from 'react'
import Page from './common/page/Page'
import Card from '../components/Card'

class PageTest extends Component {
  render () {
    return (
      <Page title='Page' breadcrumbs={[
        {title: 'Home', url: '/admin'},
        {title: 'PageText', url: '/admin/page-test', active: true}
      ]}>
        <div className='row'>
          <div className='col-md-6'>
            <Card title='Page Test'>
              It's all good
            </Card>
          </div>
        </div>
      </Page>
    )
  }
}

export default PageTest
