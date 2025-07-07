import { Link, Stack } from "expo-router";
import { IconSymbol } from "@/src/components/IconSymbol";
import { Image } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function RootChatLayout() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          title: " Chat Rooms", // left space for android
          headerLeft: () => (
            <Link href="/profile">
              <Image
                source={{ uri: user?.imageUrl }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            </Link>
          ),
          headerRight: () => (
            <Link href="/new-room">
              <IconSymbol name="plus" />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="new-room"
        options={{
          presentation: "modal",
          headerTitle: "New Chat Room",
          headerLeft: () => (
            <Link href="/" dismissTo>
              <IconSymbol name="chevron.left" />
            </Link>
          ),
        }}
      />
      <Stack.Screen name="profile" options={{ presentation: "modal" }} />

      {/* Set title to empty string to prevent showing [chat] in the header while chat room title is being fetched */}
      <Stack.Screen name="[chat]" options={{ headerTitle: "" }} />
      <Stack.Screen
        name="settings/[chat]"
        options={{ presentation: "modal", headerTitle: "Room Settings" }}
      />
      
      {/* Camera routes */}
      <Stack.Screen 
        name="camera/food-capture" 
        options={{ 
          headerTitle: "Scan Food",
          presentation: "modal" 
        }} 
      />
      <Stack.Screen 
        name="camera/barcode-scanner" 
        options={{ 
          headerTitle: "Scan Barcode",
          presentation: "modal" 
        }} 
      />
      
      {/* Analysis routes */}
      <Stack.Screen 
        name="analysis/food-results" 
        options={{ 
          headerTitle: "Food Analysis",
          presentation: "modal" 
        }} 
      />
    </Stack>
  );
}
