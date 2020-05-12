import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { Pagination } from 'react-bootstrap'
import './Blog.css'
import gql from 'graphql-tag'
const query = gql`
query($page: Int!, $slug: String) {
    blogCategories {
      slug
      title
      id
    }
    postCount(slug: $slug)
    posts(page: $page, slug: $slug) {
      id
      title
      date
      excerpt
      content
      categories
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

const BlogRow = ({post}) => {
  return (
    <div className='col-md-4'>
      <div className='card card-plain card-blog'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card-image'>
              <a href={`/news/${post.slug}`}><img className='img img-raised rounded blog-image' alt={`${post.title} - featured`} src={post.image} /></a>
            </div>
          </div>
          <div className='col-md-12'>
            <h5 className='card-title'>
              <a href={`/news/${post.slug}`}>{post.title}</a>
            </h5>
            <div className='card-description'>
              <p className='muted blog-date'>{(new Date(post.date)).toDateString()}</p>
              <div className='post-excerpt' dangerouslySetInnerHTML={{__html: post.excerpt}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

class Blog extends Component {
  state = {
    activePage: 1,
    slug: ''
  }

  handleCategoryChange(event) {
    this.props.data.refetch({
      slug: event.target.value,
      page: 0
    })
    this.setState({slug: event.target.value, activePage: 1})
  }

  handlePageChange(eventKey) {
    this.setState({
      activePage: eventKey,
    })
    this.props.data.refetch({page: eventKey - 1})
  }

  render () {
    const { data } = this.props

    if (data.networkStatus === 1) {
      return <p>Loading</p>
    }
    if (data.error) {
      return <p>Error! {data.error.message}</p>
    }

    const { posts, postCount, blogCategories } = data
    let mutablePosts = Object.assign([], posts)
    let featuerdPost = null
    let featuredDescription = ''
    if (this.state.activePage === 1) {
      featuerdPost = mutablePosts.shift()
      if (featuerdPost) {
        featuredDescription = strip(featuerdPost.content).replace(/[^\w\s]/gi, '').substring(0, 240) + '...'
      }
    }
    
    return (
      <div className='wrapper'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-10 ml-auto mr-auto'>
              <h2 className='title centered'>NEWS</h2>
                <div className='mr-auto ml-auto'>
                  <ul className='nav nav-pills nav-pills-primary' role='tablist'>
                    <div className='col-md-8 ml-auto mr-auto'>
                      <select defaultValue='' onChange={this.handleCategoryChange.bind(this)} className='selectpicker' data-size='7' data-style='btn btn-primary btn-round' title='Select Category'>
                        <option value='' disabled>Select Category</option>
                        <option value=''>All</option>
                        {blogCategories.map(blogCat => {
                          return (
                            <option key={blogCat.id} value={`${blogCat.slug}`}>{blogCat.title}</option>
                          )
                        })}
                      </select>
                    </div>
                  </ul>
                </div>
                
              <br />
              { (this.state.activePage === 1 && featuerdPost) ? (<div className='col-md-8 ml-auto mr-auto centered'>
                <div className='card card-plain card-blog'>
                  <div className='card-image'>
                    <a href={`/news/${featuerdPost.slug}`}>
                      <img className='img img-raised rounded' src={featuerdPost.image} alt='' />
                    </a>
                  </div>
                  <h3 className='card-title'>
                    <a href={`/news/${featuerdPost.slug}`}>{featuerdPost.title}</a>
                  </h3>
                  <h5 className='card-description blog-description'>
                    {featuredDescription}
                  </h5>
                  <a href={`/news/${featuerdPost.slug}`} className='btn btn-primary btn-round'> Read More</a>
                </div>
              </div>) : null}
              
              <div className='row'>
                {mutablePosts.map(post => {
                  return (<BlogRow key={post.id} post={post} />)
                })}
              </div>
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={postCount / 20}
                activePage={this.state.activePage}
                onSelect={this.handlePageChange.bind(this)} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default graphql(query, {options: {variables: {page: 0}}})(Blog)

function strip (html) {
  var doc = new window.DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}