import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image as RNImage, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomTabBar from '../components/CustomTabBar';
import { theme } from '../constants/Theme';
import { useAuth } from '../src/hooks/useAuth';
import { FichaAnimal, obtenerMisFichas } from '../src/services/animal.service';

export default function Inicio() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState('Inicio');
    const [fichas, setFichas] = useState<FichaAnimal[]>([]);
    const [loadingFichas, setLoadingFichas] = useState(true);

    const fetchFichas = async () => {
        try {
            setLoadingFichas(true);
            console.log('🔄 Fetching fichas de ganado...');
            const response = await obtenerMisFichas();
            console.log('📦 Response from obtenerMisFichas:', response);
            console.log('📦 Response type:', typeof response);
            console.log('📦 Is Array?', Array.isArray(response));
            
            if (Array.isArray(response)) {
                setFichas(response);
            } else {
                console.warn('⚠️ Response is not an array, setting empty array');
                setFichas([]);
            }
        } catch (e) {
            console.error('❌ Error fetching fichas:', e);
            setFichas([]);
        } finally {
            setLoadingFichas(false);
        }
    };

    useEffect(() => {
        fetchFichas();
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
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
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
                        {/* Card 1: Total de lotes */}
                        <View style={[styles.statsCard, styles.statsCardMain]}>
                            <View style={styles.statsCardLeft}>
                                <RNImage source={require('../assets/icons/Book.png')} style={styles.statsIcon} />
                                <View style={styles.statsTextContainer}>
                                    <Text style={styles.statsLabel}>Total de lotes</Text>
                                    <Text style={styles.statsValue}>{fichas.length}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.statsArrowBtn} onPress={() => router.replace('/ganado')}>
                                <MaterialCommunityIcons name="chevron-right" size={28} color="#23263B" />
                            </TouchableOpacity>
                        </View>
                        {/* Card 2: Total de animales */}
                        <View style={[styles.statsCard, styles.statsCardReview]}>
                            <View style={styles.statsCardLeft}>
                                <RNImage source={require('../assets/icons/Shovel.png')} style={styles.statsIcon} />
                                <View style={styles.statsTextContainer}>
                                    <Text style={styles.statsLabel}>Total de animales</Text>
                                    <Text style={styles.statsValue}>
                                        {fichas.reduce((total, ficha) => total + (ficha.cantidad || 0), 0)}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.statsArrowBtn}>
                                <MaterialCommunityIcons name="chevron-right" size={28} color="#23263B" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* GANADO POR LOTES */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.statsTitle}>Ganado por lotes</Text>
                        <TouchableOpacity 
                            style={styles.refreshButton}
                            onPress={() => {
                                setLoadingFichas(true);
                                fetchFichas();
                            }}
                            disabled={loadingFichas}
                        >
                            <MaterialCommunityIcons 
                                name="refresh" 
                                size={20} 
                                color={loadingFichas ? "#A3A6B7" : "#23263B"} 
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.stablesGrid}>
                        {(() => {
                            if (loadingFichas) {
                                return (
                                    <View style={styles.loadingContainer}>
                                        <MaterialCommunityIcons name="loading" size={32} color="#A3A6B7" />
                                        <Text style={styles.loadingText}>Cargando ganado...</Text>
                                    </View>
                                );
                            }
                            
                            console.log('🔍 Current fichas state:', fichas);
                            console.log('🔍 Is fichas array?', Array.isArray(fichas));
                            
                            if (!fichas || !Array.isArray(fichas) || fichas.length === 0) {
                                return (
                                    <View style={styles.emptyStateContainer}>
                                        <MaterialCommunityIcons name="cow" size={48} color="#A3A6B7" />
                                        <Text style={styles.emptyStateText}>No tienes ganado registrado</Text>
                                        <Text style={styles.emptyStateSubtext}>Registra tu primer lote de ganado</Text>
                                    </View>
                                );
                            }
                            
                            return fichas.map((ficha, idx) => (
                                <TouchableOpacity 
                                    key={ficha.id || idx} 
                                    style={[styles.activityCard, styles.stableCardGrid]}
                                    onPress={() => {
                                        // Navegar al detalle del lote cuando esté implementado
                                        console.log('Navegando al lote:', ficha.id);
                                    }}
                                > 
                                    <View style={styles.stableCardContent}>
                                        <RNImage source={require('../assets/icons/Grid.png')} style={styles.stableIcon} />
                                        <Text style={styles.stableNumber} numberOfLines={2}>
                                            {ficha.nombre_lote || `Lote ${ficha.id}`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ));
                        })()}
                    </View>
                </View>
            </ScrollView>

            {/* Quitar navbar personalizada y poner CustomTabBar */}
            <CustomTabBar activeTab={activeTab} onTabPress={handleTabPress} backgroundColor="#F0E8C9" />
        </View>
    );
}

// Copio los estilos desde index.tsx
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 100, // Espacio para la navbar
    },
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
    statsTextContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    statsValue: {
        color: '#23263B',
        fontSize: 19,
        fontWeight: '400',
    },
    stablesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    stableCardGrid: {
        backgroundColor: '#FCF8EA',
        borderRadius: 12,
        alignItems: 'center',
        paddingVertical: 18,
        marginHorizontal: 0,
        elevation: 1,
        minWidth: 125,
        maxWidth: 145,
        height: 120,
        marginBottom: 16,
        flexBasis: '30%',
    },
    stableCardContent: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    stableIcon: {
        width: 26,
        height: 26,
        marginBottom: 10,
    },
    stableNumber: {
        color: '#23263B',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 20,
    },
    stableDescription: {
        color: '#23263B',
        fontSize: 13,
        fontWeight: '400',
        marginTop: 4,
    },
    stableStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    stableStatsText: {
        color: '#23263B',
        fontSize: 13,
        fontWeight: '400',
        marginLeft: 4,
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
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateText: {
        color: '#A3A6B7',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        color: '#A3A6B7',
        fontSize: 14,
        fontWeight: '400',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#A3A6B7',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    refreshButton: {
        backgroundColor: '#FFD24A',
        borderRadius: 8,
        padding: 8,
    },
});
