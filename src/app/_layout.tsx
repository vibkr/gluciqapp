import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { DarkTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import { tokenCache } from "@/src/utils/cache";
import { StatusBar } from "react-native";
import { ThemeProvider } from "@/src/contexts/ThemeContext";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <ThemeProvider>
          <NavigationThemeProvider value={DarkTheme}>
            <Slot />
            <StatusBar barStyle="light-content" backgroundColor={"black"} />
          </NavigationThemeProvider>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
