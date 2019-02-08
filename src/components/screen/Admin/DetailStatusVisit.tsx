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
  // Button,
  Alert,
  TouchableHighlight,
} from 'react-native';
import { TextInput, Button, TouchableRipple } from 'react-native-paper';
import { ratio, colors } from '../../../utils/Styles';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
import NumberFormat from 'react-number-format';
// import NotifService from '../NotifService';

interface IProps {
  navigation?: any;
  store?: any;
  // users?;
}

interface IState {
  isLoaded: boolean;
  users: any;
  catatanStatusLayanan;
  totalBayarLayanan;
  totalDeposit;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Detail Status Layanan',
  };
  // public notif: NotifService;
  private taskUser: any;

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      users: [],
      catatanStatusLayanan: '',
      totalBayarLayanan: '',
      totalDeposit: '',
    };
    // this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  public componentDidMount() {
    this.getFirstData();
  }

  public render() {
    return (
      <View style={styles.topContainer}>
        { this.state.isLoaded ?
            <ActivityIndicator /> :
            <View style={styles.container}>
              { this.state.users.map( (el, key) =>
                <View style={styles.header} key={key}>
                  <View style={styles.headerContent}>
                    {/* <Text style={styles.name}>{el.namaLengkap}</Text> */}
                    <Text style={styles.name}>Tanggal Request Visit : {el.tanggalRequestVisit}</Text>
                    <Text style={styles.name}>Nama Lengkap : {el.namaLengkap}</Text>
                    <Text style={styles.name}>Handphone : {el.handphone}</Text>
                    <Text style={styles.name}>Alamat : {el.alamat}</Text>

                    <View style={[{ width: '100%' }, {marginBottom: 5}]}>
                      <TextInput
                        label='Total Bayar Layanan'
                        value={this.state.totalBayarLayanan}
                        onChangeText={(totalBayarLayanan) => this.setState({ totalBayarLayanan })}
                        keyboardType='numeric'
                      />
                    </View>
                    <View style={[{width: '100%'}, {marginBottom: 10}]}>
                      <TouchableRipple>
                        <Button mode='contained'
                          onPress={() => this._onSubmit(el)}
                          disabled={this.state.catatanStatusLayanan === ''
                                      && parseInt(this.state.totalBayarLayanan, 10) > 0
                                      ? false : true }
                        >
                          Status Layanan OK
                        </Button>
                      </TouchableRipple>
                    </View>
                    <View style={[{width: '100%'}, {marginBottom: 5}]}>
                      <TouchableRipple>
                        <Button mode='contained' color='#c43e00'
                          onPress={() => this._onSubmitNOK(el)}
                          disabled={this.state.catatanStatusLayanan === '' ? true : false }
                        >
                          Status Layanan Tidak OK
                        </Button>
                      </TouchableRipple>
                    </View>
                    <View style={{ width: '100%' }}>
                      <TextInput
                        label='Catatan Status Layanan Tidak OK'
                        value={this.state.catatanStatusLayanan}
                        onChangeText={(catatanStatusLayanan) => this.setState({ catatanStatusLayanan })}
                        multiline={true}
                        numberOfLines={3}
                      />
                    </View>
                  </View>
                  {/* <View style={styles.card2}>
                  </View> */}
                </View>,
              )}
            </View>
        }
      </View>
    );
  }

  private async getFirstData( ) {
    const taskUser = db1.db.ref(`homecare/visit`);
                      // ${this.props.navigation.state.params.qey.el.idTransfer}`);
    // console.log(this.props.navigation.state.params);
    await taskUser.orderByChild('_id')
      .equalTo(`${this.props.navigation.state.params.qey.el.idRequestVisit}`).once('value')
      .then((result) => {
        const r1 = [];
        // r1.push(result.val());
        result.forEach((el) => {
          r1.push({
            uid: this.props.navigation.state.params.qey.el.uid,
            namaLengkap: el.val().namaLengkap,
            idRequestVisit: el.val()._id,
            tanggalRequestVisit: el.val().tanggalRequestVisit,
            alamat: el.val().alamat,
            handphone: el.val().handphone,
          });
        });
        this.setState({
          users: r1,
          isLoaded: false,
        });
        // console.log(r1);
        // console.log(this.state.users);
      }).catch((err) => {
        console.log(err);
    });
    db1.db.ref('users/' + this.props.navigation.state.params.qey.el.uid + '/saldoDeposit')
    .once('value').then((res) => { // res.val();
      this.setState({ totalDeposit : res.val()});
  });

  }

  private _onSubmit = (p) => {
    const url = 'homecare/visit';
    db1.db.ref(url + '/' + p.idRequestVisit).update({
      requestVisit: 'Done',
      requestVisitNote: '',
      totalBayarLayanan: this.state.totalBayarLayanan,
    });
    db1.db.ref('users/' + p.uid).update({
      requestVisit: 'Idle',
      requestVisitNote: '',
      saldoDeposit: parseInt(this.state.totalDeposit, 10) - parseInt(this.state.totalBayarLayanan, 10),
    });
    // this.notif.cancelAll();
    this.props.navigation.navigate('Home');
  }

  private _onSubmitNOK = (p) => {
    const url = 'homecare/visit';
    db1.db.ref(url + '/' + p.idRequestVisit).update({
      requestVisit: 'Done',
      requestVisitNote: this.state.catatanStatusLayanan,
    });
    db1.db.ref('users/' + p.uid).update({
      requestVisitNote: this.state.catatanStatusLayanan,
      requestVisit: 'Idle',
    });
    // this.notif.cancelAll();
    this.props.navigation.navigate('Home');
  }

  // public onRegister(token) {
  //   // Alert.alert("Registered !", JSON.stringify(token));
  //   console.log(token);
  //   // this.setState({ registerToken: token.token, gcmRegistered: true });
  // }

  // public onNotif(notif) {
  //   console.log(notif);
  //   // Alert.alert(notif.title, notif.message);
  // }

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
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingVertical: 30,
    // marginHorizontal: 0,
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
    fontSize: 16,
    color: '#FFFFFF',
    // fontWeight: '600',
    marginBottom: 10,
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
  card2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    padding: 30,
    margin: 10,
    // borderBottomColor: '#CFD8DC',
    // borderBottomWidth: 1,
    // flexGrow: 0,
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 200,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#58a5f0',
  },
});
