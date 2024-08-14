import {View, Text, StatusBar} from 'react-native'
import React from 'react'
import ColorList from "../components/ColorList";

const Home = () => {
    return (
        <View>
            <StatusBar barStyle="dark-content" />
            <ColorList color={"#57a3d8"} />
        </View>
    )
}

export default Home
