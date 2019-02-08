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
  email;
  namaLengkap;
  handphone;
  alamat;
  resepSS;
  notifUpload;
  users;
  userResep;
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
      email : '',
      namaLengkap : '',
      handphone : '',
      alamat : '',
      resepSS : 'assets:/thumbnail-bukti.png',
      notifUpload : '',
      users: [],
      userResep: '',
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
          { this.state.userResep === 'Resep sudah di upload' &&
            <View style={{margin: 10}}>
              <Subheading>Status : {this.state.userResep}</Subheading>
              <Card>
                <Card.Cover source={{ uri: this.state.resepSS} } />
              </Card>
              <Button mode='outlined'
                onPress={() => this._onToggleForm()} >
                Lihat Form Upload Resep
              </Button>
            </View>
          }
          {/* <View style={{margin: 10}}>
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
          </View> */}
          { this.state.userResep !== 'Resep sudah di upload' &&
            <View>
              <View style={{margin: 10}}>
                <Card>
                  <Card.Cover source={{ uri: this.state.resepSS} } />
                  <Card.Actions>
                    <Button mode='text'
                      disabled={this.state.notifUpload === '- uploading ...' ? true : false}
                      onPress={() => this._onPressAva5()}>
                      Upload Resep {this.state.notifUpload}
                    </Button>
                  </Card.Actions>
                </Card>
              </View>

              <View style={{margin: 10}}>
                <Button mode='contained'
                  disabled={
                              // this.state.namaLengkap === '' ||
                              // this.state.handphone === '' ||
                              // this.state.alamat === '' ||
                              this.state.notifUpload !== 'done' ||
                              this.props.store.user.userAuth === 'notAuth'
                              ? true : false }
                  onPress={() => this._onSubmit()} >
                  Submit Resep {this.props.store.user.userAuth === 'notAuth' ? 'Silahkan login dulu' : ''}
                </Button>
              </View>
            </View>
          }
        </View>
      </ScrollView>
    );
  }

  public _onSubmit() {
    this.taskUser.update({
      namaLengkap: this.state.namaLengkap,
      handphone: this.state.handphone,
      alamat: this.state.alamat,
      resepSS: this.state.resepSS,
      userResep: 'Resep sudah di upload',
    });
    // this.setState({userResep: 'Resep uploading'})
    this.props.navigation.navigate('LandingHomeScreen');
  }

  private _onToggleForm() {
    this.setState({userResep: 'Resep uploading'});
  }

  private async getFirstData( p ) {
    await p.on('value', (result) => {
      this.setState({
        // namaLengkap : result.val().namaLengkap,
        // handphone : result.val().handphone,
        // alamat : result.val().alamat,
        resepSS : result.val().resepSS,
        userResep: result.val().userResep,
      });
    });
  }

  private _onPressAva5() {
    const options = {
      title: 'Pilih Resep',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      this.setState({ notifUpload: '- uploading ...'});
      // console.log('filesize', response.type, response.fileSize);
      const image = response.uri;
      const dbRef = firebase.storage().ref('users/' + this.props.store.user.uid + '/resep/resepSS.jpg');

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
          this.setState({ resepSS: res,
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
