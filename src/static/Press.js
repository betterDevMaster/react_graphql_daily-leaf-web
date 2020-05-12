import React from 'react'
import Page from './Page'

const pressArticles = [
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/Herb-300x300.jpg',
    link: 'http://herb.co/2017/08/06/daily-leaf/',
    title: 'Groupon For Washington State Weed Lovers Has Arrived',
    description: 'Wondering where to find the best cannabis for the best price? What about new cannabis-themed parties and celebrations near you? Well, the Groupon for weed lovers has arrived.',
    source: 'Herb.co'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/cropped-ganjapreneur-300x74.png',
    title: 'Stephen Gold & Andy Yashar: Pioneers in Cannabis Tech',
    description: 'Stephen Gold and Andy Yashar are co-founders of The Daily Leaf, a technology company that has partnered with dispensaries to find and list the best cannabis deals throughout Oregon cities — with plans to expand to Seattle, Las Vegas, and beyond.',
    link: 'https://www.ganjapreneur.com/stephen-gold-andy-yashar-the-daily-leaf/',
    source: 'Ganjapreneur'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/Screen-Shot-2017-02-28-at-1.03.17-PM-300x94.png',
    title: 'Stephen Gold Sits Down With Cheddar TV',
    description: 'A Sit down Skype interview with Stephen Gold from The Daily Leaf',
    link: 'https://cheddar.vhx.tv/cheddar-archive/videos/cheddar-closing-bell-s8-e041117-k-full-mezz-hd-en-us',
    source: 'Cheddar TV'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/Forbes-Magazine-300x176.jpg',
    title: '420 Is The Black Friday For The Cannabis Industry',
    description: 'The Pax vaporizer seems to be a valued 420 prize and is included in special giveaways at the Botanica PDX and The Daily Leaf dispensaries in Portland, Oregon.',
    link: 'https://www.forbes.com/sites/debraborchardt/2017/04/20/420-is-the-black-friday-for-the-cannabis-industry/#7190742b4fb2',
    source: 'Forbes Magazine'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/herb.co_-300x150.png',
    title: 'Top 4/20 Events in Oregon',
    description: 'The Daily Leaf is hosting a huge giveaway on 420. This event is not live, but it is an excellent thing to do on 420. Over 25 brands are participating, and winners can receive up to $1,000 of free cannabis gear. The giveaway includes PAX, Magical Butter Machine, Grav, and much more.',
    link: 'http://herb.co/2017/04/15/420-events-oregon/',
    source: 'Herb.co'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/dope_logo_black1-300x118.png',
    title: 'Dope Industry Award Winner 2017',
    description: 'Winner of Best Tech Product at the Dope Industry Awards in February, The Daily Leaf wins for the 2nd year in a row.',
    link: 'http://www.dopemagazine.com/dope-industry-awards-oregon-2017-recap/',
    source: 'Dope Magazine'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/e22b90a107ec37aa2245f2c43664390b-300x70.png',
    title: 'How Cannabis Ecommerce Challenges Are Driving Web Innovation',
    description: '“We go straight to inboxes, helping cannabis customers save money and learn more about the brands they love with the Daily Leaf and our Daily Leaf Deals newsletter',
    link: 'https://www.entrepreneur.com/article/288022',
    source: 'Entreprenuer Magazine'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/6134848_orig-300x202.png',
    title: 'Here’s What Happened When 3 People Ditched Their Careers to Work in Weed',
    description: 'Stephen Gold worked in the NYC fashion industry for four years before making the move to the cannabis industry. Gold now lives in Oregon is now co-owner of the Daily Leaf, a Groupon-like service for cannabis, with Andy Yashar.',
    link: 'http://www.complex.com/life/2017/02/left-job-for-weed-career/',
    source: 'Complex Magazine'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/Merry_Jane_Logo-300x84.png',
    title: 'How to Save Money on Marijuana',
    description: 'If you live in Portland, Ore., Daily Leaf Deals will help you find the best deals on flowers, edibles, oil, and more. Depending on the daily deals, you can save anywhere from 10 to 75 percent!',
    link: 'https://www.merryjane.com/culture/how-to-save-money-on-marijuana',
    source: 'Merry Jane'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/Screen-Shot-2017-02-28-at-1.03.17-PM-300x94.png',
    title: 'New Tech in the Cannabis Industry.',
    description: 'ZOE WILDER DISCUSSES FAVORITE MARIJUANA PRODUCTS',
    link: 'https://cheddar.vhx.tv/cheddar-archive/videos/cheddar-cheddar-life-s8-e1120216-c-full-mezz-hd-en-us',
    source: 'Chedder Live TV'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/Screen-Shot-2017-02-28-at-12.35.01-PM-300x106.png',
    title: 'WEEDSDAY PLAYLIST: THE DAILY LEAF’S STEPHEN GOLD SHARES 5 SONGS FOR YOUR NEXT SMOKE SESH',
    description: 'In 2015, Stephen Gold and his partner Andy Yashar created The Daily Leaf, a real-time resource that helps drive information to cannabis consumers. Touted as a “Groupon for Cannabis” in the early developmental stages, The Daily Leaf has blossomed into a platform that helps consumers find local information pertaining to dispensary deals, product launches, and cannabis culture events.',
    link: 'http://www.magneticmag.com/2017/01/weedsday-playlist-the-daily-leafs-stephen-gold-shares-5-songs-for-your-next-smoke-sesh/',
    source: 'MAGNETIC Magazine'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/Screen-Shot-2017-02-28-at-12.41.58-PM.png',
    title: 'Talking Cannabis Deals with The Daily Leaf',
    description: 'The Daily Leaf was created to help consumers navigate their way around specials and deals from local dispensaries. In Portland alone there’s been over 200 dispensaries and in Oregon as a whole nearly 400.  That’s a ton of options for consumers with few services to help them figure out where to go.',
    link: 'http://www.budtenderslife.com/cannabis-news-resources/2017/1/9/talking-cannabis-deals-with-the-daily-leaf',
    source: 'Budtenders Life'
  },
  {
    image: 'http://dailyleafdeals.com/wp-content/uploads/2017/02/dope_logo_black1-300x118.png',
    title: 'TECH THURSDAY: THE DAILY LEAF',
    description: 'Winner of Best Tech Product at the Dope Industry Awards in February, The Daily Leaf was founded by Stephen Gold, Andy Yashar, and their team of five. When asked why they started the business and what their mission was, Mr. Gold stated, “The Daily Leaf helps consumers in Oregon find dispensary deals on a daily basis. Our goal and objective was to create a marketplace that ultimately helps the cannabis community relay information about products that are on sale, just being released, or are exclusive.',
    link: 'http://www.dopemagazine.com/tech-thursday-the-daily-leaf/',
    source: 'Dope Magazine'
  }
]

const Press = () => (
  <Page>
    <div className='col-md-10 ml-auto mr-auto'>
      <h2 className='title'>The Daily Leaf in the News</h2>
      {pressArticles.map(press => {
        return (
          <div className='card card-plain card-blog'>
            <div className='row'>
              <div className='col-md-5'>
                <div className='card-image'>
                  <a href={press.link} target='_blank'><img className='img' src={press.image} alt='' /></a>
                </div>
              </div>
              <div className='col-md-7'>
                <h6 className='category text-primary'>{press.source.toUpperCase()}</h6>
                <h3 className='card-title'>
                  <a href={press.link} target='_blank'>{press.title}</a>
                </h3>
                <p className='card-description press-card-description'>
                  {press.description}
                  <a href={press.link} target='_blank'> Read More </a>
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </Page>
)

export default Press
