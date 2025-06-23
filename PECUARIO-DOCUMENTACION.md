# PECUARIO-DOCUMENTACION 1.0
 
## 1. Introducción

### ¿Qué es React Native?
React Native es un framework de JavaScript que permite crear aplicaciones móviles nativas para iOS y Android usando el mismo código base. Utiliza componentes similares a los de React, pero adaptados para móviles.

### ¿Qué es Expo?
Expo es una herramienta que facilita el desarrollo con React Native. Permite crear, probar y publicar apps sin necesidad de configurar entornos nativos complicados.

### ¿Qué es TypeScript y TSX?
- **TypeScript** es un lenguaje que extiende JavaScript añadiendo tipos estáticos. Ayuda a evitar errores y hace el código más fácil de entender.
- **TSX** es una extensión de TypeScript que permite escribir código JSX (estructura similar a HTML) dentro de archivos `.tsx`.

---

## 2. Estructura del Proyecto

Tu proyecto tiene una estructura similar a esta:

```
Pecuario_App/
  app/           # Pantallas principales de la app
  assets/        # Imágenes y fuentes
  components/    # Componentes reutilizables
  constants/     # Temas y colores
  hooks/         # Hooks personalizados
  src/           # Servicios, contexto y configuración
  package.json   # Dependencias del proyecto
  tsconfig.json  # Configuración de TypeScript
```

**Ejemplo:**
- `app/inicio.tsx` es una pantalla principal.
- `components/CustomTabBar.tsx` es una barra de navegación personalizada.

---

## 3. Conceptos Básicos de TypeScript y TSX

### ¿Qué es un tipo?
Un tipo define qué valores puede tener una variable. Por ejemplo:

```ts
let edad: number = 25;
let nombre: string = "Juan";
```

### ¿Qué es una interfaz?
Sirve para definir la forma de un objeto:

```ts
interface Animal {
  id: number;
  nombre: string;
  peso: number;
}
```

### ¿Qué es un componente?
Un componente es una función que retorna una interfaz visual (UI). Ejemplo:

```tsx
import React from 'react';
import { Text, View } from 'react-native';

export default function MiComponente() {
  return (
    <View>
      <Text>¡Hola, mundo!</Text>
    </View>
  );
}
```

### ¿Qué son props y estado?
- **Props**: Son datos que se pasan a los componentes.
- **Estado**: Son datos internos que pueden cambiar.

Ejemplo con estado:

```tsx
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function Contador() {
  const [cuenta, setCuenta] = useState(0);
  return (
    <View>
      <Text>Cuenta: {cuenta}</Text>
      <Button title="Sumar" onPress={() => setCuenta(cuenta + 1)} />
    </View>
  );
}
```

---

## 4. Primeros Pasos con Expo y React Native

1. Instala Node.js y npm.
2. Instala Expo CLI:
   ```bash
   npm install -g expo-cli
   ```
3. Para iniciar el proyecto:
   ```bash
   expo start
   ```
4. Escanea el QR con la app de Expo Go en tu móvil.

---

## 5. Componentes y Navegación

### Ejemplo de componente funcional

```tsx
import React from 'react';
import { Text, View } from 'react-native';

export default function Saludo({ nombre }: { nombre: string }) {
  return <Text>Hola, {nombre}!</Text>;
}
```

### Navegación entre pantallas
En tu proyecto se usa `expo-router` para navegar:

```tsx
import { useRouter } from 'expo-router';

const router = useRouter();
router.replace('/ganado'); // Navega a la pantalla de Ganado
```

---

## 6. Estilos y Diseño Responsivo

React Native usa objetos para los estilos:

```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  caja: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});
```

Para que la app se vea bien en cualquier pantalla, se usan librerías como `react-native-responsive-dimensions`:

```tsx
import { responsiveHeight as rh, responsiveWidth as rw } from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  caja: {
    height: rh(10), // 10% de la altura de la pantalla
    width: rw(80),  // 80% del ancho de la pantalla
  },
});
```

---

## 7. Consumo de APIs y Manejo de Datos

Para conectar con un backend (por ejemplo, Flask), se usan servicios:

```ts
// src/services/animal.service.ts
import api from './api.client';

export const getAnimales = async () => {
  const res = await api.get('/animales');
  return res.data;
};
```

En el componente:

```tsx
import { useEffect, useState } from 'react';
import { getAnimales } from '../src/services/animal.service';

const [animales, setAnimales] = useState([]);

useEffect(() => {
  getAnimales().then(setAnimales);
}, []);
```

---

## 8. Autenticación y Manejo de Usuarios

Se usan hooks y contexto para manejar el usuario:

```tsx
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // ... lógica de login/logout
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## 9. Animaciones y UI Personalizada

Ejemplo: barra de pestañas animada (`components/CustomTabBar.tsx`):

```tsx
<TouchableOpacity
  key={tab.name}
  style={styles.tabButton}
  onPress={() => onTabPress(tab.name)}
>
  <View style={styles.tabContent}>
    <Ionicons name={tab.icon as any} size={isActive ? 24 : 26} color={theme.primary.text} />
    {isActive && (
      <Animated.Text style={styles.tabLabel}>{tab.name}</Animated.Text>
    )}
  </View>
</TouchableOpacity>
```

Esta barra permite navegar entre pantallas y resalta la pestaña activa con animación.

---

## 10. Buenas Prácticas y Consejos
- Usa TypeScript para evitar errores y documentar tu código.
- Organiza tu proyecto en carpetas lógicas.
- Usa hooks para lógica reutilizable.
- Maneja los errores de las APIs y muestra mensajes claros al usuario.
- Prueba tu app en varios dispositivos.

---

## 11. Recursos para Seguir Aprendiendo
- [Documentación oficial de React Native](https://reactnative.dev/docs/getting-started)
- [Guía de Expo](https://docs.expo.dev/)
- [TypeScript para principiantes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Curso gratuito de React Native en YouTube](https://www.youtube.com/results?search_query=react+native+español)

---

¡Listo! Ahora tienes una base para aprender y enseñar a otros cómo funciona un proyecto real con TypeScript, TSX, React Native y Expo. Puedes convertir este archivo a PDF usando cualquier editor de Markdown o herramientas online como Dillinger o StackEdit. 