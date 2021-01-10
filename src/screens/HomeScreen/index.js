import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Button,
  Platform,
  Image,
  PermissionsAndroid,
  NativeEventEmitter,
  NativeModules,
  ToastAndroid
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { CardViewWithImage } from 'react-native-simple-card-view'
import { screenWidth } from '../../styles/mixins';
import styles from "./style";
import Modal from 'react-native-modal';
import Drawer from 'react-native-drawer';
import { scheduleActions } from '../../redux/actions/ScheduleAction';
import { userActions } from '../../redux/actions/AuthAction'
import { clientActions } from '../../redux/actions/ClientAction'
import { SERVER_URL } from "../../common/config";
import { mapValues } from 'lodash';
import moment from 'moment'
import openMap from 'react-native-open-maps';
import ReactNativeAN from 'react-native-alarm-notification';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Card } from 'react-native-elements'

const { RNAlarmNotification } = NativeModules;
const RNEmitter = new NativeEventEmitter(RNAlarmNotification);

const alarmNotifData = {
  title: 'Asile Notification',
  message: 'Please check schedule.',
  vibrate: true,
  play_sound: true,
  schedule_type: 'once',
  channel: 'Require Notification',
  data: { content: 'Schedule Notification' },
  loop_sound: true,
  has_button: true,
  small_icon: "ic_launcher",
  large_icon: "ic_launcher",
  snooze_interval: 5,
};
// const tableData = []

class Home extends Component {

  _subscribeOpen;
  _subscribeDismiss;

  constructor(props) {
    super();
    this.closeControlPanel = this.closeControlPanel.bind(this);
    this.openControlPanel = this.openControlPanel.bind(this);
    this.state = {
      showModal: false,
      selectedItem: {},
      client_info: {
        client_entity_name: "Amazon",
        custom_field: "Jack",
        address: "1 Carlton St. NSW. Sydney",
        latitude: '',
        longitude: ''
      },
      full_name: 'User Name',
      user_id: '',
      company_id: '',
      schedules: [],
      tableData: [],
      scheduleListData: [],
      update: [],
      futureFireDate: '1',
      alarmId: null,
      datePickerVisible: false,
      date: moment(new Date()).format('ddd, Do MMM YYYY'),
      error: ''
    };
  }

