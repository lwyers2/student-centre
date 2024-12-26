import { createStore } from 'redux'
import  rootReducer  from './reducers'


const storedUser = JSON.parse(localStorage.getItem('loggedUser'))
const initialState = storedUser ? { user: storedUser } : { user: null }

const store = createStore(rootReducer, initialState)

export default store
