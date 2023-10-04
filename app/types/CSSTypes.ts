export type TailwindPixelValue = `[${number} px]`;
export type TWTextSizes =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl"
  | TailwindPixelValue
  | undefined;

export type TWFontWidths =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export type DaisyUIColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "light"
  | "dark"
  | "white"
  | "black"
  | "primary-focus"
  | "primary-content"
  | "secondary-focus"
  | "secondary-content"
  | "accent-focus"
  | "accent-content"
  | "neutral"
  | "neutral-focus"
  | "neutral-content"
  | "base-100"
  | "base-200"
  | "base-300"
  | "base-content"
  | "info-focus"
  | "info-content"
  | "success"
  | "success-content"
  | "warning"
  | "warning-content"
  | "error"
  | "error-content";

export type DaisyUIBtnColor =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "Ghost"
  | "link"
  | "info"
  | "success"
  | "warning"
  | "error";

export type DaisyUIBtnSize = "lg" | "sm" | "xs";
export type DaisyUIBtnWide = "wide";
export type BtnType = "button" | "submit" | "reset";
