import { View, ViewProps, ViewStyle } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export function Card({ children, style, ...props }: ViewProps) {
  const { theme } = useTheme();
  
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.card,
          padding: 24,
          borderRadius: 20,
          marginVertical: 8,
          marginHorizontal: 6,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        style as ViewStyle,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}