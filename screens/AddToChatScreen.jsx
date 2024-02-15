import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '../assets';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useSelector } from 'react-redux';

const AddToChatScreen = () => {
  const navigation = useNavigation();
  const [addChat, setAddChat] = React.useState('');
  const user = useSelector(state => state.user.user);

  const createNewChat = async () => {
    const id = `${user._id}-${Date.now()}`;
    const _chat = {
      _id: id,
      user,
      chatName: addChat,
    };

    if (addChat !== '') {
      setDoc(doc(db, 'chats', id), _chat)
        .then(() => {
          console.log('Chat created successfully');
          setAddChat('');
          navigation.replace('HomeScreen');
        })
        .catch(err => {
          alert('Error : ', err);
        });
    }
  };

  return (
    <View className="flex-1">
      <View className="w-full bg-orange-950 px-4 py-6 flex-[0.25]">
        <View className="flex-row items-center justify-between w-full px-4 py-12">
          {/* go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="#fbfbfb" />
          </TouchableOpacity>
          {/* middle */}

          {/* last section */}
          <View className="w-12 h-12 items-center justify-center space-x-3">
            <Image source={Avatar} className="w-full h-full rounded-full" resizeMode="cover" />
          </View>
        </View>
      </View>

      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <View className="w-full px-4 py-4">
          <View className="w-full px-4 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3">
            {/* icons */}
            <Ionicons name="chatbubbles" size={24} color="#777" />
            {/* textinput */}
            <TextInput
              className="flex-1 text-lg text-primaryText -mt-2  h-12 w-full"
              placeholder="Create a chat"
              placeholderTextColor="#999"
              value={addChat}
              onChangeText={text => setAddChat(text)}
            />

            {/* icon */}
            {/* <TouchableOpacity onPress={() => createNewChat()} className="flex-col">
              <FontAwesome name="send" size={24} color="#777" />
            </TouchableOpacity> */}
          </View>

          <View className="w-full flex-row items-center justify-between py-3">
            <TouchableOpacity
              onPress={() => createNewChat()}
              className="w-full bg-primary rounded-xl py-3 flex-row items-center justify-center">
              <Text className="text-white text-lg font-bold">Create Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddToChatScreen;
