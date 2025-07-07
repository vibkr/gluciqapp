import { Pressable, PressableProps, Text, ViewStyle, TextStyle } from "react-native";

interface ButtonProps extends PressableProps {
  title?: string;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export function Button({ children, title, textStyle, style, disabled, ...props }: ButtonProps) {
  const buttonText = title || children;
  
  return (
    <Pressable
      style={[
        {
          backgroundColor: "white",
          padding: 14,
          borderRadius: 14,
          width: "100%",
          opacity: disabled ? 0.5 : 1,
        },
        style as ViewStyle,
      ]}
      disabled={disabled}
      {...props}
    >
      {typeof buttonText === "string" ? (
        <Text style={[{ textAlign: "center", fontWeight: "500" }, textStyle]}>
          {buttonText}
        </Text>
      ) : (
        buttonText
      )}
    </Pressable>
  );
}