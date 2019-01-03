import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { ratio, colors } from '../../utils/Styles';

interface IStyle {
  container: ViewStyle;
  text: TextStyle;
}

class Screen extends Component<any, any> {
  static navigationOptions = {
    title: 'Klinik Mata Hasanuddin',
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Screen</Text>
      </View>
    );
  }
}

export default Screen;

const styles = StyleSheet.create<IStyle>({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});