import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { BgImage, Logo } from '../assets';
import { UserTextInput } from '../components';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

const LoginScreen = () => {
  const navigation = useNavigation();

  const screenWidth = Math.round(Dimensions.get('window').width);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handelLogin = async () => {
    if (email) {
      await signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          if (userCredential) {
            getDoc(doc(db, 'users', userCredential.user.uid)).then(docSnap => {
              if (docSnap.exists()) {
                console.log('Document data:', docSnap.data());
                navigation.navigate('HomeScreen');
              } else {
                console.log('No such document!');
              }
            });
          }
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('error', errorCode, errorMessage);
        });
    }
  };

  return (
    <View className="flex-1 items-center justify-start">
      <Image source={BgImage} resizeMode="cover" className="h-96" style={{ width: screenWidth }} />

      {/* main view */}
      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-44 items-center justify-start py-6 px-6 space-y-6">
        <Image source={Logo} className="w-16 h-16" resizeMode="contain" />

        <Text className="py-2 text-primaryText text-xl font-semibold">Welcome Back!</Text>

        <View className="w-full flex items-center justify-center">
          {/* alert messages */}

          {/* email */}
          <UserTextInput
            placeholder="Email"
            isPassword={false}
            setStatueValue={setEmail}
            icon="email"
          />
          {/* password */}
          <UserTextInput
            placeholder="Password"
            isPassword
            setStatueValue={setPassword}
            icon="lock"
          />
          {/* button */}

          <TouchableOpacity onPress={() => handelLogin()}>
            <View
              className="w-full bg-primary rounded-2xl py-4 items-center justify-center"
              style={{ width: screenWidth - 48 }}>
              <Text className="py-2 text-white text-xl font-semibold">Login</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* login as google */}
        <TouchableOpacity>
          <View
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 items-center justify-center"
            style={{ width: screenWidth - 48 }}>
            <Text className="py-2 text-primaryText text-xl font-semibold">Login with Google</Text>
          </View>
        </TouchableOpacity>

        {/* sign up */}

        <View className="flex-row items-center justify-center space-x-2">
          <Text className="text-primaryText text-base font-semibold">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SingUpScreen')}>
            <Text className="text-primary text-base font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
