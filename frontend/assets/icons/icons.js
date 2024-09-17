import {FontAwesome, FontAwesome6, Fontisto, Foundation, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import React from "react";

export const icons = {
  index: (props)=> <Foundation name="home" size={24} {...props} />,
  events: (props)=> <MaterialCommunityIcons name="crowd" size={24} {...props} />,
  route: (props)=> <Ionicons name="compass" size={24} {...props} />,
  map: (props)=> <Fontisto name="map-marker" size={24} {...props} />,
  profile: (props)=> <MaterialCommunityIcons name="dots-hexagon" size={24} {...props} />,
}
