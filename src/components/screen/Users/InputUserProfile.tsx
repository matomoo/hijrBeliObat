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
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { Button, Headline, IconButton, Colors,
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
  email;
  namaLengkap;
  handphone;
  alamat;
  userAvatar;
  notifUpload;
  users;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Ubah User Profile',
  };
  private taskUser: any;

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users/${this.props.store.user.uid}`);
    this.state = {
      email : '',
      namaLengkap : '',
      handphone : '',
      alamat : '',
      userAvatar : 'https://bootdey.com/img/Content/avatar/avatar1.png',
      notifUpload : '',
      users: [],
    };
  }

  public componentDidMount() {
    this.getFirstData(this.taskUser);
  }

  public render() {
    return (
      <ScrollView>
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <TextInput
              mode='outlined'
              label='Nama Lengkap'
              value={this.state.namaLengkap}
              onChangeText={(namaLengkap) => this.setState({namaLengkap})}/>
          <TextInput
              mode='outlined'
              label='Handphone'
              keyboardType='number-pad'
              value={this.state.handphone}
              onChangeText={(handphone) => this.setState({handphone})}/>
          <TextInput
              mode='outlined'
              label='Alamat'
              multiline={true}
              numberOfLines={4}
              value={this.state.alamat}
              onChangeText={(alamat) => this.setState({alamat})}/>
        </View>
        <View style={{width: '100%', marginTop: 5}}>
            {/* <Text style={styles.itemLeft}>Screenshot Bukti Bayar {this.state.notifUpload}</Text> */}
            {/* <TouchableOpacity
              onPress={() => this._onPressAva5()}
              > */}
              {/* <Image style={styles.avatar}
                source={{uri: this.state.buktiBayar }}/> */}
              <Card>
                <Card.Cover source={{ uri: this.state.userAvatar} } />
                <Card.Actions>
                  <Button mode='text'
                    onPress={() => this._onPressAva5()}>
                    Pilih Gambar
                  </Button>
                </Card.Actions>
              </Card>
            {/* </TouchableOpacity> */}
          </View>

        <View style={{marginTop: 10}}>
          <Button mode='contained'
            disabled={this.state.namaLengkap === '' ||
                        this.state.handphone === '' ||
                        this.state.alamat === ''
                        ? true : false }
            onPress={() => this._onSubmit()} >
            Submit
          </Button>
        </View>

      </View>
      </ScrollView>
    );
  }

  public _onSubmit() {
    this.taskUser.update({
      namaLengkap: this.state.namaLengkap,
      handphone: this.state.handphone,
      alamat: this.state.alamat,
      userAvatar: this.state.userAvatar,
    });
    this.props.navigation.navigate('LandingHomeScreen');
  }

  private async getFirstData( p ) {
    await p.once('value', (result) => {
      // const r1 = [];
      // r1.push(result.val());
      // console.log(result.val());
      this.setState({
        namaLengkap : result.val().namaLengkap,
        handphone : result.val().handphone,
        alamat : result.val().alamat,
        userAvatar : result.val().userAvatar,
        // users: r1,
        // isLoaded: false,
      });
    });
  }

  private _onPressAva5() {
    // this.setState({ notifUpload: '- uploading...'});
    const options = {
      title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      this.setState({ notifUpload: '- uploading ...'});
      // console.log('filesize', response.type, response.fileSize);
      const image = response.uri;
      const dbRef = firebase.storage().ref('users/' + this.props.store.user.uid + '/images/avatar.jpg');

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
          // console.log(res);
          // db1.db.ref('users/' + this.props.store.user.uid).update({
          //   ssBuktiBayar: res,
          // });
          this.setState({ userAvatar: res,
                          notifUpload: 'upload done.',
                          // formDone:
                          //   this.state.namaPengirim === ''
                          //   || this.state.bankPengirim === ''
                          //   || this.state.handphonePengirim === ''
                          //   || parseInt(this.state.jumlahTransfer, 10) <= 0 ?
                          //   false : true,
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
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
