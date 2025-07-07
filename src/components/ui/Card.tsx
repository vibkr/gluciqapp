import { View, ViewProps, ViewStyle } from "react-native";

export function Card({ children, style, ...props }: ViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: "#1c1c1c",
          padding: 16,
          borderRadius: 12,
          marginVertical: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        style as ViewStyle,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}