import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Page from '../static/Page'
import './Events.css'
import moment from 'moment'

let query = gql`
  query ($date: String) {
    getEvents(date: $date) {
      id
      title
      startDate
      endDate
      place
      video
      image
      slug
      cost
      address
      tags
      content
  }
}
`

class EventList extends Component {
  render () {
    const { data } = this.props
    const { getEvents } = data

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    return (
      <Page>
        <div className='row'>
          <div className='col-md-12'>
            <h2 className='title'>Events</h2>
            <h4 className='description'>
              Upcoming weed events in January
            </h4>
            <div className='row'>
              {getEvents.map((ev) => {
                return (
                  <div className='col-md-6 col-lg-4'>
                    <div className='card card-blog card-plain'>
                      <div className='card-image'>
                        <a href={`/events/${ev.slug}`}>
                          <img className='img rounded img-raised event-image' src={ev.image} alt='' />
                        </a>
                      </div>
                      <div className='card-body'>
                        <h5 className='card-title'>
                          <a href={`/events/${ev.slug}`}>{ev.title}</a>
                        </h5>
                        <p className='card-description'>
                          {`${ev.content.substring(0, 100)}...`}
                        </p>
                        <div className='card-footer'>
                          <div className='stats stats-left'>
                            <i className='now-ui-icons tech_watch-time' /> {moment(ev.startDate).format('MM/DD/YYYY hh:mm')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

export default graphql(query, {
  options: {
    variables: {
      date: new Date()
    }
  }
})(EventList)
