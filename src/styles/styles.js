import {StyleSheet} from 'react-native';
import {
    black,
    buttonPrimary,
    gray,
    grayBackgroundLight,
    inactiveBackground,
    inactiveText,
    primary,
    white,
    yellow
} from "./colors";
import {boxShadow, margin, padding, scaleSize, screenWidth} from "./mixins";

export const AppStyles = StyleSheet.create({
    containerBlack: {
        flex: 1,
        backgroundColor: black
    },
    containerWhite: {
        flex: 1,
        backgroundColor: white,
        height: '90%'
    },
    containerModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        backgroundColor: primary,
        ...boxShadow()
    },
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    nameTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginLeft: 15
    },
    loaderStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
    },
    modal: {
        width: 90,
        height: 90,
        padding: 10,
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: white,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.75,
        shadowRadius: 5,
        elevation: 5,
    },
    backBtnContainer: {
        width: scaleSize(35),
        height: scaleSize(35),
        alignSelf: 'flex-start',
        justifyContent: 'center',
        ...margin(15, 0, 0, 5)
    },
    backBtn: {
        width: scaleSize(20),
        height: scaleSize(20),
        alignSelf: 'center'
    },
    centeredRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        width: screenWidth,
        height: 1,
        backgroundColor: gray
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: '#000000',
        borderRadius: 5,
        borderColor: yellow,
        borderWidth: 2,
        textAlign: 'center',
        justifyContent: 'center',
        ...padding(10, 20),
        ...margin(0, 10)
    },
    reviewDialog: {
        ...boxShadow()
    }
});

export const DrawerMenuStyles = StyleSheet.create({
    drawerTransparent: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    drawer: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
    },
    header: {
        width: '100%',
        height: 150,
        backgroundColor: primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerImage: {
        width: 80,
        height: 80,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: 12,
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    textHeader: {
        fontSize: 18,
        color: '#111',
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    textMenu: {
        fontSize: 16,
        color: '#111',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    menuImage:{
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingLeft: 10,
    },
});

export const ChattingStyles = StyleSheet.create({
    listView: {
        flex: 1,
        flexDirection: 'column',
        padding: 5
    },
    itemContainerMe: {
        width: screenWidth,
        flex: 1,
        alignContent: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    itemWrapperMe: {
        maxWidth: screenWidth / 2,
        flexDirection: 'row',
        backgroundColor: '#1E90FF',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    itemContainerYou: {
        width: screenWidth,
        flex: 1,
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    itemWrapperYou: {
        maxWidth: (screenWidth / 2) + 30,
        flexDirection: 'row',
        backgroundColor: gray,
        padding: 10,
        borderRadius: 5,
        alignContent: 'center'
    },
    timeMe: {
        fontSize: 8,
        color: 'white',
        textAlignVertical: 'center',
        marginRight: 5,
        marginTop: 4
    },
    timeYou: {
        fontSize: 8,
        textAlignVertical: 'center',
        color: 'black',
        marginLeft: 15
    },
    messageMe: {
        fontSize: 12,
        color: 'white',
        textAlignVertical: 'center'
    },
    messageYou: {
        fontSize: 12,
        textAlignVertical: 'center',
        color: 'black',
        marginLeft: 15
    },
    messageWrapper: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    senderImage: {
        width: 30,
        height: 30,
        borderRadius: 100,
        alignItems: 'center'
    },
    senderImageWrapper: {
        width: 20,
        height: 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: screenWidth - 90,
        fontSize: 16,
        marginLeft: 5,
        alignSelf: 'center'
    },
    sendButtonDisabled: {
        backgroundColor: inactiveBackground,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        position: 'absolute',
        end: 0
    },
    sendButtonEnabled: {
        backgroundColor: buttonPrimary,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        position: 'absolute',
        end: 0
    },
    sendButtonTextEnabled: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: white,
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10
    },
    sendButtonTextDisabled: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: inactiveText,
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10
    }
});
