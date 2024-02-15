import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo, Avatar, RoomIcon } from '../assets';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../config/firebaseConfig';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { SET_USER_NULL } from '../context/actions/userActions';

const HomeScreen = () => {
  const user = useSelector(state => state.user.user);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(true);
  const [chats, setChats] = React.useState([]);

  useLayoutEffect(() => {
    const chatQuery = query(collection(db, 'chats'), orderBy('_id', 'desc'));

    const unsubscribe = onSnapshot(chatQuery, snapshot => {
      const _chats = snapshot.docs.map(doc => doc.data());
      setChats(_chats);
      setIsLoading(false);
    });

    // also want last message of each chat
    const lastMessageQuery = query(collection(db, 'chats'), orderBy('timestamp', 'desc'), limit(1));

    const unsubscribe2 = onSnapshot(lastMessageQuery, snapshot => {
      const _chats = snapshot.docs.map(doc => doc.data());
      setChats(_chats);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  // logout function using redux
  const handleLogout = async () => {
    await auth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.replace('LoginScreen');
    });
  };
  return (
    <View style={{ paddingTop: Math.max(insets.top, 16) }}>
      <View className="w-full flex-row items-center justify-between px-4 py-2">
        {/* <Image source={Logo} className="w-12 h-12" resizeMode="cover" /> */}

        <TouchableOpacity className="w-12 h-12 rounded-full border border-primary flex items-center justify-center">
          <Image source={Avatar} className="w-full h-full rounded-full" resizeMode="cover" />
        </TouchableOpacity>

        {/* logout button */}
        <TouchableOpacity
          onPress={() => handleLogout()}
          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <Text className="text-white text-xs font-bold">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* scrollView */}
      <ScrollView className="w-full px-4 pt-4">
        <View className="w-full">
          <View className="w-full flex-row items-center justify-between px-2">
            <Text className="text-primaryText text-base font-extrabold pb-2">Messages</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddToChatScreen')}
              className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Text className="text-white text-xs font-bold">+</Text>
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <>
              <View className="w-full flex items-center justify-center">
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            </>
          ) : (
            <>
              {chats && chats.length > 0 ? (
                <>
                  {chats.map((room, index) => (
                    <MessageCard key={index} room={room} />
                  ))}
                </>
              ) : (
                <>
                  <View className="w-full flex items-center justify-center">
                    <Text className="text-primaryText text-base font-bold">No Messages</Text>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const MessageCard = ({ room }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChatScreen', { room })}
      className="w-full flex-row items-center justify-start py-2">
      {/* images */}
      <View className="w-16 h-16 rounded-full flex items-center border-2 border-primary p-1 justify-center">
        <Image source={RoomIcon} className="w-full h-full rounded-full" resizeMode="cover" />
      </View>
      {/* content */}
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">{room.chatName}</Text>

        <Text className="text-primaryText text-sm">
          {/* {room.messages[room.messages.length - 1].user.email} :{' '}
          {room.messages[room.messages.length - 1].message} */}
        </Text>
      </View>

      {/* time text */}
      <Text className="text-primary px-4 text-base font-semibold">27 min</Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;
