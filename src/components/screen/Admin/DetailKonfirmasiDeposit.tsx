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

interface IProps {
  navigation?: any;
  store?: any;
  // users?;
}

interface IState {
  isLoaded: boolean;
  __users: any;
  totalDeposit;
  buktiBayar;
  catatanKonfirmasiDeposit;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Detail Konfirmasi Deposit',
  };

  private taskUser: any;

  constructor(props) {
    super(props);
    // this.taskUser = db1.db.ref(`users/
    //                   ${this.props.navigation.state.params.qey.el.uid}/
    //                   deposit/
    //                   ${this.props.navigation.state.params.qey.el.idTransfer}`);
    this.state = {
      isLoaded: true,
      __users: [],
      totalDeposit: '0',
      buktiBayar: 'assets:/thumbnail-bukti.png',
      catatanKonfirmasiDeposit: '',
    };
  }

  public componentDidMount() {
    this.getFirstData();
  }

  public render() {
    return (
        <ScrollView>
      <View style={styles.topContainer}>
        {/* <Text style={styles.textInfo}>Detail Informasi Transfer</Text> */}
        { this.state.isLoaded ?
            <ActivityIndicator /> :
            <View style={styles.container}>
              { this.state.__users.map( (el, key) =>
                <View style={styles.header} key={key}>
                  <View style={styles.headerContent}>
                    {/* <Text style={styles.name}>{el.namaLengkap}</Text> */}
                    <Text style={styles.name}>Tanggal transfer : {el.tanggalTransfer}</Text>
                    <Text style={styles.name}>Nama pengirim : {el.namaPengirim}</Text>
                    <Text style={styles.name}>Handphone pengirim : {el.handphonePengirim}</Text>
                    <Text style={styles.name}>Bank pengirim : {el.bankPengirim}</Text>
                    <NumberFormat
                      value={el.jumlahTransfer}
                      displayType={'text'} thousandSeparator={true} prefix={'Rp. '}
                      renderText={(value) => <Text style={styles.name}>Jumlah transfer : {value}</Text>} />
                    {/* <Text style={styles.name}>Jumlah transfer : {el.jumlahTransfer}</Text> */}
                    <Text style={styles.name}>Screenshot bukti bayar:</Text>
                    <Image style={styles.buktiBayar}
                      source={{uri: this.state.buktiBayar }}/>
                    <View style={[{width: '100%'}, {marginVertical: 10}]}>
                      <TouchableRipple>
                        <Button mode='contained'
                          onPress={() => this._onSubmit()}
                          disabled={this.state.catatanKonfirmasiDeposit === '' ? false : true }
                        >
                          Konfirmasi Deposit OK
                        </Button>
                      </TouchableRipple>
                    </View>
                    <View style={[{width: '100%'}, {marginBottom: 5}]}>
                      <TouchableRipple>
                        <Button mode='contained' color='#c43e00'
                          onPress={() => this._onSubmitNOK()}
                          disabled={this.state.catatanKonfirmasiDeposit === '' ? true : false }
                        >
                          Konfirmasi Deposit Tidak OK
                        </Button>
                      </TouchableRipple>
                    </View>
                    <View style={{ width: '100%' }}>
                      <TextInput
                        label='Catatan Konfirmasi Deposit Tidak OK'
                        value={this.state.catatanKonfirmasiDeposit}
                        onChangeText={(catatanKonfirmasiDeposit) => this.setState({ catatanKonfirmasiDeposit })}
                        multiline={true}
                        numberOfLines={3}
                      />
                    </View>

                    {/* <View
                      // style={{justifyContent: 'center'}}
                      >
                      <TouchableOpacity
                        style={[styles.buttonContainer, styles.loginButton]}
                          onPress={() => this._onSubmit()}
                      >
                        <Text style={styles.loginText}>Pembayaran OK</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.buttonContainer, styles.loginButton]}
                          onPress={() => this._onReject()}
                      >
                        <Text style={styles.loginText}>Pembayaran Tidak OK</Text>
                      </TouchableOpacity>
                    </View> */}
                  </View>
                  {/* <View style={styles.card2}>
                  </View> */}
                </View>,
              )}
            </View>
        }
      </View>
        </ScrollView>
    );
  }

  private async getFirstData( ) {
    const taskUser = db1.db.ref(`users/${this.props.navigation.state.params.qey.el.uid}/deposit`);
                      // ${this.props.navigation.state.params.qey.el.idTransfer}`);
    // console.log(this.props.navigation.state.params);
    await taskUser.orderByChild('_id').equalTo(`${this.props.navigation.state.params.qey.el.idTransfer}`).once('value')
      .then((result) => {
        const r1 = [];
        // r1.push(result.val());
        result.forEach((el) => {
          r1.push({
            uid: this.props.navigation.state.params.qey.el.uid,
            // // namaPengirim: el.val().namaPengirim,
            tanggalTransfer: el.val().tanggalTransfer,
            namaPengirim: el.val().namaPengirim,
            handphonePengirim: el.val().handphonePengirim,
            bankPengirim: el.val().bankPengirim,
            jumlahTransfer: el.val().jumlahTransfer,
            idTransfer: el.val()._id,
            // ssBuktiBayar: el.val().ssBuktiBayar,
          });
        });
        this.setState({
          __users: r1,
          isLoaded: false,
        });
        db1.db.ref('users/' + this.props.navigation.state.params.qey.el.uid + '/saldoDeposit')
          .once('value').then((res) => { // res.val();
            this.setState({ totalDeposit : res.val()});
        });
        db1.db.ref('users/' + this.props.navigation.state.params.qey.el.uid + '/buktiBayarSS')
          .once('value').then((res) => { // res.val();
            this.setState({ buktiBayar: res.val() });
        });
        // console.log(r1);
        // console.log(this.state.users);
      }).catch((err) => {
        console.log(err);
    });
  }

  private _onSubmit = () => {
    // Alert.alert(this.props.store.user.uid);
    // console.log('state', this.state);
    // console.log('navigation', this.props.navigation.state.params);
    const url = 'users/' + this.props.navigation.state.params.qey.el.uid;
    db1.db.ref(url).update({
      statusDeposit: 'OK',
      saldoDeposit: parseInt(this.state.totalDeposit, 10) + parseInt(this.state.__users[0].jumlahTransfer, 10),
      // parseInt(this.state.totalDeposit, 10) + parseInt(this.state.__users.jumlahTransfer, 10),
    });
    db1.db.ref(url + '/deposit/' + this.props.navigation.state.params.qey.el.idTransfer).update({
      statusVerifikasi: 'OK',
    });
    db1.db.ref('deposit/konfirmasi')
      .child(this.props.navigation.state.params.qey.el.idTransfer).remove();
    this.props.navigation.navigate('LandingHomeScreen');
  }

  private _onSubmitNOK = () => {
    const url = 'users/' + this.props.navigation.state.params.qey.el.uid;
    db1.db.ref(url).update({
      statusDeposit: this.state.catatanKonfirmasiDeposit,
    });
    db1.db.ref(url + '/deposit/' + this.props.navigation.state.params.qey.el.idTransfer).update({
      statusDeposit: this.state.catatanKonfirmasiDeposit,
    });
    db1.db.ref('deposit/konfirmasi')
      .child(this.props.navigation.state.params.qey.el.idTransfer).remove();
    this.props.navigation.navigate('LandingHomeScreen');
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
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingVertical: 30,
    // marginHorizontal: 0,
  },
  headerContent: {
    backgroundColor: '#2e7d32',
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
    backgroundColor: '#00b5ec',
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
