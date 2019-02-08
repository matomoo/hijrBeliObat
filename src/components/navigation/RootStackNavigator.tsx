import React from 'react';
import { createStackNavigator, createBottomTabNavigator,
  getActiveChildNavigationOptions, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { inject, observer } from 'mobx-react/native';
import { colors } from '../../utils/Styles';
// import appStore from '../../stores/appStore';
// import IntroScreen from '../screen/Intro';
// import NotFoundScreen from '../screen/NotFound';
// import HomeUserScreen from '../screen/HomeUser';
// import InfoScreen from '../screen/Info';
import AppLoaderScreen from '../screen/AppLoader';
import ProfileScreen from '../screen/Users/UserProfile';
import InputUserProfileScreen from '../screen/Users/InputUserProfile';
import UserChangePwdScreen from '../screen/Users/UserChangePwd';
// import UserDaftarAntrianDetailScreen from '../screen/Users/UserDaftarAntrianDetail';
// import InputItemDiagnosisScreen from '../screen/Resepsionis/InputItemDiagnosis';
// import InputItemObatScreen from '../screen/Apotek/InputItemObat';
// import InputShareOfPercentage from '../screen/Manajemen/InputShareOfPercentage';
// import CpListDiagnosisScreen from '../screen/Resepsionis/CpListDiagnosis';
// import CpListDaftarAntrianScreen from '../screen/Resepsionis/CpListDaftarAntrian';
// import CpListObatScreen from '../screen/Apotek/CpListObat';
// import CpListDaftarAntrianByDokterScreen from '../screen/Dokter/CpListDaftarAntrianByDokter';
// import PasienRekamMedikByDokterScreen from '../screen/Dokter/PasienRekamMedikByDokter';
// import DiagnosisResepObatScreen from '../screen/Dokter/DiagnosisObatResep';
import LandingHomeScreen from '../screen/LandingHome';
import LandingResepScreen from '../screen/LandingResep';
import LandingDepositScreen from '../screen/LandingDeposit';
import Login from '../screen/authe/Login';
import KonfirmasiPesananScreen from '../screen/Landing/KonfirmasiPesanan';
import DetailKonfirmasiDepositScreen from '../screen/Admin/DetailKonfirmasiDeposit';
import DetailRequestVisitScreen from '../screen/Admin/DetailRequestVisit';
import AutheLoadingScreen from '../screen/authe/Login';
// import SwitchNavi from '../navigation/SwitchNavigator';

// Set here for tabNavigator content
const UserBottomTabNavigator = createBottomTabNavigator(
  {
    LandingHomeScreen: { screen: LandingHomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: (() => (<Icon name='home' size={30}/>) ),
        tabBarVisible: true,
        // title: 'Dzikr App', // setting header title on its screen
      },
    },
    LandingResepScreen: { screen: LandingResepScreen,
      navigationOptions: () => ({
        tabBarLabel: 'Resep',
        tabBarIcon: (() => (<Icon name='align-justify' size={30}/>) ),
        tabBarVisible: true,
      }),
    },
    LandingDepositScreen: { screen: LandingDepositScreen,
      navigationOptions: () => ({
        tabBarLabel: 'Deposit',
        tabBarIcon: (() => (<Icon name='th-large' size={30}/>) ),
        tabBarVisible: true,
      }),
    },
    ProfileScreen: { screen: ProfileScreen,
      navigationOptions: () => ({
        tabBarLabel: 'Profil',
        tabBarIcon: (() => (<Icon name='user-md' size={30}/>) ),
        tabBarVisible: true,
      }),
    },
  },
);

const routeConfig = {
  UserBottomTabNavigator: {
    screen: UserBottomTabNavigator,
    navigationOptions: ({ navigation, screenProps }) => {
      const childOptions = getActiveChildNavigationOptions(navigation, screenProps);
      return {
        title: childOptions.title,
      };
    },
  },
  // SwitchNav: SwitchNavi,
  AutheLoadingScreen: {
    screen: AutheLoadingScreen,
    path: 'AutheLoadingScreen',
  },
  LandingHomeScreen: {
    screen: LandingHomeScreen,
    path: 'LandingHomeScreen',
  },
  AppLoaderScreen: {
    screen: AppLoaderScreen,
    path: 'AppLoaderScreen',
  },
  InputUserProfileScreen: {
    screen: InputUserProfileScreen,
    path: 'InputUserProfileScreen',
  },
  UserChangePwdScreen: {
    screen: UserChangePwdScreen,
    path: 'UserChangePwdScreen',
  },
  KonfirmasiPesananScreen: {
    screen: KonfirmasiPesananScreen,
    path: 'KonfirmasiPesananScreen',
  },
  DetailKonfirmasiDepositScreen: {
    screen: DetailKonfirmasiDepositScreen,
    path: 'DetailKonfirmasiDepositScreen',
  },
  DetailRequestVisitScreen: {
    screen: DetailRequestVisitScreen,
    path: 'DetailRequestVisitScreen',
  },
  // InfoScreen: {
  //   screen: InfoScreen,
  //   path: 'InfoScreen',
  // },
  // HomeUserScreen: {
  //   screen: HomeUserScreen,
  //   path: 'HomeUserScreen',
  // },
  // UserDaftarAntrianDetailScreen: {
  //   screen: UserDaftarAntrianDetailScreen,
  //   path: 'UserDaftarAntrianDetailScreen',
  // },
  // InputItemDiagnosisScreen: {
  //   screen: InputItemDiagnosisScreen,
  //   path: 'InputItemDiagnosisScreen',
  // },
  // InputItemObatScreen: {
  //   screen: InputItemObatScreen,
  //   path: 'InputItemObatScreen',
  // },
  // InputShareOfPercentage: {
  //   screen: InputShareOfPercentage,
  //   path: 'InputShareOfPercentage',
  // },
  // CpListDiagnosisScreen: {
  //   screen: CpListDiagnosisScreen,
  //   path: 'CpListDiagnosisScreen',
  // },
  // CpListDaftarAntrianScreen: {
  //   screen: CpListDaftarAntrianScreen,
  //   path: 'CpListDaftarAntrianScreen',
  // },
  // CpListObatScreen: {
  //   screen: CpListObatScreen,
  //   path: 'CpListObatScreen',
  // },
  // CpListDaftarAntrianByDokterScreen: {
  //   screen: CpListDaftarAntrianByDokterScreen,
  //   path: 'CpListDaftarAntrianByDokterScreen',
  // },
  // PasienRekamMedikByDokterScreen: {
  //   screen: PasienRekamMedikByDokterScreen,
  //   path: 'PasienRekamMedikByDokterScreen',
  // },
  // DiagnosisResepObatScreen: {
  //   screen: DiagnosisResepObatScreen,
  //   path: 'DiagnosisResepObatScreen',
  // },
};

const navigatorConfig = {
  initialRouteName: 'UserBottomTabNavigator',
  // header: null,
  // headerMode: 'none',
  gesturesEnabled: true,
  statusBarStyle: 'light-content',
  navigationOptions: {
    headerStyle: {
      headerBackTitle: null,
      backgroundColor: colors.dodgerBlue,
      borderBottomColor: 'transparent',
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white',
  },
};

const RootStackNavigator = createStackNavigator(routeConfig, navigatorConfig);

interface IProps {
  navigation: any;
  store?;
}

@inject('store') @observer
class RootNavigator extends React.Component<IProps> {
  private static router = RootStackNavigator.router;

  public render() {
    // console.log('stackNav', this.props.store.user.userRole);
    return <RootStackNavigator navigation={this.props.navigation}/>;
  }
}

export default RootNavigator;
