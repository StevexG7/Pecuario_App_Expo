import { theme } from '@/constants/Theme';
import { useAuthContext } from '@/src/context/AuthContext';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

export default function Perfil() {
    const { logout } = useAuthContext();
    const [activeTab, setActiveTab] = useState('Perfil');
    const [isTabBarTransparent, setIsTabBarTransparent] = useState(false);
    const router = useRouter();

    const handleTabPress = (tab: string) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        switch (tab) {
            case 'Ganado':
                router.replace('/ganado');
                break;
            case 'Inicio':
                router.replace('/inicio');
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
            <Stack.Screen 
                options={{ 
                    headerShown: true,
                    title: 'Perfil',
                    headerStyle: {
                        backgroundColor: theme.primary.main,
                    },
                    headerTintColor: theme.primary.text,
                }} 
            />
            <View style={styles.content}>
                <Text style={styles.title}>Mi Perfil</Text>
                <TouchableOpacity style={styles.button} onPress={logout}>
                    <Text style={styles.buttonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
            <CustomTabBar 
                activeTab={activeTab} 
                onTabPress={handleTabPress}
                isTransparent={isTabBarTransparent}
            />
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
    }
});
