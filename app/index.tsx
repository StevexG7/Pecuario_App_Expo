import { theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Easing, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Componente de alerta centrada y modal
function AppAlert({ message, onClose }: { message: string, onClose: () => void }) {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={!!message}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalAlert}>
                    <Text style={styles.modalAlertText}>{message}</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                        <Text style={styles.modalButtonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default function Login() {
    const textColor = theme.primary.text;
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const eyeAnim = useRef(new Animated.Value(0)).current;

    // Validación simple de email
    const validateEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Simulación de usuarios ya existentes
    const usuariosExistentes = ['usuario1', 'admin', 'pecuario'];

    const handleLogin = async () => {
        if (!username) {
            setAlert('Por favor ingresa tu nombre de usuario.');
            return;
        }
        if (usuariosExistentes.includes(username.trim().toLowerCase())) {
            setAlert('El nombre de usuario ya está en uso.');
            return;
        }
        if (!validateEmail(email)) {
            setAlert('Por favor ingresa un correo válido.');
            return;
        }
        if (!password) {
            setAlert('Por favor ingresa tu contraseña.');
            return;
        }
        if (password.length < 8) {
            setAlert('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        setLoading(true);
        setAlert(null);
        try {
            // Aquí va tu lógica de conexión con el backend
            setTimeout(() => {
                setLoading(false);
                router.push('/transition');
            }, 1200);
        } catch (e) {
            setLoading(false);
            setAlert('Error de conexión. Intenta de nuevo.');
        }
    };

    const handleTogglePassword = () => {
        Animated.timing(eyeAnim, {
            toValue: showPassword ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
        setShowPassword((prev) => !prev);
    };

    const eyeRotation = eyeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.backgroundFill}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Stack.Screen options={{ headerShown: false }} />
                <AppAlert message={alert ?? ''} onClose={() => setAlert(null)} />
                <Image
                    source={require('../assets/images/Logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Image
                    source={require('../assets/images/Type.png')}
                    style={styles.typeImage}
                    resizeMode="contain"
                />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre de usuario</Text>
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        placeholder="Ingresa tu nombre de usuario"
                        placeholderTextColor={textColor}
                        autoCapitalize="none"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        placeholder="Ingresa tu correo"
                        placeholderTextColor={textColor}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={styles.passwordInputWrapper}>
                        <TextInput
                            style={[styles.input, { color: textColor, paddingRight: 44 }]}
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor={textColor}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={handleTogglePassword}
                            activeOpacity={0.7}
                        >
                            <Animated.View style={{ transform: [{ rotate: eyeRotation }] }}>
                                <Ionicons
                                    name={showPassword ? 'eye' : 'eye-off'}
                                    size={24}
                                    color={theme.primary.text}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.loginButtonText}>{loading ? 'Enviando...' : 'Enviar'}</Text>
                    <Ionicons name="arrow-forward" size={24} color={theme.primary.contrastText} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={[styles.forgotPasswordText]}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundFill: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.primary.main,
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        paddingTop: 30,
        gap: 16,
        backgroundColor: theme.primary.main,
    },
    logo: {
        width: '20%',
        maxWidth: 100,
        maxHeight: 100,
        marginTop: 0,
        marginBottom: 10,
        alignSelf: 'center',
    },
    typeImage: {
        width: '90%',
        maxWidth: 300,
        maxHeight: 200,
        marginBottom: 16,
        alignSelf: 'center',
    },
    inputContainer: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 16,
    },
    label: {
        color: theme.primary.text,
        fontWeight: 'bold',
        marginBottom: 6,
        fontSize: 16,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: theme.secondary.main,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: theme.secondary.card_2,
    },
    loginButton: {
        width: '100%',
        maxWidth: 400,
        height: 50,
        backgroundColor: theme.primary.button,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    loginButtonText: {
        color: theme.primary.contrastText,
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        marginTop: 24,
    },
    forgotPasswordText: {
        textDecorationLine: 'underline',
        fontSize: 15,
        color: theme.primary.text,
        textAlign: 'center',
    },
    // Estilos para el modal de alerta
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalAlert: {
        backgroundColor: theme.primary.main,
        borderRadius: 16,
        padding: 28,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 260,
        maxWidth: 340,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    modalAlertText: {
        color: theme.primary.text,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 18,
    },
    modalButton: {
        backgroundColor: theme.primary.button,
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    modalButtonText: {
        color: theme.primary.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    passwordInputWrapper: {
        position: 'relative',
        width: '100%',
        justifyContent: 'center',
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: [{ translateY: -12 }],
        padding: 1,
        zIndex: 2,
    },
});