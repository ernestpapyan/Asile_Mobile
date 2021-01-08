import React, { Component } from 'react';
import { connect } from "react-redux";
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


class ForgotPasswordScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: false,
            email: '',
            password: '',
            error: '',
        };
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

    reset = () => {
        if (this.state.email === '') {
            this.setState({ error: 'Enter email' });
            SimpleToast.show('Enter email', SimpleToast.SHORT);
        } else if (this.state.password === '') {
            this.setState({ error: 'Enter new password' });
            SimpleToast.show('Enter new password', SimpleToast.SHORT);
        } else if (this.emailValidate(this.state.email) == false) {
            this.setState({ error: 'Enter valid email' });
            SimpleToast.show('Enter valid email', SimpleToast.SHORT);
        } else {
            this.processreset();
        }
    }

    processreset = async () => {
        let body = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.resetPassword( body )
        this.setState({ isLoading: true })
    }

    render() {
        let userData = this.props.reset_user
        console.log('userData.reset user====> ', userData.reset_user.email)
        if (userData.error != null) {
            SimpleToast.show(userData.error)
        } else if (userData.email != "" && this.state.isLoading == true) {
            SimpleToast.show('Reset password Success! Please wait until approved...')
            this.props.navigation.navigate("Login");
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
                                <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 30 }}>Reset Password</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <Image style={styles.inputIcon} source={require('../../../assets/email.png')} />
                                <TextInput style={styles.inputBox} placeholder="Email" onChangeText={emailInput => this.emailValidate(emailInput)} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Image style={styles.inputIcon} source={require('../../../assets/ic_lock_64dp.png')} />
                                <TextInput style={styles.inputBox} placeholder="Password" secureTextEntry={true} onChangeText={passwordInput => this.setState({ error: '', password: passwordInput })} />
                            </View>
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={this.reset}>
                                <Text style={AppStyles.text}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {/* <Modal transparent={true} visible={this.state.isLoading} animationType='fade'
                    onRequestClose={() => this.updateLoadingStatus(false)}>
                    <WaitingDialog />
                </Modal> */}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        reset_user: state.reset_user
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({
    resetPassword: userActions.resetPassword
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen);