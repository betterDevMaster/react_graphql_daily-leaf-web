import React, {Component} from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const query = gql`{
  allBrands {
    id
    slug
    logo
  }
}
`

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [ { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } }, { breakpoint: 440, settings: { slidesToShow: 1, slidesToScroll: 1 } } ]
}

const FeaturedBrandCard = (props) => (
  <div align='center'>
    <a href={`/brands/${props.brand.slug}`}>
      <div className='card card-background featured-brand-card'>
        <img className='featured-brand-card-image' src={`${props.brand.logo}`} alt='' />
      </div>
    </a>
  </div>
)

class HomeBrandList extends Component {
  render () {
    const { data } = this.props
    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }
    return (
      <section className='home-featured-brands'>
        <p className='home-featured-brands-title'>FEATURED BRANDS</p>
        <Slider {...settings}>
          {data.allBrands.map(brand => {
            return (<div key={brand.id}><FeaturedBrandCard brand={brand} /></div>)
          })}
        </Slider>
      </section>)
  }
}

export default graphql(query)(HomeBrandList)
