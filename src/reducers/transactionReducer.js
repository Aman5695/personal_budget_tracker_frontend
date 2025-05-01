const txInitial = { list: [] };
export default function(state = txInitial, action) {
  switch(action.type) {
    case 'SET_TX_LIST':
        return { ...state, list: action.payload };  
    case 'ADD_TX':
      return { ...state, list: [action.payload, ...state.list] };
    case 'UPDATE_TX':
      return { ...state, list: state.list.map(tx => tx._id === action.payload._id ? action.payload : tx) };
    case 'DELETE_TX':
      return { ...state, list: state.list.filter(tx => tx._id !== action.payload) };
    
    default:
      return state;
  }
}