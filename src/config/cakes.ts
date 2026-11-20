export type CakeFlavor = "mango" | "chocolate" | "butterscotch" | "vanilla" | "black-forest" | "red-velvet";
export type CakeShape = "round" | "heart" | "square" | "rectangular";
export type CakeTiers = 1 | 2 | 3;
export type CakeCandles = 1 | 2 | 3;
export type PetalCount = 36 | 72 | 108;

export const cakeShapes: { id: CakeShape; name: string; icon: string; description: string }[] = [
  { id: "round", name: "Round", icon: "●", description: "A timeless celebration classic" },
  { id: "heart", name: "Heart", icon: "♥", description: "Made with extra love" },
  { id: "square", name: "Square", icon: "■", description: "Neat and modern" },
  { id: "rectangular", name: "Rectangular", icon: "▬", description: "Perfect for sharing" },
];

export const cakeTierChoices: { id: CakeTiers; name: string; description: string }[] = [
  { id: 1, name: "One stage", description: "Single-stage cake" },
  { id: 2, name: "Two stages", description: "A little more grand" },
  { id: 3, name: "Three stages", description: "The full celebration" },
];

export const cakeCandleChoices: { id: CakeCandles; name: string }[] = [
  { id: 1, name: "One candle" },
  { id: 2, name: "Two candles" },
  { id: 3, name: "Three candles" },
];

export const petalChoices: { id: PetalCount; name: string; description: string }[] = [
  { id: 36, name: "Light", description: "A delicate scatter" },
  { id: 72, name: "Romantic", description: "A generous ring" },
  { id: 108, name: "Lush", description: "A full petal moment" },
];

export const cakeChoices: { id: CakeFlavor; name: string; description: string; icon: string; swatch: string; frosting: string; filling: string }[] = [
  { id: "mango", name: "Mango Cake", description: "Sunny mango frosting with fresh fruit.", icon: "🥭", swatch: "linear-gradient(135deg, #ffc94f, #ff8e32)", frosting: "#ffc34f", filling: "#ff8a2d" },
  { id: "chocolate", name: "Chocolate Cake", description: "Rich cocoa layers with chocolate curls.", icon: "🍫", swatch: "linear-gradient(135deg, #7d3e24, #32150f)", frosting: "#64301d", filling: "#2d130e" },
  { id: "butterscotch", name: "Butterscotch Cake", description: "Golden caramel frosting and butterscotch chips.", icon: "🍯", swatch: "linear-gradient(135deg, #f3bb55, #a85f20)", frosting: "#e8a64d", filling: "#95501f" },
  { id: "vanilla", name: "Vanilla Cake", description: "Classic vanilla cream with rainbow sprinkles.", icon: "🌼", swatch: "linear-gradient(135deg, #fff5cf, #eacb91)", frosting: "#fff0c9", filling: "#dfa867" },
  { id: "black-forest", name: "Black Forest", description: "Chocolate, cream, and bright cherries.", icon: "🍒", swatch: "linear-gradient(135deg, #351412, #a31531)", frosting: "#3b1818", filling: "#fff2df" },
  { id: "red-velvet", name: "Red Velvet Cake", description: "Velvety crimson layers with cream-cheese frosting.", icon: "❤️", swatch: "linear-gradient(135deg, #d94155, #6e1024)", frosting: "#b91f3c", filling: "#fff3e5" },
];
