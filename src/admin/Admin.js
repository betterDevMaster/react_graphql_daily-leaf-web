import React, { Component } from 'react'
import Nav from './common/AdminNav'
import BrandList from './brands/BrandList'
import BrandCreate from './brands/BrandCreate'
import BrandEdit from './brands/BrandEdit'
import BrandView from './brands/BrandView'
import BrandAnalytics from './brands/BrandAnalytics'
import { Route, Switch } from 'react-router-dom'
import Deals from './deals/Deals'
import DealCreate from './deals/DealCreate'
import DealEdit from './deals/DealEdit'
import DealAnalytics from './deals/DealAnalytics'
import DealsFeatured from './deals/DealsFeatured'
import DealsArchived from './deals/DealsArchived'
import Dispensaries from './dispensaries/Dispensaries'
import DispensaryCreate from './dispensaries/DispensaryCreate'
import DispensaryView from './dispensaries/DispensaryView'
import DispensaryEdit from './dispensaries/DispensaryEdit'
import DispnesaryAnalytics from './dispensaries/DispensaryAnalytics'
import DealView from './deals/DealView'
import PageTest from './PageTest'
import Dashboard from './dashboard/Dashboard'

import EventList from './events/EventsList'
import EventCreate from './events/EventsCreate'
import EventEdit from './events/EventsEdit'
import EventsView from './events/EventsView'

import SettingsView from './settings/Settings'
import PeopleView from './settings/People'
import AdminView from './settings/AdminView'
import AdminEdit from './settings/AdminEdit'

import { AUTH_ADMIN_TOKEN } from '../components/auth/authenticationReducer'

class Admin extends Component {
  componentWillMount () {
    let token = window.localStorage.getItem(AUTH_ADMIN_TOKEN)
    if (!token) {
      this.props.history.push('/admin/login')
    }
  }

  render () {
    return (
      <div id='AdminComponent' className='container-fluid admin-container'>
        <div className='row'>
          <Nav />
          <main id='admin-main' role='main' className='col-sm-9 ml-sm-auto col-md-10'>
            <Switch>
              <Route exact path='/admin' component={Dashboard} />
              <Route exact path='/admin/brands/new' component={BrandCreate} />
              <Route exact path='/admin/page-test' component={PageTest} />
              <Route exact path='/admin/brand/:id/edit' component={BrandEdit} />
              <Route exact path='/admin/brand/:id/analytics' component={BrandAnalytics} />
              <Route path='/admin/brands' component={BrandList} />
              <Route path='/admin/brand/:id' component={BrandView} />

              <Route exact path='/admin/dispensaries' component={Dispensaries} />
              <Route exact path='/admin/dispensaries/new' component={DispensaryCreate} />
              <Route exact path='/admin/dispensary/:id/edit' component={DispensaryEdit} />
              <Route exact path='/admin/dispensary/:id/analytics' component={DispnesaryAnalytics} />
              <Route exact path='/admin/dispensary/:id' component={DispensaryView} />

              <Route exact path='/admin/deals/featured' component={DealsFeatured} />
              <Route exact path='/admin/deals/archived' component={DealsArchived} />
              <Route exact path='/admin/deals/new' component={DealCreate} />
              <Route exact path='/admin/deals' component={Deals} />
              <Route exact path='/admin/deal/:id/edit' component={DealEdit} />
              <Route exact path='/admin/deal/:id/analytics' component={DealAnalytics} />
              <Route exact path='/admin/deal/:id' component={DealView} />

              <Route exact path='/admin/events/new' component={EventCreate} />
              <Route exact path='/admin/events' component={EventList} />
              <Route exact path='/admin/event/:id/edit' component={EventEdit} />
              <Route exact path='/admin/event/:id' component={EventsView} />

              <Route exact path='/admin/settings' component={SettingsView} />
              <Route exact path='/admin/people' component={PeopleView} />
              <Route exact path='/admin/people/admins/:id' component={AdminView} />

              <Route exact path='/admin/account' component={AdminEdit} />
            </Switch>
          </main>
        </div>
      </div>
    )
  }
}

export default Admin
