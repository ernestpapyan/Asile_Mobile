import React, {Component} from 'react';
import {Text, ActivityIndicator, View} from 'react-native';
import CardView from 'react-native-cardview';
import {AppStyles} from "../styles/styles";

export default class WaitingDialog extends Component {
    render() {
        return (
            <View style={[AppStyles.containerModal, AppStyles.centered]}>
                <CardView style={AppStyles.modal}
                          cardElevation={5}
                          cardMaxElevation={5}
                          cornerRadius={2}>
                    <ActivityIndicator
                        style={{height: 50}}
                        color="#C00"
                        size="large"/>
                    <Text style={{padding: 5, fontSize: 10, fontWeight: 'bold'}}>Loading...</Text>
                </CardView>
            </View>
        );
    }
}