import React, { Component } from 'react';
import { connect } from "react-redux";
import { View, BackHandler, Modal, ImageBackground, TouchableOpacity, Image, Text, TextInput, Alert } from 'react-native';
import WaitingDialog from "../../components/waitingDialog";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import ShakingText from 'react-native-shaking-text';
import { AppStyles } from "../../styles/styles";
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker'
import moment from 'moment';
import { SERVER_URL } from "../../common/config";
import Geolocation from '@react-native-community/geolocation';
import { getPreciseDistance } from 'geolib';
import { Platform, } from 'react-native';
import SimpleToast from "react-native-simple-toast";
import styles from './style'

class CheckinScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: false,
            schedule_items: [],
            schedule_id: 0,
            client_id: 0,
            date: '',
            time: '',
            latitude: '',
            longitude: '',
            client_latitude: '',
            client_longitude: '',
            predicted_time_spent: 0,
            datePickerVisible: false,
            timePickerVisible: false,
            error: '',
            user_id: '',
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
        AsyncStorage.getItem('user_id').then((value) => {
            console.log("get full name===>", value)

            this.setState({
                ...this.state,
                user_id: value,
            })
            let body = {
                user_id: value
            }
            fetch(`${SERVER_URL}getCheckinScheduleByUserId`, {
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
                    let startDateTime = moment(currentDate).startOf('day');
                    let endDateTime = moment(currentDate).endOf('day');
                    console.log('endDateTime===>', endDateTime)
                    scheduleData.filter(function (fitem) {
                        console.log(moment(fitem.schedule_datetime))
                        return (moment(fitem.schedule_datetime) > startDateTime && moment(fitem.schedule_datetime) < endDateTime);
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
                    this.setState({
                        ...this.state,
                        schedule_id: schedule_items[0].value ? schedule_items[0].value : 0,
                        schedule_items: schedule_items
                    })

                    return true;
                })
                .catch(error => {
                    return (error)
                })
        })
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

    getCurrentDate() {
        return moment(new Date()).format("YYYY-MM-DD")
    }

    getCurrentTime() {
        return moment(new Date()).format("HH:mm:ss")
    }

    onBackButtonClicked = () => {
        this.props.navigation.navigate("Home");
        return true;
    }

    updateLoadingStatus = bool => {
        this.setState({ isLoading: bool });
    }

    checkin = () => {
        if (this.state.schedule_id === 0) {
            this.setState({ error: 'No schedule' });
            SimpleToast.show("No schedule.")
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
            //this.processCheckin();
        }
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
            this.processCheckin();
        }
    };

    processCheckin = async () => {
        //Check if it is in 200m

        console.log(this.state.schedule_id, this.state.date + " " + this.state.time)
        let body = {
            schedule_id: this.state.schedule_id,
            check_in_datetime: this.state.date + " " + this.state.time
        }
        fetch(`${SERVER_URL}checkin`, {
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
                console.log("Checkin response === > ", res)
                SimpleToast.show("Checkin Success!")
                this.setState({
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
                            <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 30 }}>Check In</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={require('../../assets/ic_home_64dp.png')} />
                            <Picker
                                style={styles.inputBox}
                                placeholder="Checkin"
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

                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={this.checkin}>
                            <Text style={AppStyles.text}>CHECK IN</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckinScreen);