import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  // Text,
  View,
  AsyncStorage,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as db1 from '../../../firebase/firebase';
import { Button, Headline, IconButton, Colors,
  Caption, Card, Title, Paragraph, TouchableRipple, Text,
} from 'react-native-paper';

import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import { auth, db } from '../../../firebase';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded;
  users;
  email;
  password;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'User Profile',
  };

  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users/${this.props.store.user.uid}`);
    this.state = {
      isLoaded: false,
      email: '',
      password: '',
      users: [],
    };
  }

  public componentDidMount() {
    if (this.props.store.user.userAuth === 'yesAuth') {
      this.getFirstData(this.taskUser);
    }
  }

  public render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          { this.props.store.user.userAuth === 'yesAuth' &&
            <View style={[{width: '100%'}, {marginTop: 10}]}>
              { this.state.users.map( (el, key) =>
                <View key={key}>
                  <Card style={[{margin: 10}]}>
                    <Card.Cover source={{ uri: el.userAvatar} } />
                    <Card.Content>
                          <Title>Nama Lengkap : { el.namaLengkap }</Title>
                          <Title>Handphone : { el.handphone }</Title>
                          <Title>Alamat : { el.alamat }</Title>
                    </Card.Content>
                    <Card.Actions>
                      <Button mode='text'
                        // style={{ marginRight: 5}}
                        onPress={() => this.props.navigation.navigate('InputUserProfileScreen')}>
                        Ubah user profile
                      </Button>
                      <Button mode='text'
                        onPress={() => this.props.navigation.navigate('UserChangePwdScreen')}>
                        Ubah password
                      </Button>
                    </Card.Actions>
                  </Card>
                </View>,
              )}
              <View style={[{marginTop: 10}]}>
                <Button mode='outlined'
                  onPress={() => this._onLogout()} >
                  Logout
                </Button>
              </View>
            </View>
          }
          { this.props.store.user.userAuth === 'notAuth' &&
            <View style={[{marginTop: 30}]}>
              <Button mode='outlined'
                onPress={() => this.props.navigation.navigate('AutheLoadingScreen')}>
                Login
              </Button>
            </View>
          }
        </View>
      </ScrollView>
    );
  }

  private async getFirstData( p ) {
    await p.on('value', (result) => {
      const r1 = [];
      r1.push(result.val());
      this.setState({
        users: r1,
        isLoaded: false,
      });
    });
  }

  private _onLogout = async () => {
    await AsyncStorage.clear();
    auth.doSignOut();
    this.props.navigation.navigate('Auth');
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
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
