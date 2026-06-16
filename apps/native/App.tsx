import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MobileUIProvider } from "@/components/mobile-ui-provider";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  eyebrow: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  title: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "800",
  },
  body: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 24,
  },
});

function AppShell() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <MobileUIProvider>
          <View style={styles.screen}>
            <StatusBar style="auto" />
            <Text style={styles.eyebrow}>Better Fullstack Mobile</Text>
            <Text style={styles.title}>Production-minded Expo starter</Text>
            <Text style={styles.body}>Native app shell is ready.</Text>
          </View>
        </MobileUIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return <AppShell />;
}
