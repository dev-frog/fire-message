import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { BgImage, Logo } from '../assets';
import { UserTextInput } from '../components';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

const SingUpScreen = () => {
  const navigation = useNavigation();

  const screenWidth = Math.round(Dimensions.get('window').width);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handelSingUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const data = {
          _id: userCredential.user.uid,
          fullName,
          email,
          providerDate: userCredential.user.providerData[0],
        };

        setDoc(doc(db, 'users', userCredential.user.uid), data).then(() => {
          console.log('Document successfully written!');
          navigation.navigate('LoginScreen');
        });
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('error', errorCode, errorMessage);
      });
  };

  return (
    <View className="flex-1 items-center justify-start">
      <Image source={BgImage} resizeMode="cover" className="h-96" style={{ width: screenWidth }} />

      {/* main view */}
      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-44 items-center justify-start py-6 px-6 space-y-6">
        <Image source={Logo} className="w-16 h-16" resizeMode="contain" />

        <Text className="py-2 text-primaryText text-xl font-semibold">Join With Us!</Text>

        {/* avatar */}
        {/* <View className="w-24 h-24 bg-primary rounded-full items-center justify-center -my-4">
          <TouchableOpacity className="w-20 h-20 bg-white rounded-full items-center justify-center">
            <Image source={{ uri: '' }} className="w-16 h-16" resizeMode="contain" />
          </TouchableOpacity>
        </View> */}

        <View className="w-full flex items-center justify-center">
          {/* email */}
          <UserTextInput
            placeholder="Full Name"
            isPassword={false}
            setStatueValue={setFullName}
            icon="person"
          />

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

          <TouchableOpacity onPress={() => handelSingUp()}>
            <View
              className="w-full bg-primary rounded-2xl py-4 items-center justify-center"
              style={{ width: screenWidth - 48 }}>
              <Text className="py-2 text-white text-xl font-semibold">Sing Up</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* sign up */}

        <View className="flex-row items-center justify-center space-x-2">
          <Text className="text-primaryText text-base font-semibold">Have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text className="text-primary text-base font-semibold">Login Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SingUpScreen;
