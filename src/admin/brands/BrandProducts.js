import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { reset } from 'redux-form'
import gql from 'graphql-tag'
import BrandProductForm from './BrandProductForm'
import request from 'superagent'
import DataTable from '../common/DataTable'
import server from '../../config/server'
import ReactDOM from 'react-dom'
import { editProduct } from '../../brands/brandReducer'
import { connect } from 'react-redux'

const createProduct = gql`
  mutation ($product: ProductInput!) {
    createProduct(data: $product) {
      id
    }
  }
`

const updateProduct = gql`
  mutation ($id: ID!, $product: ProductInput!) {
    updateProduct(id: $id, data: $product) {
      id
    }
  }
`

const removeProduct = gql`
  mutation ($productId: ID!) {
    removeProduct(productId: $productId) {
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
      fileUrl: null,
      selectedProduct: null
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
    var self = this
    if (values.id) {
      this.props.updateProduct({
        variables: {
          id: values.id,
          product: {
            name: values.name,
            image: values.image,
            order: values.order,
            desc: values.desc,
            brandId: values.brandId
          }
        }
      }).then(({ data }) => {
        window.$('#myModal').modal('hide')
        self.datatable.wrappedInstance.state.dataTable.ajax.reload()
        reset('brand-product-form')
      }).catch((error) => {
        console.log(error)
        window.swal('Error', 'There was an error updating the product', 'error')
      })
    } else {
      this.props.createProduct({
        variables: {
          product: values
        }
      }).then(({ data }) => {
        window.$('#myModal').modal('hide')
        self.datatable.wrappedInstance.state.dataTable.ajax.reload()
        reset('brand-product-form')
      }).catch((error) => {
        console.log(error)
        window.swal('Error', 'There was an error creating the product', 'error')
      })
    }
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

  showNewProductModal () {
    window.$('#myModal').modal('show')
    this.props.editProduct({})
    this.setState({selectedProduct: null})
  }

  removeProduct (ev, product) {
    ev.preventDefault()
    var self = this
    this.props.removeProduct({
      variables: {
        productId: product.id
      }
    }).then(() => {
      self.datatable.state.wrappedInstance.dataTable.ajax.reload()
    }).catch((err) => {
      console.log(err)
    })
  }

  handleEditProduct (ev, product) {
    ev.preventDefault()
    this.setState({
      selectedProduct: product
    })
    this.props.editProduct(product)
    window.$('#myModal').modal('show')
  }

  onRowReorder (rowData, diffy) {
    return this.props.updateProduct({
      variables: {
        id: rowData.id,
        product: {
          brandId: rowData.brand_id,
          order: diffy.newPosition
        }
      }
    })
  }

  render () {
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
      {data: 'name', title: 'Name'},
      {data: 'desc', title: 'Description'},
      {
        data: null,
        title: 'Actions',
        sortable: false,
        searchable: false,
        createdCell: (td, cellData, rowData, row, col) =>
          ReactDOM.render(
            <div className='dropdown'>
              <button className='btn btn-sm btn-info dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                Select
              </button>
              <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                <a className='dropdown-item' href='/' onClick={(e) => this.handleEditProduct(e, rowData)}>Edit</a>
                <a className='dropdown-item' href='/' onClick={(e) => this.removeProduct(e, rowData)}>Remove</a>
              </div>
            </div>, td)}
    ]

    return (
      <div>
        <section>
          <button className='btn btn-primary' onClick={this.showNewProductModal.bind(this)}>
            <i className='now-ui-icons files_single-copy-04' /> Add Product
          </button>
        </section>
        <section>
          <DataTable
            id='brandProducts'
            ref={(dataTable) => { this.datatable = dataTable }}
            reorder={{
              enable: true,
              update: false,
              dataSrc: 'order'
            }}
            onRowReorder={this.onRowReorder.bind(this)}
            data={{id: this.props.brand.id}}
            columns={productColumns}
            source={`${server.url}/datatables/brand-products`} />
        </section>
        <div className='modal fade' id='myModal' tabIndex='-1' role='dialog' aria-labelledby='myModalLabel' style={{display: 'none'}} aria-hidden='true'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header justify-content-center'>
                <button type='button' className='close' data-dismiss='modal' aria-hidden='true'>
                  <i className='now-ui-icons ui-1_simple-remove' />
                </button>
                <h4 className='title title-up'>Product</h4>
              </div>
              <div className='modal-body'>
                <ReduxBrandForm
                  product={this.state.selectedProduct}
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

const mapDispatchToProps = {
  editProduct
}
const mapStateToProps = (state) => ({
  initialValues: state.brands.editingProduct
})

const ReduxBrandForm = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {withRef: true}
)(BrandProductForm)
const ReduxBrandProducts = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(BrandProducts)

export default compose(graphql(updateProduct, {name: 'updateProduct'}), graphql(removeProduct, {name: 'removeProduct'}), graphql(createProduct, {name: 'createProduct'}))(ReduxBrandProducts)
