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
  List,
} from 'react-native-paper';
import * as db1 from '../../../firebase/firebase';

interface IProps {
  navigation?: any;
  store: any;
}

interface IState {
  isLoaded: boolean;
  users: any[];
  itemsPesan;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Konfirmasi Pesanan',
  };

  public taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users`);
    this.state = {
      isLoaded: true,
      users: [],
      itemsPesan: [],
    };
  }

  public componentDidMount() {
    // console.log(this.props.navigation);
    // this.getFirstData(this.taskUser);
    this.setState({
      itemsPesan: this.props.navigation.state.params.el.itemsPesan,
      isLoaded: false,
    });
  }

  public render() {
    const {itemsPesan} = this.state;
    return (
      <View style={styles.container}>
        { this.state.isLoaded ?
          <ActivityIndicator /> :
          <View style={{padding: 10}}>
            { itemsPesan.map((el) =>
              <View key={el.IdObat} style={{marginTop: 10}}>
                <Title>{el.NamaObat}</Title>
                <Subheading>{el.ResepObat}</Subheading>
              </View>,
            ) }
          </View>
        }
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
