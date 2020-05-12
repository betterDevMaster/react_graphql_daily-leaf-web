import React, { Component } from 'react'
import Logo from '../components/nav/images/logo@3x.png'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'
import request from 'superagent'
import server from '../config/server'
let query = gql` {
  posts {
    id
    title
    slug
  }

  claimedDealCount
  claimedDealAmount

  getEvents {
    title
    startDate
    slug
  }
}
`

let footerMutation = gql`
mutation($email: String!) {
  footerContact(email: $email)
}
`

class FooterItem {
  constructor (props) {
    this.id = props.ID
    this.title = props.title.rendered
    this.link = props.link
    this.date = new Date()
  }
}

class EventItem {
  constructor (props) {
    this.id = props.id
    this.title = props.title
    this.link = props.url
    this.date = new Date(props.start_date)
  }
}
class Footer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      events: [],
      posts: []
    }
  }

  componentDidMount () {
    request.get(`${server.blog}/wp-json/tribe/events/v1/events?start_date=2018-04-14&per_page=5`).then(response => {
      let evnts = []
      if (response.body && response.body.events) {
        response.body.events.forEach(evnt => {
          evnts.push(new EventItem(evnt))
        })
      }
      this.setState({
        events: evnts
      })
    })

    request.get(`${server.blog}/wp-json/wp/v2/posts/?`).then(response => {
      let posts = []
      if (response.body) {
        response.body.forEach(post => {
          posts.push(new FooterItem(post))
        })
      }
      this.setState({
        posts: posts
      })
    })
  }

  submitSignup () {
    this.props.mutate({
      variables: {
        email: window.$('#footerEmailInput').val()
      }
    }).then(() => {
      window.$('#footerEmailInput').val('')
      window.swal('Success', `Thank you for signing up for our newsletter`, 'success')
    })
  }

  render () {
    const { data } = this.props
    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    const { claimedDealAmount, claimedDealCount } = data

    let footerEvents = this.state.events.slice(0, 5)
    let footerPosts = this.state.posts.slice(0, 5)

    return (
      <footer className='footer footer-big' data-background-color='black'>
        <div className='container'>
          <div className='content'>
            <div className='row'>
              <div className='col-md-3'>
                <div className='footer-logo-container'>
                  <img width={103} src={Logo} alt='Daily Leaf Logo Footer' />
                </div>
                <ul className='social-buttons'>
                  <li>
                    <a href='https://www.facebook.com/dailyleafdeals' className='btn btn-icon btn-facebook btn-round' target='_blank' rel='noopener noreferrer'>
                      <i className='fa fa-facebook-square' />
                    </a>
                  </li>
                  <li>
                    <a href='https://twitter.com/the_dailyleaf' className='btn btn-icon btn-twitter btn-round' target='_blank' rel='noopener noreferrer'>
                      <i className='fa fa-twitter' />
                    </a>
                  </li>
                  <li>
                    <a herf='https://www.youtube.com/channel/UC7tEs-h52jMQaYwVfwIt0Jg' className='btn btn-icon btn-google btn-round' target='_blank' rel='noopener noreferrer'>
                      <i className='fa fa-youtube' />
                    </a>
                  </li>
                  <li>
                    <a href='https://www.instagram.com/the.dailyleaf/' className='btn btn-icon btn-instagram btn-round' target='_blank' rel='noopener noreferrer'>
                      <i className='fa fa-instagram' />
                    </a>
                  </li>
                </ul>
                <br />
                <h5>{(39493 + claimedDealCount).toLocaleString()} <small className='text-muted'>Deals</small></h5>
                <h5>${(100923 + claimedDealAmount).toLocaleString()} <small className='text-muted'>Money Saved</small></h5>
                <ul>
                  <li>
                    <a href='/420-giveaway' className='text-muted'>
                     Contest
                    </a>
                  </li>
                  <li>
                    <a href='/terms' className='text-muted'>
                     Terms and Conditions
                    </a>
                  </li>
                </ul>
              </div>
              <div className='col-md-3'>
                <h5>SUBSCRIBE TO OUR NEWSLETTER</h5>
                <p>Join our newsletter and get news in your inbox every week!</p>
                <input id='footerEmailInput' className='form-control' type='text' /><button onClick={this.submitSignup.bind(this)} className='btn btn-primary'>Submit</button>
              </div>
              <div className='col-md-3'>
                <h5>EVENTS</h5>
                <ul className='links-vertical'>
                  {footerEvents.map((ev, index) => {
                    return (
                      <li key={index}>
                        <a href={ev.link} className='text-muted'>
                          {ev.title}<br />
                          <i className='now-ui-icons ui-1_calendar-60' /> {moment(ev.date).format('MMM DD, YYYY hh:mm A')}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className='col-md-3'>
                <h5>NEWS</h5>
                <div className='social-feed'>
                  <ul className='links-vertical'>
                    {footerPosts.map((post, idx) => {
                      return (
                        <li key={idx}>
                          <a className='text-muted' href={post.link}>{post.title}</a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className='copyright'>
              Copyright ©
              <script>
                  document.write(new Date().getFullYear())
              </script>2019 Daily Leaf Deals All Rights Reserved.
          </div>
        </div>
      </footer>
    )
  }
}

export default compose(graphql(footerMutation), graphql(query))(Footer)
