import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  AsyncStorage,
  Alert,
} from 'react-native';
// import { Button } from 'react-native-paper';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { TextInput, Button, TouchableRipple } from 'react-native-paper';
import TabBar from 'react-native-underline-tabbar';
// import NotifService from '../NotifService';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';

import NotifService from '../NotifService';

// import { ratio, colors } from '../../../utils/Styles';
import CpKonfirmasiDeposit from './CpKonfirmasiDeposit';
import CpRequestVisit from './CpRequestVisit';
import CpStatusVisit from './CpStatusVisit';

@inject('store') @observer
class Index extends Component<any, any> {
  public notif: NotifService;

  constructor(props) {
    super(props);
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  public render() {
      return (
        <View style={styles.container}>
        <ScrollableTabView
            tabBarActiveTextColor='#53ac49'
            renderTabBar={() => <TabBar underlineColor='#53ac49' />}
            style={{width: '100%'}}
            prerenderingSiblingsNumber={1}
            >
          <CpKonfirmasiDeposit tabLabel={{label: 'Konfirmasi Deposit',
              badge: this.props.store.user.userBadge1, badgeColor: 'red'}}
            navigation={ this.props.navigation } />
          <CpRequestVisit tabLabel={{label: 'Layanan Pesanan Obat',
              badge: this.props.store.user.userBadge2, badgeColor: 'red'}}
            navigation={ this.props.navigation } />
          {/* <CpStatusVisit tabLabel={{label: 'Status Layanan',
              badge: this.props.store.user.userBadge3, badgeColor: 'red'}}
            navigation={ this.props.navigation } /> */}
          {/* <Page tabLabel={{label: 'Developr'}} /> */}
          {/* <Page tabLabel={{label: 'Page Demo'}} />
          <Page tabLabel={{label: 'Page Demo'}} /> */}
        </ScrollableTabView>
        {/* <Button onPress={() => this.notif.localNotif()}>Tes</Button> */}
        </View>
      );
  }

  public onRegister(token) {
    Alert.alert('Registered !', JSON.stringify(token));
    // console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  public onNotif(notif) {
    // console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  public handlePerm(perms) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }

}

export default Index;

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    backgroundColor: '#00BFFF',
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name2: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    color: '#00BFFF',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
});
