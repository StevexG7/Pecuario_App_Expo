import React, { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants/Theme';

export default function RecoverPass() {
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Animaciones
    const anim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    }, []);

    const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleRecover = async () => {
        if (!email) {
            setAlert('Por favor ingresa tu correo electrónico.');
            return;
        }
        if (!validateEmail(email)) {
            setAlert('Por favor ingresa un correo válido.');
            return;
        }
        setLoading(true);
        setAlert(null);
        // Simulación de envío
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setAlert('Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.');
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity, transform: [{ translateY }] }}>
                <Text style={styles.title}>Recuperar contraseña</Text>
                <Text style={styles.subtitle}>Ingresa tu correo electrónico para recibir instrucciones.</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor={theme.primary.text}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading && !success}
                />
                {alert && <Text style={[styles.alert, success && { color: theme.primary.button }]}>{alert}</Text>}
                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.7 }]}
                    onPress={handleRecover}
                    disabled={loading || success}
                >
                    <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Recuperar contraseña'}</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primary.main,
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.primary.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: theme.primary.text,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        width: 280,
        height: 48,
        borderWidth: 1,
        borderColor: theme.secondary.main,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: theme.secondary.card_2,
        color: theme.primary.text,
        marginBottom: 16,
    },
    button: {
        backgroundColor: theme.primary.button,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: theme.primary.contrastText,
        fontSize: 16,
        fontWeight: 'bold',
    },
    alert: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'center',
    },
});