import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import { Button, Headline, IconButton, Colors,
  Caption, Card, Title, Paragraph, TouchableRipple, Subheading,
} from 'react-native-paper';
import * as db1 from '../../firebase/firebase';
import InputResep from '../screen/Landing/InputResep';

interface IProps {
  navigation?: any;
  store: any;
}

interface IState {
  isLoaded: boolean;
  users: any[];
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Resep',
  };

  public taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users`);
    this.state = {
      isLoaded: true,
      users: [],
    };
  }

  public componentDidMount() {
    // this.getFirstData(this.taskUser);
    // console.log(this.state.users);
  }

  public render() {
    return (
      <View style={styles.container}>
        <InputResep navigation={this.props.navigation} />
      </View>
    );
  }

  private async getFirstData( p ) {
    await p
      .on('value', (snap) => {
      const r1 = [];
      snap.forEach((el) => {
        // console.log(el.val());
        r1.push({
          uid: el.val()._id,
          namaLengkap: el.val().namaLengkap,
          email: el.val().email,
          userRole: el.val().role,
        });
        // console.log(r1);
      });
      this.setState({
        users: r1,
        isLoaded: false,
      });
    });
  }

}

export default Screen;

interface IStyle {
  container: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<IStyle>({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // width: '100%',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
