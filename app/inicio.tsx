import { theme } from '@/constants/Theme';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Platform, StatusBar as RNStatusBar, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 44;
const HEADER_HEIGHT = STATUSBAR_HEIGHT + 56;

export default function Inicio() {
    const dailyCards = [
        {
            icon: <Ionicons name="checkmark" size={28} color={theme.primary.text} style={{ marginBottom: 8 }} />,
            label: 'Cumplidas',
            value: '20/30',
            bold: '20',
        },
        {
            icon: <MaterialIcons name="monitor" size={28} color={theme.primary.text} style={{ marginBottom: 8 }} />,
            label: 'Revisiones',
            value: '10/30',
            bold: '10',
        },
        {
            icon: <Ionicons name="list" size={28} color={theme.primary.text} style={{ marginBottom: 8 }} />,
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
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.welcomeHeader}>
                <Text style={styles.welcomeSmall}>Bienvenido(a)</Text>
                <Text style={styles.welcomeName}>Stevex</Text>
            </View>
            {/* Contenedor de actividades diarias */}
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
                                key={card.label}
                                style={[styles.dailyCard, idx !== dailyCards.length - 1 && { marginRight: 14 }]}
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
            {/* Tus estadísticas */}
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
                    <View style={styles.statsDotsRow}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.line} />
                        <View style={styles.dot} />
                    </View>
                </View>
                <View style={styles.statsCard}>
                    <View style={styles.statsCardRow}>
                        <MaterialCommunityIcons name="shovel" size={32} color={theme.primary.text} style={styles.statsIcon} />
                        <Text style={styles.statsTitle}>Próximos a vencer</Text>
                        <TouchableOpacity style={styles.statsArrow}>
                            <Ionicons name="chevron-forward" size={24} color={theme.primary.text} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statsDotsRow}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.line} />
                        <View style={styles.dot} />
                    </View>
                </View>
                <View style={styles.statsCard}>
                    <View style={styles.statsCardRow}>
                        <MaterialCommunityIcons name="power-plug" size={32} color={theme.primary.text} style={styles.statsIcon} />
                        <Text style={styles.statsTitle}>Ahorro de energía</Text>
                        <TouchableOpacity style={styles.statsArrow}>
                            <Ionicons name="chevron-forward" size={24} color={theme.primary.text} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statsDotsRow}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.line} />
                        <View style={styles.dot} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: HEADER_HEIGHT,
        justifyContent: 'flex-start',
    },
    welcomeHeader: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        zIndex: 10,
        height: HEADER_HEIGHT,
        backgroundColor: theme.primary.main,
        paddingTop: STATUSBAR_HEIGHT,
        paddingBottom: 18,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        justifyContent: 'flex-end',
    },
    welcomeSmall: {
        color: theme.primary.text,
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 2,
    },
    welcomeName: {
        color: theme.primary.text,
        fontSize: 28,
        fontWeight: 'bold',
    },
    dailyContainer: {
        marginTop: 30,
        marginBottom: 10,
        maxHeight: 130,
    },
    sectionTitle: {
        fontSize: 15,
        color: '#A0A3BD',
        fontWeight: '600',
        marginBottom: 6,
        marginLeft: 4,
    },
    dailyScrollWrapper: {
        height: 100,
        justifyContent: 'center',
    },
    dailyScroll: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 4,
    },
    dailyCard: {
        width: 120,
        height: 90,
        backgroundColor: theme.primary.main,
        borderRadius: 14,
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
        fontSize: 13,
        marginBottom: 1,
    },
    dailyValue: {
        color: theme.primary.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 20,
        color: theme.primary.text,
    },
    sectionTitle2: {
        fontSize: 16,
        color: '#A0A3BD',
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 10,
        marginLeft: 4,
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
