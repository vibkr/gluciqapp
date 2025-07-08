import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = "primary", 
  size = "medium", 
  loading = false, 
  children, 
  style, 
  disabled,
  ...props 
}: ButtonProps) {
  const { theme } = useTheme();
  
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 36,
      },
      medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        minHeight: 44,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        shadowColor: theme.colors.secondary,
      },
      accent: {
        backgroundColor: theme.colors.accent,
        shadowColor: theme.colors.accent,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: theme.colors.primary,
        shadowOpacity: 0,
        elevation: 0,
      },
      ghost: {
        backgroundColor: "transparent",
        shadowOpacity: 0,
        elevation: 0,
      },
    };

    if (disabled || loading) {
      return {
        ...baseStyle,
        ...sizeStyles[size],
        backgroundColor: theme.colors.disabled,
        shadowOpacity: 0,
        elevation: 0,
      };
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: "600",
    };

    // Size text styles
    const sizeTextStyles: Record<ButtonSize, TextStyle> = {
      small: {
        fontSize: 14,
      },
      medium: {
        fontSize: 16,
      },
      large: {
        fontSize: 18,
      },
    };

    // Variant text styles
    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: {
        color: theme.colors.background,
      },
      secondary: {
        color: theme.colors.background,
      },
      accent: {
        color: theme.colors.background,
      },
      outline: {
        color: theme.colors.primary,
      },
      ghost: {
        color: theme.colors.primary,
      },
    };

    if (disabled || loading) {
      return {
        ...baseStyle,
        ...sizeTextStyles[size],
        color: theme.colors.textSecondary,
      };
    }

    return {
      ...baseStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === "outline" || variant === "ghost" ? theme.colors.primary : theme.colors.background} 
        />
      ) : (
        <Text style={getTextStyle()}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}