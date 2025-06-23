import { theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize as rf, responsiveHeight as rh, responsiveWidth as rw } from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../components/CustomInput';
import CustomTabBar from '../components/CustomTabBar';
import { registrarAnimal } from '../src/services/animal.service';

type Gender = 'hembra' | 'macho';
type Purpose = 'lechera' | 'cria' | 'levante' | 'seba';
type Breed = 'nelore' | 'criollo' | 'gyr' | 'brahman';

// Componente de alerta centrada y modal (igual que en index.tsx)
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

export default function Formulario() {
    const [activeTab, setActiveTab] = useState('Formulario');
    const [isTabBarTransparent, setIsTabBarTransparent] = useState(false);
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
    const [alert, setAlert] = useState<string | null>(null);

    const handleTabPress = (tab: string) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        switch (tab) {
            case 'Ganado':
                router.replace('/ganado');
                break;
            case 'Inicio':
                router.replace('/inicio');
                break;
            case 'Formulario':
                router.replace('/formulario' as any);
                break;
            case 'Perfil':
                router.replace('/perfil');
                break;
        }
    };

    // Función para detectar el scroll y ajustar la transparencia de la barra
    const handleScroll = (event: any) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const scrollY = contentOffset.y;
        const contentHeight = contentSize.height;
        const screenHeight = layoutMeasurement.height;
        
        // Calcular si estamos cerca del final del contenido
        const distanceFromBottom = contentHeight - scrollY - screenHeight;
        const threshold = 150; // Distancia en píxeles desde el final
        
        // Hacer transparente si estamos cerca del final o si hay poco contenido
        const shouldBeTransparent = distanceFromBottom < threshold || contentHeight < screenHeight;
        
        setIsTabBarTransparent(shouldBeTransparent);
    };

    const handleLotChange = (text: string) => {
        if (/^\d{0,3}$/.test(text) && (!text || parseInt(text) > 0)) {
            setLot(text);
            setErrors(prev => ({ ...prev, lot: false }));
        }
    };

    const handleSubmit = async () => {
        const newErrors = {
            gender: !gender,
            purpose: !purpose,
            breed: !breed,
            lot: !lot || lot.length < 1 || parseInt(lot) < 1
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            try {
                // Generar nombre del lote automáticamente
                const genderText = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Animal';
                const breedText = breed ? breed.charAt(0).toUpperCase() + breed.slice(1) : 'Sin raza';
                const purposeText = purpose ? purpose.charAt(0).toUpperCase() + purpose.slice(1) : 'Sin propósito';
                const nombreLote = `${genderText} ${breedText} - ${purposeText}`;
                
                const animalData = {
                    nombre_lote: nombreLote,
                    genero: gender === 'hembra' ? 'Hembra' : 'Macho',
                    proposito: purpose!,
                    raza: breed!,
                    cantidad: parseInt(lot)
                };
                
                console.log('Enviando datos al backend:', animalData);
                
                await registrarAnimal(animalData);

                setAlert('Animales registrados exitosamente');
                setTimeout(() => {
                    router.replace('/ganado');
                }, 1500);
            } catch (err: any) {
                console.error('Error completo:', err);
                console.error('Datos del error:', {
                    mensaje: err.message,
                    status: err.status,
                    data: err.data
                });
                
                let errorMessage = 'Error al registrar los animales.';
                if (err.status === 400) {
                    errorMessage = 'Los datos enviados no son válidos. Verifica la información.';
                } else if (err.status === 401) {
                    errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
                } else if (err.status === 500) {
                    errorMessage = 'Error en el servidor. Por favor, intenta más tarde.';
                }
                
                setAlert(errorMessage);
            }
        }
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
            <AppAlert message={alert ?? ''} onClose={() => setAlert(null)} />
            <ScrollView style={styles.scrollView} onScroll={handleScroll}>
                <View style={styles.content}>
                    <Text style={styles.title}>Registro de Ganado</Text>
                    
                    {/* Género */}
                    <CustomInput
                        label="Género *"
                        value={gender || ''}
                        onChange={(val) => {
                            setGender(val as Gender);
                            setPurpose(null); // Reset purpose when gender changes
                            setErrors(prev => ({ ...prev, gender: false }));
                        }}
                        options={['hembra', 'macho']}
                        placeholder="Selecciona un género"
                    />
                    {errors.gender && (
                        <Text style={styles.errorText}>Selecciona un género</Text>
                    )}

                    {/* Propósito */}
                    <CustomInput
                        label="Propósito *"
                        value={purpose || ''}
                        onChange={(val) => {
                            setPurpose(val as Purpose);
                            setErrors(prev => ({ ...prev, purpose: false }));
                        }}
                        options={gender === 'hembra' ? ['lechera', 'cria', 'levante'] : gender === 'macho' ? ['seba', 'levante'] : ['lechera', 'cria', 'levante', 'seba']}
                        placeholder="Selecciona un propósito"
                    />
                    {errors.purpose && (
                        <Text style={styles.errorText}>Selecciona un propósito</Text>
                    )}

                    {/* Raza */}
                    <CustomInput
                        label="Raza *"
                        value={breed || ''}
                        onChange={(val) => {
                            setBreed(val as Breed);
                            setErrors(prev => ({ ...prev, breed: false }));
                        }}
                        options={['nelore', 'criollo', 'gyr', 'brahman']}
                        placeholder="Selecciona una raza"
                    />
                    {errors.breed && (
                        <Text style={styles.errorText}>Selecciona una raza</Text>
                    )}

                    {/* Lote */}
                    <CustomInput
                        label="Cantidad de Animales *"
                        value={lot}
                        onChange={handleLotChange}
                        placeholder="Ingresa la cantidad (1-999)"
                    />
                    {errors.lot && (
                        <Text style={styles.errorText}>Ingresa una cantidad válida (1-999)</Text>
                    )}

                    {/* Vista previa del nombre del lote */}
                    {gender && breed && purpose && (
                        <View style={styles.previewContainer}>
                            <Text style={styles.previewLabel}>Nombre del lote que se creará:</Text>
                            <Text style={styles.previewText}>
                                {`${gender.charAt(0).toUpperCase() + gender.slice(1)} ${breed.charAt(0).toUpperCase() + breed.slice(1)} - ${purpose.charAt(0).toUpperCase() + purpose.slice(1)}`}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Registrar</Text>
                    </TouchableOpacity>

                    {/* Botón para dirigirse a la vista del ganado */}
                    <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={() => router.replace('/ganado')}
                    >
                        <Text style={styles.submitButtonText}>Ir a Ganado</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
            <CustomTabBar 
                activeTab={activeTab} 
                onTabPress={handleTabPress}
                isTransparent={isTabBarTransparent}
            />
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
        marginTop: rh(-2),
        marginBottom: rh(3),
    },
    submitButton: {
        backgroundColor: theme.primary.button,
        padding: rw(3),
        borderRadius: rw(2),
        alignItems: 'center',
        marginTop: rh(3),
    },
    submitButtonText: {
        color: theme.primary.text,
        fontSize: rf(1.8),
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
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
    previewContainer: {
        marginTop: rh(2),
        padding: rw(4),
        backgroundColor: theme.primary.main,
        borderRadius: rw(2),
        alignItems: 'center',
    },
    previewLabel: {
        color: theme.primary.text,
        fontSize: rf(1.6),
        fontWeight: 'bold',
        marginBottom: rh(1),
    },
    previewText: {
        color: theme.primary.text,
        fontSize: rf(1.4),
    },
}); 