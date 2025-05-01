const budgetInitial = { monthly: 0 };
export default function(state = budgetInitial, action) {
  switch(action.type) {
    case 'SET_BUDGET':
      return { ...state, monthly: action.payload };
    default:
      return state;
  }
}