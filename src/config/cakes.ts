export type CakeFlavor = "mango" | "chocolate" | "butterscotch" | "vanilla" | "black-forest" | "red-velvet";

export const cakeChoices: { id: CakeFlavor; name: string; description: string; icon: string; swatch: string; frosting: string; filling: string }[] = [
  { id: "mango", name: "Mango Cake", description: "Sunny mango frosting with fresh fruit.", icon: "🥭", swatch: "linear-gradient(135deg, #ffc94f, #ff8e32)", frosting: "#ffc34f", filling: "#ff8a2d" },
  { id: "chocolate", name: "Chocolate Cake", description: "Rich cocoa layers with chocolate curls.", icon: "🍫", swatch: "linear-gradient(135deg, #7d3e24, #32150f)", frosting: "#64301d", filling: "#2d130e" },
  { id: "butterscotch", name: "Butterscotch Cake", description: "Golden caramel frosting and butterscotch chips.", icon: "🍯", swatch: "linear-gradient(135deg, #f3bb55, #a85f20)", frosting: "#e8a64d", filling: "#95501f" },
  { id: "vanilla", name: "Vanilla Cake", description: "Classic vanilla cream with rainbow sprinkles.", icon: "🌼", swatch: "linear-gradient(135deg, #fff5cf, #eacb91)", frosting: "#fff0c9", filling: "#dfa867" },
  { id: "black-forest", name: "Black Forest", description: "Chocolate, cream, and bright cherries.", icon: "🍒", swatch: "linear-gradient(135deg, #351412, #a31531)", frosting: "#3b1818", filling: "#fff2df" },
  { id: "red-velvet", name: "Red Velvet Cake", description: "Velvety crimson layers with cream-cheese frosting.", icon: "❤️", swatch: "linear-gradient(135deg, #d94155, #6e1024)", frosting: "#b91f3c", filling: "#fff3e5" },
];
