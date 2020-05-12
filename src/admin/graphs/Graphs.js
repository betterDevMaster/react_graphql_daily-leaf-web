import React from 'react'
const GOOGLE_APP_ID = 'ga:112416096'
const gapi = window.gapi

export const generateLineGraph = (metrics, filter, container) => {
  const defaultLineGraphProps = {
    query: {
      'ids': GOOGLE_APP_ID,
      'start-date': '30daysAgo',
      'end-date': 'today',
      'dimensions': 'ga:date'
    },
    chart: {
      'type': 'LINE',
      'options': {
        'width': '100%'
      }
    }
  }
  let g = Object.assign({}, defaultLineGraphProps)
  g.query.metrics = metrics
  g.query.filters = filter
  g.chart.container = container
  let graph = new gapi.analytics.googleCharts.DataChart(g)
  return graph
}

export const Stat = (props) => (
  <div className='col-lg-3 col-sm-6'>
    <div className='card card-stats'>
      <div className='card-body '>
        <div className='statistics statistics-horizontal'>
          <div className='info info-horizontal'>
            <div className='row'>
              <div className='col-5'>
                <div className='icon icon-primary icon-circle'>
                  <i className={props.icon} />
                </div>
              </div>
              <div className='col-7 text-right'>
                <h3 className='info-title'>{props.value}</h3>
                <h6 className='stats-title'>{props.title}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
