import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  Alert,
  TextInput,
} from 'react-native';
import { auth, db } from '../../../firebase';
// import Terms from '../Terms';
import { ratio, colors } from '../../../utils/Styles';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';

interface IProps {
  navigation?: any;
  store: any;
}

interface IState {
  isLoggingIn: boolean;
  fname;
  email;
  password;
}

@inject('store') @observer
class Screen extends Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      fname   : '',
      email   : '',
      password: '',
      isLoggingIn: false,
    };
  }

  public render() {
      return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image style={styles.imageLogo} source={require('../../../../assets/app_splash.png')} />
          </View>
          <View style={styles.inputContainer}>
            <Image style={styles.inputIcon}
              source={{uri: 'https://img.icons8.com/color/40/000000/circled-user-male-skin-type-3.png'}}/>
            <TextInput style={styles.inputs}
                placeholder='Full name'
                underlineColorAndroid='transparent'
                onChangeText={(fname) => this.setState({fname})}/>
          </View>
          <View style={styles.inputContainer}>
            <Image style={styles.inputIcon}
              source={{uri: 'https://img.icons8.com/flat_round/40/000000/secured-letter.png'}}/>
            <TextInput style={styles.inputs}
                placeholder='Email'
                keyboardType='email-address'
                underlineColorAndroid='transparent'
                onChangeText={(email) => this.setState({email})}/>
          </View>
          <View style={styles.inputContainer}>
            <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/color/40/000000/password.png'}}/>
            <TextInput style={styles.inputs}
                placeholder='Password'
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({password})}/>
          </View>
          <TouchableOpacity style={!this.state.isLoggingIn ?
              [styles.buttonContainer, styles.loginButton] :
              [styles.buttonContainerDisabled, styles.loginButtonDisabled]
            }
            disabled={this.state.isLoggingIn}
            onPress={() => this.onRegister()}>
            <Text style={!this.state.isLoggingIn ? styles.buttonText : styles.buttonTextDisabled}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

  public onClickListener = (viewId) => {
    Alert.alert('Alert', 'Button pressed ' + viewId);
  }

  public onRegister = () => {
    this.setState({ isLoggingIn: true });
    auth.doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(( p ) => {
        db._saveUserProfile(p.user.uid, this.state.email, this.state.fname);
        this.props.store.user.uid = p.user.uid;
        // this.props.store.user.userAuth = 'yesAuth';
        this.props.navigation.navigate('AppLoaderScreen');
        // this.props.navigation.navigate('Home');
      })
      .catch((error) => {
        Alert.alert(error.message);
        this.setState({ isLoggingIn: false });
      });
  }
}

export default Screen;

// styles
const resizeMode = 'center';
const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  inputContainer: {
    borderColor: '#4caf50',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 2,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    justifyContent: 'center',
  },
  btnByRegister: {
    height: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: 300,
    backgroundColor: 'transparent',
  },
  // buttonContainer: {
  //   height: 45,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 10,
  //   width: 250,
  //   borderRadius: 30,
  // },
  // loginButton: {
  //   backgroundColor: '#00b5ec',
  // },
  // loginText: {
  //   color: 'white',
  // },
  bgImage: {
    flex: 1,
    resizeMode,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  btnText: {
    color: 'black',
    // fontWeight: 'bold',
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: {width: -1, height: 1},
    // textShadowRadius: 10,
  },
  textByRegister: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',

    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  imageContainer: {
    marginBottom: 20,
    padding: 10,
  },
  imageLogo: {
    width: 350,
    height: 255,
  },
  buttonContainer: {
    // height: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#1976d2',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 10,
    color: '#ffffff',
  },
  buttonContainerDisabled: {
    // height: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 250,
    borderRadius: 30,
  },
  loginButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  buttonTextDisabled: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 10,
    color: '#aeaeae',
  },
});
