import React from 'react'
import { Text,StyleSheet } from 'react-native'
import { white, purple, black} from "../utils/colors"

export default function DateHeader ({ date }) {
	return (
		<Text style={styles.date}>
			{date}
		</Text>
	)
}
const styles = StyleSheet.create({
	date: {
		color: 'purple',
		fontSize: 20
	}
})
