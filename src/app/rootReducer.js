import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import brandReducer from '../brands/brandReducer'
import dispensaryReducer from '../dispensary/dispensaryReducer'
import authReducer from '../components/auth/authenticationReducer'
import dealReducer from '../deals/dealReducer'

export default combineReducers({
  routing: routerReducer,
  form: formReducer,
  brands: brandReducer,
  dispensary: dispensaryReducer,
  auth: authReducer,
  deals: dealReducer
})
