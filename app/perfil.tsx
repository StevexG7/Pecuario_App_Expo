import { theme } from '@/constants/Theme';
import { useAuthContext } from '@/src/context/AuthContext';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Perfil() {
    const { logout } = useAuthContext();

    return (
        <View style={styles.container}>
            <Text>Perfil</Text>
            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: theme.primary.button,
        padding: 10,
        borderRadius: 5,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    }
})
