import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import attractions from './attractions.json';

const MapPage = () => {
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
            >
                {attractions.attractions.map((attraction, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: attraction.latitude, longitude: attraction.longitude }}
                        title={attraction.name}
                        description={attraction.description}
                    />
                ))}
            </MapView>
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

export default MapPage;
