import {FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import React from "react";

export const icons = {
  index: (props)=> <FontAwesome name="home" size={24} {...props} />,
  events: (props)=> <FontAwesome name="music" size={24} {...props} />,
  route: (props)=> <Ionicons name="compass" size={24} {...props} />,
  map: (props)=> <FontAwesome6 name="map-location-dot" size={24} {...props} />,
  profile: (props)=> <MaterialCommunityIcons name="account" size={24} {...props} />,
}
