import React, { Component } from 'react';
import { connect } from "react-redux";
import { View, BackHandler, Modal, ImageBackground, TouchableOpacity, Picker, Image, Text, TextInput, Alert } from 'react-native';
import styles from "./style";
import StatusBarPlaceHolder from "../../components/statusbarPlaceHolder";
import WaitingDialog from "../../components/waitingDialog";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import ShakingText from 'react-native-shaking-text';
import { AppStyles } from "../../styles/styles";
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { scheduleActions } from '../../redux/actions/ScheduleAction'
import { SERVER_URL } from "../../common/config";

// import * as userActions from "../../redux/actions/userActions";
import { bindActionCreators } from "redux";
import { H1, Item } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import SimpleToast from 'react-native-simple-toast';

class SchduleScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: false,
            company_items: [],
            user_id: '',
            company_code: 1,
            date: 'Select Date',
            time: 'Select Time',
            predicted_time_spent: 0,
            datePickerVisible: false,
            timePickerVisible: false,
            min_time: new Date(),
            max_time: new Date(),
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
        setTimeout(() => {
            AsyncStorage.multiGet(['user_id', 'min_time', 'max_time']).then((value) => {
                console.log("async===>", value)
                let min_time = new Date(moment().add(value[1][1] / 1440, 'days'))
                let max_time = new Date(moment().add(value[2][1] / 1440, 'days'))
                console.log('min, max time===>', min_time, max_time)
                this.setState({
                    ...this.state,
                    user_id: value[0][1],
                    min_time: min_time,
                    max_time: max_time
                })
                let body = {
                    user_id: value[0][1]
                }
                fetch(`${SERVER_URL}getClientsById`, {
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
                        console.log(res[0].client_id)
                        this.setState({
                            ...this.state,
                            company_items: res,
                            company_code: res[0].client_id

                        })
                        return true;
                    })
                    .catch(error => {
                        return (error)
                    })
            })

        }, 1000);
    }

    onBackButtonClicked = () => {
        this.props.navigation.navigate("Home");
        return true;
    }

    updateLoadingStatus = bool => {
        this.setState({ isLoading: bool });
    }


    showDatePicker = () => {
        this.setState({ datePickerVisible: true });
    }

    hideDatePicker = () => {
        this.setState({ datePickerVisible: false });
    }

    handleDatePicker = date => {
        this.setState({
            datePickerVisible: false,
            date: moment(date).format('YYYY-MM-DD'),
            error: ''
        });
    }

    showTimePicker = () => {
        this.setState({ timePickerVisible: true });
    }

    hideTimePicker = () => {
        this.setState({ timePickerVisible: false });
    }

    handleTimePicker = time => {
        this.setState({
            timePickerVisible: false,
            time: moment(time).format('HH:mm:ss'),
            error: ''
        });
    }

    schedule = () => {
        let compareDate = moment(this.state.date + " " + this.state.time)
        console.log("compare Date===>", compareDate)
        if (this.state.company_code === 0) {
            this.setState({ error: 'Select Company' });
        } else if (this.state.date === '') {
            this.setState({ error: 'Select Date' });
        } else if (this.state.time === '') {
            this.setState({ error: 'Select Time' });
        } else if (this.state.predicted_time_spent === '') {
            this.setState({ error: 'Enter predicted time spent' });
        } else if (this.state.min_time > compareDate || this.state.max_time < compareDate) {
            this.setState({ error: 'Selected time is out of company rule.' })
        }
        else {
            this.processSchedule();
        }
    }

    processSchedule = async () => {
        let body = {
            user_id: this.state.user_id,
            client_id: this.state.company_code,
            schedule_datetime: this.state.date + " " + this.state.time,
            predicted_time_spent: this.state.predicted_time_spent.toString()
        }
        // this.props.addSchedule(body)
        fetch(`${SERVER_URL}createNewSchedule`, {
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
                if (res.schedule_id == "0") {
                    SimpleToast.show("This time frame is already scheduled.")
                } else {
                    SimpleToast.show("Successfully scheduled.")
                }
                
                return true;
            })
            .catch(error => {
                return (error)
            })

    }

    render() {

        return (
            <View style={styles.container}>
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
                            <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 30 }}>Scheduling</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={require('../../assets/ic_home_64dp.png')} />
                            <Picker
                                style={styles.inputBox}
                                placeholder="Company Name"
                                selectedValue={this.state.company_code}
                                onValueChange={(value) => {
                                    console.log(value)
                                    this.setState({ company_code: value })
                                    console.log(this.state.company_code)
                                }
                                } >
                                {
                                    this.state.company_items.map((item, index) => {
                                        return (
                                            <Picker.Item key={index} label={item.client_entity_name} value={item.client_id} />
                                        )
                                    })
                                }
                            </Picker>
                        </View>
                        <TouchableOpacity style={styles.inputContainer} onPress={this.showDatePicker}>
                            <Image style={styles.inputIcon} source={require('../../assets/calendar.png')} />
                            <Text style={styles.time}>{this.state.date}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.inputContainer} onPress={this.showTimePicker}>
                            <Image style={styles.inputIcon} source={require('../../assets/clock.png')} />
                            <Text style={styles.time}>{this.state.time}</Text>
                        </TouchableOpacity>
                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={require('../../assets/spend-time.png')} />
                            <TextInput style={styles.inputBox} placeholder="Predicted Time Spent(min)" maxLength={10} keyboardType="numeric" onChangeText={timeSpentInput => this.setState({ error: '', predicted_time_spent: timeSpentInput })} />
                        </View>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={this.schedule}>
                            <Text style={AppStyles.text}>SCHEDULE</Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.datePickerVisible}
                            mode='date' onConfirm={this.handleDatePicker}
                            minimumDate={this.state.min_time}
                            maximumDate={this.state.max_time}
                            onCancel={this.hideDatePicker}
                        />
                        <DateTimePicker
                            isVisible={this.state.timePickerVisible}
                            mode='time'
                            minimumDate={this.state.min_time}
                            maximumDate={this.state.max_time}
                            is24Hour={true}
                            onConfirm={this.handleTimePicker}
                            onCancel={this.hideTimePicker} />
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

const mapStateToProps = state => ({
    add_schedule: state.add_schedule,
    // client_info: state.client_info
})

const mapDispatchToProps = dispatch => bindActionCreators({
    addSchedule: scheduleActions.addSchedule,

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SchduleScreen);