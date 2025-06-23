import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Easing, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { responsiveFontSize as rf, responsiveHeight as rh, responsiveWidth as rw } from 'react-native-responsive-dimensions';
import { theme } from '../constants/Theme';
import { useAuthContext } from '../src/context/AuthContext';

// Componente de alerta centrada y modal
const AppAlert = ({ message, onClose }: { message: string; onClose: () => void }) => {
    if (!message) return null;
    return (
        <Modal
            transparent
            visible={!!message}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.alertContainer}>
                    <Text style={styles.alertText}>{message}</Text>
                    <TouchableOpacity style={styles.alertButton} onPress={onClose}>
                        <Text style={styles.alertButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default function Login() {
    const textColor = theme.primary.text;
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState<string | null>(null);
    const { login, register, loading, error } = useAuthContext();
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    
    // Animaciones
    const eyeAnim = useRef(new Animated.Value(0)).current;
    const formAnim = useRef(new Animated.Value(1)).current;
    const usernameAnim = useRef(new Animated.Value(0)).current;
    const switchModeAnim = useRef(new Animated.Value(0)).current;

    // Validación simple de email
    const validateEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async () => {
        // Validaciones comunes
        if (!email) {
            setAlert('Por favor ingresa tu correo electrónico.');
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
        if (password.length < 7) {
            setAlert('La contraseña debe tener al menos 7 caracteres.');
            return;
        }

        setAlert(null);

        try {
            if (isLogin) {
                // Lógica de inicio de sesión
                await login(email, password);
                router.replace('/transition');
            } else {
                // Validaciones específicas para registro
                if (!username) {
                    setAlert('Por favor ingresa un nombre de usuario.');
                    return;
                }
                // Lógica de registro
                await register(username, email, password);
                setAlert('¡Registro exitoso! Iniciando sesión...');
                router.replace('/transition');
            }
        } catch (err) {
            setAlert(err instanceof Error ? err.message : 'Error de conexión. Intenta de nuevo.');
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

    const handleSwitchMode = () => {
        // Animar el formulario
        Animated.sequence([
            Animated.timing(formAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(formAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.in(Easing.ease),
            }),
        ]).start();

        // Animar el campo de username
        Animated.timing(usernameAnim, {
            toValue: isLogin ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
        }).start();

        // Animar el botón de cambio de modo
        Animated.timing(switchModeAnim, {
            toValue: isLogin ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
        }).start();

        setIsLogin(!isLogin);
    };

    const eyeRotation = eyeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const usernameOpacity = usernameAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const usernameTranslateY = usernameAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, 0],
    });

    const formScale = formAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.95, 1],
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
                
                <Animated.View style={[
                    styles.formContainer,
                    {
                        opacity: formAnim,
                        transform: [{ scale: formScale }]
                    }
                ]}>
                    <Animated.View style={[
                        styles.inputContainer,
                        {
                            opacity: usernameOpacity,
                            transform: [{ translateY: usernameTranslateY }]
                        }
                    ]}>
                        {!isLogin && (
                            <>
                                <Text style={styles.label}>Nombre de usuario</Text>
                                <TextInput
                                    style={[styles.input, { color: textColor }]}
                                    placeholder="Ingresa tu nombre de usuario"
                                    placeholderTextColor={textColor}
                                    autoCapitalize="none"
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </>
                        )}
                    </Animated.View>

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

                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.loginButtonText}>{isLogin ? 'Ingresar' : 'Registrarse'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchModeButton}
                        onPress={handleSwitchMode}
                    >
                        <Text style={styles.switchModeText}>
                            {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
                            <Text style={{ fontWeight: 'bold' }}>
                                {isLogin ? 'Regístrate' : 'Ingresa'}
                            </Text>
                        </Text>
                    </TouchableOpacity>

                    {/* --- ENLACE DE RECUPERACIÓN (REUBICADO) --- */}
                    {isLogin && (
                        <TouchableOpacity 
                            style={styles.forgotPasswordButton}
                            onPress={() => router.push('/recoverpass')}
                        >
                            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>
                    )}
                    {/* ------------------------------------------- */}

                </Animated.View>
            </KeyboardAvoidingView>
            <View style={styles.copyrightContainer}>
                <Text style={styles.copyrightText}>
                    © {new Date().getFullYear()} Pecuario App. Todos los derechos reservados.
                </Text>
            </View>
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
        padding: rw(5),
        paddingTop: rh(5),
        gap: rh(2),
        backgroundColor: theme.primary.main,
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    logo: {
        width: rw(20),
        maxWidth: rw(30),
        maxHeight: rh(12),
        marginTop: 0,
        marginBottom: rh(2),
        alignSelf: 'center',
    },
    typeImage: {
        width: rw(80),
        maxWidth: rw(90),
        maxHeight: rh(18),
        marginBottom: rh(2),
        alignSelf: 'center',
    },
    inputContainer: {
        width: '100%',
        maxWidth: rw(90),
        marginBottom: rh(2),
        overflow: 'hidden',
    },
    label: {
        color: theme.primary.text,
        fontWeight: 'bold',
        marginBottom: rh(0.8),
        fontSize: rf(2.1),
    },
    input: {
        width: '100%',
        height: rh(6),
        borderWidth: 1,
        borderColor: theme.secondary.main,
        borderRadius: rw(2),
        paddingHorizontal: rw(4),
        fontSize: rf(2),
        backgroundColor: theme.secondary.card_2,
    },
    passwordInputWrapper: {
        position: 'relative',
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        height: '100%',
        justifyContent: 'center',
    },
    loginButton: {
        width: '100%',
        maxWidth: rw(90),
        height: rh(6),
        backgroundColor: theme.primary.button,
        borderRadius: rw(7),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: rw(2),
        marginTop: rh(1.5),
    },
    loginButtonText: {
        color: theme.primary.contrastText,
        fontSize: rf(2.2),
        fontWeight: 'bold',
    },
    switchModeButton: {
        marginTop: rh(2),
    },
    switchModeText: {
        color: theme.primary.text,
        fontSize: rf(1.9),
        textAlign: 'center',
    },
    forgotPasswordButton: {
        marginTop: rh(2.5),
    },
    forgotPasswordText: {
        color: theme.primary.text,
        fontSize: rf(1.8),
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertContainer: {
        backgroundColor: theme.primary.main,
        borderRadius: 16,
        padding: 20,
        width: '80%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    alertText: {
        color: theme.primary.text,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 18,
    },
    alertButton: {
        backgroundColor: theme.primary.button,
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 24,
        marginTop: 4,
    },
    alertButtonText: {
        color: theme.primary.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    copyrightContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: rh(2),
    },
    copyrightText: {
        color: theme.primary.text,
        fontSize: rf(1.5),
        opacity: 0.6,
        textAlign: 'center',
    },
});