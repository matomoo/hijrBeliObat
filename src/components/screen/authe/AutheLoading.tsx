import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
} from 'react-native';
import { ratio, colors } from '../../../utils/Styles';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import { db } from 'src/firebase';
import * as db1 from '../../../firebase/firebase';

interface IProps {
  navigation?: any;
  store: any;
}

interface IState {
  isLoggingIn: boolean;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {

  constructor(props) {
    super(props);
    this._bootstrapAsync();
    this.state = {
      isLoggingIn: false,
    };
  }

  public render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle='default' />
      </View>
    );
  }

  // Fetch the token from storage then navigate to our appropriate place
  private _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log(userToken, this.props.store.user.uid);
    if (userToken) {
      this.props.store.user.uid = userToken;
      db1.db.ref(`users/${userToken}`).on('value', (el) => {
          this.props.store.user.userRole = el.val().role;
          this.props.store.user.userNamaLengkap = el.val().namaLengkap;
          this.props.store.user.userTerms = el.val().userTerms;
          this.props.store.user.userHandphone = el.val().handphone;
          this.props.store.user.userAlamat = el.val().alamat;
          this.props.store.user.userAuth = 'yesAuth';
          this.props.navigation.navigate('App');
        });
    } else {
      this.props.navigation.navigate('App');
      this.props.store.user.userAuth = 'notAuth';
    }
    // this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  }

}

export default Screen;

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
  },
});
