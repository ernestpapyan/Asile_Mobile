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
import Pdf from 'react-native-pdf';

import AsyncStorage from '@react-native-community/async-storage';
import { SERVER_URL } from "../../common/config";

class ResourceScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: false,
            showModal: false,
            company_id: '',
            selected_item: '',
            data: [],
            source: {
                uri: '',
                cache: true
            },
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

        AsyncStorage.getItem('company_id').then((value) => {
            let body = {
                company_id: value
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
                    else if (res.company_info != null || res.company_info != '') {
                        let data = res.company_info.split(', ')
                        this.setState({
                            ...this.state,
                            data: data
                        })
                    }

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

    onItemClicked = (item) => {
        //getClientInfo by name
        console.log(`${SERVER_URL}pdf/${item}`)
        let source = {
            uri: `${SERVER_URL}pdf/${item}`,
            cache: true
        }
        this.setState({
            showModal: true,
            source: source,
            selected_item: item
        });
        return true;
    }

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
                    <Text style={{ fontWeight: 'bold', fontSize: 30, marginTop: 20, marginBottom: 30, alignSelf: 'center' }}>Company Resources</Text>
                </View>

                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => { this.onItemClicked(item) }}
                        >
                            <ListItem>
                                <ListItem.Content>
                                    <ListItem.Title>
                                        {`${item}`}
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
                    <View style={styles.pdfcontainer}>
                        <Text style={{color: 'white', fontSize: 16}}>{this.state.selected_item}</Text>
                        <Pdf
                            source={this.state.source}
                            onLoadComplete={(numberOfPages, filePath) => {
                                console.log(`number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                console.log(`current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.log(error);
                            }}
                            onPressLink={(uri) => {
                                console.log(`Link presse: ${uri}`)
                            }}
                            style={styles.pdf} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ResourceScreen);