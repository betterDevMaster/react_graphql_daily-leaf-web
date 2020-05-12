import React, { Component } from 'react'
import ReactGoogleMapLoader from 'react-google-maps-loader'
import ReactGoogleMap from 'react-google-map'
import iconMarker from './mapPin.svg'
import moment from 'moment-timezone'
import { DEFAULT_LOCATION } from '../../dispensary/dispensaryReducer'
const MAP_API_KEY = 'AIzaSyDZc_Z_rrLaGoMFnJExGO7jAwIjyD0oBuA'
var activeInfoWindow = null

class Map extends Component {
  render () {
    const props = this.props
    return (
      <ReactGoogleMapLoader
        params={{
          key: MAP_API_KEY,
          libraries: 'places,geometry'
        }}
        render={(googleMaps) => {
          if (googleMaps) {
            return (
              <div style={{ height: props.height ? props.height : 400 }}>
                <ReactGoogleMap
                  googleMaps={googleMaps}
                  center={props.center ? props.center : {lat: props.lat || DEFAULT_LOCATION.lat, lng: props.lng || DEFAULT_LOCATION.lng}}
                  zoom={props.zoom ? props.zoom : 12}
                  onLoaded={(googleMaps, map) => {
                    if (props.onMapLoaded) {
                      props.onMapLoaded(map, googleMaps)
                    }
                  }}
                  styles={mapStyle}
                  coordinates={
                    props.dispensaries ? props.dispensaries.map(disp => {
                      return {
                        title: disp.name,
                        position: {
                          lat: disp.coordinates.lat,
                          lng: disp.coordinates.lng
                        },
                        onLoaded: (googleMaps, map, marker) => {
                          marker.setAnimation(googleMaps.Animation.DROP)
                          marker.setIcon(iconMarker)
                          var infoLeft = ''
                          var infoRight = ''
                          var content = ''
                          if (disp.slug) {
                            content = `
                            <div class='deal-map-window'>
                              <div class='info-deal-window-body'>
                              <p class='info-deal-name'><a href='/dispensary/${disp.slug}'>${disp.name}</a></p>
                              <p class='info-deal-address'>${disp.address}<br />
                                ${disp.city}, ${disp.state}, ${disp.zip}
                              </p>
                              <div class='info-deal-footer'>
                              <div class='info-window-stats pull-left'>
                                ${infoLeft}
                              </div>
                              <div class='info-window-stats pull-right'>
                                ${infoRight}
                              </div>
                              <div class='clearfix'></div>
                            </div>
                            </div>
                            </div>
                            `
                          } else {
                            let addressBlock = ''
                            let websiteBlock = ''
                            if (disp.address && disp.address.length > 0) {
                              addressBlock = `<p class='info-deal-address'>${disp.address}<br />
                              ${disp.city}, ${disp.state}, ${disp.zip}
                            </p>`
                            }
                            if (disp.website && disp.website.length > 0) {
                              websiteBlock = `<p class='info-deal-name'><a href='${disp.website}'>${disp.name}</a></p>`
                            } else {
                              websiteBlock = `<p class='info-deal-name-no-link'>${disp.name}</p>`
                            }
                            content = `
                            <div class='deal-map-window'>
                              <div class='info-deal-window-body'>
                              ${websiteBlock}
                              ${addressBlock}
                              <div class='info-deal-footer'>
                              <div class='info-window-stats pull-left'>
                                ${infoLeft}
                              </div>
                              <div class='info-window-stats pull-right'>
                                ${infoRight}
                              </div>
                              <div class='clearfix'></div>
                            </div>
                            </div>
                            </div>
                            `
                          }
                          const infoWindow = new googleMaps.InfoWindow({
                            maxWidth: 340,
                            content: content
                          })
                          googleMaps.event.addListener(infoWindow, 'domready', () => {
                            var iwOuter = window.$('.gm-style-iw')
                            var iwBackground = iwOuter.prev()
                            iwBackground.children(':nth-child(2)').css({'display': 'none'})
                            iwBackground.children(':nth-child(4)').css({'display': 'none'})
                            iwBackground.children(':nth-child(3)').find('div').children().css({'z-index': '1'})

                            var iwCloseBtn = iwOuter.next()
                            iwCloseBtn.css({
                              opacity: '1',
                              right: '38px',
                              width: '27px',
                              height: '27px',
                              top: '3px', // button repositioning
                              border: '7px solid #1BE58D', // increasing button border and new color
                              'border-radius': '13px', // circular effect
                              'box-shadow': '0 0 5px #1BE58D' // 3D effect to highlight the button
                            })
                            iwCloseBtn.mouseout(() => {
                              window.$(this).css({opacity: '1'})
                            })
                          })
                          // Open InfoWindow when Marker will be clicked
                          googleMaps.event.addListener(marker, 'click', () => {
                            if (activeInfoWindow) {
                              activeInfoWindow.close()
                            }
                            infoWindow.open(map, marker)
                            activeInfoWindow = infoWindow
                          })
                        }
                      }
                    }) : props.deals ? props.deals.filter((deal) => deal.dispensaries.length > 0).map(deal => {
                      return {
                        title: deal.title,
                        position: {
                          lat: (deal.dispensaries && deal.dispensaries.length > 0) ? deal.dispensaries[0].coordinates.lat : 0,
                          lng: (deal.dispensaries && deal.dispensaries.length > 0) ? deal.dispensaries[0].coordinates.lng : 0
                        },
                        onLoaded: (googleMaps, map, marker) => {
                          marker.setAnimation(googleMaps.Animation.DROP)
                          marker.setIcon(iconMarker)
                          var infoLeft = ''
                          if (deal.distance) {
                            infoLeft = `
                            <span>
                              <i class='fa fa-map-marker info-window-icon' aria-hidden='true'></i> ${deal.distance.toFixed(1)}mi
                            </span>
                            `
                          }
                          var infoRight = ''
                          if (deal.expires) {
                            infoRight = `
                            <span>
                              <i class='fa fa-clock-o info-window-icon' aria-hidden='true'></i> ${moment(deal.expires).tz('America/Los_Angeles').format('MM/DD/YY h:mm a')}
                            </span>
                            `
                          }
                          const infoWindow = new googleMaps.InfoWindow({
                            maxWidth: 340,
                            content: `
                            <div class='deal-map-window'>
                              <a href='/deals/${deal.slug}'>
                                <img class='img img-fluid info-window-image' src='${deal.image}' alt='info' />
                              </a>
                              <div class='info-deal-window-body'>
                              <p class='info-deal-name'><a href='/deals/${deal.slug}'>${deal.name}</a></p>
                              <a class='info-dispensary-link' href='/dispensary/${deal.dispensaries[0].slug}'><p class='info-deal-address'>${deal.dispensaries[0].address}<br />
                                ${deal.dispensaries[0].city}, ${deal.dispensaries[0].state}, ${deal.dispensaries[0].zip}
                              </p>
                              </a>
                              <a href='${deal.dispensaries[0].directions}' class='btn btn-primary map-get-directions-button'>Get Directions</a>
                              <div class='info-deal-footer'>
                              <div class='info-window-stats pull-left'>
                                ${infoLeft}
                              </div>
                              <div class='info-window-stats pull-right'>
                                ${infoRight}
                              </div>
                              <div class='clearfix'></div>
                            </div>
                            </div>
                              
                            </div>
                            `
                          })
                          googleMaps.event.addListener(infoWindow, 'domready', () => {
                            var iwOuter = window.$('.gm-style-iw')
                            var iwBackground = iwOuter.prev()
                            iwBackground.children(':nth-child(2)').css({'display': 'none'})
                            iwBackground.children(':nth-child(4)').css({'display': 'none'})
                            // iwBackground.children(':nth-child(1)').attr('style', (i, s) => { return s + 'left: 76px !important;' })
                            // iwBackground.children(':nth-child(3)').attr('style', (i, s) => { return s + 'left: 76px !important;' })
                            iwBackground.children(':nth-child(3)').find('div').children().css({'z-index': '1'})
                            var iwCloseBtn = iwOuter.next()
                            iwCloseBtn.css({
                              opacity: '1',
                              right: '38px',
                              width: '27px',
                              height: '27px',
                              top: '3px', // button repositioning
                              border: '7px solid #1BE58D', // increasing button border and new color
                              'border-radius': '13px', // circular effect
                              'box-shadow': '0 0 5px #1BE58D' // 3D effect to highlight the button
                            })
                            iwCloseBtn.mouseout(() => {
                              window.$(this).css({opacity: '1'})
                            })
                          })
                          // Open InfoWindow when Marker will be clicked
                          googleMaps.event.addListener(marker, 'click', () => {
                            if (activeInfoWindow) {
                              activeInfoWindow.close()
                            }
                            infoWindow.open(map, marker)
                            activeInfoWindow = infoWindow
                          })
                        }
                      }
                    }) : []
                  }
                />
              </div>
            )
          }
        }
      }
    />)
  }
}

const mapStyle = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#f5f5f5'
      }
    ]
  },
  {
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#616161'
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#f5f5f5'
      }
    ]
  },
  {
    'featureType': 'administrative.land_parcel',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#bdbdbd'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#eeeeee'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e5e5e5'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#ffffff'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#dadada'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#616161'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  },
  {
    'featureType': 'transit.line',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e5e5e5'
      }
    ]
  },
  {
    'featureType': 'transit.station',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#eeeeee'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#c9c9c9'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  }
]

export default Map
