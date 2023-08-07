export default {
  name: "Sheltie",
  slug: "sheltie-app",
  owner: "camhammel",
  version: "1.2.4",
  orientation: "portrait",
  icon: "./assets/appIcon.png",
  primaryColor: "#3F77B9",
  jsEngine: "hermes",
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/b02e7b71-f109-4b47-8196-fd8a10d2b529"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    bundleIdentifier: "app.sheltie",
    buildNumber: "1.2.5",
    supportsTablet: false,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover"
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "This app uses Location to determine animal shelters closest to you for results.",
      NSLocationAlwaysAndWhenInUseUsageDescription: "This app uses Location to determine animal shelters closest to you for results."
    },
    associatedDomains: [
      "applinks:*.sheltie.app",
      "applinks:sheltie.app",
      "applinks:https://sheltie.app",
      "applinks:www.sheltie.app"
    ]
  },
  android: {
    package: "app.sheltie",
    versionCode: 16,
    permissions: [
      "ACCESS_COARSE_LOCATION"
    ],
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover"
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "http",
            host: "sheltie.app"
          },
          {
            scheme: "https",
            host: "sheltie.app"
          },
          {
            scheme: "https",
            host: "*.sheltie.app"
          }
        ],
        category: [
          "BROWSABLE",
          "DEFAULT"
        ]
      }
    ]
  },
  web: {
    favicon: "./assets/appIcon.png"
  },
  scheme: "sheltie",
  description: "Search for pets available for adoption from local shelters. This app uses the Petfinder API and does not claim ownership to the data provided by Petfinder. ",
  extra: {
    eas: {
      projectId: "b02e7b71-f109-4b47-8196-fd8a10d2b529"
    },
    PETFINDER_KEY: process.env.PETFINDER_KEY,
    PETFINDER_SECRET: process.env.PETFINDER_SECRET
  },
  runtimeVersion: "exposdk:47.0.0",
  plugins: [
    [
      "expo-updates",
      {
        "username": "camhammel"
      }
    ]
  ]
}
