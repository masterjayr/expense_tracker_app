import React, { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { ExpensesContext } from "../store/expenses-context";
import { getDaysMinusDays } from "../utils/date";
import { fetchExpenses } from "../utils/http";
function RecentExpenses() {
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState();
	const expensesCtx = useContext(ExpensesContext);

	useEffect(() => {
		setIsFetching(true);

		async function getExpenses() {
			try {
				const expenses = await fetchExpenses();
				expensesCtx.setExpenses(expenses);
			} catch (error) {
				setError("Could not fetch Expenses");
			}

			setIsFetching(false);
		}
		getExpenses();
	}, []);

	const recentExpenses = expensesCtx.expenses.filter((expense) => {
		const today = new Date();
		const date7DaysAgo = getDaysMinusDays(today, 7);
		return expense.date > date7DaysAgo;
	});

	function errorHandler() {
		setError(null);
	}

	if (error && !isFetching) {
		return <ErrorOverlay message={error} onConfirm={errorHandler} />;
	}

	if (isFetching) {
		return <LoadingOverlay />;
	}
	return (
		<ExpensesOutput
			expensesPeriod="Last 7 Days"
			expenses={recentExpenses}
			fallbackText="No Expenses spent for the last 7 Days"
		/>
	);
}

export default RecentExpenses;
