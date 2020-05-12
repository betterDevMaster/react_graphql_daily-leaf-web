import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Map from '../components/map/Map'
const query = gql`
  query ($slug: String!) {
    singleEvent(slug: $slug) {
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

class EventPage extends Component {
  componentDidMount () {
    this.props.data.refetch({slug: this.props.match.params.slug})
  }

  scrollToArticle (e) {
    e.preventDefault()
    let $ = window.$
    $('html, body').animate({ scrollTop: 750 }, 'slow')
  }

  render () {
    const { data } = this.props

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    const { singleEvent } = data

    if (!singleEvent) {
      return <h2>Event Not Found</h2>
    }

    return (
      <div className='wrapper blog-post'>
        <div className='page-header page-header-small'>
          <div className='page-header-image' data-parallax='true' style={{backgroundImage: `url('${singleEvent.image}')`}} />
          <div className='content-center'>
            <div className='row'>
              <div className='col-md-8 ml-auto mr-auto text-center'>
                <h2 className='title'>{singleEvent.title}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className='section'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <div className='button-container'>
                  <a href={`https://twitter.com/share?url=${encodeURIComponent(document.URL)}`} target='_blank' className='btn btn-icon btn-lg btn-twitter btn-round' rel='noopener noreferrer'>
                    <i className='fa fa-twitter' />
                  </a>
                  <a href='https://www.facebook.com/sharer/sharer.php?u=#url' target='_blank' className='btn btn-icon btn-lg btn-facebook btn-round' rel='noopener noreferrer'>
                    <i className='fa fa-facebook-square' />
                  </a>
                  <a href={`https://plus.google.com/share?url=${encodeURIComponent(document.URL)}`} target='_blank' className='btn btn-icon btn-lg btn-google btn-round' rel='noopener noreferrer'>
                    <i className='fa fa-google' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
          <div className='container'>
            <div className='row'>
              <div className='col-md-8 ml-auto mr-auto'>
                <div className='row'>
                  <div className='col-md-6'>
                    <h5>When</h5>
                    <p className='post-excerpt'>
                      {(new Date(singleEvent.startDate)).toDateString()} {singleEvent.endDate ? ` - ${new Date(singleEvent.endDate).toDateString()}` : null}
                    </p>

                    <h5>Where</h5>
                    <p className='post-excerpt'>{singleEvent.place}</p>
                    <p className='post-excerpt'>{singleEvent.address}</p>
                    <Map dispensaries={[]} />
                  </div>
                  <div className='col-md-6'>
                    <h5>Description</h5>
                    <div id='post-content' className='post-excerpt' dangerouslySetInnerHTML={{__html: singleEvent.content}} />
                  </div>
                </div>
                <section />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(graphql(query, {options: {variables: {slug: ''}}}))(EventPage)
