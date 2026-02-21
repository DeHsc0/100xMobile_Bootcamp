
import "../global.css"
import "../src/polyfills";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-get-random-values";
import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden></StatusBar>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
    </SafeAreaProvider>
  );
}