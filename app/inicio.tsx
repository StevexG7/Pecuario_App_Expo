import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image as RNImage, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomTabBar from '../components/CustomTabBar';
import { theme } from '../constants/Theme';
import { useAuth } from '../src/hooks/useAuth';
import { getMisLotes, Lote } from '../src/services/lote.service';

export default function Inicio() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState('Inicio');
    const [lotes, setLotes] = useState<Lote[]>([]);
    useEffect(() => {
        const fetchLotes = async () => {
            try {
                console.log('🔄 Fetching lotes...');
                const response = await getMisLotes();
                console.log('📦 Response from getMisLotes:', response);
                console.log('📦 Response type:', typeof response);
                console.log('📦 Is Array?', Array.isArray(response));
                
                // Asegurar que siempre sea un array
                if (Array.isArray(response)) {
                    setLotes(response);
                } else if (response && typeof response === 'object' && (response as any).data && Array.isArray((response as any).data)) {
                    // Si la respuesta está envuelta en un objeto con propiedad 'data'
                    setLotes((response as any).data);
                } else {
                    console.warn('⚠️ Response is not an array, setting empty array');
                    setLotes([]);
                }
            } catch (e) {
                console.error('❌ Error fetching lotes:', e);
                setLotes([]);
            }
        };
        fetchLotes();
    }, []);
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
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* HEADER CURVO Y BIENVENIDA */}
            <View style={styles.headerContainer}>
                {/* Fondo curvo */}
                <RNImage source={require('../assets/images/Header.png')} style={styles.headerBg} resizeMode="cover" />
                <View style={styles.headerContentCentered}>
                    <RNImage source={require('../assets/icons/Person.png')} style={styles.headerUserIcon} resizeMode="contain" />
                    <View style={styles.headerTextBlock}>
                        <Text style={styles.headerWelcome}>Bienvenido(a)</Text>
                        <Text style={styles.headerName}>{user?.name || (user as any)?.nombre || ''}</Text>
                        
                    </View>
                </View>
            </View>

            {/* ACTIVIDADES DIARIAS */}
            <View style={styles.sectionContainer}>
                <Text style={styles.activitiesTitle}>Actividades diarias</Text>
                <View style={styles.activitiesRow}>
                    {/* Card 1: Cumplidas */}
                    <View style={[styles.activityCard, styles.activityCardDone]}> 
                        <MaterialCommunityIcons name="check-circle-outline" size={28} color="#23263B" style={styles.activityIcon} />
                        <Text style={styles.activityLabel}>Cumplidas</Text>
                        <Text style={styles.activityValue}><Text style={styles.activityValueBold}>20</Text>/30</Text>
                    </View>
                    {/* Card 2: Revisiones */}
                    <View style={[styles.activityCard, styles.activityCardReview]}>
                        <MaterialCommunityIcons name="note-outline" size={28} color="#23263B" style={styles.activityIcon} />
                        <Text style={styles.activityLabel}>Revisiones</Text>
                        <Text style={styles.activityValue}><Text style={styles.activityValueBold}>10</Text>/30</Text>
                    </View>
                    {/* Card 3: Inventario */}
                    <View style={[styles.activityCard, styles.activityCardInventory]}>
                        <MaterialCommunityIcons name="format-list-bulleted" size={28} color="#23263B" style={styles.activityIcon} />
                        <Text style={styles.activityLabel}>Inventario</Text>
                        <Text style={styles.activityValue}><Text style={styles.activityValueBold}>5</Text>/30</Text>
                    </View>
                    {/* Futuras cards */}
                </View>
            </View>

            {/* ESTADÍSTICAS */}
            <View style={styles.sectionContainer}>
                <Text style={styles.statsTitle}>Tus estadísticas</Text>
                <View style={styles.statsList}>
                    {/* Card 1: Estado del ganado */}
                    <View style={[styles.statsCard, styles.statsCardMain]}>
                        <View style={styles.statsCardLeft}>
                            <RNImage source={require('../assets/icons/Book.png')} style={styles.statsIcon} />
                            <Text style={styles.statsLabel}>Estado del ganado</Text>
                        </View>
                        <TouchableOpacity style={styles.statsArrowBtn} onPress={() => router.replace('/ganado')}>
                            <MaterialCommunityIcons name="chevron-right" size={28} color="#23263B" />
                        </TouchableOpacity>
                    </View>
                    {/* Card 2: Próximos a vencer */}
                    <View style={[styles.statsCard, styles.statsCardReview]}>
                        <View style={styles.statsCardLeft}>
                            <RNImage source={require('../assets/icons/Shovel.png')} style={styles.statsIcon} />
                            <Text style={styles.statsLabel}>Próximos a vencer</Text>
                        </View>
                        <TouchableOpacity style={styles.statsArrowBtn}>
                            <MaterialCommunityIcons name="chevron-right" size={28} color="#23263B" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* ESTABLOS ACTIVOS */}
            <View style={styles.sectionContainer}>
                <Text style={styles.statsTitle}>Establos activos</Text>
                <View style={styles.stablesGrid}>
                    {(() => {
                        console.log('🔍 Current lotes state:', lotes);
                        console.log('🔍 Is lotes array?', Array.isArray(lotes));
                        
                        if (!lotes || !Array.isArray(lotes) || lotes.length === 0) {
                            return (
                                <Text style={{ color: '#A3A6B7', textAlign: 'center', width: '100%' }}>No tienes lotes registrados.</Text>
                            );
                        }
                        
                        return lotes.map((lote, idx) => (
                            <View key={lote.id || idx} style={[styles.activityCard, styles.stableCardGrid]}> 
                                <RNImage source={require('../assets/icons/Grid.png')} style={styles.activityIcon} />
                                <Text style={styles.stableNumber}>{lote.nombre || lote.id}</Text>
                            </View>
                        ));
                    })()}
                </View>
            </View>

            {/* Quitar navbar personalizada y poner CustomTabBar */}
            <CustomTabBar activeTab={activeTab} onTabPress={handleTabPress} backgroundColor="#F0E8C9" />
        </View>
    );
}

