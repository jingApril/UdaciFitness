import React, { Component } from "react";
import { View, TouchableOpacity, Text, Platform, StyleSheet } from "react-native";
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue
} from "../utils/helpers";
import UdacitySlider from "./UdacitySlider";
import UdacityStepper from "./UdacityStepper";
import DateHeader from "./DateHeader";
import { Ionicons } from '@expo/vector-icons';
import TextButton from "./TextButton";
import { submitEntry, removeEntry } from "../utils/api";
import { connect } from "react-redux";
import { addEntry } from "../actions";
import { white, purple,} from "../utils/colors"

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
        onPress={onPress}
        style={Platform.OS === "ios" ? styles.iosSubmitBtn : styles.androidSubmitBtn}
    >
        <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  };
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((state) => {
      const count = state[metric] + step;
      return {
        ...state,
        [metric]: count > max ? max : count
      };
    });
  };

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step;
      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      };
    });
  };

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }));
  };

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    // update Redux
    this.props.dispatch(
      addEntry({
        [key]: entry
      })
    );

    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    }));
    // Navigate to Home

    // save  to  "DB"
    submitEntry({ key, entry });
    // clearn local notification
  };

  reset = () => {
    const key = timeToString();

    // update Redux
    this.props.dispatch(
      addEntry({
        [key]: getDailyReminderValue()
      })
    );
    // Route to Home

    // Update "DB"
    removeEntry(key);
  };

  render() {
    const metaInfo = getMetricMetaInfo();
    // this.props.alreadyLogged
    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
            <Ionicons name={Platform.OS ==="ios"? 'ios-happy-outline':"md-happy"} size={100} />
            <Text>you already logged your information for today</Text>
            <TextButton style={{padding: 10}} onPress={this.reset}>reset</TextButton>
        </View>
      );
    }
    return (
      <View style={styles.container}>
          <DateHeader date={new Date().toLocaleDateString()} />

          {Object.keys(metaInfo).map(key => {
              const { getIcon, type, ...rest } = metaInfo[key];
              const value = this.state[key];
              return (
                  <View  style={styles.row} key={key}>
                      {getIcon()}
                      {type === "slider" ? (
                          <UdacitySlider
                              value={value}
                              onChange={value => this.slide(key, value)}
                              {...rest}
                          />
                      ) : (
                          <UdacityStepper
                              value={value}
                              onIncrement={() => this.increment(key)}
                              onDecrement={() => this.decrement(key)}
                              {...rest}
                          />
                      )}
                  </View>
              );
          })}
          <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding:20,
        backgroundColor: white
    },
    row:{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40,
    },
    androidSubmitBtn:{
        backgroundColor: purple,
        padding: 10,
        borderRadius: 2,
        height: 45,
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: "flex-end",
        justifyContent: 'center',
        alignItems: "center",
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center'
    },
    center:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight:30,
    },
})

function mapStateToProps(state) {
  const key = timeToString();
  return {
    alreadyLogged: state[key] && typeof state[key].today === "undefined"
  };
}

export default connect(mapStateToProps)(AddEntry);
