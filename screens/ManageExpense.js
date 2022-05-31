import React, { useLayoutEffect, useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import IconButton from "../components/UI/IconButton";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";
import { storeExpense, updateExpense, deleteExpense } from "../utils/http";
function ManageExpense({ route, navigation }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState();
	const expensesCtx = useContext(ExpensesContext);

	const editedExpenseId = route.params?.expenseId;
	const isEditing = !!editedExpenseId;

	const selectedExpense = expensesCtx.expenses.find(
		(expenses) => expenses.id === editedExpenseId
	);

	async function deleteExpenseHandler() {
		setIsSubmitting(true);
		try {
			expensesCtx.deleteExpense(editedExpenseId);
			await deleteExpense(editedExpenseId);
		} catch (error) {
			setError("Could not Delete Expense - Please try again later");
			setIsSubmitting(false);
		}

		// setIsSubmitting(false); // no need because we are going back
		navigation.goBack();
	}

	useLayoutEffect(() => {
		navigation.setOptions({
			title: isEditing ? "Edit Expense" : "Add Expense",
		});
	}, [isEditing, navigation]);

	function cancelHandler() {
		navigation.goBack();
	}

	async function confirmHandler(expenseData) {
		setIsSubmitting(true);
		try {
			if (isEditing) {
				expensesCtx.updateExpense(editedExpenseId, expenseData);
				await updateExpense(editedExpenseId, expenseData);
			} else {
				const id = await storeExpense(expenseData);
				expensesCtx.addExpense({ ...expenseData, id });
			}
			navigation.goBack();
		} catch (error) {
			setError("Could not save data- please try again later");
		}
	}

	function errorHandler() {
		setError(null);
	}

	if (error && !isSubmitting) {
		return <ErrorOverlay message={error} onConfirm={errorHandler} />;
	}

	if (isSubmitting) {
		return <LoadingOverlay />;
	}

	return (
		<View style={styles.container}>
			<ExpenseForm
				onCancel={cancelHandler}
				onSubmit={confirmHandler}
				submitButtonLabel={isEditing ? "Update" : "Add"}
				defaultValues={selectedExpense}
			/>

			{isEditing && (
				<View style={styles.deleteContainer}>
					<IconButton
						icon="trash"
						color={GlobalStyles.colors.error500}
						size={36}
						onPress={deleteExpenseHandler}
					/>
				</View>
			)}
		</View>
	);
}

export default ManageExpense;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: GlobalStyles.colors.primary800,
	},
	deleteContainer: {
		marginTop: 16,
		paddingTop: 8,
		borderTopWidth: 2,
		alignItems: "center",
		borderTopColor: GlobalStyles.colors.error500,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		minWidth: 120,
		marginHorizontal: 8,
	},
});
