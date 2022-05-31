import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses-context";
function AllExpenses() {
	const expensesCtx = useContext(ExpensesContext);
	return (
		<ExpensesOutput
			expensesPeriod="Total"
			expenses={expensesCtx.expenses}
			fallbackText="No Registered Expenses found"
		/>
	);
}

export default AllExpenses;