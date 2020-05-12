import React from 'react'

const DealList = ({ deals, onDealClicked }) => {
  return (
    <div className='table-responsive'>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Featured</th>
            <th>Expires</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => {
            return (
              <tr key={deal.id} onClick={(e) => onDealClicked(deal.id)}>
                <td>{deal.id}</td>
                <td><img src={deal.image} height={100} alt={`${deal.name} - img`} /></td>
                <td>{deal.name}</td>
                <td>{deal.price ? `$${deal.price * 0.01}` : ''}</td>
                <td>{deal.discount ? `$${deal.discount * 0.01}` : ''}</td>
                <td>{deal.featured}</td>
                <td>{deal.expires}</td>
                <td>{deal.order}</td>
                <td className='text-center'>
                  <a type='button' href={`/admin/deal/${deal.id}/edit`} rel='tooltip' className='btn btn-info btn-icon btn-sm btn-neutral' data-original-title='' title=''>
                    <i className='now-ui-icons ui-1_settings-gear-63' />
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
export default DealList
