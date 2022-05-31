import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { getFormattedDate } from "../../utils/date";
import Button from "../UI/Button";
import Input from "./Input";
function ExpenseForm({ onCancel, submitButtonLabel, onSubmit, defaultValues }) {
	const [inputValues, setInputs] = useState({
		amount: {
			value: defaultValues ? defaultValues.amount.toString() : "",
			isValid: true,
		},
		date: {
			value: defaultValues ? getFormattedDate(defaultValues.date) : "",
			isValid: true,
		},
		description: {
			value: defaultValues ? defaultValues.description : "",
			isValid: true,
		},
	});

	function inputChangedHandler(inputIdentifier, enteredValue) {
		setInputs((currInputs) => {
			return {
				...currInputs,
				[inputIdentifier]: { value: enteredValue, isValid: true },
			};
		});
	}

	function submitHandler() {
		const expenseData = {
			amount: +inputValues.amount.value,
			date: new Date(inputValues.date.value),
			description: inputValues.description.value,
		};

		const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
		const dateIsValid = expenseData.date.toString() !== "Invalid Date";
		const descriptionIsValid = expenseData.description.trim().length > 0;

		if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
			//show feedback
			// Alert.alert("Invalid Input", "Please check your input values");
			setInputs((currInputs) => {
				return {
					amount: { value: currInputs.amount.value, isValid: amountIsValid },
					date: { value: currInputs.date.value, isValid: dateIsValid },
					description: {
						value: currInputs.description.value,
						isValid: descriptionIsValid,
					},
				};
			});
			return;
		}
		onSubmit(expenseData);
	}

	const formIsInValid =
		!inputValues.amount.isValid ||
		!inputValues.date.isValid ||
		!inputValues.description.isValid;

	return (
		<View style={styles.form}>
			<Text style={styles.title}>Your Expense</Text>
			<View style={styles.inputsRow}>
				<View style={styles.rowInput}>
					<Input
						label="Amount"
						invalid={!inputValues.amount.isValid}
						textInputConfig={{
							keyboardType: "decimal-pad",
							onChangeText: inputChangedHandler.bind(this, "amount"),
							value: inputValues.amount.value,
						}}
					/>
				</View>
				<View style={styles.rowInput}>
					<Input
						label="Date"
						invalid={!inputValues.date.isValid}
						textInputConfig={{
							placeholder: "YYYY-MM-DD",
							maxLength: 10,
							onChangeText: inputChangedHandler.bind(this, "date"),
							value: inputValues.date.value,
						}}
					/>
				</View>
			</View>

			<Input
				label="Description"
				invalid={!inputValues.description.isValid}
				textInputConfig={{
					keyboardType: "default",
					multiline: true,
					onChangeText: inputChangedHandler.bind(this, "description"),
					value: inputValues.description.value,
					// autoCapitalize: 'sentences'
				}}
			/>
			{formIsInValid && (
				<Text style={styles.errorText}>
					Invalid Input values- Please Check your entered data!
				</Text>
			)}
			<View style={styles.buttonsContainer}>
				<Button mode="flat" onPress={onCancel} style={styles.button}>
					Cancel
				</Button>
				<Button mode="" onPress={submitHandler} style={styles.button}>
					{submitButtonLabel}
				</Button>
			</View>
		</View>
	);
}

export default ExpenseForm;

const styles = StyleSheet.create({
	form: {
		marginTop: 40,
	},
	inputsRow: {
		flexDirection: "row",
	},
	rowInput: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
		textAlign: "center",
		marginVertical: 24,
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
	errorText: {
		textAlign: "center",
		color: GlobalStyles.colors.error500,
		margin: 8,
	},
});
