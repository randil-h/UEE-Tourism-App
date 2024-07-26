import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

const App = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-blue-100`}>
      <Text style={tw`text-black text-lg`}>Hello Bimidu!</Text>
    </View>
  );
};

export default App;