import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../home/Home'
import DealSearch from '../deals/DealSearch'
import DealView from '../deals/DealView'
import Brands from '../brands/Brands'
import BrandView from '../brands/BrandView'
import Nav from '../components/nav/Nav'
import Footer from '../components/Footer'
import DispensaryView from '../dispensary/DispensaryView'
import ProfileView from '../profile/Profile'
import BlogView from '../blog/Blog'
import BlogPost from '../blog/BlogPost'
import FaqsView from '../static/Faqs'
import TermsView from '../static/Terms'
import PrivacyView from '../static/Privacy'
import PressView from '../static/Press'
import ContactView from '../static/Contact'
import EventListView from '../events/EventList'
import EventView from '../events/EventPage'
import './Main.css'

class Main extends Component {
  render () {
    return (
      <div id='MainComponent'>
        <Nav />
        <div className='content-wrapper'>
          <Switch>
            <Route path='/dispensary/:slug' component={DispensaryView} />
            <Route path='/brands/:slug' component={BrandView} />
            <Route path='/brands' component={Brands} />
            <Route path='/deals/:slug' component={DealView} />
            <Route path='/deals' component={DealSearch} />
            <Route path='/profile' component={ProfileView} />
            <Route path='/news/:slug' component={BlogPost} />
            <Route path='/news' component={BlogView} />
            <Route path='/press' component={PressView} />
            <Route path='/faqs' component={FaqsView} />
            <Route path='/terms' component={TermsView} />
            <Route path='/contact' component={ContactView} />
            <Route path='/events/:slug' component={EventView} />
            <Route path='/events' component={EventListView} />
            <Route path='/conditions' component={TermsView} />
            <Route path='/privacy' component={PrivacyView} />
            <Route path='/' component={Home} />
          </Switch>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Main
