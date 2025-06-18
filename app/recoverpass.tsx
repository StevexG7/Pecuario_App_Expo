import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SixDigitInput from '../components/SixDigitInput';
import { theme } from '../constants/Theme';

const API_URL = 'https://fffa-191-111-11-85.ngrok-free.app/api';

export default function RecoverPass() {
    const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [alert, setAlert] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    // Animaciones
    const anim = useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    }, [anim]);
    const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    // Paso 1: Enviar email
    const handleSendEmail = async () => {
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
        try {
            const res = await fetch(`${API_URL}/auth/request-reset-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setAlert('Si el correo está registrado, recibirás un código de verificación.');
                setStep('code');
            } else {
                setAlert(data.error || 'Error enviando correo.');
            }
        } catch {
            setAlert('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Paso 2: Verificar código
    const handleVerifyCode = async () => {
        if (code.length !== 6) {
            setAlert('Ingresa el código de 6 dígitos.');
            return;
        }
        setLoading(true);
        setAlert(null);
        try {
            const res = await fetch(`${API_URL}/auth/verify-reset-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            const data = await res.json();
            if (res.ok) {
                setStep('password');
                setAlert(null);
            } else {
                setAlert(data.error || 'Código incorrecto.');
            }
        } catch {
            setAlert('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Reenviar código
    const handleResendCode = async () => {
        setLoading(true);
        setAlert(null);
        try {
            const res = await fetch(`${API_URL}/auth/request-reset-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setAlert('Código reenviado. Revisa tu correo.');
            } else {
                setAlert(data.error || 'Error reenviando código.');
            }
        } catch {
            setAlert('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!password || !confirm) {
            setAlert('Por favor ingresa y confirma la nueva contraseña.');
            return;
        }
        if (password.length < 7) {
            setAlert('La contraseña debe tener al menos 7 caracteres.');
            return;
        }
        if (password !== confirm) {
            setAlert('Las contraseñas no coinciden.');
            return;
        }
        setLoading(true);
        setAlert(null);
        try {
            const res = await fetch(`${API_URL}/auth/reset-password-with-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, new_password: password }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setAlert('¡Contraseña restablecida exitosamente!');
                setTimeout(() => router.replace('/'), 1500);
            } else {
                setAlert(data.error || 'Error al restablecer la contraseña.');
            }
        } catch {
            setAlert('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (step !== 'email') setSuccess(false);
    }, [step]);

    console.log('step:', step, 'loading:', loading, 'success:', success);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Animated.View style={{ opacity, transform: [{ translateY }], alignItems: 'center', width: '100%' }}>
                <Image source={require('../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
                {step === 'email' && (
                    <>
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
                        {alert && <Text style={[styles.alert, { color: theme.primary.text }]}>{alert}</Text>}
                        <TouchableOpacity
                            style={[styles.button, loading && { opacity: 0.7 }]}
                            onPress={handleSendEmail}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Enviar código'}</Text>
                        </TouchableOpacity>
                    </>
                )}
                {step === 'code' && (
                    <>
                        <Text style={styles.title}>Verifica tu correo</Text>
                        <Text style={styles.subtitle}>Ingresa el código de 6 dígitos que recibiste.</Text>
                        <SixDigitInput value={code} onChange={setCode} autoFocus />
                        {alert && <Text style={[styles.alert, { color: theme.primary.text }]}>{alert}</Text>}
                        <TouchableOpacity
                            style={[styles.button, loading && { opacity: 0.7 }]}
                            onPress={handleVerifyCode}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>{loading ? 'Verificando...' : 'Verificar código'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.primary.text, marginTop: 12 }]}
                            onPress={handleResendCode}
                            disabled={loading}
                        >
                            <Text style={[styles.buttonText, { color: theme.primary.main }]}>Reenviar código</Text>
                        </TouchableOpacity>
                    </>
                )}
                {step === 'password' && (
                    <>
                        <Text style={styles.title}>Nueva contraseña</Text>
                        <Text style={styles.subtitle}>Ingresa tu nueva contraseña.</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nueva contraseña"
                            placeholderTextColor={theme.primary.text}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            editable={true}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar contraseña"
                            placeholderTextColor={theme.primary.text}
                            secureTextEntry
                            value={confirm}
                            onChangeText={setConfirm}
                            editable={true}
                        />
                        {alert && <Text style={[styles.alert, { color: theme.primary.text }]}>{alert}</Text>}
                        <TouchableOpacity
                            style={[styles.button, loading && { opacity: 0.7 }]}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>{loading ? 'Cambiando...' : 'Cambiar contraseña'}</Text>
                        </TouchableOpacity>
                    </>
                )}
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
    logo: {
        width: 100,
        height: 100,
        marginBottom: 24,
        alignSelf: 'center',
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
        alignSelf: 'center',
    },
    button: {
        backgroundColor: theme.primary.button,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        width: 280,
        alignSelf: 'center',
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