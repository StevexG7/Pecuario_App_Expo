import { theme } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize as rf, responsiveHeight as rh, responsiveWidth as rw } from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTabBar from '../components/CustomTabBar';

type Gender = 'vaca' | 'toro';
type Purpose = 'lechera' | 'cria' | 'levante' | 'seba';
type Breed = 'nelore' | 'criollo' | 'gyr' | 'brahman';

export default function Formulario() {
    const [activeTab, setActiveTab] = useState('Formulario');
    const router = useRouter();
    const [gender, setGender] = useState<Gender | null>(null);
    const [purpose, setPurpose] = useState<Purpose | null>(null);
    const [breed, setBreed] = useState<Breed | null>(null);
    const [lot, setLot] = useState('');
    const [errors, setErrors] = useState({
        gender: false,
        purpose: false,
        breed: false,
        lot: false
    });

    const handleTabPress = (tab: string) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        switch (tab) {
            case 'Ganado':
                router.navigate('/ganado');
                break;
            case 'Inicio':
                router.navigate('/inicio');
                break;
            case 'Formulario':
                router.navigate('/formulario');
                break;
            case 'Perfil':
                break;
        }
    };

    const handleLotChange = (text: string) => {
        // Solo permitir números y máximo 3 dígitos
        if (/^\d{0,3}$/.test(text)) {
            setLot(text);
            setErrors(prev => ({ ...prev, lot: false }));
        }
    };

    const handleSubmit = () => {
        const newErrors = {
            gender: !gender,
            purpose: !purpose,
            breed: !breed,
            lot: !lot || lot.length < 1
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            // Aquí puedes manejar el envío del formulario
            console.log({ gender, purpose, breed, lot });
        }
    };

    const renderPurposeOptions = () => {
        if (!gender) return null;

        const options = gender === 'vaca' 
            ? ['lechera', 'cria', 'levante']
            : ['seba', 'levante'];

        return (
            <View style={styles.section}>
                <Text style={styles.label}>Propósito *</Text>
                <View style={styles.optionsContainer}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.optionButton,
                                purpose === option && styles.selectedOption
                            ]}
                            onPress={() => {
                                setPurpose(option as Purpose);
                                setErrors(prev => ({ ...prev, purpose: false }));
                            }}
                        >
                            <Text style={[
                                styles.optionText,
                                purpose === option && styles.selectedOptionText
                            ]}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {errors.purpose && (
                    <Text style={styles.errorText}>Selecciona un propósito</Text>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Stack.Screen 
                options={{ 
                    headerShown: true,
                    title: 'Formulario',
                    headerStyle: {
                        backgroundColor: theme.primary.main,
                    },
                    headerTintColor: theme.primary.text,
                }} 
            />
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <Text style={styles.title}>Registro de Ganado</Text>
                    
                    {/* Género */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Género *</Text>
                        <View style={styles.optionsContainer}>
                            {['vaca', 'toro'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.optionButton,
                                        gender === option && styles.selectedOption
                                    ]}
                                    onPress={() => {
                                        setGender(option as Gender);
                                        setPurpose(null); // Reset purpose when gender changes
                                        setErrors(prev => ({ ...prev, gender: false }));
                                    }}
                                >
                                    <MaterialCommunityIcons 
                                        nombre={option === 'vaca' ? 'cow' : 'bull'} 
                                        size={24} 
                                        color={gender === option ? theme.primary.text : theme.primary.button} 
                                    />
                                    <Text style={[
                                        styles.optionText,
                                        gender === option && styles.selectedOptionText
                                    ]}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.gender && (
                            <Text style={styles.errorText}>Selecciona un género</Text>
                        )}
                    </View>

                    {/* Propósito */}
                    {renderPurposeOptions()}

                    {/* Raza */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Raza *</Text>
                        <View style={styles.optionsContainer}>
                            {['nelore', 'criollo', 'gyr', 'brahman'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.optionButton,
                                        breed === option && styles.selectedOption
                                    ]}
                                    onPress={() => {
                                        setBreed(option as Breed);
                                        setErrors(prev => ({ ...prev, breed: false }));
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        breed === option && styles.selectedOptionText
                                    ]}>
                                        {option === 'criollo' ? 'Criollo Casanare' : 
                                         option === 'gyr' ? 'Gyr Lando' : 
                                         option === 'brahman' ? 'Brahman Rojo' : 
                                         option.charAt(0).toUpperCase() + option.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.breed && (
                            <Text style={styles.errorText}>Selecciona una raza</Text>
                        )}
                    </View>

                    {/* Lote */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Lote *</Text>
                        <TextInput
                            style={[styles.input, errors.lot && styles.inputError]}
                            value={lot}
                            onChangeText={handleLotChange}
                            keyboardType="numeric"
                            maxLength={3}
                            placeholder="Ingresa el número de lote (1-3 dígitos)"
                            placeholderTextColor="#666"
                        />
                        {errors.lot && (
                            <Text style={styles.errorText}>Ingresa un número de lote válido</Text>
                        )}
                    </View>

                    <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Registrar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <CustomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.secondary.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: rw(4),
    },
    title: {
        fontSize: rf(2.5),
        color: theme.primary.text,
        fontWeight: 'bold',
        marginBottom: rh(2),
    },
    section: {
        marginBottom: rh(2),
    },
    label: {
        fontSize: rf(1.8),
        color: theme.primary.text,
        marginBottom: rh(1),
        fontWeight: '600',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: rw(2),
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: rw(3),
        borderRadius: rw(2),
        backgroundColor: theme.primary.main,
        borderWidth: 1,
        borderColor: theme.primary.button,
        gap: rw(2),
    },
    selectedOption: {
        backgroundColor: theme.primary.button,
    },
    optionText: {
        color: theme.primary.button,
        fontSize: rf(1.6),
    },
    selectedOptionText: {
        color: theme.primary.text,
    },
    input: {
        backgroundColor: theme.primary.main,
        borderRadius: rw(2),
        padding: rw(3),
        color: theme.primary.text,
        fontSize: rf(1.6),
        borderWidth: 1,
        borderColor: theme.primary.button,
    },
    inputError: {
        borderColor: '#ff4444',
    },
    errorText: {
        color: '#ff4444',
        fontSize: rf(1.4),
        marginTop: rh(0.5),
    },
    submitButton: {
        backgroundColor: theme.primary.button,
        padding: rw(3),
        borderRadius: rw(2),
        alignItems: 'center',
        marginTop: rh(2),
    },
    submitButtonText: {
        color: theme.primary.text,
        fontSize: rf(1.8),
        fontWeight: 'bold',
    },
}); 