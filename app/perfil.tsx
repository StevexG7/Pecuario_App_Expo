import { useAuthContext } from '@/src/context/AuthContext';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Modal, Image as RNImage, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

export default function Perfil() {
    const { logout, user } = useAuthContext();
    const [activeTab, setActiveTab] = useState('Perfil');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    // States for password change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    // States for email change
    const [newEmail, setNewEmail] = useState('');
    // States for feedback
    const [feedback, setFeedback] = useState('');
    const router = useRouter();

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

    // Handlers for modals (replace with real logic)
    const handlePasswordChange = () => {
        if (!currentPassword || !newPassword) {
            Alert.alert('Error', 'Completa ambos campos');
            return;
        }
        // Aquí iría la lógica real de cambio de contraseña
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        Alert.alert('Contraseña cambiada', 'Tu contraseña ha sido actualizada.');
    };
    const handleEmailChange = () => {
        if (!newEmail) {
            Alert.alert('Error', 'Ingresa el nuevo correo');
            return;
        }
        // Aquí iría la lógica real de cambio de correo
        setShowEmailModal(false);
        setNewEmail('');
        Alert.alert('Correo cambiado', 'Tu correo ha sido actualizado.');
    };
    const handleSendFeedback = () => {
        if (!feedback) {
            Alert.alert('Error', 'Por favor escribe tu feedback');
            return;
        }
        setShowFeedbackModal(false);
        setFeedback('');
        Alert.alert('¡Gracias!', 'Tu feedback ha sido enviado.');
    };
    const handleContactDev = () => {
        setShowContactModal(false);
        Linking.openURL('mailto:dev@pecuarioapp.com');
    };

    return (
        <View style={styles.container}>
            {/* HEADER CURVO PERSONALIZADO */}
            <View style={styles.headerContainer}>
                <RNImage source={require('../assets/images/Header.png')} style={styles.headerBg} resizeMode="cover" />
                <View style={styles.headerContentCentered}>
                    <RNImage source={require('../assets/icons/Person.png')} style={styles.headerUserIcon} resizeMode="contain" />
                    <Text style={styles.headerName}>Perfil</Text>
                </View>
            </View>
            {/* Secciones de ajustes e info */}
            <View style={{ flex: 1 }}>
                <View style={[styles.section, { marginTop: 32 }]}>
                    <Text style={styles.sectionTitle}>Ajustes de la app</Text>
                    <TouchableOpacity style={styles.row} onPress={() => setShowPasswordModal(true)}>
                        <Feather name="lock" size={22} color="#23263B" style={styles.icon} />
                        <Text style={styles.rowText}>Cambiar contraseña</Text>
                        <Ionicons name="chevron-forward" size={20} color="#A3A6B7" style={styles.chevron} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={() => setShowEmailModal(true)}>
                        <MaterialIcons name="alternate-email" size={22} color="#23263B" style={styles.icon} />
                        <Text style={styles.rowText}>Cambiar correo</Text>
                        <Ionicons name="chevron-forward" size={20} color="#A3A6B7" style={styles.chevron} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={logout}>
                        <Feather name="log-out" size={22} color="#C82333" style={styles.icon} />
                        <Text style={[styles.rowText, { color: '#C82333' }]}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Info de la app</Text>
                    <TouchableOpacity style={styles.row} onPress={() => setShowFeedbackModal(true)}>
                        <Feather name="message-circle" size={22} color="#23263B" style={styles.icon} />
                        <Text style={styles.rowText}>Feedback de la app</Text>
                        <Ionicons name="chevron-forward" size={20} color="#A3A6B7" style={styles.chevron} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={() => setShowContactModal(true)}>
                        <Feather name="user" size={22} color="#23263B" style={styles.icon} />
                        <Text style={styles.rowText}>Contactar a un dev</Text>
                        <Ionicons name="chevron-forward" size={20} color="#A3A6B7" style={styles.chevron} />
                    </TouchableOpacity>
                    <View style={[styles.row, { borderBottomWidth: 0 }]}> 
                        <Feather name="info" size={22} color="#23263B" style={styles.icon} />
                        <Text style={styles.rowText}>Versión de la app</Text>
                        <Text style={styles.versionText}>{Constants.manifest?.version || '1.0.0'}</Text>
                    </View>
                </View>
                <View style={styles.logoContainer}>
                    <RNImage source={require('../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
                </View>
            </View>
            <CustomTabBar activeTab={activeTab} onTabPress={handleTabPress} backgroundColor="#F0E8C9" />

            {/* Modal Cambiar Contraseña */}
            <Modal visible={showPasswordModal} transparent animationType="fade" onRequestClose={() => setShowPasswordModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Cambiar contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña actual"
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nueva contraseña"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setShowPasswordModal(false)}>
                                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtnAction} onPress={handlePasswordChange}>
                                <Text style={styles.modalBtnActionText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal Cambiar Correo */}
            <Modal visible={showEmailModal} transparent animationType="fade" onRequestClose={() => setShowEmailModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Cambiar correo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nuevo correo"
                            keyboardType="email-address"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />
                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setShowEmailModal(false)}>
                                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtnAction} onPress={handleEmailChange}>
                                <Text style={styles.modalBtnActionText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal Feedback */}
            <Modal visible={showFeedbackModal} transparent animationType="fade" onRequestClose={() => setShowFeedbackModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Feedback de la app</Text>
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            placeholder="Escribe tu feedback aquí..."
                            multiline
                            value={feedback}
                            onChangeText={setFeedback}
                        />
                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setShowFeedbackModal(false)}>
                                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtnAction} onPress={handleSendFeedback}>
                                <Text style={styles.modalBtnActionText}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal Contactar Dev */}
            <Modal visible={showContactModal} transparent animationType="fade" onRequestClose={() => setShowContactModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Contactar a un dev</Text>
                        <Text style={{ color: '#23263B', marginBottom: 18, textAlign: 'center' }}>
                            ¿Tienes un problema o sugerencia? Escríbenos a:
                        </Text>
                        <Text style={{ color: '#007AFF', fontWeight: 'bold', textAlign: 'center', marginBottom: 18 }}>
                            dev@pecuarioapp.com
                        </Text>
                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setShowContactModal(false)}>
                                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtnAction} onPress={handleContactDev}>
                                <Text style={styles.modalBtnActionText}>Contactar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF6E7',
        paddingTop: 0,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 18,
        marginHorizontal: 16,
        marginBottom: 25,
        paddingVertical: 8,
        paddingHorizontal: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    sectionTitle: {
        color: '#3A5D23',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 12,
        marginBottom: 8,
        marginLeft: 18,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderColor: '#F0E8C9',
    },
    rowText: {
        flex: 1,
        color: '#23263B',
        fontSize: 16,
        fontWeight: '500',
    },
    icon: {
        marginRight: 16,
    },
    chevron: {
        marginLeft: 8,
    },
    versionText: {
        color: '#A3A6B7',
        fontSize: 15,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 28,
        width: '85%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 6,
    },
    modalTitle: {
        color: '#23263B',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 18,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#F0E8C9',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 14,
        backgroundColor: '#FCF8EA',
        color: '#23263B',
    },
    modalBtnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
    modalBtnCancel: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 12,
        marginRight: 8,
    },
    modalBtnCancelText: {
        color: '#23263B',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalBtnAction: {
        flex: 1.2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        backgroundColor: '#F8D7DA',
        paddingVertical: 12,
        marginLeft: 8,
    },
    modalBtnActionText: {
        color: '#C82333',
        fontWeight: 'bold',
        fontSize: 16,
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
    headerUserIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    headerName: {
        color: '#23263B',
        fontSize: 22,
        fontWeight: 'bold',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        marginBottom: 12,
    },
    logo: {
        width: 120,
        height: 48,
    },
});
