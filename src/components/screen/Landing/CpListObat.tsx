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
  // List,
  FlatList,
} from 'react-native';
import {
  List, Card, Title, Paragraph, Button,
  Caption, Subheading, Divider, Searchbar,
} from 'react-native-paper';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import * as db1 from '../../../firebase/firebase';
import NumberFormat from 'react-number-format';
import DataObat from '../Landing/OfflineData';

interface IProps {
  navigation?: any;
  store?: any;
}

interface IState {
  isLoaded: boolean;
  items: any;
  firstQuery;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {
  public static navigationOptions = {
    title: 'Daftar Obat',
  };

  private arrayholder: any[];
  private taskUser: any;

  constructor(props) {
    super(props);
    // this.taskUser = db1.db.ref(`obat`);
    this.arrayholder = [];
    this.state = {
      isLoaded: true,
      items: '',
      firstQuery: '',
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
            onPress={() => this.onNewData()}>
            Tambah
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

  public _keyExtractor = (item) => item.NamaObat;

  public _renderItems = ({item}) => (
    <Card>
      <Card.Content>
        <Title>{item.NamaObat}</Title>
        <Subheading>{item.ResepObat}</Subheading>
        {/* <NumberFormat
          value={item.hargaBeliObat}
          displayType={'text'} thousandSeparator={true} prefix={'Rp. '}
          renderText={(value) => <Paragraph>{value}</Paragraph>} />
        <NumberFormat
          value={item.hargaJualObat}
          displayType={'text'} thousandSeparator={true} prefix={'Rp. '}
          renderText={(value) => <Paragraph>{value}</Paragraph>} />
        <NumberFormat
          value={item.jumlahObat}
          displayType={'text'} thousandSeparator={true}
          renderText={(value) => <Paragraph>Jumlah : {value}</Paragraph>} /> */}
      </Card.Content>
      <Card.Actions>
        {/* <Button mode='outlined' style={{marginRight: 5}} onPress={() => this.onUpdateData(item)}>
          Ubah
        </Button> */}
        <Button mode='outlined' style={{marginRight: 5}} onPress={() => this.onBeliData(item)}>
          Beli
        </Button>
        {/* <Button mode='text'
          color='#B71C1C'
          onPress={() => this.onDeleteData(item)}>
          Hapus
        </Button> */}
      </Card.Actions>
    </Card>
  )

  private async getFirstData( p ) {
    await p
      .on('value', (snap) => {
      const r1 = [];
      snap.forEach((el) => {
        r1.push({
          I: el.val().idObat,
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
      // this.notif.localNotif();
      // this.props.store.user.userBadge2 = r1.length;
    });
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
