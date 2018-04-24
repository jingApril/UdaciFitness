import React from 'react'
import { View,Text, Slider } from 'react-native'

export default function UdacitySlider({ max, unit, step, value, onChange }) {
	return (
		<View>
			<Slider
				step = {step}
				value ={value}
				maximumValue ={max}
				minmumValue ={0}
				onValueChange = {onChange}
			/>
			<View>
				<Text>
					{value}
				</Text>
				<Text>{unit}</Text>
			</View>
		</View>
	)
}
