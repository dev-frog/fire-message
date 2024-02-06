import { View, Image, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Logo } from '../assets';
import { auth, db } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { getDoc, doc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { SET_USER } from '../context/actions/userActions';

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    chechLoggedUser();
  }, []);

  const chechLoggedUser = async () => {
    auth.onAuthStateChanged(userCred => {
      if (userCred?.uid) {
        getDoc(doc(db, 'users', userCred?.uid))
          .then(docSnap => {
            if (docSnap.exists()) {
              console.log('Document data:', docSnap.data());
              dispatch(SET_USER(docSnap.data()));
            }
          })
          .then(() => {
            setImmediate(() => {
              navigation.replace('HomeScreen');
            }, 2000);
          });
      } else {
        console.log('No user is signed in.');
        navigation.replace('LoginScreen');
      }
    });
  };
  return (
    <View className="flex-1 items-center justify-center space-y-24">
      <Image source={Logo} className="w-16 h-16" resizeMode="contain" />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default SplashScreen;
