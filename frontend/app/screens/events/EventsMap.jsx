import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

const EventsMap = () => {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 7.8731,
                    longitude: 80.7718,
                    latitudeDelta: 2.5,
                    longitudeDelta: 2.5,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default EventsMap;
