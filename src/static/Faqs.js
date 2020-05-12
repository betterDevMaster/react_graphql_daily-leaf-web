import React from 'react'
import Page from './Page'
import './Page.css'

const faqs = [
  {
    title: 'What’s this all about?',
    content: 'The Daily Leaf allows you to view deals from dispensaries around town, and get directions to dispensaries offering deals that you would like to purchase.  All deals have limited inventory, so you must be able to get to the dispensary before they run out.'
  },
  {
    title: 'Who am I paying?  I don’t see a place to enter my credit card information.  Is all of this free?',
    content: 'No, you must be go to a designated dispensary once age is verified. All deals being advertised on The Daily Leaf will be paid for at the time of physical purchase in the dispensary that is hosting the deal.'
  },
  {
    title: 'What states is The Daily Leaf available in?',
    content: 'The Daily Leaf is currently hosting deals for dispensaries in Oregon and parts of Washington.  Check back frequently and sign up below to get informed when we expand to other cities and states.'
  },
  {
    title: 'How do I find more information on the items being advertised on The Daily Leaf?',
    content: 'Below the item click the “details” button. Once redirected, scroll down the page to see the product description to read more information.'
  },
  {
    title: 'How do I search The Daily Leaf for items that are being advertised?',
    content: 'There are a couple of ways to look through the content being advertised on The Daily Leaf. On the top of The Daily Leaf website you will see links  which showcases featured items, hot items, and the newest released items.  To view all deals, you can click At the top of the page is a search bar, simply type in the kind of deal or item (flower, concentrates, accessories) you are looking for.'
  },
  {
    title: 'What kinds of products and accessories am I able to claim?',
    content: 'Daily Leaf, consumers will have the opportunity to view edibles, concentrates, topicals, flower, accessories, and much more.  In order to ACTUALLY purchase any product that contains marijuana and is NOT just the actual flower itself, you will need a valid oregon ID card or Drivers License to purchase at the dispensary that is hosting the deal.'
  },
  {
    title: 'How do I subscribe to the Daily Leaf Newsletter?',
    content: 'Simply scroll down to the bottom of the page, type in your email address where it says “Subscribe to our Newsletter” and click subscribe!'
  },
  {
    title: 'What is the Daily Leaf News?',
    content: 'The Daily Leaf news is our blog spot to keep all of our users up to date on what’s going on in the marijuana industry in the pacific northwest, as well as educational and fun articles to browse through.'
  },
  {
    title: 'Is the Daily Leaf on Social Media?',
    content: `Yes, we love staying connected with our users!</p>
    <p>Facebook.com/DailyLeafDeals</p>
    <p>Twitter.com/DailyLeafDeals</p>
    <div class='mailmunch-forms-in-post-middle' style='display: none !important;'></div>
    <p>Instagram: @the_dl_pdx</p>`
  },
  {
    title: 'How do I know when there are new items?',
    content: 'Stay in touch with The Daily Leaf for all of the latest information.  We will be rolling out flash deals on our social media pages as well as newsletter, so make sure you are connected to us for up to the minute information!'
  },
  {
    title: 'How do I know which dispensary to go to?',
    content: 'Each reservation will have a specific dispensary attached to it, once you pick your items, click ob=n &#8220;Get Directions ____________&#8221; and head into the designated dispensary to purchase the deal and receive your products.'
  },
  {
    title: 'Still Have Questions?',
    content: '<script src="https://form.jotform.com/jsform/53266939254162" type="text/javascript"></script>'
  }
]
const FaqSection = ({title, content, idKey}) => (
  <div className='card card-plain'>
    <div className='card-header' role='tab' id={`heading${idKey}`}>
      <a data-toggle='collapse' data-parent='#accordion' href={`#collapse${idKey}`} aria-expanded='true' aria-controls={`collapse${idKey}`}>
        {title}
        <i className='now-ui-icons arrows-1_minimal-down' />
      </a>
    </div>
    <div id={`collapse${idKey}`} className='collapse' role='tabpanel' aria-labelledby={`heading${idKey}`}>
      <div className='card-body' dangerouslySetInnerHTML={{__html: content}} />
    </div>
  </div>
)
const Faqs = (props) => (
  <Page>
    <section className='faqs-section'>
      <div className='row'>
        <div className='col-md-12'>
          <h2>FAQs</h2>
          <div id='accordion' role='tablist' aria-multiselectable='true' className='card-collapse'>
            {faqs.map((faq, idx) => {
              return <FaqSection title={faq.title} content={faq.content} idKey={idx} />
            })}
          </div>
        </div>
      </div>
    </section>
  </Page>
)

export default Faqs
