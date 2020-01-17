import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Image, View, Text } from 'react-native';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';

import Constants from '../constants';
import api from '../services/api';

function Main ({ navigation }) {
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('');
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync();

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });
            }
        }

        loadInitialPosition();
    }, []);
 
    async function loadDevs() {
        const { latitude, longitude } = currentRegion;
        setVisible(true);

        const response = await api.get('/devs/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });

        setVisible(false);
        setDevs(response.data.devs);
    }

    function handleRegionChangedComplete(region) {
        setCurrentRegion(region);
    }

    if (!currentRegion) {
        return null;
    }

    return (
        <>
            <View style={styles.searchForm}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar dev por Tecnologia"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                />
                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name="my-location" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
            <Spinner
                visible={isVisible}
                textContent={'Buscando...'}
                textStyle={{color: Constants.BACKGROUND_COLOR}}
                color={Constants.BACKGROUND_COLOR}
            />
            <MapView
                onRegionChangeComplete={handleRegionChangedComplete}
                initialRegion={currentRegion}
                style={styles.map}>
                {devs.map(dev => (
                <Marker
                    key={dev._id}
                    coordinate={{
                        longitude: dev.location.coordinates[0],
                        latitude: dev.location.coordinates[1],
                    }}>
                    <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
                    <Callout onPress={() => {
                        navigation.navigate('Profile', { github_username: dev.github })
                    }}>
                        <View style={styles.callout}>
                            <Text style={styles.devName}>{dev.name}</Text>
                            <Text style={styles.devBio}>{dev.bio}</Text>
                            <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                        </View>
                    </Callout>
                </Marker>
                ))}
            </MapView>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF'
    },
    callout: {
        width: 260,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio: {
        color: '#666',
        marginTop: 5,
    },
    devTechs: {
        marginTop: 5,
    },
    searchForm: {
        position: 'absolute',
        top: 20,
        left: 5,
        zIndex: 5,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 0.99,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: Constants.BACKGROUND_COLOR_DARK,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
});

export default Main;