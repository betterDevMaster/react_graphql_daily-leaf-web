import React from 'react'
import DealCard from './dealcard/DealCard'
import Slider from 'react-slick'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [ { breakpoint: 960, settings: { slidesToShow: 3, slidesToScroll: 3 } }, { breakpoint: 800, settings: { slidesToShow: 2, slidesToScroll: 2 } }, { breakpoint: 440, settings: { slidesToShow: 1, slidesToScroll: 1 } } ]
}

const DealList = (props, deals) => (
  <section className='brand-view-section'>
    {props.title ? <p className='brand-view-section-title'>{props.title}</p> : '' }
    {props.slider ? <Slider {...settings}>
      {props.deals.map((deal, index) => {
        return (<div key={deal.id + '-' + index} className='col-lg-3 col-md-4 col-sm-6 col-12'>
          <DealCard deal={deal} />
        </div>)
      })}
    </Slider> : <div className='row'>
      {props.deals.map((deal, index) => {
        return (
          <div key={deal ? deal.id + index : index} className='col-lg-3 col-md-4 col-sm-6 col-12'>
            <DealCard deal={deal} />
          </div>
        )
      })}
    </div>
  }
  </section>
)

export default DealList
