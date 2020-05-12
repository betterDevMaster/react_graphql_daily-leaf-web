import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import './Blog.css'
import gql from 'graphql-tag'
const query = gql`
query ($slug: String!) {
  singlePost(slug: $slug) {
    id
    title
    date
    excerpt
    content
    image
    slug
    author {
      id
      name
      avatar
    }
  }
}

  `

class BlogPost extends Component {
  componentDidMount () {
    this.props.data.refetch({slug: this.props.match.params.slug})
  }

  scrollToArticle (e) {
    e.preventDefault()
    let $ = window.$
    $('html, body').animate({ scrollTop: 750 }, 'slow')
  }

  render () {
    const { data } = this.props

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    const { singlePost } = data

    if (!singlePost) {
      return <h2>Article Not Found</h2>
    }

    return (
      <div className='wrapper blog-post'>
        <div className='page-header page-header-small'>
          <div className='page-header-image' data-parallax='true' style={{backgroundImage: `url('${singlePost.image}')`}} />
          <div className='content-center'>
            <div className='row'>
              <div className='col-md-8 ml-auto mr-auto text-center'>
                <h2 className='title'>{singlePost.title}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className='section'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <div className='button-container'>
                  <a href='' onClick={this.scrollToArticle} className='btn btn-primary btn-round btn-lg blog-header-button'>
                    <i className='now-ui-icons text_align-left' /> Read Article
                  </a>
                  <a href={`https://twitter.com/share?url=${encodeURIComponent(document.URL)}`} target='_blank' className='btn btn-icon btn-lg btn-twitter btn-round blog-header-button' rel='noopener noreferrer'>
                    <i className='fa fa-twitter' />
                  </a>
                  <a href='https://www.facebook.com/sharer/sharer.php?u=#url' target='_blank' className='btn btn-icon btn-lg btn-facebook btn-round blog-header-button' rel='noopener noreferrer'>
                    <i className='fa fa-facebook-square' />
                  </a>
                  <a href={`https://plus.google.com/share?url=${encodeURIComponent(document.URL)}`} target='_blank' className='btn btn-icon btn-lg btn-google btn-round blog-header-button' rel='noopener noreferrer'>
                    <i className='fa fa-google' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
          <div className='container'>
            <div className='row'>
              <div className='col-md-8 ml-auto mr-auto'>
                <p className='muted'>{(new Date(singlePost.date)).toDateString()}</p>
                <div id='post-content' className='post-excerpt' dangerouslySetInnerHTML={{__html: singlePost.content}} />

                <div className='card card-profile card-plain'>
                  <div className='row'>
                    <div className='col-md-2'>
                      <div className='card-avatar'>
                        <img className='img img-raised' src={singlePost.author.avatar} alt='' />
                      </div>
                    </div>
                    <div className='col-md-8'>
                      <h4 className='card-title text-left'>{singlePost.author.name}</h4>
                    </div>
                    <div className='col-md-2' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(graphql(query, {options: {variables: {slug: ''}}}))(BlogPost)
