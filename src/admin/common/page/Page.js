import React, { Component } from 'react'
import Header from '../AdminHeader'
import { Breadcrumb } from 'react-bootstrap'
import './Page.css'

class Page extends Component {
  render () {
    return (
      <div>
        <Header title={this.props.title} menuItems={this.props.menuItems} />
        {this.props.breadcrumbs ? <Breadcrumb>
          {this.props.breadcrumbs.map((crumb, index) => {
            return (
              <Breadcrumb.Item key={index} href={crumb.url} active={crumb.active}>
                {crumb.title}
              </Breadcrumb.Item>
            )
          })}
        </Breadcrumb>
        : null}
        <div className='container p-3'>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default Page
