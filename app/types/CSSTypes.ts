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
  |'accent'
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

export type maxWidthTW = 
"max-w-0	"|
"max-w-none"| 
"max-w-xs"|	  /* 320px */ 
"max-w-sm"| /* 384px */ 
"max-w-md"| /* 448px */ 
"max-w-lg"|  /* 512px */ 
"max-w-xl"|	  /* 576px */ 
"max-w-2xl"|  /* 672px */
"max-w-3xl"| /* 768px */
"max-w-4xl"| /* 896px */
"max-w-5xl"|	 /* 1024px */
"max-w-6xl"| /* 1152px */
"max-w-7xl"|	 /* 1280px */
"max-w-full"| 
"max-w-min"|	//"max-width: min-content;"|
"max-w-max"|	//"max-width:"| "max-content;"|
"max-w-fit"|//	"max-width: fit-content;"|
"max-w-prose"|	//"max-width: 65ch;"|
"max-w-screen-sm"|	//"max-width: 640px;"|
"max-w-screen-md"|//	"max-width: 768px;"|
"max-w-screen-lg"|//	"max-width: 1024px;"|
"max-w-screen-xl"|//	"max-width: 1280px;"|
"max-w-screen-2xl"  //max-width: 1536px