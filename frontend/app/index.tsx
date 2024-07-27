import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from "../tailwind";

import openingImage from "../assets/images/kandy-lake.jpg";

const App = () => {
  return (
    <View className="flex-1">
      <ImageBackground
        source={openingImage}
        resizeMode="cover"
        style={tw`flex-1 justify-center items-center`}
      >
        <Text style={tw`mt-30 text-white text-2xl font-bold text-center mb-2`}>Sri Lanka</Text>
        <Text style={tw`mt-30 text-white text-2xl font-bold text-center mb-6`}>Wonder of Asia</Text>
        <TouchableOpacity style={tw`mt-60 bg-blue-500 px-6 py-3 rounded-full`}>
          <Text style={tw`text-white text-lg font-semibold`}>Get Started</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default App;