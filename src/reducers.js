import { SAVE_KEY } from './actions';

function app(state = [], action) {
  switch (action.type) {
    case SAVE_KEY:
      return [
        ...state,
        {
          key: action.key
        }
      ]
    default:
      return state
  }
}

export default app