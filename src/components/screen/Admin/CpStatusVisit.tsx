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
  Button,
  Alert,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { ratio, colors } from '../../../utils/Styles';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
import NumberFormat from 'react-number-format';
import NotifService from '../NotifService';

interface IProps {
  navigation?: any;
  store?: any;
  tabLabel?;
}

interface IState {
  isLoaded: boolean;
  users: any;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {

  public notif: NotifService;
  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`homecare/visit`);
    this.state = {
      isLoaded: true,
      users: [],
    };
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  public componentDidMount() {
    this.getFirstData(this.taskUser);
    this.getNotif(this.taskUser);
    // console.log(this.state.users);
  }

  public render() {
    return (
      <View style={styles.topContainer}>
      <ScrollView>
        {/* <Text style={styles.textInfo}>Daftar User Done Visit</Text> */}
        { this.state.isLoaded ?
            <ActivityIndicator /> :
            <View style={styles.container}>
              { this.state.users.map( (el, key) =>
                <View style={styles.header} key={key}>
                  <TouchableOpacity
                    // style={[styles.buttonContainer, styles.loginButton]}
                    onPress={() =>
                      this.props.navigation.navigate('DetailStatusVisit' , {qey : {el}})
                      // this._onRequest()
                    }
                  >
                    <View style={styles.headerContent}>
                      <Text style={styles.name}>{el.namaLengkap}</Text>
                    </View>
                  </TouchableOpacity>
                </View>,
              )}
            </View>
        }
        </ScrollView>
      </View>
    );
  }

  private async getFirstData( p ) {
    await p.orderByChild('requestVisit')
      .equalTo('Menunggu Team Homecare')
      .on('value', (snap) => {
      const r1 = [];
      snap.forEach((el) => {
        r1.push({
          uid: el.val().uid,
          namaLengkap: el.val().namaLengkap,
          idRequestVisit: el.val()._id,
          tanggalRequestVisit: el.val().tanggalRequestVisit,
        });
      });
      this.setState({
        users: r1,
        isLoaded: false,
      });
      this.props.store.user.userBadge3 = r1.length;
    });

  }

  private async getNotif(p) {
    await p.orderByChild('requestVisit')
      .equalTo('Menunggu Team Homecare')
      .on('child_added', (snap) => {
        // console.log(snap.val());
        // snap.forEach(el => {
          this.notif.localNotifFor( 'Update Status Layanan ',
                                      snap.val().namaLengkap );
          
        // });
      })
  }

  public onRegister(token) {
    // Alert.alert("Registered !", JSON.stringify(token));
    console.log(token);
    // this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  public onNotif(notif) {
    console.log(notif);
    // Alert.alert(notif.title, notif.message);
  }

  public handlePerm(perms) {
    console.log(perms);
    // Alert.alert("Permissions", JSON.stringify(perms));
  }

}

export default Screen;

const styles: any = StyleSheet.create({
  topContainer: {
    flex: 1,
    // flexGrow: 1,
    width: '100%',
    padding: 10,
    // backgroundColor: 'yellow',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    // marginVertical: 10,
    // marginHorizontal: 0,
    // height : 100,
    // marginTop : 10,
    // flexGrow: 1,
  },
  // card1: {
  //   flex: 1,
  //   height: 50,
  // },
  header: {
    // marginHorizontal: 0,
    width: '100%',
    // flexGrow: 1,
    flex: 1,
    // paddingVertical: 30,
    marginBottom: 10,
  },
  headerContent: {
    backgroundColor: '#0277bd',
    padding: 15,
    borderRadius: 15,
    // paddingHorizontal: 30,
    // marginLeft: 15,
    // marginHorizontal: 0,
    alignItems: 'flex-start',
    width: '100%',
    // flex: 1,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  textInfo: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    color: '#616161',
  },
  smallTextInfo: {
    fontSize: 14,
    marginBottom: 10,
    color: '#696969',
  },
  itemSpaceV10: {
    marginVertical: 10,
  },
});
