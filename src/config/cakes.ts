export type CakeFlavor = "mango" | "chocolate" | "butterscotch" | "vanilla" | "black-forest";

export const cakeChoices: { id: CakeFlavor; name: string; description: string; swatch: string; frosting: string; filling: string }[] = [
  { id: "mango", name: "Mango Cake", description: "Sunny mango frosting with fresh fruit.", swatch: "linear-gradient(135deg, #ffc94f, #ff8e32)", frosting: "#ffc34f", filling: "#ff8a2d" },
  { id: "chocolate", name: "Chocolate Cake", description: "Rich cocoa layers with chocolate curls.", swatch: "linear-gradient(135deg, #7d3e24, #32150f)", frosting: "#64301d", filling: "#2d130e" },
  { id: "butterscotch", name: "Butterstoch Cake", description: "Golden caramel frosting and butterscotch chips.", swatch: "linear-gradient(135deg, #f3bb55, #a85f20)", frosting: "#e8a64d", filling: "#95501f" },
  { id: "vanilla", name: "Vanilla Cake", description: "Classic vanilla cream with rainbow sprinkles.", swatch: "linear-gradient(135deg, #fff5cf, #eacb91)", frosting: "#fff0c9", filling: "#dfa867" },
  { id: "black-forest", name: "Black Forest", description: "Chocolate, cream, and bright cherries.", swatch: "linear-gradient(135deg, #351412, #a31531)", frosting: "#3b1818", filling: "#fff2df" },
];
