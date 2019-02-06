import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  // Text,
  View,
  TouchableHighlight,
  // TextInput,
  ScrollView,
  DatePickerAndroid,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { Button, Headline, IconButton, Colors, Subheading,
  Caption, Card, Title, Paragraph, TouchableRipple, Text, TextInput,
} from 'react-native-paper';
import * as db1 from '../../../firebase/firebase';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import ImagePicker from 'react-native-image-picker';
import firebase from 'firebase';
import RNFetchBlob from 'rn-fetch-blob';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  tanggalTransfer;
  namaPengirim;
  bankPengirim;
  handphonePengirim;
  jumlahTransfer;
  buktiBayar;
  notifUpload;
  users;
  userResep;
  statusDeposit;
  saldoDeposit;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Upload Resep',
  };
  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users/${this.props.store.user.uid}`);
    this.state = {
      tanggalTransfer : '',
      namaPengirim : '',
      bankPengirim: '',
      handphonePengirim : '',
      jumlahTransfer : '',
      buktiBayar : 'assets:/thumbnail-bukti.png',
      notifUpload : '',
      users: [],
      userResep: '',
      statusDeposit: '',
      saldoDeposit: '',
    };
  }

  public componentDidMount() {
    if (this.props.store.user.userAuth === 'yesAuth') {
      this.getFirstData(this.taskUser);
    }
  }

  public render() {
    return (
      <ScrollView style={{width: '100%'}}>
        <View style={{width: '100%'}}>
          {/* { this.state.statusDeposit === 'OK' &&
            <View style={{margin: 10}}>
              <Subheading>Status : {this.state.statusDeposit}</Subheading>
              <Button mode='outlined'
                onPress={() => this._onToggleForm()} >
                Toggle Form Upload Resep
              </Button>
            </View>
          } */}
          <View style={{margin: 10}}>
            <TextInput
              disabled={true}
              mode='outlined'
              label='Tanggal Transfer'
              value={this.state.tanggalTransfer}
              onChangeText={(tanggalTransfer) => this.setState({tanggalTransfer})}/>
            <Button onPress={() => this._onDateTap()}>
              Pilih Tanggal
            </Button>
            <TextInput
              mode='outlined'
              label='Nama Pengirim'
              value={this.state.namaPengirim}
              onChangeText={(namaPengirim) => this.setState({namaPengirim})}/>
            <TextInput
              mode='outlined'
              label='Bank Pengirim'
              value={this.state.bankPengirim}
              onChangeText={(bankPengirim) => this.setState({bankPengirim})}/>
            <TextInput
              mode='outlined'
              label='Handphone Pengirim'
              keyboardType='number-pad'
              value={this.state.handphonePengirim}
              onChangeText={(handphonePengirim) => this.setState({handphonePengirim})}/>
            <TextInput
              mode='outlined'
              label='jumlahTransfer'
              keyboardType='number-pad'
              value={this.state.jumlahTransfer}
              onChangeText={(jumlahTransfer) => this.setState({jumlahTransfer})}/>
          </View>
          {/* { this.state.userResep === 'Resep uploading' && */}
            <View>
              <View style={{margin: 10}}>
                <Card>
                  <Card.Cover source={{ uri: this.state.buktiBayar} } />
                  <Card.Actions>
                    <Button mode='text'
                      disabled={this.state.notifUpload === '- uploading ...' ? true : false}
                      onPress={() => this._onPressAva5()}>
                      Upload Bukti Bayar {this.state.notifUpload}
                    </Button>
                  </Card.Actions>
                </Card>
              </View>

              <View style={{margin: 10}}>
                <Button mode='contained'
                  disabled={
                              // this.state.tanggalTransfer = '' ||
                              this.state.namaPengirim === '' ||
                              this.state.bankPengirim === '' ||
                              this.state.handphonePengirim === '' ||
                              this.state.jumlahTransfer === '' ||
                              this.state.notifUpload !== 'done' ||
                              this.props.store.user.userAuth === 'notAuth'
                              ? true : false }
                  onPress={() => this._onSubmit()} >
                  Submit Bukti Bayar {this.props.store.user.userAuth === 'notAuth' ? 'Silahkan login dulu' : ''}
                </Button>
              </View>
            </View>
          {/* } */}
        </View>
      </ScrollView>
    );
  }

  public _onSubmit() {
    const a = db1.db.ref(`users/${this.props.store.user.uid}/deposit`).push();
    db1.db.ref(`users/${this.props.store.user.uid}/deposit/${a.key}`).update({
      _id: a.key,
      tanggalTransfer: this.state.tanggalTransfer,
      namaPengirim: this.state.namaPengirim,
      bankPengirim: this.state.bankPengirim,
      handphonePengirim: this.state.handphonePengirim,
      jumlahTransfer: this.state.jumlahTransfer,
    });
    db1.db.ref(`users/${this.props.store.user.uid}`).update({
      statusDeposit: 'Menunggu verifikasi',
      buktiBayarSS: this.state.buktiBayar,
      // saldoDeposit: parseInt( this.state.saldoDeposit, 10 ) + parseInt(this.state.jumlahTransfer, 10),
    });
    db1.db.ref(`deposit/konfirmasi/${a.key}`).update({
      _id: a.key,
      uid: this.props.store.user.uid,
      namaLengkap: this.props.store.user.userNamaLengkap,
    });
    this.props.navigation.navigate('LandingHomeScreen');
  }

  private async _onDateTap() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // date: new Date(2020, 4, 25)
        date: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ tanggalTransfer : `${day}/${month + 1}/${year}` });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  private _onToggleForm() {
    this.setState({statusDeposit: 'Bukti bayar uploading'});
  }

  private async getFirstData( p ) {
    await p.on('value', (result) => {
      this.setState({
        // namaPengirim : result.val().namaPengirim,
        // handphonePengirim : result.val().handphonePengirim,
        // jumlahTransfer : result.val().jumlahTransfer,
        // buktiBayar : result.val().buktiBayar,
        saldoDeposit: result.val().saldoDeposit,
        statusDeposit: result.val().statusDeposit,
      });
    });
  }

  private _onPressAva5() {
    const options = {
      title: 'Pilih Bukti Bayar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      this.setState({ notifUpload: '- uploading ...'});
      // console.log('filesize', response.type, response.fileSize);
      const image = response.uri;
      const dbRef = firebase.storage().ref('users/' + this.props.store.user.uid + '/resep/buktiBayar.jpg');

      const Blob = RNFetchBlob.polyfill.Blob;
      const fs = RNFetchBlob.fs;
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;

      const uploadImage = (uri, fbRef, mime = 'image/jpg') => {
        return new Promise((resolve, reject) => {
          const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          let uploadBlob = null;
          // const imageRef = firebase.storage().ref('posts').child(imageName);
          const imageRef = fbRef;
          fs.readFile(uploadUri, 'base64')
            .then((data) => {
              return Blob.build(data, { type: `${mime};BASE64` });
            })
            .then((blob) => {
              uploadBlob = blob;
              return imageRef.put(blob, { contentType: mime });
            })
            .then(() => {
              uploadBlob.close();
              return imageRef.getDownloadURL();
            })
            .then((url) => {
              resolve(url);
              // console.log(url);
            })
            .catch((error) => {
              reject(error);
            });
        });
      };

      uploadImage(image, dbRef)
        .then((res) => {
          this.setState({ buktiBayar: res,
                            notifUpload: 'done',
           });
        })
        .catch((err) => {
          console.log(err);
        })
      ;
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
    padding: 10,
    // width: '100%',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
