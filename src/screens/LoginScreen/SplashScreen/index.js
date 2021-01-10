import React, { Component } from 'react';
import { connect } from "react-redux";
import { View, StatusBar, Image, Text, Platform, BackHandler, ActivityIndicator, Modal } from 'react-native';
import { AppStyles } from "../../../styles/styles";
import AsyncStorage from '@react-native-community/async-storage';
import { bindActionCreators } from "redux";
// import * as authActions from "_actions/authActions";
import WaitingDialog from "../../../components/waitingDialog";

class SplashScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: false
        };
        this._isMounted = false;
    }

    componentDidMount() {
        setTimeout(() => {
            AsyncStorage.getItem('user_id').then((value) => {
                console.log("get Async===>", value)
                value === null || value == '' ? this.gotoLogin() : this.gotoHome()
            }
            );
        }, 3000);
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    gotoLogin = () => {
        this.props.navigation.navigate("Login");
    }

    gotoHome = () => {
        this.props.navigation.navigate("Main");
    }

    updateLoadingStatus = bool => {
        this.setState({ isLoading: bool });
    }

    render() {
        return (
            <View style={[AppStyles.containerWhite, AppStyles.centered]}>
                <StatusBar barStyle='light-content' backgroundColor='#000000' />
                <Image style={{ width: 100, height: 100 }} source={require('../../../assets/logo.png')} />
                <Modal transparent={true} visible={this.state.isLoading} animationType='fade'
                    onRequestClose={() => this.updateLoadingStatus(false)}>
                    <WaitingDialog />
                </Modal>
                <Text style={{ marginTop: '50%', }}>Schedule, Track, Forecast</Text>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {
        // authActions: bindActionCreators(authActions, dispatch),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);