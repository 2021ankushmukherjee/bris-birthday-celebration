export type CakeFlavor =
  | "mango"
  | "chocolate"
  | "butterscotch"
  | "vanilla"
  | "black-forest"
  | "red-velvet";

export type CakeShape = "round" | "heart" | "square" | "rectangular";
export type CakeTiers = 1 | 2 | 3;
export type CakeCandles = 1 | 2 | 3;
export type PetalCount = 36 | 72 | 108;

export interface CakeOption {
  id: CakeFlavor;
  name: string;
  description: string;
  icon: string;
  swatch: string;
  frosting: string;
  filling: string;
}

export interface CakeShapeOption {
  id: CakeShape;
  name: string;
  icon: string;
  description: string;
}

export interface CakeTierOption {
  id: CakeTiers;
  name: string;
  description: string;
}

export interface CakeCandleOption {
  id: CakeCandles;
  name: string;
}

export interface PetalOption {
  id: PetalCount;
  name: string;
  description: string;
}
