import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import ExpenseItem from "./ExpenseItem";

function renderExpenseItem(itemData) {
	return <ExpenseItem {...itemData.item} />;
}

function ExpensesList({ expenses }) {
	return (
		<FlatList
			data={expenses}
			renderItem={renderExpenseItem}
			keyExtractor={(item) => item.id}
		/>
	);
}

export default ExpensesList;