  componentDidMount() {
    this._subscribeDismiss = RNEmitter.addListener(
      'OnNotificationDismissed',
      (data) => {
        const obj = JSON.parse(data);
        console.log(`notification id: ${obj.id} dismissed`);
      },
    );

    this._subscribeOpen = RNEmitter.addListener(
      'OnNotificationOpened',
      (data) => {
        console.log(data);
        const obj = JSON.parse(data);
        console.log(`app opened by notification: ${obj.id}`);
      },
    );

    // check ios permissions
    if (Platform.OS === 'ios') {
      this.showPermissions();

      ReactNativeAN.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      }).then(
        (data) => {
          console.log('RnAlarmNotification.requestPermissions', data);
        },
        (data) => {
          console.log('RnAlarmNotification.requestPermissions failed', data);
        },
      );
    }

    this.getSchedule()
  }

  componentWillUnmount() {
    this._subscribeDismiss.remove();
    this._subscribeOpen.remove();
  }

  setAlarm = async (fireDate) => {
    const { update } = this.state;

    const details = { ...alarmNotifData, fire_date: fireDate };
    console.log(`alarm set: ${fireDate}`);

    try {
      const alarm = await ReactNativeAN.scheduleAlarm(details);
      console.log(alarm);
      if (alarm) {
        this.setState({
          update: [...update, { date: `alarm set: ${fireDate}`, id: alarm.id }],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  checkAlarms = async () => {
    console.log("")
    const list = await ReactNativeAN.getScheduledAlarms();
    console.log(list.length)
    if (list.length == 0) {
      this.state.scheduleListData.map(item => {
        this.setAlarm(item.format('DD-MM-YYYY HH:mm:ss'))
      })
    } else {
      var items = []
      // this.state.scheduleListData.map(item => {
      list.map(l => {
        let date = moment();
        date.year(l.year);
        date.month(l.month - 1)
        date.date(l.day)
        date.hour(l.hour)
        date.minute(l.minute)
        date.second(l.second)
        console.log('l_date: ', date.format('YYYY-MM-DD HH:mm:ss'));
        // let a_date = l.year.toString() + "-" + l.month.toString() + '-' + l.day.toString() + ' ' + l.hour.toString() + ':' + l.minute.toString() + ':' + l.second.toString()
        let l_date = date.format('YYYY-MM-DD HH:mm:ss')
        items.push(l_date)

      })
      // })
      console.log(items)
      this.state.scheduleListData.map(s_item => {
        console.log("s_item: ", s_item)
        if (!items.includes(s_item.format('YYYY-MM-DD HH:mm:ss'))) {
          this.setAlarm(moment(s_item).format('DD-MM-YYYY HH:mm:ss'))
        }
      })

    }

    const update = list.map((l) => ({
      date: `alarm: ${l.day}-${l.month}-${l.year} ${l.hour}:${l.minute}:${l.second}`,
      id: l.id,
    }));

    this.setState({ update });

  };

  getSchedule() {
    AsyncStorage.multiGet(['user_id', 'full_name', 'company_id']).then((values) => {
      console.log("get full name===>", values[1][1])

      this.setState({
        ...this.state,
        user_id: values[0][1],
        full_name: values[1][1],
        company_id: values[2][1]
      })
      console.log(values)
      console.log("getcompany", values[2][1])
      this.getCompanyRule(values[2][1])
      // this.props.getSchedule(this.state.user_id)
      let body = {
        user_id: values[0][1]
      }
      fetch(`${SERVER_URL}getScheduleByUserId`, {
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
          console.log("========", res)
          let scheduleData = res
          // console.log(scheduleData)
          this.setState({
            ...this.state,
            schedules: scheduleData,
          })
          let currentDate = new Date()
          this.setTableData(currentDate)

          //Get Scheduled alarm items
          this.checkAlarms()

          return true;
        })
        .catch(error => {
          return (error)
        })
    })
  }

  setTableData(date) {
    var tableData = []
    var scheduleListData = []

    let dateString = moment(date).format("YYYY-MM-DD")

    let startDateTime = moment(date).startOf('day');
    let endDateTime = moment(date).endOf('day');
    this.state.schedules.filter(function (fitem) {
      console.log(moment(fitem.schedule_datetime))
      return (moment(fitem.schedule_datetime) > startDateTime && moment(fitem.schedule_datetime) < endDateTime);
    }).map(item => {
      // this.state.scheduleData.map(item => {
      let datetime = item.schedule_datetime;
      console.log(datetime)
      let date = datetime.split(' ')[0].split('-')[1] + "/" + datetime.split(' ')[0].split('-')[2]
      let time = datetime.split(' ')[1].split(':')[0] + ":" + datetime.split(' ')[1].split(':')[1]
      let client_name = item.client_entity_name;
      let client_id = item.client_id
      let check_in_datetime = item.check_in_datetime
      console.log("checkindatetime===> ", check_in_datetime)
      let check_out_datetime = item.check_out_datetime
      let check_in = 'No'
      let check_out = 'No'
      if (check_in_datetime != "0000-00-00 00:00:00") {
        check_in = 'Yes'
        if (check_out_datetime != "0000-00-00 00:00:00") {
          check_out = 'Yes'
        }
      }
      let tableRow = {
        client_name: client_name,
        date: date,
        time: time,
        client_id: client_id,
        check_in: check_in,
        check_out: check_out
      }
      tableData.push(tableRow)

      //Schedule Alarm List

      let s_date = moment(datetime).subtract('00:15:00')
      // let s_date = moment(datetime).subtract('00:15:00').format('YYYY-MM-DD HH:mm:ss')
      console.log('s_date: ', s_date)
      scheduleListData.push(s_date)
    })
    this.setState({
      ...this.state,
      tableData: tableData,
      scheduleListData: scheduleListData
    })
  }

  getCompanyRule(company_id) {
    let body = {
      company_id: company_id
    }
    fetch(`${SERVER_URL}getCompanyById`, {
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
        AsyncStorage.setItem(
          'min_time',
          res.min_schedule_time.toString()
        )
        AsyncStorage.setItem(
          'max_time',
          res.max_schedule_time.toString()
        )
        AsyncStorage.setItem(
          'notes',
          res.notes.toString()
        )
        AsyncStorage.setItem(
          'upload',
          res.upload.toString()
        )
        return true;
      })
      .catch(error => {
        return (error)
      })
  }

  closeControlPanel = () => {
    this._drawer.close()
  };
  openControlPanel = () => {
    this._drawer.open()
  };

  showDatePicker = () => {
    this.setState({ datePickerVisible: true });
  }

  hideDatePicker = () => {
    this.setState({ datePickerVisible: false });
  }

  handleDatePicker = date => {
    this.setState({
      datePickerVisible: false,
      date: moment(date).format('ddd, Do MMM YYYY'),
      error: ''
    });
    this.setTableData(date)
  }

  onItemClicked = (item) => {
    //getClientInfo by name
    setTimeout(() => {

      let body = {
        client_id: item.client_id
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
          this.setState({
            ...this.state,
            showModal: true,
            selectedItem: item,
            client_info: {
              client_entity_name: res.client_entity_name,
              custom_field: res.custom_field,
              address: res.address,
              latitude: res.location.split(' ')[0],
              longitude: res.location.split(' ')[1]
            }
          });
          console.log(res)
          // this.setState({  })
          return true;
          // return res;
          // resolve(res);
        })
        .catch(error => {
          return (error)
        })
    }, 2000);
  }

  gotoCheckin = () => {
    this.props.navigation.navigate('Checkin')
  }

  gotoCheckout = () => {
    this.props.navigation.navigate('Checkout')
  }

  getDirection = () => {
    console.log("Go to direction clicked");

    openMap({ latitude: Number(this.state.client_info.latitude), longitude: Number(this.state.client_info.longitude), provider: 'google', zoom: 10 })
    this.setState({ showModal: false });
  };

  onClose = () => {
    this.setState({ showModal: false });
  };

  render() {
    const drawerStyles = {
      drawer: { backgroundColor: 'white' },
      main: { paddingLeft: 3 },
    }
    const { update, alarmId } = this.state;
    return (
      <Drawer
        type="static"
        tapToClose={true}
        content={
          <View style={{
            alignItems: 'center',
            marginTop: 30
          }}>
            <Image style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              marginBottom: 20
            }} source={require('../../assets/user.png')} />
            <Text style={{
              fontWeight: 'bold',
              fontSize: 15,
              marginBottom: 10
            }}>Hi, {this.state.full_name} </Text>
            <View style={{
              height: 0.4,
              backgroundColor: 'black',
              width: '100%'
            }}>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('CreateClientScreen')
              }}
              style={{
                elevation: 8,
                backgroundColor: "white",
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 12,
                margin: 10
              }}>
              <Text style={{
                fontSize: 15,
                color: "#991100",
                fontWeight: "bold",
                alignSelf: "center",
                textTransform: "uppercase"
              }}>New Client</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log("log out button clicked")
                Alert.alert(
                  'Log out',
                  'Please confirm log out.',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel'
                    },
                    {
                      text: 'OK', onPress: () => {
                        // logout
                        AsyncStorage.setItem("user_id", '')
                        userActions.logout();

                        this.props.navigation.navigate('Login');
                      }
                    }
                  ],
                  { cancelable: false }
                );
                // this.onBackButtonClicked()
              }}
              style={{
                elevation: 8,
                backgroundColor: "white",
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 12,
                margin: 10
              }}>
              <Text style={{
                fontSize: 15,
                color: "#991100",
                fontWeight: "bold",
                alignSelf: "center",
                textTransform: "uppercase"
              }}>Log out</Text>
            </TouchableOpacity>

          </View>
        }
        ref={(ref) => this._drawer = ref}
        openDrawerOffset={0.5}
        styles={drawerStyles}
        closedDrawerOffset={-3}
        tweenHandler={Drawer.tweenPresets.parallax}
      >

        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <View style={{ position: 'absolute', left: 0 }}>
              <TouchableOpacity style={styles.backButton}
                onPress={this.openControlPanel}

              >
                <Image style={styles.backButtonIcon} source={require('../../assets/drawer.png')} />
              </TouchableOpacity>
            </View>
            <View style={{ height: '100%', width: '100%', alignItems: 'center', margin: 5, alignSelf: 'center', }}>
              <View>
                <Image source={require('../../assets/logo-login.png')} style={styles.image} />
              </View>
            </View>

          </View>
          <View style={styles.cardContainer}>
            <ScrollView horizontal={true}>
              <View style={styles.cardRowContainer}>
                <TouchableOpacity style={styles.cardView}>
                  <CardViewWithImage
                    width={screenWidth / 2.5}
                    source={require('../../assets/schedule.png')}
                    title={'      USER\nSCHEDULING'}
                    imageWidth={30}
                    imageHeight={30}
                    roundedImage={false}
                    onPress={() => {
                      this.props.navigation.navigate('Schedule');
                    }}
                    titleTextAlign={'center'}
                    imageMargin={{ top: 10 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.cardView}>
                  <CardViewWithImage
                    width={screenWidth / 2.5}
                    source={require('../../assets/client.png')}
                    title={'   CLIENT\nDATABASE'}
                    imageWidth={30}
                    imageHeight={30}
                    roundedImage={false}
                    onPress={() => {
                      this.props.navigation.navigate('ClientDB');
                    }}
                    titleTextAlign={'center'}
                    imageMargin={{ top: 10 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardView}>
                  <CardViewWithImage
                    width={screenWidth / 2.5}
                    source={require('../../assets/resource.png')}
                    title={' COMPANY\nRESOURCES'}
                    imageWidth={30}
                    imageHeight={30}
                    roundedImage={false}
                    onPress={() => {
                      this.props.navigation.navigate('ResourceScreen');
                    }}
                    imageMargin={{ top: 10 }}
                  />
                </TouchableOpacity>

              </View>

            </ScrollView>


          </View>
          <TouchableOpacity style={styles.inputContainer} onPress={this.showDatePicker}>
            <Image style={styles.inputIcon} source={require('../../assets/calendar.png')} />
            <Text style={styles.time}>{this.state.date}</Text>
          </TouchableOpacity>
          <View style={{ height: '60%', padding: 10 }}>
            <View style={styles.tableContainer}>
              <View style={{ height: '100%' }}>
                <ScrollView>
                  {
                    this.state.tableData.map((item, index) => (

                      <TouchableOpacity
                        key={index}
                        onPress={() => { this.onItemClicked(item) }}>
                        <Card>
                          {/*react-native-elements Card*/}
                          <View style={{
                            flexDirection: 'row',
                            width: screenWidth - 80,
                            height: 20,
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderRadius: 10,
                            alignItems: 'center'
                          }}>
                            <View>
                              <Text style={{ fontSize: 18 }}>
                                {item.time}
                              </Text>
                            </View>

                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                              {item.client_name}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ color: 'red' }}>IN : </Text>
                              <Text>{item.check_in}</Text>
                              <Text style={{ color: 'blue', marginLeft: 20 }}>OUT : </Text>
                              <Text>{item.check_out}</Text>
                            </View>
                          </View>

                        </Card>

                      </TouchableOpacity>

                    ))
                  }
                </ScrollView>
              </View>
            </View>
          </View>
          <Modal
            isVisible={this.state.showModal}
            onBackdropPress={() => this.setState({ showModal: false })}
            style={{
              backdropColor: "#B4B3DB",
              backdropOpacity: 0.8,
              animationIn: "zoomInDown",
              animationOut: "zoomOutUp",
              animationInTiming: 600,
              animationOutTiming: 600,
              backdropTransitionInTiming: 600,
              backdropTransitionOutTiming: 600
            }}
          >
            <View style={styles.modalContainer}>
              <Text style={{ fontWeight: 'bold', fontSize: 25, marginBottom: 0 }}>{this.state.selectedItem.client_name}</Text>
              <View style={styles.modalDivider}>
              </View>
              <View>
                <Text style={{ fontSize: 20, marginBottom: 20, marginTop: 20 }}>Client Entity Name: {this.state.client_info.client_entity_name}</Text>
                {/* <Text style={{ fontSize: 20, marginBottom: 20 }}>Client Owner Name: {this.state.client_info.custom_field}</Text> */}
                <Text style={{ fontSize: 20, marginBottom: 20 }}>Address: {this.state.client_info.address}</Text>

              </View >
              <View style={styles.modalBottomDivider}>
              </View>
              <View style={{ flexDirection: 'row', }}>
                <TouchableOpacity onPress={this.gotoCheckin} style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>CHECK IN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.gotoCheckout} style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>CHECK OUT</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', }}>

                <TouchableOpacity onPress={this.getDirection} style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>GET DIRECTION</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={this.onClose} style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity> */}
              </View>

              {/* <Button title="GET DIRECTION" style={{ height: 30, width: '80%', marginTop: 30 }} onPress={this.getDirection} /> */}
            </View>
          </Modal>
          <DateTimePicker
            isVisible={this.state.datePickerVisible}
            mode='date' onConfirm={this.handleDatePicker}
            minimumDate={this.state.min_time}
            maximumDate={this.state.max_time}
            onCancel={this.hideDatePicker}
          />
        </View>
      </Drawer>
    );
  }


};


const mapStateToProps = state => ({
  schedules: state.schedules,
  // client_info: state.client_info
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getSchedule: scheduleActions.getSchedule,
  logout: userActions.logout,
  getClientProfileById: clientActions.getClientProfileById
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home);
