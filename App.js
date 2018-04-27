import React from 'react'
import {
View,
Text,
Stylesheet,
TouchableHightLigh,
TouchableNativeFeedback,
TouchableOpacity,
TouchableWithoutFeeback
 } from 'react-native'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import AddEntry from './components/AddEntry'
import History from './components/History'

export default class App extends React.Component {
  render() {
    return (
        <Provider store={createStore(reducer)}>
            <View style={{flex: 1}}>
                <History />
            </View>
        </Provider>
    )
  }
}
