import React, { Component } from 'react';
import {
  StyleSheet,
  // TouchableOpacity,
  // Image,
  // Text,
  View,
  ActivityIndicator,
  // AsyncStorage,
  // StatusBar,
  // Button,
  Alert,
  // TouchableHighlight,
  ScrollView,
  // List,
  FlatList,
} from 'react-native';
import {
  // List, Paragraph, Divider,
  Button, Card, Title, Portal, Modal, Surface,
  Subheading, Searchbar, Caption, IconButton, Colors, Divider,
} from 'react-native-paper';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
// import NumberFormat from 'react-number-format';
import DataObat from '../Landing/OfflineData';
import moment from 'moment';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded: boolean;
  items: any;
  firstQuery;
  itemsPesan;
  jumlahItemPesan;
  modObatVisible;
  users;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Daftar Obat',
  };

  private arrayholder: any[];
  private taskUser: any;
  // private aPesan: any[];

  constructor(props) {
    super(props);
    this.taskUser = db1.db.ref(`users/${this.props.store.user.uid}`);
    this.arrayholder = [];
    this.state = {
      isLoaded: true,
      items: '',
      firstQuery: '',
      itemsPesan: [],
      jumlahItemPesan: 0,
      modObatVisible: false,
      users: [],
    };
  }

  public componentDidMount() {
    // console.log(this.props.store.user.userAuth);
    if (this.props.store.user.userAuth === 'yesAuth') {
      this.getFirstData(this.taskUser);
    }
    this.setState({
      items: DataObat,
      isLoaded: false,
    });
    this.arrayholder = DataObat;
  }

  public render() {
    return (
      <View style={styles.topContainer}>
        <Portal>
          <Modal visible={this.state.modObatVisible} onDismiss={this._hideModalObat}>
            <Surface style={styles.containerModal}>
              <View style={{display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: '100%',
              }}>
                <Title>Konfirmasi Pesanan</Title>
                <IconButton
                  icon='clear'
                  color={Colors.red500}
                  size={30}
                  onPress={() => this._hideModalObat()}
                />
              </View>
              <Divider />
              { this.state.itemsPesan.map((el, key) =>
                <View key={key} style={{ display: 'flex',
                                          flexDirection: 'row',
                                          justifyContent: 'flex-start',
                                          alignItems: 'center',
                                          width: '100%',
                }}>
                  <IconButton
                    icon='clear'
                    color={Colors.red500}
                    size={20}
                    onPress={() => this._onDeleteObat(el)}
                  />
                  <View>
                    <Subheading>{el.NamaObat}</Subheading>
                    <Caption>{el.ResepObat}</Caption>
                  </View>
                </View>,
              )}
            </Surface>
            <Surface>
              <Button mode='outlined'
                onPress={() => this._submitPesananObat()}>
                Submit Pesanan Obat
              </Button>
            </Surface>
          </Modal>
        </Portal>
        <ScrollView>
        { this.state.isLoaded ?
            <ActivityIndicator /> :
            <View style={{width: '100%'}}>
              <FlatList
                data={this.state.items}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItems}
                ListHeaderComponent={this.renderHeader}
              />
            </View>
        }
        </ScrollView>
        <View style={{marginVertical: 10}}>
          <Button mode='contained'
            disabled={this.state.jumlahItemPesan === 0 ? true : false }
            onPress={() => this._showModalObat()}>
            Konfirmasi Pesanan ( {this.state.jumlahItemPesan} )
          </Button>
        </View>
      </View>
    );
  }

  public searchFilterFunction = (text) => {
    const newData = this.arrayholder.filter((item) => {
      const itemData = `${item.NamaObat.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({ items: newData });
  }

  public renderHeader = () => {
    return <Searchbar
      placeholder='Cari nama obat'
      onChangeText={(text) => this.searchFilterFunction(text)}
    />;
  }

  public _keyExtractor = (item) => item.IdObat;

  public _renderItems = ({item}) => (
    <Card>
      <Card.Content>
        {/* <Title>{item.NamaObat}</Title>
        <Subheading>{item.ResepObat}</Subheading> */}
        <Subheading>{item.NamaObat}</Subheading>
        <Caption>{item.ResepObat}</Caption>
      </Card.Content>
      <Card.Actions>
        <Button mode='outlined' style={{marginRight: 5}} onPress={() => this.onPesan(item)}>
          Pesan
        </Button>
      </Card.Actions>
    </Card>
  )

  private _showModalObat = () => this.setState({ modObatVisible: true });
  private _hideModalObat = () => this.setState({ modObatVisible: false });

  private async getFirstData( p ) {
    // console.log(p);
    await p
      .on('value', (snap) => {
      const r1 = [];
      r1.push(snap.val());
      // console.log(snap.val());
      // snap.forEach((el) => {
      //   r1.push({
      //     idObat: el.val().idObat,
      //     namaObat: el.val().namaObat,
      //     hargaBeliObat: el.val().hargaBeliObat,
      //     hargaJualObat: el.val().hargaJualObat,
      //     jumlahObat: el.val().jumlahObat,
      //     kodeBPJS: el.val().kodeBPJS,
      //   });
      // });
      this.setState({
        users: r1,
        isLoaded: false,
      });
      // this.arrayholder = r1;
    });
  }

  private onPesan(p) {
    // console.log(this.state.users);
    if (this.props.store.user.userAuth === 'yesAuth') {
      if (!this.state.itemsPesan.includes(p)) {
        if (p.ResepObat === 'Harus menggunakan resep' && this.state.users[0].userResep !== 'Resep sudah di upload' ) {
          Alert.alert('Pastikan resep dokter sudah di upload');
        } else {
          this.state.itemsPesan.push(p);
          this.setState({ jumlahItemPesan: this.state.itemsPesan.length });
        }
      }
    } else {
      Alert.alert('Silahkan login dulu sebelum melakukan pemesanan obat');
    }
  }

  private _submitPesananObat() {
    const a = db1.db.ref(`pesananObat`).push();
    db1.db.ref(`pesananObat/${a.key}`).update({
      idPesananObat: a.key,
      idPemesan: this.props.store.user.uid,
      namaPemesan: this.props.store.user.userNamaLengkap,
      alamatPemesan: this.props.store.user.userAlamat,
      handphonePemesan: this.props.store.user.userHandphone,
      tanggalPesananObat: moment(Date.now()).format('YYYY-MM-DD'),
      itemPesanan: JSON.stringify(this.state.itemsPesan),
      statusPesananObat: 'Menunggu verifikasi',
      resepSS: this.state.users[0].resepSS,
    });
    db1.db.ref(`users/${this.props.store.user.uid}`).update({
      statusPesananObat: 'Menunggu verifikasi',
    });
    this._hideModalObat();
    this.setState({ itemsPesan : [] });
  }

  private _onDeleteObat = (p) => {
    const a = this.state.itemsPesan;
    const b = a.filter((q) => q !== p);
    this.setState({
      itemsPesan : b,
      jumlahItemPesan: b.length,
    });
    if (b.length === 0 ) {
      this._hideModalObat();
    }
  }

}

export default Screen;

const styles: any = StyleSheet.create({
  topContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  containerModal: {
    flex: 1,
    // backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 15,
  },
  containerItems: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginLeft: 10,
  },
});
