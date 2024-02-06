import { View, TextInput } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const UserTextInput = ({ placeholder, isPassword, setStatueValue, icon }) => {
  const [value, onChangeText] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <View className="border rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 my-2 border-gray-200">
      <MaterialIcons name={icon} size={24} color="black" />
      <TextInput
        className="flex-1 text-base text-primaryText font-semibold -mt-1"
        placeholder={placeholder}
        value={value}
        onChangeText={text => {
          onChangeText(text);
          setStatueValue(text);
        }}
        secureTextEntry={isPassword ? !showPassword : false}
      />

      {isPassword && (
        <MaterialIcons
          name={showPassword ? 'visibility' : 'visibility-off'}
          size={24}
          color="black"
          onPress={() => setShowPassword(!showPassword)}
        />
      )}
    </View>
  );
};

export default UserTextInput;
