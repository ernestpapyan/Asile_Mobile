import { StyleSheet } from 'react-native';
import { black, grayBackgroundLight, primaryDark, white, yellow } from "../../styles/colors";
import { boxShadow, margin, padding, screenWidth } from "../../styles/mixins";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: white,
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarContainer: {
        width: screenWidth,
        height: '10%',
        backgroundColor: 'white',
        marginTop: '5%',
        flexDirection: 'row'
    },
    imageBackground: {
        width: screenWidth,
        height: screenWidth
    },
    backButton: {
        width: 35,
        height: 35,
        position: 'absolute',
        start: 0,
        margin: 15,
    },
    backButtonIcon: {
        width: 20,
        height: 20,
        alignSelf: 'center'
    },
    cameraButton: {
        width: 40,
        height: 40,
        end: 0,
        alignSelf: 'flex-end',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: '#fff',
        margin: 20,
        ...boxShadow()
    },
    loginContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 10
    },
    accountTypeContainer: {
        width: screenWidth - 50,
        height: 50,
        justifyContent: 'center',
        marginBottom: 15,
        backgroundColor: primaryDark,
        alignItems: 'center',
        flexDirection: 'row',
        alignContent: 'center',
        ...padding(10, 0)
    },
    buttonPrimaryDark: {
        flex: 1,
        height: 40,
        backgroundColor: primaryDark,
        borderRadius: 1,
        borderColor: primaryDark,
        borderWidth: 0,
        textAlign: 'center',
        justifyContent: 'center',
        ...padding(10, 20),
        ...margin(0, 5)
    },
    buttonGreen: {
        flex: 1,
        height: 40,
        backgroundColor: 'green',
        borderRadius: 1,
        borderColor: primaryDark,
        borderWidth: 0,
        textAlign: 'center',
        justifyContent: 'center',
        ...padding(10, 20),
        ...margin(0, 5)
    },
    inputContainer: {
        flexDirection: 'row',
        width: screenWidth - 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
        marginBottom: 20,
        ...boxShadow()
    },
    inputNote: {
        flexDirection: 'row',
        width: '60%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'baseline',
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 20,
        ...boxShadow()
    },
    inputReason: {
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'baseline',
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 20,
        ...boxShadow()
    },
    inputLatLong: {
        flexDirection: 'row',
        width: '40%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
        ...boxShadow()
    },
    inputIcon: {
        width: 15,
        height: 15,
        marginLeft: 5
    },
    inputBox: {
        width: screenWidth - 85,
        height: 50,
        marginLeft: 5,
        color: black,
    },
    inputLatLongBox: {
        // width: screenWidth - 85,
        height: 50,
        color: black,
    },
    time: {
        width: screenWidth - 85,
        color: 'black',
        fontSize: 15,
        textAlignVertical: 'center',
        alignSelf: 'center',
        marginLeft: 10
    },
    note: {
        width: '100%',
        color: 'black',
        fontSize: 15,
        textAlignVertical: 'center',
        alignSelf: 'baseline',
        marginLeft: 10
    },
    buttonContainer: {
        width: screenWidth - 40,
        height: 40,
        backgroundColor: '#5589e6',
        borderRadius: 20,
        marginBottom: 10,
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
        ...padding(10, 20)
    },
    image: {
        width: screenWidth / 2.3,
        height: '90%',
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    }
});

export default styles;