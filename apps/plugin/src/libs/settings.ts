export const SETTING_ENUM = {
  apiUrl: "API_URL",
  tags: "TAGS",
} as const;

export const SETTINGS_SCHEMA = [
  {
    default: "",
    description:
      "The Tailscale magic DNS URL for your Slipbox server. This is something like https://slipbox.example.ts.net.",
    key: SETTING_ENUM.apiUrl,
    title: "API URL",
    type: "string",
  },
  {
    default: "",
    description:
      "Tags to add at the end of every imported note.",
    key: SETTING_ENUM.tags,
    title: "Default tags",
    type: "string",
  }
] as const;
