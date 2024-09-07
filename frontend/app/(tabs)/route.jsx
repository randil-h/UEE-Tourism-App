import {View, Text, StatusBar, TextInput, TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import ColorList from "../../components/test_components/ColorList";
import {FontAwesome} from "@expo/vector-icons";

const Route = () => {
  return (
      <ScrollView className="mt-16">
          <View className="relative">

              <View className="flex flex-row justify-between px-6 py-2">
                  <Text className="font-bold text-3xl">Your Route</Text>

              </View>


              <ColorList color="#d85766" />
          </View>
      </ScrollView>
  )
}

export default Route
