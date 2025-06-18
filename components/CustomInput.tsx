import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Props para el input personalizado
interface CustomInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  options?: string[]; // Si hay opciones, es un dropdown
}

export default function CustomInput({ label, value, onChange, placeholder, options }: CustomInputProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {options ? (
        <>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowOptions(!showOptions)}
            activeOpacity={0.8}
          >
            <Text style={{ color: value ? '#222' : '#888' }}>{value || placeholder}</Text>
          </TouchableOpacity>
          {showOptions && (
            <View style={styles.dropdown}>
              {options.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    onChange(item);
                    setShowOptions(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      ) : (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#888"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#222' },
  input: {
    backgroundColor: '#faf7e8',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e5e2c6',
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e2c6',
    marginTop: 2,
    maxHeight: 120,
    zIndex: 10,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
}); 