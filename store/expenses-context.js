import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
	expenses: [],
	addExpense: ({ description, amount, date }) => {},
	deleteExpense: (id) => {},
	setExpenses: (expenses) => {},
	updateExpense: (id, { description, amount, date }) => {},
});

function expensesReducer(state, action) {
	switch (action.type) {
		case "ADD":
			return [{ ...action.payload }, ...state];
		case "UPDATE":
			const updatableExpenseIndex = state.indexOf(
				(expense) => expense.id === action.payload.id
			);
			const updatableExpense = state[updatableExpenseIndex];
			const updatedItem = { ...updatableExpense, ...action.payload.payload };
			const updatedExpenses = [...state];
			updatableExpense[updatableExpenseIndex] = updatedItem;
			return updatedExpenses;
		case "DELETE":
			return state.filter((expense) => expense.id !== action.payload);
		case "SET":
			const inverted = action.payload.reverse();

			return inverted;
		default:
			return state;
	}
}

function ExpensesContextProvider({ children }) {
	const [expenseState, dispatch] = useReducer(expensesReducer, []);

	function addExpense(expenseData) {
		dispatch({ type: "ADD", payload: expenseData });
	}
	function deleteExpense(id) {
		dispatch({ type: "DELETE", payload: id });
	}

	function updateExpense(id, expenseData) {
		dispatch({ type: "UPDATE", payload: { id, data: expenseData } });
	}

	function setExpenses(expenses) {
		dispatch({ type: "SET", payload: expenses });
	}

	const value = {
		expenses: expenseState,
		addExpense: addExpense,
		deleteExpense: deleteExpense,
		updateExpense: updateExpense,
		setExpenses: setExpenses,
	};

	return (
		<ExpensesContext.Provider value={value}>
			{children}
		</ExpensesContext.Provider>
	);
}

export default ExpensesContextProvider;
