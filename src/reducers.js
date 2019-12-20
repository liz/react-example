import { SAVE_KEY } from './actions';

function app(state = [], action) {
  switch (action.type) {
    case SAVE_KEY:
      console.log("SAVE_KEY state", state)
      return [
        ...state,
        {
          key: action.key
        }
      ]
    default:
      console.log("default state", state)
      return state
  }
}

export default app