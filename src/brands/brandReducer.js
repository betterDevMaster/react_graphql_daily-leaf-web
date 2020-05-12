const initialState = {
  editingBrand: null,
  editingProduct: null
}

export const SET_EDITING_BRAND = 'SET_EDITING_BRAND'
export const SET_EDITING_PRODUCT = 'SET_EDITING_PRODUCT'

export const editBrand = (brand) => {
  return {
    type: SET_EDITING_BRAND,
    payload: brand
  }
}

export const editProduct = (product) => {
  return {
    type: SET_EDITING_PRODUCT,
    payload: product
  }
}

const ADMIN_ACTION_HANDLERS = {
  [SET_EDITING_BRAND]: (state, action) => {
    return ({ ...state, editingBrand: action.payload })
  },
  [SET_EDITING_PRODUCT]: (state, action) => {
    return ({ ...state, editingProduct: action.payload })
  }
}

export default function zenReducer (state = initialState, action) {
  const handler = ADMIN_ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
