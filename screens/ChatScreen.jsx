import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import React, { useState, useRef, useLayoutEffect } from 'react';
import { MaterialIcons, FontAwesome5, FontAwesome, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from '../assets';
import { useSelector } from 'react-redux';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const ChatScreen = ({ route }) => {
  const { room } = route.params;
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(null);
  const user = useSelector(state => state.user.user);

  const textInputRef = useRef(null);

  const handleKeyboardOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const sendMessage = async () => {
    const timestamp = serverTimestamp();
    const _id = `${room._id}-${Date.now()}`;
    const _doc = {
      _id,
      text: message,
      createdAt: timestamp,
      roomId: room._id,
      user,
    };

    setMessage('');
    await addDoc(collection(doc(db, 'chats', room._id), 'messages'), _doc)
      .then(() => {
        console.log('Message sent successfully');
      })
      .catch(err => {
        console.log('Error : ', err);
      });
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(db, 'chats', room?._id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(msgQuery, querySnap => {
      const upMsg = querySnap.docs.map(doc => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  console.log('messages-->', messages);

  return (
    <View className="flex-1">
      <View className="w-full bg-orange-950 px-4 py-6 flex-[0.25]">
        <View className="flex-row items-center justify-between w-full px-4 py-12">
          {/* go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="#fbfbfb" />
          </TouchableOpacity>
          {/* middle */}

          <View className="flex-row items-center justify-center space-x-3">
            <View className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <FontAwesome5 name="users" size={24} color="#fbfbfb" />
            </View>
            <View>
              <Text className="text-gray-50 text-base font-semibold capitalize ">
                {room.chatName.length > 16 ? `${room.chatName.slice(0, 16)}..` : room.chatName}{' '}
              </Text>
              <Text className="text-gray-100 text-sm font-semibold capitalize">online</Text>
            </View>
          </View>

          {/* last section */}
          <View className="w-12 h-12 items-center justify-center space-x-3">
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={24} color="#fbfbfb" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* chat section */}
      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={160}>
          <>
            <ScrollView>
              {isLoading ? (
                <>
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size="large" color="#43C651" />
                  </View>
                </>
              ) : (
                <>
                  {messages?.map((msg, index) =>
                    msg.user.providerDate.email === user.providerDate.email ? (
                      <>
                        <View className="m-1" key={index}>
                          <View
                            style={{ alignSelf: 'flex-end' }}
                            className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-primary w-auto  relative">
                            <Text className="text-base font-semibold text-white">{msg.text}</Text>
                          </View>
                          <View style={{ alignSelf: 'flex-end' }}>
                            {msg?.createdAt && (
                              <Text className="text-[12px] text-black font-semibold">
                                {new Date(
                                  parseInt(msg?.createdAt?.seconds) * 1000
                                ).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  hour12: true,
                                })}
                              </Text>
                            )}
                          </View>
                        </View>
                      </>
                    ) : (
                      <>
                        <View
                          key={index}
                          style={{ alignSelf: 'flex-start' }}
                          className="flex items-center justify-start space-x-2">
                          <View className="flex-row items-center justify-center space-x-2">
                            {/* image */}
                            <Image
                              className="w-12 h-12 rounded-full"
                              resizeMode="cover"
                              source={{ uri: msg?.user?.profilePic }}
                            />
                            {/* text */}
                            <View className="m-1">
                              <View className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-gray-200 w-auto  relative">
                                <Text className="text-base font-semibold text-black">
                                  {msg.message}
                                </Text>
                              </View>
                              <View style={{ alignSelf: 'flex-start' }}>
                                {msg?.createdAt?.seconds && (
                                  <Text className="text-[12px] text-black font-semibold">
                                    {new Date(
                                      parseInt(msg?.createdAt?.seconds) * 1000
                                    ).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: 'numeric',
                                      hour12: true,
                                    })}
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      </>
                    )
                  )}
                </>
              )}
            </ScrollView>

            <View className="w-full flex-row items-center justify-center px-8">
              <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center justify-center">
                <TouchableOpacity onPress={handleKeyboardOpen}>
                  <Entypo name="emoji-happy" size={24} color="#555" />
                </TouchableOpacity>

                <TextInput
                  className="flex-1 h-8 text-base text-primaryText font-semibold"
                  placeholder="Type here..."
                  placeholderTextColor="#999"
                  value={message}
                  onChangeText={text => setMessage(text)}
                />
              </View>
              <TouchableOpacity className="pl-4" onPress={sendMessage}>
                <FontAwesome name="send" size={24} color="#555" />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
