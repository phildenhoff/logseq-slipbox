export const SETTING_ENUM = {
  apiUrl: "API_URL",
} as const;

export const SETTINGS_SCHEMA = [
  {
    default: "",
    description:
      "The Tailscale magic DNS URL for your Slipbox server. This is something like https://slipbox.example.ts.net.",
    key: SETTING_ENUM.apiUrl,
    title: "API URL",
    type: "string",
  } as const,
];
