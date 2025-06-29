import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { HelloWave } from '../components/HelloWave';
import { theme } from '../constants/Theme';
import { obtenerMisFichas } from '../src/services/animal.service';

const TransitionScreen = () => {
    const router = useRouter();

    useEffect(() => {
        const checkFichasAndNavigate = async () => {
            try {
                // Hacemos la llamada a la función correcta
                const misFichas = await obtenerMisFichas();
                
                // Si hay fichas, lo mandamos a la pantalla de 'ganado'
                if (misFichas && misFichas.length > 0) {
                    router.replace('/ganado');
                } else {
                    // Si no hay fichas, a la pantalla de 'formulario' para que cree la primera
                    router.replace('/formulario');
                }
            } catch (error) {
                console.error("Error al verificar fichas, redirigiendo a formulario:", error);
                // En caso de cualquier error, es más seguro enviarlo al formulario
                router.replace('/formulario');
            }
        };

        // Damos un pequeño tiempo para que la transición se sienta más suave
        const timer = setTimeout(() => {
            checkFichasAndNavigate();
        }, 500); // 0.5 segundos de espera

        return () => clearTimeout(timer); // Limpiamos el temporizador si el componente se desmonta
    }, [router]);

    return (
        <View style={styles.container}>
            <HelloWave />
            <ActivityIndicator size="large" color={theme.primary.text} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primary.main,
    },
});

export default TransitionScreen;
