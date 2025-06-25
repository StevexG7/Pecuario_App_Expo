import { theme } from '@/constants/Theme';
import { useAuthContext } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image as RNImage, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

export default function Perfil() {
    const { logout } = useAuthContext();
    const [activeTab, setActiveTab] = useState('Perfil');
    const router = useRouter();

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
        switch (tab) {
            case 'Inicio':
                router.replace('/inicio');
                break;
            case 'Ganado':
                router.replace('/ganado');
                break;
            case 'Formulario':
                router.replace('/formulario');
                break;
            case 'Perfil':
                router.replace('/perfil');
                break;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER CURVO PERSONALIZADO */}
            <View style={styles.headerContainer}>
                <RNImage source={require('../assets/images/Header.png')} style={styles.headerBg} resizeMode="cover" />
                <View style={styles.headerContentCentered}>
                    <RNImage source={require('../assets/icons/Person.png')} style={styles.headerUserIcon} resizeMode="contain" />
                    <Text style={styles.headerName}>Perfil</Text>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Mi Perfil</Text>
                <TouchableOpacity style={styles.button} onPress={logout}>
                    <Text style={styles.buttonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
            <CustomTabBar activeTab={activeTab} onTabPress={handleTabPress} backgroundColor="#F0E8C9" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.secondary.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.primary.text,
        marginBottom: 30,
    },
    button: {
        backgroundColor: theme.primary.button,
        padding: 15,
        borderRadius: 8,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
    },
    buttonText: {
        color: theme.primary.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerContainer: {
        width: '100%',
        height: 120,
        position: 'relative',
        backgroundColor: '#F0E8C9',
        borderBottomRightRadius: 120,
        borderBottomLeftRadius: 0,
        overflow: 'hidden',
        marginBottom: 12,
    },
    headerBg: {
        position: 'absolute',
        width: '130%',
        height: '100%',
        top: 0,
        left: '-15%',
        zIndex: 2,
    },
    headerContentCentered: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
        width: '100%',
        zIndex: 3,
        marginTop: 10,
        marginLeft: 25,
    },
    headerUserIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    headerName: {
        color: '#23263B',
        fontSize: 22,
        fontWeight: 'bold',
    },
});
