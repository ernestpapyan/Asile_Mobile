import {StyleSheet} from 'react-native';
import {scale, moderateScale} from '../utils/scaling';

const style = StyleSheet.create({
  btn: {
    borderRadius: 50,
    marginRight: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    padding: 5,
  },
  titleView: {
    marginLeft: 15,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  headerRightView: {
    marginBottom: 10,
    flexDirection: 'row',
    marginRight: 5,
  },
  headerIcon: {
    fontSize: 35,
    color: 'white',
  },
  imageIcon: {
    width: 40,
    height: 40,
  },
  sign_out_text: {
    fontSize: 16,
    color: '#BB0B0B',
    fontWeight: 'normal',
  },
  delete_text: {
    color: '#BB0B0B',
    fontSize: 16,
    fontWeight: 'normal',
  },
  header_left_container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  header_left_back_buton: {
    width: 'auto',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    justifyContent: 'center',
  },
  title_customized_view: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title_text_bold: {
    fontSize: moderateScale(24),
    color: 'black',
    fontWeight: 'bold',
  },
});

export default style;
