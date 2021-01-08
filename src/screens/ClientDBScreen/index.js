import React, { Component } from 'react';
import { connect } from "react-redux";
import { View, BackHandler, FlatList, TouchableOpacity, Image, Text, TextInput, ActivityIndicator } from 'react-native';
import styles from './style';
import StatusBarPlaceHolder from "../../components/statusbarPlaceHolder";
import WaitingDialog from "../../components/waitingDialog";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import ShakingText from 'react-native-shaking-text';
import { AppStyles } from '../../styles/styles';
import ImagePicker from 'react-native-image-picker';
import { ListItem, SearchBar } from 'react-native-elements';
import moment from 'moment';
import openMap from 'react-native-open-maps';
import Modal from 'react-native-modal';

import AsyncStorage from '@react-native-community/async-storage';
import { SERVER_URL } from "../../common/config";

class ClientDBScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: false,
            showModal: false,
            selectedItem: {},
            data: [],
            error: null,
        };
        this.arrayholder = [];
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', async () => {
            BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonClicked());
        });
        navigation.addListener('willBlur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonClicked);
        });
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        
        AsyncStorage.getItem('user_id').then((value) => {
            let body = {
                user_id: value
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
                    console.log(res)
                    this.setState({
                        ...this.state,
                        data: res
                    })
                    this.arrayholder = res
                    return true;
                })
                .catch(error => {
                    return (error)
                })
        })
    };

    onBackButtonClicked = () => {
        this.props.navigation.navigate("Home");
        return true;
    }

    updateLoadingStatus = bool => {
        this.setState({ loading: bool });
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#CED0CE',
                }}
            />
        );
    };

    searchFilterFunction = text => {
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.client_entity_name}`;
            console.log(itemData)
            // const textData = text.toUpperCase();

            return itemData.indexOf(text) > -1;
        });
        // console.log(newData)
        this.setState({
            data: newData,
        });
    };

    renderHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                lightTheme
                round
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={true}
                value={this.state.value}
            />
        );
    };

    onItemClicked = (item) => {
        //getClientInfo by name
        this.setState({ showModal: true });
        console.log(item)
        this.setState({ selectedItem: item })
        return true;
    }

    getDirection = () => {
        // console.log("Go to direction clicked====>", this.state.selectedItem.location);
        let location = this.state.selectedItem.location
        let latitude = Number(location.split(' ')[0])
        let longitude = Number(location.split(' ')[1])
        console.log('lat, long : ', latitude, longitude)
        openMap({ latitude: latitude, longitude: longitude, provider: 'google', zoom: 10 })
        this.setState({ showModal: false });
    };


    onClose = () => {
        this.setState({ showModal: false });
    };

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
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
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 30, marginTop: 20, marginBottom: 30, alignSelf: 'center' }}>Client Database</Text>
                </View>
                <SearchBar
                    placeholder="Type Here..."
                    lightTheme
                    round
                    onChangeText={text => this.searchFilterFunction(text)}
                    autoCorrect={true}
                    value={this.state.value}
                />
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={( ) => { this.onItemClicked(item) }}
                        >
                            <ListItem>
                                <ListItem.Content>
                                    <ListItem.Title>
                                        {`${item.client_entity_name}`}
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            {/* <Image source={require('../../assets/right-arrow.png')} style={styles.listImage} /> */}
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.email}
                    ItemSeparatorComponent={this.renderSeparator}
                // ListHeaderComponent={this.renderHeader}
                />

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
                        <Text style={{ fontWeight: 'bold', fontSize: 25, marginBottom: 0 }}>{this.state.selectedItem.client_entity_name}</Text>
                        <View style={styles.modalDivider}>
                        </View>
                        <View>
                            <Text style={{ fontSize: 20, marginBottom: 20, marginTop: 20 }}>Client Entity Name: {this.state.selectedItem.client_entity_name}</Text>
                            <Text style={{ fontSize: 20, marginBottom: 20 }}>Client Owner Name: {this.state.selectedItem.client_owner_name}</Text>
                            <Text style={{ fontSize: 20, marginBottom: 20 }}>Address: {this.state.selectedItem.address}</Text>

                        </View >
                        <View style={styles.modalBottomDivider}>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity onPress={this.getDirection} style={styles.buttonContainer}>
                                <Text style={styles.buttonText}>GET DIRECTION</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.onClose} style={styles.buttonContainer}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <Button title="GET DIRECTION" style={{ height: 30, width: '80%', marginTop: 30 }} onPress={this.getDirection} /> */}
                    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientDBScreen);