import { theme } from '@/constants/Theme';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StatusBar as RNStatusBar, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize as rf, responsiveHeight as rh, responsiveWidth as rw } from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTabBar from '../components/CustomTabBar';
import { useAuth } from '../src/hooks/useAuth';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 44;
const HEADER_HEIGHT = STATUSBAR_HEIGHT + rh(7);


// Componente animado para los puntos sobre la línea
const AnimatedDotsLine = ({
    dotCount = 3,
    duration = 1800,
    dotColor = theme.primary.button,
    lineColor = '#23263B',
    style = {},
}) => {
    const dotAnims = useRef(Array.from({ length: dotCount }, () => new Animated.Value(0))).current;
    const lineRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const animate = () => {
            if (!isMounted) return;
            dotAnims.forEach((anim, i) => {
                anim.setValue(0);
                Animated.timing(anim, {
                    toValue: 1,
                    duration,
                    delay: i * (duration / dotCount / 1.5),
                    useNativeDriver: true,
                }).start(() => {
                    if (i === dotCount - 1 && isMounted) animate();
                });
            });
        };
        animate();
        return () => { isMounted = false; };
    }, [dotAnims, duration, dotCount]);

    // El ancho de la línea se obtiene en layout
    const [lineW, setLineW] = React.useState(0);

    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center', width: '100%' }, style]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative', flex: 1 }}>
                {/* Línea */}
                <View
                    ref={lineRef}
                    style={{
                        flex: 1,
                        height: 4,
                        backgroundColor: lineColor,
                        borderRadius: 2,
                        marginHorizontal: 2,
                        position: 'relative',
                        overflow: 'visible',
                    }}
                    onLayout={e => setLineW(e.nativeEvent.layout.width)}
                >
                    {/* Puntos animados */}
                    {lineW > 0 && dotAnims.map((anim, i) => {
                        const translateX = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, lineW - 12], // 12 = dot size
                        });
                        const opacity = anim.interpolate({
                            inputRange: [0, 0.85, 1],
                            outputRange: [1, 1, 0],
                        });
                        return (
                            <Animated.View
                                key={i}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: -4,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: dotColor,
                                    transform: [{ translateX }],
                                    opacity,
                                }}
                            />
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

export default function Inicio() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Inicio');
    const router = useRouter();
    const dailyCards = [
        {
            icon: <Ionicons name="checkmark" size={rf(3.2)} color={theme.primary.text} style={{ marginBottom: rh(1) }} />,
            label: 'Cumplidas',
            value: '20/30',
            bold: '20',
        },
        {
            icon: <MaterialIcons name="monitor" size={rf(3.2)} color={theme.primary.text} style={{ marginBottom: rh(1) }} />,
            label: 'Revisiones',
            value: '10/30',
            bold: '10',
        },
        {
            icon: <Ionicons name="list" size={rf(3.2)} color={theme.primary.text} style={{ marginBottom: rh(1) }} />,
            label: 'Inventario',
            value: '5/30',
            bold: '5',
        },
        {
            icon: <Ionicons name="checkmark" size={32} color={theme.primary.text} style={{ marginBottom: 12 }} />,
            label: 'Cumplidas',
            value: '20/30',
            bold: '20',
        },
        {
            icon: <MaterialIcons name="monitor" size={32} color={theme.primary.text} style={{ marginBottom: 12 }} />,
            label: 'Revisiones',
            value: '10/30',
            bold: '10',
        },
        {
            icon: <Ionicons name="list" size={32} color={theme.primary.text} style={{ marginBottom: 12 }} />,
            label: 'Inventario',
            value: '5/30',
            bold: '5',
        },
        // Puedes agregar más cards aquí
    ];
    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'Ganado') {
            router.push('/ganado');
        } else if (tab === 'Inicio') {
            router.push('/inicio');
        }
        // Puedes agregar más rutas según tus tabs
    };
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.welcomeHeader}>
                <Text style={styles.welcomeSmall}>Bienvenido(a)</Text>
                <Text style={styles.welcomeName}>{user?.name || user?.nombre || ''}</Text>
            </View>
            <View style={{ flex: 1, marginTop: 1 }}>
                <View style={styles.dailyContainer}>
                    <Text style={styles.sectionTitle}>Actividades diarias</Text>
                    <View style={styles.dailyScrollWrapper}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.dailyScroll}
                        >
                            {dailyCards.map((card, idx) => (
                                <TouchableOpacity
                                    key={card.label + idx}
                                    style={[styles.dailyCard, idx !== dailyCards.length - 1 && { marginRight: rw(3) }]}
                                    activeOpacity={0.85}
                                >
                                    {card.icon}
                                    <Text style={styles.dailyLabel}>{card.label}</Text>
                                    <Text style={styles.dailyValue}>
                                        <Text style={styles.bold}>{card.bold}</Text>/{card.value.split('/')[1]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
                <Text style={styles.sectionTitle2}>Tus estadísticas</Text>
                <View style={styles.statsCol}>
                    <View style={styles.statsCard}>
                        <View style={styles.statsCardRow}>
                            <MaterialCommunityIcons name="cow" size={32} color={theme.primary.text} style={styles.statsIcon} />
                            <Text style={styles.statsTitle}>Estado del ganado</Text>
                            <TouchableOpacity style={styles.statsArrow}>
                                <Ionicons name="chevron-forward" size={24} color={theme.primary.text} />
                            </TouchableOpacity>
                        </View>
                        <AnimatedDotsLine />
                    </View>
                    <View style={styles.statsCard}>
                        <View style={styles.statsCardRow}>
                            <MaterialCommunityIcons name="shovel" size={32} color={theme.primary.text} style={styles.statsIcon} />
                            <Text style={styles.statsTitle}>Próximos a vencer</Text>
                            <TouchableOpacity style={styles.statsArrow}>
                                <Ionicons name="chevron-forward" size={24} color={theme.primary.text} />
                            </TouchableOpacity>
                        </View>
                        <AnimatedDotsLine />
                    </View>
                    <View style={styles.statsCard}>
                        <View style={styles.statsCardRow}>
                            <MaterialCommunityIcons name="power-plug" size={32} color={theme.primary.text} style={styles.statsIcon} />
                            <Text style={styles.statsTitle}>Ahorro de energía</Text>
                            <TouchableOpacity style={styles.statsArrow}>
                                <Ionicons name="chevron-forward" size={24} color={theme.primary.text} />
                            </TouchableOpacity>
                        </View>
                        <AnimatedDotsLine />
                    </View>
                </View>
            </View>
            <CustomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.secondary.background,
        paddingHorizontal: rw(2.5),
        paddingTop: HEADER_HEIGHT,
        justifyContent: 'flex-start',
    },
    welcomeHeader: {
        position: 'absolute',
        top: rw(7),
        left: 0,
        right: 0,
        zIndex: 10,
        height: HEADER_HEIGHT,
        backgroundColor: theme.primary.main,
        paddingTop: STATUSBAR_HEIGHT,
        paddingBottom: rh(2.5),
        paddingHorizontal: rw(2.5),
        borderBottomLeftRadius: rw(8),
        borderBottomRightRadius: rw(8),
        justifyContent: 'flex-end',
    },
    welcomeSmall: {
        color: theme.primary.text,
        fontSize: rf(1.8),
        fontWeight: '500',
        marginBottom: rh(0.5),
    },
    welcomeName: {
        color: theme.primary.text,
        fontSize: rf(3.2),
        fontWeight: 'bold',
    },
    dailyContainer: {
        marginTop: rh(3),
        marginBottom: rh(1.5),
        maxHeight: rh(16),
    },
    sectionTitle: {
        fontSize: rf(1.8),
        color: '#A0A3BD',
        fontWeight: '600',
        marginBottom: rh(0.8),
        marginLeft: rw(1),
    },
    dailyScrollWrapper: {
        height: rh(12),
        justifyContent: 'center',
    },
    dailyScroll: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: rw(1),
    },
    dailyCard: {
        width: rw(28),
        height: rh(12),
        backgroundColor: theme.primary.main,
        borderRadius: rw(3.5),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
    },
    dailyLabel: {
        color: theme.primary.text,
        fontSize: rf(1.6),
        marginBottom: rh(0.2),
    },
    dailyValue: {
        color: theme.primary.text,
        fontSize: rf(2.2),
        fontWeight: 'bold',
    },
    bold: {
        fontWeight: 'bold',
        fontSize: rf(2.5),
        color: theme.primary.text,
    },
    sectionTitle2: {
        fontSize: rf(2),
        color: '#A0A3BD',
        fontWeight: '600',
        marginTop: rh(1.5),
        marginBottom: rh(1.2),
        marginLeft: rw(1),
    },
    statsCol: {
        gap: 16,
    },
    statsCard: {
        backgroundColor: theme.primary.main,
        borderRadius: 12,
        padding: 16,
        marginBottom: 0,
        elevation: 1,
    },
    statsCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statsIcon: {
        marginRight: 12,
    },
    statsTitle: {
        flex: 1,
        fontSize: 16,
        color: theme.primary.text,
        fontWeight: '600',
    },
    statsArrow: {
        backgroundColor: theme.primary.button,
        borderRadius: 20,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsDotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        gap: 8,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.primary.button,
    },
    line: {
        flex: 1,
        height: 4,
        backgroundColor: '#23263B',
        borderRadius: 2,
        marginHorizontal: 2,
    },
});
