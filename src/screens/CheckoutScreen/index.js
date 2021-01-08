import React, { Component, useRef } from 'react';
import { connect } from "react-redux";
import { View, BackHandler, Modal, TouchableOpacity, Image, Text, TextInput, PermissionsAndroid } from 'react-native';
import styles from './style';
import StatusBarPlaceHolder from "../../components/statusbarPlaceHolder";
import WaitingDialog from "../../components/waitingDialog";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import ShakingText from 'react-native-shaking-text';
import { AppStyles } from '../../styles/styles';
import ImagePicker from 'react-native-image-picker';
import SimpleToast from "react-native-simple-toast";
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker'
import { SERVER_URL } from "../../common/config";
import Geolocation from '@react-native-community/geolocation';
import { getPreciseDistance } from 'geolib';
import moment from 'moment';

// import * as userActions from "../../redux/actions/userActions";
import { bindActionCreators } from "redux";
import { H1, Item } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
const createFormData = (photo, body) => {
    const data = new FormData();

    data.append('photo', {
        name: photo.fileName,
        type: photo.type,
        uri:
            Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
    });

    Object.keys(body).forEach((key) => {
        data.append(key, body[key]);
    });

    console.log(data)
    return data;
};
class CheckoutScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: false,
            schedule_items: [],
            schedule_id: 0,
            selected_reason: '',
            upload_reason: 'Create Sales Order',
            client_id: 0,
            date: '',
            time: '',
            latitude: '',
            longitude: '',
            signature: 'Signature',
            client_latitude: '',
            client_longitude: '',
            note: '',
            upload: '',
            upload_picture: '',
            upload_notes: '',
            isNote: true,
            isUpload: true,
            isOtherReason: false,
            user_id: '',
            predicted_time_spent: 0,
            datePickerVisible: false,
            timePickerVisible: false,
            visiting_reason: [
                'Create Sales Order',
                'Billing purposes',
                'Offer goods',
                'Others'
            ],
            error: '',
        };
        this.getCurrentLocation()
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', async () => {
            BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonClicked());
        });
        navigation.addListener('willBlur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonClicked);
        });
        this.getScheduleItems()
        let curDate = this.getCurrentDate()
        let curTime = this.getCurrentTime()
        this.setState(
            {
                ...this.state,
                date: curDate,
                time: curTime
            }
        )
    }

    getScheduleItems() {
        AsyncStorage.multiGet(['user_id', 'notes', 'upload']).then((values) => {
            this.setState({
                ...this.state,
                user_id: values[0][1],
                isNote: values[1][1],
                isUpload: values[2][1]
            })

            let body = {
                user_id: values[0][1]
            }
            fetch(`${SERVER_URL}getCheckoutScheduleByUserId`, {
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
                    let scheduleData = res
                    // console.log(scheduleData)
                    var schedule_items = []
                    let currentDate = new Date()
                    scheduleData.filter(function (fitem) {
                        console.log(moment(fitem.schedule_datetime))
                        return moment(fitem.schedule_datetime) < currentDate;
                    }).map(item => {
                        let datetime = item.schedule_datetime;
                        let client_name = item.client_entity_name;
                        let client_id = item.client_id
                        let schedule_id = item.schedule_id
                        let listItem = {
                            label: datetime + " " + client_name,
                            value: schedule_id,
                            client_id: client_id
                        }
                        schedule_items.push(listItem)

                    })
                    if (schedule_items.length != 0) {
                        this.setState({
                            ...this.state,
                            schedule_id: schedule_items[0].value,
                            schedule_items: schedule_items
                        })
                    } else {
                        this.setState({
                            ...this.state,
                            schedule_id: 0,
                            schedule_items: []
                        })
                    }


                    return true;
                })
                .catch(error => {
                    return (error)
                })

        })

    }

    getCurrentDate() {
        return moment(new Date()).format("YYYY-MM-DD")
    }

    getCurrentTime() {
        return moment(new Date()).format("HH:mm:ss")
    }

    getCurrentLocation() {
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                // setLocationStatus('You are Here');

                //getting the Longitude from the location json
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);

                //getting the Latitude from the location json
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);

                this.setState({
                    ...this.state,
                    latitude: currentLatitude,
                    longitude: currentLongitude
                })
            },
            (error) => {
                this.setState({
                    ...this.state,
                    error: error
                })
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
    }

    onBackButtonClicked = () => {
        this.props.navigation.navigate("Home");
        return true;
    }

    updateLoadingStatus = bool => {
        this.setState({ isLoading: bool });
    }

    checkout = () => {
        if (this.state.schedule_id === 0) {
            this.setState({ error: 'No schedule' });
            SimpleToast.show("No schedule.");
        } else {
            //Get Client Info--Location
            let body = {
                client_id: this.state.client_id
            }
            fetch(`${SERVER_URL}getClientProfileById`, {
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

                    let c_lat = res.location.split(' ')[0]
                    let c_lon = res.location.split(' ')[1]
                    console.log('Client Location ==> ', c_lat, c_lon)
                    this.setState({
                        ...this.state,
                        client_latitude: c_lat,
                        client_longitude: c_lon
                    })
                    this.calculatePreciseDistance()
                    return true;
                })
                .catch(error => {
                    return (error)
                })
            //this.processCheckout();
        }
    }

    showSignature = () => {
        //getClientInfo by name

        this.setState({
            ...this.state,
            isSignature: true,
        });

    }

    calculatePreciseDistance = () => {
        var pdis = getPreciseDistance(
            { latitude: this.state.latitude, longitude: this.state.longitude },
            { latitude: this.state.client_latitude, longitude: this.state.client_longitude },
        );
        console.log("Distance====>", pdis)
        if (pdis > 200) {
            SimpleToast.show(`You are ${pdis} metres away from client.`)
        } else {
            this.processCheckout();
        }
    };

    selectPhoto = () => {
        var options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log('User selected a file form camera or gallery', response);
                const data = new FormData();
                data.append('name', 'avatar');
                data.append('fileData', {
                    uri: response.uri,
                    type: response.type,
                    name: response.fileName
                });
                const config = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                    body: data,
                };
                fetch(`${SERVER_URL}upload`, config)
                    .then((res) => {
                        console.log(res);
                        return res.json()
                    })
                    .then(res => {
                        console.log(res.path);
                        this.setState({
                            ...this.state,
                            upload_picture: res.path
                        })
                        return true
                    })
                    .catch((err) => { console.log(err) });
            }
        })
    }

    processCheckout = async () => {
        //Check if it is in 200m

        console.log(this.state.schedule_id, this.state.date + " " + this.state.time)
        let body = {
            schedule_id: this.state.schedule_id,
            check_out_datetime: this.state.date + " " + this.state.time,
            upload_picture: this.state.upload_picture,
            notes: this.state.upload_notes,
            reason: this.state.upload_reason
        }
        fetch(`${SERVER_URL}checkout`, {
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
                console.log("Checkout response === > ", res)
                SimpleToast.show("Checkout Success!")

                this.setState({
                    upload_notes: '',
                    upload_picture: '',
                    schedule_id: 0,
                    schedule_items: [],
                })
                this.componentDidMount()
                return true;
            })
            .catch(error => {
                return (error)
            })

    }

    // _signaturePadError = (error) => {
    //     console.error(error);
    // };

    // _signaturePadChange = ({ base64DataUrl }) => {
    //     console.log("Got new signature: " + base64DataUrl);
    // };
    render() {

        return (
            <View style={styles.container} >
                {/* <StatusBarPlaceHolder /> */}
                < KeyboardAwareScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', alwaysBounceVertical: true }}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag" >
                    <View style={styles.avatarContainer}>
                        <View style={{ position: 'absolute', left: 0 }}>
                            <TouchableOpacity style={styles.backButton} onPress={() => this.onBackButtonClicked()}>
                                <Image style={styles.backButtonIcon} source={require('../../assets/arrow_back.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: '100%', width: '100%', alignItems: 'center', margin: 15, alignSelf: 'center', }}>
                            <View >
                                <Image source={require('../../assets/logo-login.png')} style={styles.image} />
                            </View>

                        </View>
                    </View>
                    <View style={styles.loginContainer}>
                        <ShakingText style={styles.error}>{this.state.error}</ShakingText>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 30 }}>Check Out</Text>
                        </View>
                        <ScrollView>
                            <>
                                <View style={styles.inputContainer}>
                                    <Image style={styles.inputIcon} source={require('../../assets/ic_home_64dp.png')} />
                                    <Picker
                                        style={styles.inputBox}
                                        placeholder="Checkout"
                                        selectedValue={this.state.schedule_id}
                                        onValueChange={(value) => {
                                            console.log(value)
                                            let schedule_item = this.state.schedule_items.filter((item) => {
                                                return item.value == value
                                            })
                                            this.setState({
                                                schedule_id: value,
                                                client_id: schedule_item.length != 0 ? schedule_item[0].client_id : 0
                                            })
                                        }
                                        } >
                                        {
                                            this.state.schedule_items.map((item, index) => {
                                                return (
                                                    <Picker.Item key={index} label={item.label} value={item.value} />
                                                )
                                            })
                                        }
                                    </Picker>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Image style={styles.inputIcon} source={require('../../assets/calendar.png')} />
                                    <TextInput style={styles.time} editable={false}>{this.state.date}</TextInput>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Image style={styles.inputIcon} source={require('../../assets/clock.png')} />
                                    <TextInput style={styles.time} editable={false}>{this.state.time}</TextInput>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={styles.inputLatLong}>
                                        <TextInput style={styles.inputLatLongBox} editable={false} placeholder="Latitude" value={this.state.latitude} />
                                    </View>
                                    <View style={styles.inputLatLong}>
                                        <TextInput style={styles.inputLatLongBox} editable={false} placeholder="Longitude" value={this.state.longitude} />
                                    </View>
                                </View>
                                {/* <View style={{
                            width: '100%',
                            height: 150,
                        }}>
                            <View style={styles.inputContainer}>
                                <TextInput style={styles.time} editable={false}>Signature</TextInput>
                            </View>
                            <SignaturePad onError={this._signaturePadError}
                                onChange={this._signaturePadChange}
                                style={{ flex: 1, backgroundColor: 'white', margin: 10, }} />

                        </View> */}
                                <View style={styles.inputContainer}>

                                    <Picker
                                        style={styles.inputBox}
                                        placeholder="Visiting Reason"
                                        selectedValue={this.state.selected_reason}
                                        onValueChange={(value) => {
                                            console.log(value)
                                            if (value == 'Others') {
                                                this.setState({
                                                    ...this.state,
                                                    isOtherReason: true,
                                                    selected_reason: value
                                                })
                                            } else {
                                                this.setState({
                                                    ...this.state,
                                                    selected_reason: value,
                                                    isOtherReason: false,
                                                    upload_reason: value
                                                })
                                            }
                                        }
                                        } >
                                        {
                                            this.state.visiting_reason.map((item, index) => {
                                                return (
                                                    <Picker.Item key={index} label={item} value={item} />
                                                )
                                            })
                                        }
                                    </Picker>
                                </View>

                                <View>
                                    {
                                        this.state.isOtherReason && <View style={styles.inputReason}>
                                            <TextInput
                                                style={styles.note}
                                                multiline={true}
                                                placeholder={'REASON'}
                                                onChangeText={value => this.setState({ error: '', upload_reason: value })}
                                            >{this.state.upload_reason}</TextInput>
                                        </View>
                                    }

                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    {
                                        this.state.isNote == true && <View style={styles.inputNote}>
                                            <TextInput
                                                style={styles.note}
                                                multiline={true}
                                                placeholder={'NOTE'}
                                                onChangeText={value => this.setState({ error: '', upload_notes: value })}
                                            >{this.state.note}</TextInput>
                                        </View>
                                    }
                                    {
                                        this.state.isUpload == true && <View>
                                            <Text style={{ alignSelf: 'center', fontSize: 15 }}>UPLOAD</Text>
                                            <TouchableOpacity style={styles.cameraButton} onPress={this.selectPhoto}>
                                                <Image style={styles.backButtonIcon} source={require('../../assets/camera.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    }

                                </View>
                                <TouchableOpacity
                                    style={styles.buttonContainer}
                                    onPress={this.checkout}>
                                    <Text style={AppStyles.text}>CHECK OUT</Text>
                                </TouchableOpacity>

                            </>

                        </ScrollView>

                    </View>

                </KeyboardAwareScrollView >

                <Modal transparent={true} visible={this.state.isLoading} animationType='fade'
                    onRequestClose={() => this.updateLoadingStatus(false)}>
                    <WaitingDialog />
                </Modal>
            </View >
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);