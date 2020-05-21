/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component, useState, useEffect} from 'react';
import { View, Image, FlatList, TouchableOpacity, Dimensions, StyleSheet, Text, PermissionsAndroid } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { ActionSheet, Root, Container, Header, Content, Item, Input, Label } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const options = {
  width: 300,
  height: 400,
  cropping: true,
  includeBase64: true,
  compressImageMaxWidth: 500,
  compressImageMaxHeight: 500,
  compressImageQuality: 0.7,
};

export default function App() {
  const [myState, mySetState] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('state')
      .then(value => {
        if (value) mySetState(JSON.parse(value));
        console.log('AsyncStorage:', value);
      })
      .catch(error => console.log('AsyncStorage error: ', error));
  }, []);

  const onClickSaveProfile = () => {
    AsyncStorage.setItem('state', JSON.stringify(myState))
      .then(alert('Profile saved'))
      .catch(error => console.log('AsyncStorage error: ', error));
  };

  const onClickSetPhoto = () => {
    const BUTTONS = ['Take Photo', 'Choose from Library', 'Cancel'];
    ActionSheet.show(
      {options: BUTTONS, cancelButtonIndex: 2, title: 'Select a Photo'},
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            takePhotoFromCamera();
            break;
          case 1:
            choosePhotoFromLibrary();
            break;
          default:
        }
      },
    );
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker(options)
      .then(image => {
        // console.log('Choose Photo Object: ', image);
        onSelectedImage(image);
      })
      .catch(error => console.log('ImagePicker error: ', error));
  };

  const takePhotoFromCamera = () => {
    const requestCameraPermission = async () => {
      // async function requestCameraPermission() {
      //Calling the permission function
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'AndoridPermissionExample App Camera Permission',
          message: 'AndoridPermissionExample App needs access to your camera ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openCamera(options)
          .then(image => {
            // console.log('Photo Object: ', image);
            onSelectedImage(image);
          })
          .catch(error => console.log('ImagePicker error: ', error));
      } else {
        alert('CAMERA Permission Denied.');
      }
    };
    requestCameraPermission();
  };

  const onSelectedImage = image => {
    const source = {uri: image.path};
    let item = {
      id: Date.now(),
      url: source,
      // data: image.data,
      mime: image.mime,
    };
    mySetState({...myState, 'profileImage':item});
  };

  const onInputTextChanged = (text, label) => {
    mySetState({...myState, [label]: text});
  };

  const onClickClear = () => {
    AsyncStorage.clear().then(mySetState(0));
  };

  console.log('myState: ', myState);

  const { content, btnPressStyle, buttonArea, profileArea, itemViewImage, itemImage } = styles;
  return (
    <Root>
      <View style={content}>
        <View style={profileArea}>
          <View style={itemViewImage}>
            <Image
              source={myState.profileImage && myState.profileImage.url}
              style={itemImage}
            />
          </View>
          <Item inlineLabel>
            <Label>Имя</Label>
            <Input
              value={myState.name}
              onChangeText={text => onInputTextChanged(text, 'name')}
            />
          </Item>
          <Item inlineLabel>
            <Label>Фамилия</Label>
            <Input
              value={myState.lastname}
              onChangeText={text => onInputTextChanged(text, 'lastname')}
            />
          </Item>
          <Item inlineLabel>
            <Label>Отчество</Label>
            <Input
              value={myState.patronymic}
              onChangeText={text => onInputTextChanged(text, 'patronymic')}
            />
          </Item>
          <Item inlineLabel>
            <Label>Логин</Label>
            <Input
              value={myState.login}
              onChangeText={text => onInputTextChanged(text, 'login')}
            />
          </Item>
          <Item inlineLabel>
            <Label>Email</Label>
            <Input
              value={myState.email}
              onChangeText={text => onInputTextChanged(text, 'email')}
            />
          </Item>
          <Item inlineLabel>
            <Label>Телефон</Label>
            <Input
              value={myState.phone}
              onChangeText={text => onInputTextChanged(text, 'phone')}
            />
          </Item>
        </View>
        <View style={buttonArea}>
          <TouchableOpacity
            style={btnPressStyle}
            onPress={() => onClickSetPhoto()}>
            <Text style={{color: '#fff'}}>Set Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={btnPressStyle}
            onPress={() => onClickSaveProfile()}>
            <Text style={{color: '#fff'}}>Save Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={btnPressStyle}
            onPress={() => onClickClear()}>
            <Text style={{color: '#fff'}}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Root>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 50,
    marginBottom: 30,
    flex: 1,
    alignItems: 'center',
  },
  itemViewImage: {
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  itemImage: {
    backgroundColor: '#2F455C',
    height: 150,
    width: width - 60,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  btnPressStyle: {
    backgroundColor: '#0080ff',
    height: 50,
    width: width / 3 - 20,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonArea: {
    flex: 0,
    flexDirection: 'row',
  },
  profileArea: {
    flex: 0,
    height: height - 90,
  },
});
