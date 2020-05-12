import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import BrandProductForm from './BrandProductForm'
import request from 'superagent'
import DataTable from '../common/DataTable'
import server from '../../config/server'

const createProduct = gql`
  mutation ($product: ProductInput!) {
    createProduct(data: $product) {
      id
    }
  }
`

class BrandProducts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false,
      file: null,
      fileUrl: null
    }
  }

  toggleModal () {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  handleProductSubmit (values) {
    var self = this
    if (this.state.file) {
      this.handleImageUpload(this.state.file).then(() => {
        values.image = self.state.fileUrl
        self.submitForm(values)
      })
    } else {
      this.submitForm(values)
    }
  }

  submitForm (values) {
    values.brandId = this.props.brand.id
    this.props.mutate({
      variables: {
        product: values
      }
    }).then(({ data }) => {
      this.datatable.wrappedInstance.state.dataTable.ajax.reload()
    }).catch((error) => {
      console.log(error)
      window.alert('Error', 'there was an error creating the brand', 'error')
    })
  }

  handleImageUpload (file) {
    return new Promise((resolve, reject) => {
      let upload = request.post(`${server.url}/upload`).field('image', file)
      upload.end((err, response) => {
        if (err) {
          return reject(err)
        }
        if (response.body.versions.length > 0) {
          this.setState({
            fileUrl: response.body.versions[0].url
          })
          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  handleImageChanged (file) {
    this.setState({file: file})
  }

  render () {
    return (
      <div>
        <section>
          <button className='btn btn-primary' data-toggle='modal' data-target='#myModal'>
            <i className='now-ui-icons files_single-copy-04' /> Add Product
          </button>
        </section>
        <section>
          <DataTable ref={(dataTable) => { this.datatable = dataTable }} id='brandProducts' data={{id: this.props.brand.id}} columns={productColumns} source={`${server.url}/datatables/brand-products`} />
        </section>
        <div className='modal fade' id='myModal' tabIndex='-1' role='dialog' aria-labelledby='myModalLabel' style={{display: 'none'}} aria-hidden='true'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header justify-content-center'>
                <button type='button' className='close' data-dismiss='modal' aria-hidden='true'>
                  <i className='now-ui-icons ui-1_simple-remove' />
                </button>
                <h4 className='title title-up'>New Product</h4>
              </div>
              <div className='modal-body'>
                <BrandProductForm
                  brand={this.props.brand}
                  onSubmit={this.handleProductSubmit.bind(this)}
                  imageChanged={this.handleImageChanged.bind(this)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(graphql(createProduct))(BrandProducts)

const productColumns = [
  {data: 'order', 'title': 'Order', width: '30px', searchable: false, sortable: true},
  {
    data: 'image',
    title: 'Image',
    width: '60px',
    searchable: false,
    sortable: false,
    render: (data, type, row) => {
      return `<img style="height: 50px" src='${data}' className='img-thumbnail' />`
    }},
  {data: 'name', title: 'Name'}
]
