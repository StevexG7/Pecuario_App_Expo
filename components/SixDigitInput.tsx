import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { theme } from '../constants/Theme';

interface Props {
  value: string;
  onChange: (val: string) => void;
  autoFocus?: boolean;
}

export default function SixDigitInput({ value, onChange, autoFocus }: Props) {
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, idx: number) => {
    let newValue = value.split('');
    if (text.length > 1) {
      // Si el usuario pega el código completo
      onChange(text.slice(0, 6));
      return;
    }
    newValue[idx] = text;
    const joined = newValue.join('').replace(/[^0-9]/g, '');
    onChange(joined);
    if (text && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, idx) => (
        <TextInput
          key={idx}
          ref={(ref: any) => (inputs.current[idx] = ref)}
          style={[styles.input, value[idx] && styles.filled]}
          value={value[idx] || ''}
          onChangeText={text => handleChange(text, idx)}
          onKeyPress={e => handleKeyPress(e, idx)}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={autoFocus && idx === 0}
          selectionColor={theme.primary.button}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 16,
  },
  input: {
    width: 40,
    height: 48,
    borderWidth: 2,
    borderColor: theme.primary.button,
    borderRadius: 8,
    backgroundColor: theme.secondary.card_2,
    textAlign: 'center',
    fontSize: 24,
    color: theme.primary.text,
  },
  filled: {
    borderColor: theme.primary.main,
  },
}); 