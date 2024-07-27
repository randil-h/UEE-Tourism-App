import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import tw from "../tailwind";

import openingImage from "../assets/images/kandy-lake.jpg";

const App = () => {
  return (
    <View className = "flex-1">
      <ImageBackground
        source={openingImage}
        resizeMode="cover"
        style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`"text-white text-2xl font-bold text-center mb-2`}>Sri Lanka</Text>
          <br></br>
          <Text style={tw`text-white text-2xl font-bold text-center`}>Wonder of Asia</Text>
        </ImageBackground>
    </View>
  )
}

export default App;