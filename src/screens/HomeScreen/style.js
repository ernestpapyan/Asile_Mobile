import { StyleSheet, Dimensions, } from 'react-native';
import { black, grayBackgroundLight, primaryDark, white, yellow } from "../../styles/colors";
import { boxShadow, margin, padding, screenWidth } from "../../styles/mixins";
const styles = StyleSheet.create({

    engine: {
        position: 'absolute',
        right: 0,
    },
    footer: {
        color: '#555',
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    body: {
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90%'
    },
    cardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '20%',
        marginBottom: 10
    },
    cardRowContainer: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%',
    },
    cardView: {
        width: '33%',
        height: '100%',
        marginBottom: 5
    },
    cardViewStyle: {

        // width: screenWidth/2.5, 
        height: '100%',
        justifyContent: 'center',
    },

    cardView_InsideText: {

        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginTop: 50

    },

    cardImage: {
        width: 70,
        height: 70,
    },
    image: {
        width: screenWidth / 3,
        height: '100%',
    },
    avatarContainer: {
        width: screenWidth,
        height: '10%',
        backgroundColor: 'white',
        flexDirection: 'row'
    },

    backButton: {
        width: 35,
        height: 35,
        marginLeft: 10,
        marginVertical: 15
    },
    backButtonIcon: {
        width: 25,
        height: 25,
        alignSelf: 'center'
    },
    userNameText: {
        textAlign: 'right',
        alignSelf: 'center',
        fontSize: 20
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    tableContainer: {
        borderRadius: 10,
        backgroundColor: '#fff',
        width: Dimensions.get('screen').width,
        height: '100%',
        alignItems: 'center'
    },
    tableHeader: {
        height: 40,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    tableHeaderItem: {
        width: '15%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableHeaderWideItem: {
        width: '30%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableHeaderNarrowItem: {
        width: '15%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableDivider: {
        height: 1,
        backgroundColor: '#fff',
        width: '95%'
    },
    modalDivider: {
        height: 1,
        backgroundColor: '#000',
        width: '100%'
    },
    modalBottomDivider: {
        height: 1,
        backgroundColor: '#000',
        width: '100%',
        marginBottom: 30
    },
    buttonContainer: {
        elevation: 8,
        backgroundColor: "#004488",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 10
    },
    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    inputContainer: {
        flexDirection: 'row',
        width: screenWidth - 20,
        height: '7%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'white',
        marginBottom: 5,
        marginTop: 10,
        ...boxShadow()
    },
    inputIcon: {
        width: 20,
        height: 20,
        marginLeft: 5
    },
    inputBox: {
        width: screenWidth - 85,
        height: 50,
        marginLeft: 5,
        color: black,
    },
    time: {
        width: screenWidth - 85,
        color: 'black',
        fontSize: 20,
        textAlignVertical: 'center',
        alignSelf: 'center',
        marginLeft: 10
    },

});

export default styles;