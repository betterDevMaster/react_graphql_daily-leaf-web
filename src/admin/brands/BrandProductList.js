import React, { Component } from 'react'
class BrandProductList extends Component {
  render () {
    const { products } = this.props

    if (!products) {
      return (<div />)
    }

    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td><img src={product.image} height={100} alt={`${product.name} - img`} /></td>
                <td>{product.name}</td>
                <td>{product.desc}</td>
                <td className='text-center'>
                  <button type='button' rel='tooltip' className='btn btn-info btn-icon btn-sm   btn-neutral  ' data-original-title='' title=''>
                    <i className='now-ui-icons ui-1_settings-gear-63' />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default BrandProductList
