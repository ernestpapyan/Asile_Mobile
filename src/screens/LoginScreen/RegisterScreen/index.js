import React, { Component } from 'react';
import { useSelector, connect } from "react-redux";
import { View, BackHandler, Modal, ImageBackground, TouchableOpacity, Image, Text, TextInput, Alert } from 'react-native';
import styles from "./style";
import StatusBarPlaceHolder from "../../../components/statusbarPlaceHolder";
import WaitingDialog from "../../../components/waitingDialog";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { AppStyles } from "../../../styles/styles";
import DateTimePicker from 'react-native-modal-datetime-picker';
import SimpleToast from "react-native-simple-toast";
import { userActions } from "../../../redux/actions/AuthAction";
import { bindActionCreators } from "redux";
import { H1 } from 'native-base';

class RegisterScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: false,
            username: '',
            email: '',
            password: '',
            mobile: '',
            company_code: '',
            error: '',
        };
        this.updateLoadingStatus = this.updateLoadingStatus.bind(this, true);
        
        this.onBackButtonClicked = this.onBackButtonClicked.bind(this, true);

        this.register = this.register.bind(this, true);
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', async () => {
            BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonClicked());
        });
        navigation.addListener('willBlur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonClicked);
        });
    }

    onBackButtonClicked = () => {
        this.props.navigation.navigate("Login");
        return true;
    }

    updateLoadingStatus = bool => {
        this.setState({ isLoading: bool });
    }

    emailValidate = email => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            this.setState({ error: 'Email is incorrect', email: email });
            return false;
        } else {
            this.setState({ error: '', email: email });
        }
    }

    register = () => {

        if (this.state.username === '') {
            SimpleToast.show('Enter username', SimpleToast.SHORT);
        } else if (this.state.email === '') {
            SimpleToast.show('Enter email', SimpleToast.SHORT);
        } else if (this.state.mobile === '' || this.state.mobile.length != 10) {
            SimpleToast.show('Enter valid phone number', SimpleToast.SHORT);
        } else if (this.state.company_code === '') {
            SimpleToast.show('Enter company code', SimpleToast.SHORT);
        } else if (this.state.password === '') {
            SimpleToast.show('Enter password', SimpleToast.SHORT);
        } else if (this.emailValidate(this.state.email) == false) {
            SimpleToast.show('Enter valid email', SimpleToast.SHORT);
        } else {
            this.processRegister();
        }
    }

    processRegister = () => {
        let body = {
            full_name: this.state.username,
            password: this.state.password,
            email: this.state.email,
            phone_number: this.state.mobile,
            company_id: this.state.company_code,
            isAdmin: false,
            isActive: false
        }
        this.setState({
            isLoading: true
        })
        this.props.register(body)
    }

    render(props) {
        let userData = this.props.signup_user
        console.log('userData.signupuser====> ', userData.signup_user)
        if (this.state.isLoading == true) {
            if (userData.error != null) {
                SimpleToast.show(userData.error)
            } else if (userData.signup_user.isActive != true && userData.signup_user.isActive != undefined) {
                SimpleToast.show('Signup Success! Please wait until approved')
                this.props.navigation.navigate("Login");
            } else if (userData.signup_user.message != "") {
                SimpleToast.show('Please check the company code.')
            }
            this.setState({
                isLoading: false
            })
        }

        return (
            <View style={styles.container}>
                {/* <StatusBarPlaceHolder /> */}
                <KeyboardAwareScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', alwaysBounceVertical: true }}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag">
                    <View style={styles.mainContainer}>
                        <View style={styles.avatarContainer}>
                            <View>
                                <TouchableOpacity style={styles.backButton} onPress={() => this.onBackButtonClicked()}>
                                    <Image style={styles.backButtonIcon} source={require('../../../assets/arrow_back.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.loginContainer}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 30 }}>Create New Account</Text>
                            </View>

                            <View style={styles.inputContainer}>
                                <Image style={styles.inputIcon} source={require('../../../assets/ic_user_64dp.png')} />
                                <TextInput style={styles.inputBox} placeholder="User Name" onChangeText={userNameInput => this.setState({ error: '', username: userNameInput })} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Image style={styles.inputIcon} source={require('../../../assets/email.png')} />
                                <TextInput style={styles.inputBox} placeholder="Email" onChangeText={emailInput => this.setState({ error: '', email: emailInput })} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Image style={styles.inputIcon} source={require('../../../assets/mobile.png')} />
                                <TextInput
                                    style={styles.inputBox} placeholder="Phone Number" maxLength={10} keyboardType="numeric" onChangeText={mobileInput => this.setState({ error: '', mobile: mobileInput })} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Image style={styles.inputIcon} source={require('../../../assets/ic_home_64dp.png')} />
                                <TextInput style={styles.inputBox} placeholder="Company Code" maxlength={10} keyboardType="numeric" onChangeText={companyCodeInput => this.setState({ error: '', company_code: companyCodeInput })} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Image style={styles.inputIcon} source={require('../../../assets/ic_lock_64dp.png')} />
                                <TextInput style={styles.inputBox} placeholder="Password" secureTextEntry={true} onChangeText={passwordInput => this.setState({ error: '', password: passwordInput })} />
                            </View>
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={this.register}>
                                <Text style={AppStyles.text}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <Modal transparent={true} visible={this.state.isLoading} animationType='fade'
                    onRequestClose={() => this.updateLoadingStatus(false)}>
                    <WaitingDialog />
                </Modal>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        signup_user: state.signup_user
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    register: userActions.register
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);