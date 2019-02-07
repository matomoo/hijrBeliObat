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
  Button, Card, Title,
  Subheading, Searchbar, Caption,
} from 'react-native-paper';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
// import NumberFormat from 'react-number-format';
import DataObat from '../Landing/OfflineData';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded: boolean;
  items: any;
  firstQuery;
  itemsPesan;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Daftar Obat',
  };

  private arrayholder: any[];
  private taskUser: any;
  private aPesan: any[];

  constructor(props) {
    super(props);
    // this.taskUser = db1.db.ref(`obat`);
    this.arrayholder = [];
    this.state = {
      isLoaded: true,
      items: '',
      firstQuery: '',
      itemsPesan: [],
    };
  }

  public componentDidMount() {
    // this.getFirstData(this.taskUser);
    this.setState({
      items: DataObat,
      isLoaded: false,
    });
    this.arrayholder = DataObat;
    // console.log(DataObat);
  }

  public render() {
    return (
      <View style={styles.topContainer}>
        {/* <Text style={styles.textInfo}>Daftar User Request Visit</Text> */}
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
            onPress={() => this.onKonfirmasiPesanan()}>
            Konfirmasi Pesanan
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
    // const { firstQuery } = this.state;
    return <Searchbar
      placeholder='Cari nama obat'
      onChangeText={(text) => this.searchFilterFunction(text)}
      // value={firstQuery}
      />;
  }

  public _keyExtractor = (item) => item.IdObat;

  public _renderItems = ({item}) => (
    <Card>
      <Card.Content>
        <Title>{item.NamaObat}</Title>
        <Subheading>{item.ResepObat}</Subheading>
      </Card.Content>
      <Card.Actions>
        <Button mode='outlined' style={{marginRight: 5}} onPress={() => this.onPesan(item)}>
          Pesan
        </Button>
      </Card.Actions>
    </Card>
  )

  private async getFirstData( p ) {
    await p
      .on('value', (snap) => {
      const r1 = [];
      snap.forEach((el) => {
        r1.push({
          idObat: el.val().idObat,
          namaObat: el.val().namaObat,
          hargaBeliObat: el.val().hargaBeliObat,
          hargaJualObat: el.val().hargaJualObat,
          jumlahObat: el.val().jumlahObat,
          kodeBPJS: el.val().kodeBPJS,
        });
      });
      this.setState({
        items: r1,
        isLoaded: false,
      });
      this.arrayholder = r1;
    });
  }

  private onPesan(p) {
    this.aPesan[p.idObat] = p.NamaObat;
    console.log(this.aPesan);
    // const {itemsPesan} = this.state;
    // const a = itemsPesan;
    // // cek p ada didalam a?
    // a.push(p);
    // this.setState({ itemsPesan : a });
  }

  private onKonfirmasiPesanan() {
    console.log(this.state.itemsPesan);
  }

  private onUpdateData(p) {
    // console.log( p );
    this.props.navigation.navigate('InputItemObatScreen', {qey: 'updateData', el: {p}});
  }

  private onBeliData(p) {
    // console.log( p );
    this.props.navigation.navigate('InputItemObatScreen', {qey: 'beliData', el: {p}});
  }

  private onNewData() {
    // console.log( p );
    this.props.navigation.navigate('InputItemObatScreen', {qey: 'newData'});
  }

  private onDeleteData(p) {
    Alert.alert(
      'Hapus item',
      'Hapus item ' + p.namaObat + '?',
      [
        {text: 'Batal', onPress: () => console.log('Batal'), style: 'cancel'},
        {text: 'OK', onPress: () => db1.db.ref('obat/' + p.idObat).remove()},
      ],
    );
  }

}

export default Screen;

const styles: any = StyleSheet.create({
  topContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
});
