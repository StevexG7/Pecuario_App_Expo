import { theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const WAVE_TEXT = '¡Bienvenido a Pecuario App!';

export default function Transition() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const waveAnims = useRef(WAVE_TEXT.split('').map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // Fade in general
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        // Animación de ola única
        const waveDuration = 1200;
        const perLetter = 40; // ms entre letras
        const upTime = 250;
        const downTime = 250;
        const animations = waveAnims.map((anim, i) =>
            Animated.sequence([
                Animated.delay(i * perLetter),
                Animated.timing(anim, {
                    toValue: -14,
                    duration: upTime,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: downTime,
                    useNativeDriver: true,
                }),
            ])
        );
        Animated.stagger(perLetter, animations).start();

        // Fade out y navegación después de la ola
        const timeout = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                router.replace('/inicio');
            });
        }, waveDuration + 400); // un poco después de la ola
        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Animated.View style={[styles.box, { opacity: fadeAnim }]}> 
                <View style={styles.waveRow}>
                    {WAVE_TEXT.split('').map((char, i) => (
                        <Animated.Text
                            key={i}
                            style={[
                                styles.title,
                                { transform: [{ translateY: waveAnims[i] }] },
                            ]}
                        >
                            {char}
                        </Animated.Text>
                    ))}
                </View>
                <Text style={styles.subtitle}>Has iniciado sesión correctamente.</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.primary.main,
        padding: 24,
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    waveRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.primary.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: theme.primary.text,
        textAlign: 'center',
    },
});
