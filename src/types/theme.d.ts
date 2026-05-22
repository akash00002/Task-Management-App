import "@react-navigation/native";

declare module "@react-navigation/native" {
  export interface Theme {
    colors: Theme["colors"] & {
      success: string;
      warning: string;
      danger: string;
      muted: string;
      secondaryText: string;
      badgeBg: string;
      shadow: string;
    };
  }
}
