import { Tabs, useRouter } from "expo-router";
import { IconSymbol } from "@/src/components/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { userStore, userActions } from "@/src/stores/userStore";

export default function RootChatLayout() {
  const { theme } = useTheme();
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [initializingUser, setInitializingUser] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      // Redirect to auth if not signed in
      router.replace("/(auth)");
      return;
    }

    if (user && isSignedIn) {
      // Initialize user data
      const initializeUser = async () => {
        try {
          await userActions.initializeUser(user);
          
          // Check if onboarding is complete
          const profile = userStore.profile.get();
          if (!profile?.onboarding_completed) {
            // Redirect to existing onboarding flow
            router.replace("/onboarding/welcome");
            return;
          }
          
          setInitializingUser(false);
        } catch (error) {
          console.error("Error initializing user:", error);
          Alert.alert("Error", "Failed to initialize user data");
          setInitializingUser(false);
        }
      };

      initializeUser();
    }
  }, [user, isSignedIn, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out");
    }
  };

  // Show loading while initializing
  if (initializingUser || !isSignedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}>
            {user?.imageUrl && (
              <Image
                source={{ uri: user.imageUrl }}
                style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
              />
            )}
            <Text style={{ color: theme.colors.text, marginRight: 8 }}>
              {user?.firstName || user?.emailAddresses[0]?.emailAddress}
            </Text>
            <TouchableOpacity onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? "house.fill" : "house"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: "Food",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "restaurant" : "restaurant-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insulin"
        options={{
          title: "Insulin",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "medical" : "medical-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={24} color={color} />
          ),
        }}
      />
      {/* Hide other screens from tabs */}
      <Tabs.Screen name="camera" options={{ href: null }} />
      <Tabs.Screen name="analysis" options={{ href: null }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="new-room" options={{ href: null }} />
      <Tabs.Screen name="[chat]" options={{ href: null }} />
    </Tabs>
  );
}
