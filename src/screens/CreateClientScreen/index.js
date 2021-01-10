import React, { Component } from 'react';
import { connect } from "react-redux";
import { View, BackHandler, Modal, ImageBackground, TouchableOpacity, Image, Text, TextInput, Alert } from 'react-native';
import styles from './style'
import WaitingDialog from "../../components/waitingDialog";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import ShakingText from 'react-native-shaking-text';
import { AppStyles } from "../../styles/styles";
import AsyncStorage from '@react-native-community/async-storage';
import { SERVER_URL } from "../../common/config";
import SimpleToast from "react-native-simple-toast";

class CreateClientScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: false,
            client_entity_name: '',
            address: '',
            latitude: '',
            longitude: '',
            phone_number: '',
            company_id: '',
            custom_field: '',
            created_by: '',
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

        this.getLocalStorage()
    }

    getLocalStorage() {
        AsyncStorage.multiGet(['user_id', 'company_id']).then((values) => {
            this.setState({
                ...this.state,
                created_by: values[0][1],
                company_id: values[1][1],
            })
        })
    }

    onBackButtonClicked = () => {
        this.props.navigation.navigate("Home");
        return true;
    }

    updateLoadingStatus = bool => {
        this.setState({ isLoading: bool });
    }

    create_client = async () => {

        if (this.state.client_entity_name == null || this.state.client_entity_name == "") {
            SimpleToast.show("Please enter client entity name.")
            return
        } else if (this.state.address == null || this.state.address == "") {
            SimpleToast.show("Please enter client address.")
            return
        } else if (this.state.latitude == null || this.state.latitude == "") {
            SimpleToast.show("Please enter latitude.")
            return
        } else if (this.state.longitude == null || this.state.longitude == "") {
            SimpleToast.show("Please enter longitude.")
            return
        } else if (this.state.phone_number.length == 0 || this.state.phone_number.length < 7) {
            SimpleToast.show('Please enter valid phone number')
            return
        } else if (this.state.custom_field == null || this.state.custom_field == "") {
            SimpleToast.show("Please enter custom field.")
            return
        } else {
            console.log("create_client")
            let body = {
                client_entity_name: this.state.client_entity_name,
                address: this.state.address,
                location: this.state.latitude + ' ' + this.state.longitude,
                custom_field: this.state.custom_field,
                phone_number: this.state.phone_number,
                company_id: this.state.company_id,
                approved: '0',
                created_by: this.state.created_by
            }
            fetch(`${SERVER_URL}addClient`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
                .then(res => {
                    return res.json()
                })
                .then(res => {
                    if (res.error) {
                        throw (res.error);
                    }
                    console.log(res)
                    if (res.client_id != null) {
                        SimpleToast.show('This client is already exist.')
                    } else {
                        SimpleToast.show("Create Success!")
                    }
                    this.setState({
                        ...this.state,
                        isLoading: false,
                        client_entity_name: '',
                        address: '',
                        latitude: '',
                        longitude: '',
                        phone_number: '',
                        custom_field: '',
                        error: '',
                    });
                    return true;
                })
                .catch(error => {
                    return (error)
                })

        }

    }

    render() {
        return (
            <View style={styles.container}>
                {/* <StatusBarPlaceHolder /> */}
                <KeyboardAwareScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', alwaysBounceVertical: true }}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag">
                    <View style={styles.avatarContainer}>
                        <View style={{ position: 'absolute', left: 0 }}>
                            <TouchableOpacity style={styles.backButton} onPress={() => this.onBackButtonClicked()}>
                                <Image style={styles.backButtonIcon} source={require('../../assets/arrow_back.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: '100%', width: '100%', alignItems: 'center', margin: 15, alignSelf: 'center', }}>
                            <View>
                                <Image source={require('../../assets/logo-login.png')} style={styles.image} />
                            </View>

                        </View>
                    </View>
                    <View style={styles.loginContainer}>
                        <ShakingText style={styles.error}>{this.state.error}</ShakingText>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 30 }}>New Client</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={require('../../assets/ic_user_64dp.png')} />
                            <TextInput
                                style={styles.time}
                                editable={true}
                                placeholder={'Entity Name'}
                                onChangeText={value => this.setState({ error: '', client_entity_name: value })}
                            >{this.state.client_entity_name}
                            </TextInput>
                        </View>
                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={require('../../assets/maps_location.png')} />
                            <TextInput
                                style={styles.time}
                                editable={true}
                                placeholder={'Address'}
                                onChangeText={value => this.setState({ error: '', address: value })}
                            >{this.state.address}
                            </TextInput>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={styles.inputLatLong}>
                                <TextInput
                                    style={styles.inputLatLongBox}
                                    editable={true}
                                    placeholder="Latitude"
                                    value={this.state.latitude}
                                    keyboardType='numeric'
                                    onChangeText={value => this.setState({ error: '', latitude: value })} />
                            </View>
                            <View style={styles.inputLatLong}>
                                <TextInput
                                    style={styles.inputLatLongBox}
                                    editable={true}
                                    placeholder="Longitude"
                                    value={this.state.longitude}
                                    keyboardType='numeric'
                                    onChangeText={value => this.setState({ error: '', longitude: value })} />
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={require('../../assets/mobile.png')} />
                            <TextInput
                                style={styles.time}
                                editable={true}
                                placeholder={'Phone Number'}
                                keyboardType='numeric'
                                onChangeText={value => this.setState({ error: '', phone_number: value })}
                            >{this.state.phone_number}
                            </TextInput>
                        </View>
                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={require('../../assets/ic_aboutus_64dp.png')} />
                            <TextInput
                                style={styles.time}
                                editable={true}
                                placeholder={'Custom Field'}
                                onChangeText={value => this.setState({ error: '', custom_field: value })}
                            >{this.state.custom_field}
                            </TextInput>
                        </View>

                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={this.create_client}>
                            <Text style={AppStyles.text}>CREATE CLIENT</Text>
                        </TouchableOpacity>
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
    return {}
}

const mapDispatchToProps = dispatch => {
    return {
        // userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateClientScreen);