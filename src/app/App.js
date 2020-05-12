import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import server from '../config/server'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { Helmet } from 'react-helmet'

import './App.css'
import Main from '../main/Main'
import Admin from '../admin/Admin'
import AdminLogin from '../admin/auth/AdminLogin'

const httpLink = createHttpLink({
  uri: `${server.url}/graphql`
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = window.localStorage.getItem('DailyLeaf::Token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const adminAuthLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = window.localStorage.getItem('DailyLeaf::AdminToken')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

const adminClient = new ApolloClient({
  link: adminAuthLink.concat(httpLink),
  cache: new InMemoryCache()
})

class App extends Component {
  render () {
    return (
      <div className='AppComponent'>
        <Helmet>
          <meta name='description' content='The Daily Leaf Is The Leader In Marijuana Deals. Shop from hundreds of Dispensaries all the State Of Oregon. Portland Marijuana Deals:'/>
        </Helmet>
        <Switch>
          <Route exact path='/admin/login' component={AdminLogin} />
          <Route path='/admin' render={(props) => {
            return (
              <ApolloProvider client={adminClient}>
                <Admin {...props} />
              </ApolloProvider>
            )
          }} />
          <Route path='/' render={(props) => {
            return (
              <ApolloProvider client={client}>
                <Main {...props} />
              </ApolloProvider>
            )
          }} />
        </Switch>
      </div>
    )
  }
}

export default App