// Copio los estilos desde index.tsx
const styles = StyleSheet.create({
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
    headerCow: {
        position: 'absolute',
        top: 8,
        left: 8,
        width: 40,
        height: 40,
        opacity: 0.08,
        zIndex: 1,
    },
    headerContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        marginLeft: 18,
        zIndex: 2,
    },
    headerUserIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    headerTextBlock: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    headerWelcome: {
        color: '#23263B',
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 2,
    },
    headerName: {
        color: '#23263B',
        fontSize: 22,
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginHorizontal: 18,
        marginBottom: 18,
    },
    sectionTitle: {
        color: theme.primary.text,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
    activitiesTitle: {
        color: '#A3A6B7',
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 12,
    },
    activitiesRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 16,
    },
    activityCard: {
        flex: 1,
        borderRadius: 1,
        alignItems: 'center',
        paddingVertical: 18,
        marginHorizontal: 0,
        elevation: 1,
        minWidth: 125,
        maxWidth: 145,
        backgroundColor: '#FCF8EA', // default, override per card
    },
    activityCardDone: {
        backgroundColor: '#EFE7C9',
    },
    activityCardReview: {
        backgroundColor: '#FCF8EA',
    },
    activityCardInventory: {
        backgroundColor: '#FDFBF5',
    },
    activityIcon: {
        width: 26,
        height: 26,
        marginBottom: 10,
        tintColor: '#23263B',
    },
    activityLabel: {
        color: '#23263B',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 5,
    },
    activityValue: {
        color: '#23263B',
        fontSize: 19,
        fontWeight: '400',
    },
    activityValueBold: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#23263B',
    },
    statsTitle: {
        color: '#A3A6B7',
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 12,
    },
    statsList: {
        gap: 16,
    },
    statsCard: {
        backgroundColor: '#EFE7C9',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        marginBottom: 0,
        elevation: 1,
        justifyContent: 'space-between',
    },
    statsCardMain: {
        backgroundColor: '#EFE7C9',
    },
    statsCardReview: {
        backgroundColor: '#FCF8EA',
    },
    statsCardEnergy: {
        backgroundColor: '#FDFBF5',
    },
    statsCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 14,
    },
    statsIcon: {
        width: 34,
        height: 34,
        marginRight: 8,
    },
    statsLabel: {
        color: '#23263B',
        fontWeight: 'bold',
        fontSize: 17,
    },
    statsArrowBtn: {
        backgroundColor: '#FFD24A',
        borderRadius: 8,
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stablesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 16,
    },
    stableCardGrid: {
        backgroundColor: '#FCF8EA',
        borderRadius: 12,
        alignItems: 'center',
        paddingVertical: 18,
        marginHorizontal: 0,
        elevation: 1,
        minWidth: 100,
        maxWidth: 140,
        marginBottom: 16,
        flexBasis: '30%',
    },
    stableNumber: {
        color: '#23263B',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 8,
        textAlign: 'center',
    },
    headerShadow: {
        position: 'absolute',
        bottom: -30,
        right: 0,
        width: '100%',
        height: 80,
        backgroundColor: '#bdb38b',
        borderBottomRightRadius: 180,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        zIndex: 1,
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
});
