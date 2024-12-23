import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

// Example Reducer (replace with actual reducers)
const exampleReducer = (state = {}, action) => {
  switch (action.type) {
  case 'SET_DATA':
    return { ...state, data: action.payload }
  default:
    return state
  }
}

const rootReducer = combineReducers({
  example: exampleReducer,
})

const store = configureStore({ reducer: rootReducer })

export default store
