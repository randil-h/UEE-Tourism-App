import { AntDesign, Feather } from "@expo/vector-icons";
import React from "react";

export const icons = {
  index: (props)=> <AntDesign name="home" size={26} {...props} />,
  events: (props)=> <Feather name="music" size={24} {...props} />,
  route: (props)=> <Feather name="compass" size={26} {...props} />,
  map: (props)=> <Feather name="map" size={24} {...props} />,
  profile: (props)=> <AntDesign name="user" size={26} {...props} />,
}
