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
  ScrollView,
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
  catatanRequestVisit;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Detail Layanan Pesanan Obat',
  };

  // public notif: NotifService;
  private taskUser: any;

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      users: [],
      catatanRequestVisit: '',
    };
    // this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  public componentDidMount() {
    this.getFirstData();
  }

  public render() {
    return (
      <View style={styles.topContainer}>
        <ScrollView>
        { this.state.isLoaded ?
            <ActivityIndicator /> :
            <View style={styles.container}>
              { this.state.users.map( (el, key) =>
                <View style={styles.header} key={key}>
                  <View style={styles.headerContent}>
                    {/* <Text style={styles.name}>{el.namaLengkap}</Text> */}
                    <Text style={styles.name}>Tanggal Request Layanan Obat : {el.tanggalRequestVisit}</Text>
                    <Text style={styles.name}>Nama Lengkap : {el.namaLengkap}</Text>
                    <Text style={styles.name}>Handphone : {el.handphone}</Text>
                    <Text style={styles.name}>Alamat : {el.alamat}</Text>
                    <Text  style={styles.name}>Item Pesanan Obat: </Text>
                    { JSON.parse(el.itemLayanan).map((res, key2) =>
                      <View key={key2}>
                        <Text style={styles.name}>
                          - {res.NamaObat}
                          ( {res.ResepObat} )
                        </Text>
                      </View>,
                      )}
                    <Image style={styles.buktiBayar}
                      source={{uri: el.resepSS }}/>
                    <View style={[{width: '100%'}, {marginBottom: 10}]}>
                      <TouchableRipple>
                        <Button mode='contained'
                          onPress={() => this._onSubmit(el)}
                          disabled={this.state.catatanRequestVisit === '' ? false : true }
                        >
                          Request Layanan OK
                        </Button>
                      </TouchableRipple>
                    </View>
                    <View style={[{width: '100%'}, {marginBottom: 5}]}>
                      <TouchableRipple>
                        <Button mode='contained' color='#c43e00'
                          onPress={() => this._onSubmitNOK(el)}
                          disabled={this.state.catatanRequestVisit === '' ? true : false }
                        >
                          Request Layanan Tidak OK
                        </Button>
                      </TouchableRipple>
                    </View>
                    <View style={{ width: '100%' }}>
                      <TextInput
                        label='Catatan Request Layanan Tidak OK'
                        value={this.state.catatanRequestVisit}
                        onChangeText={(catatanRequestVisit) => this.setState({ catatanRequestVisit })}
                        multiline={true}
                        numberOfLines={3}
                      />
                    </View>
                  </View>

                </View>,
              )}
            </View>
        }
      </ScrollView>
      </View>
    );
  }

  private async getFirstData( ) {
    const taskUser = db1.db.ref(`pesananObat`);
    await taskUser.orderByChild('idPesananObat')
      .equalTo(`${this.props.navigation.state.params.qey.el.idRequestVisit}`).once('value')
      .then((result) => {
        const r1 = [];
        // r1.push(result.val());
        result.forEach((el) => {
          r1.push({
            uid: this.props.navigation.state.params.qey.el.uid,
            namaLengkap: el.val().namaPemesan,
            idRequestVisit: el.val().idPesananObat,
            tanggalRequestVisit: el.val().tanggalPesananObat,
            alamat: el.val().alamatPemesan,
            handphone: el.val().handphonePemesan,
            itemLayanan: el.val().itemPesanan,
            resepSS: el.val().resepSS,
            // itemObat: el.val().itemObat,
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
  }

  private _onSubmit = (p) => {
    const url = 'pesananObat';
    db1.db.ref(url + '/' + p.idRequestVisit).update({
      // requestVisit: 'Menunggu Team',
      // requestVisitNote: 'Menunggu Team',
      statusPesananObat: 'Pesanan obat dalam pengantaran',
    });
    db1.db.ref('users/' + p.uid).update({
      // requestVisit: 'Menunggu Team',
      // requestVisitNote: 'Menunggu Team',
      statusPesananObat: 'Pesanan obat dalam pengantaran',
      userResep: 'Tidak ada reseps',
      resepSS: '-',
    });
    // this.notif.cancelAll();
    this.props.navigation.navigate('LandingHomeScreen');
  }

  private _onSubmitNOK = (p) => {
    const url = 'pesananObat';
    db1.db.ref(url + '/' + p.idRequestVisit).update({
      requestVisit: 'Idle',
      requestVisitNote: this.state.catatanRequestVisit,
    });
    db1.db.ref('users/' + p.uid).update({
      requestVisit: 'Idle',
      requestVisitNote: this.state.catatanRequestVisit,
    });
    // this.notif.cancelAll();
    this.props.navigation.navigate('LandingHomeScreen');
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
    // justifyContent: 'flex-start',
    flexDirection: 'column',
    // width: '100%',
    flex: 1,
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
  buktiBayar: {
    width: 300,
    height: 400,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 5,
    backgroundColor: 'white',
  },
});
