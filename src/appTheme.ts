import {
  createDarkTheme,
  createLightTheme,
  type BrandVariants,
  type Theme,
} from "@fluentui/react-components";

const myNewTheme: BrandVariants = {
  10: "#03020C",
  20: "#0D1144",
  30: "#121678",
  40: "#23169C",
  50: "#3D14BB",
  60: "#5B0DD5",
  70: "#7902EA",
  80: "#9600F8",
  90: "#B114FF",
  100: "#C730FF",
  110: "#DB47FF",
  120: "#EC5DFF",
  130: "#FB73FF",
  140: "#FF90F9",
  150: "#FFABF3",
  160: "#FFC4F1",
};

export const myLightTheme: Theme = {
  ...createLightTheme(myNewTheme),
};

export const myDarkTheme: Theme = {
  ...createDarkTheme(myNewTheme),
};

myDarkTheme.colorBrandForeground1 = myNewTheme[110];
myDarkTheme.colorBrandForeground2 = myNewTheme[120];
