import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import RootStackNavigator from './RootStackNavigator';
import AuthStackNavigator from './AutheStackNavigator';
import AutheLoading from '../screen/authe/AutheLoading';
import { Switch } from 'react-native';

const SwitchNavigator =  createSwitchNavigator(
  {
    AuthLoading: AutheLoading,
    App: RootStackNavigator,
    Auth: AuthStackNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(SwitchNavigator);
export default AppContainer;
