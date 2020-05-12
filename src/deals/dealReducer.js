const initialState = {
  editingDeal: null
}

export const SET_EDITING_DEAL = 'SET_EDITING_DEAL'

export const editDeal = (deal) => {
  return {
    type: SET_EDITING_DEAL,
    payload: deal
  }
}

const ADMIN_ACTION_HANDLERS = {
  [SET_EDITING_DEAL]: (state, action) => {
    let eDeal = Object.assign({}, action.payload)
    eDeal.expires = new Date(eDeal.expires)
    return ({ ...state, editingDeal: eDeal })
  }
}

export default function zenReducer (state = initialState, action) {
  const handler = ADMIN_ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
