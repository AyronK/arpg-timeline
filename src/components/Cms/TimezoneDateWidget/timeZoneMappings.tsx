export const timeZoneMappings: {
  abbr: string;
  iana: string;
  description: string;
}[] = [
  { abbr: "UTC", iana: "Etc/UTC", description: "Coordinated Universal Time" },
  {
    abbr: "EST",
    iana: "America/New_York",
    description: "Eastern Standard Time (North America)",
  },
  {
    abbr: "CST",
    iana: "America/Chicago",
    description: "Central Standard Time (North America)",
  },
  {
    abbr: "PST",
    iana: "America/Los_Angeles",
    description: "Pacific Standard Time (North America) PST / PDT",
  },
  { abbr: "JST", iana: "Asia/Tokyo", description: "Japan Standard Time" },
  { abbr: "CET", iana: "Europe/Paris", description: "Central European Time" },
  { abbr: "CST", iana: "Asia/Shanghai", description: "China Standard Time" },
];
