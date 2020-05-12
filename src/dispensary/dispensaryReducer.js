
import moment from 'moment'
/*
const NEW_YORK_LOCATION = {
  lat: 40.723218799,
  lng: -73.9988697
}
*/
const PORTLAND_LOCATION = {
  lat: 45.523064,
  lng: -122.676483
}

export const DEFAULT_LOCATION = {
  lat: PORTLAND_LOCATION.lat,
  lng: PORTLAND_LOCATION.lng
}
const initialState = {
  editingDispensary: null,
  userLocation: {
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng
  },
  searchLocation: null,
  address: {
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    directions: '',
    lat: 0,
    lng: 0
  }
}
const google = window.google
const navigator = window.navigator
const document = window.document
const placeIdUrlPrefix = 'https://maps.google.com/maps/place/?q=place_id:'

export const SET_GOOGLE_AUTOCOMPLETE_LOCATION = 'SET_GOOGLE_AUTOCOMPLETE_LOCATION'
export const SET_USER_LOCATION = 'SET_USER_LOCATION'
export const SET_SEARCH_LOCATION = 'SET_SEARCH_LOCATION'
export const SET_EDITING_DISPENSARY = 'SET_EDITING_DISPENSARY'

export const updateSelectedAddress = (googleComponents) => {
  return (dispatch) => {
    var addressData = {}
    if (googleComponents && googleComponents.gmaps) {
      addressData = parseAddressComonents(googleComponents.gmaps.address_components)
      addressData.directions = `${placeIdUrlPrefix}${googleComponents.placeId}`
      addressData.lat = googleComponents.location.lat
      addressData.lng = googleComponents.location.lng
      return placeDetails(googleComponents.placeId).then(details => {
        addressData.name = details.name
        addressData.phone = details.international_phone_number
        addressData.url = details.website
        addressData.images = []
        if (details.photos) {
          details.photos.forEach(photo => {
            addressData.images.push(photo.getUrl({maxWidth: 1440, maxHeight: 1440}))
          })
        }
        dispatch(setGoogleLocation(addressData))
      })
    }
  }
}

export const editDispensary = (disp) => {
  return {
    type: SET_EDITING_DISPENSARY,
    payload: disp
  }
}

export const getGPSLocation = () => {
  return (dispatch) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        let currentDistance = getDistanceFromLatLonInKm(pos.lat, pos.lng, DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng) * 0.6213712
        if (currentDistance < 500) {
          dispatch(setUserLocation(pos))
        }
      }, function (err) {
        console.log(err)
      })
    } else {
      // Browser doesn't support Geolocation
    }
  }
}

export const setGoogleLocation = (newAddress) => {
  return {
    type: SET_GOOGLE_AUTOCOMPLETE_LOCATION,
    payload: newAddress
  }
}
const ADMIN_ACTION_HANDLERS = {
  [SET_GOOGLE_AUTOCOMPLETE_LOCATION]: (state, action) => {
    return ({ ...state, address: action.payload })
  },
  [SET_USER_LOCATION]: (state, action) => {
    return ({ ...state, userLocation: action.payload })
  },
  [SET_SEARCH_LOCATION]: (state, action) => {
    return ({ ...state, searchLocation: action.payload })
  },
  [SET_EDITING_DISPENSARY]: (state, action) => {
    let dispensary = action.payload
    dispensary.hours.forEach((hourData) => {
      /*
       order
        day
        startTime
        endTime
      */
      dispensary[`startTime${hourData.order}`] = {
        value: hourData.startTime,
        label: moment(new Date(`01/01/2001 ${hourData.startTime}`)).format('hh:mm A')
      }

      dispensary[`endTime${hourData.order}`] = {
        value: hourData.endTime,
        label: moment(new Date(`01/01/2001 ${hourData.endTime}`)).format('hh:mm A')
      }
    })
    return ({ ...state, editingDispensary: dispensary })
  }
}

export const setUserLocation = (coordinates) => {
  return {
    type: SET_USER_LOCATION,
    payload: coordinates
  }
}

export const setSearchLocation = (coordinates) => {
  return {
    type: SET_SEARCH_LOCATION,
    payload: coordinates
  }
}

export default function zenReducer (state = initialState, action) {
  const handler = ADMIN_ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
var globalAddressData = {}
export const parseAddressComonents = (addressComponents) => {
  globalAddressData = {}
  for (const component in googleComponents) {
    addressComponents.forEach(addressComponent => populateFormElements(addressComponent, googleComponents[component]))
  }
  globalAddressData.address = `${globalAddressData.streetNumber} ${globalAddressData.streetAddress}`
  return globalAddressData
}
const googleComponents = [
  { googleComponent: `street_number`, id: `streetNumber` },
  { googleComponent: `route`, id: `streetAddress` },
  { googleComponent: `sublocality_level_1`, id: `city` },
  { googleComponent: `locality`, id: `city` },
  { googleComponent: `administrative_area_level_1`, id: `state` },
  { googleComponent: `postal_code`, id: `zip` }
]

const populateFormElements = (addressComponent, formMap) => {
  const addressType = addressComponent.types[0]
  if (formMap.googleComponent === addressType) {
    let formValue = addressComponent.long_name
    globalAddressData[formMap.id] = formValue
  }
}
const placeDetails = (placeId) => {
  return new Promise((resolve, reject) => {
    let service = new google.maps.places.PlacesService(document.getElementById('root')
    .appendChild(document.createElement('div')))
    service.getDetails({placeId: placeId}, (data, status) => {
      resolve(data)
    })
  })
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371 // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1)  // deg2rad below
  var dLon = deg2rad(lon2-lon1) 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c // Distance in km
  return d
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}