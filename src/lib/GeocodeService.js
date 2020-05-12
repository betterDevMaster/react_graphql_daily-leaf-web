import Geocode from 'react-geocode'
// const MAP_API_KEY = 'AIzaSyDZc_Z_rrLaGoMFnJExGO7jAwIjyD0oBuA'
const MAP_API_KEY = 'AIzaSyBx12OOenqx3zNzSlsQ6qU3uGZUtLLDhFk'

Geocode.setApiKey(MAP_API_KEY)

export const geocodeFromCoordinates = (lat, lng) => {
  return new Promise((resolve, reject) => {
    Geocode.fromLatLng(lat, lng).then(
      response => {
        let comps = response.plus_code.compound_code.split(',')
        console.log(comps)
        let state = 'ALL'
        if (comps.length >= 1) {
          state = comps[1].trim()
        }
        // const address = parseAddressComonents(response.results)
        // console.log(response.results)
        resolve(state)
      },
      error => {
        console.error(error)
      }
    )
  })
}
