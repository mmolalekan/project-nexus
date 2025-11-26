import plugin from "tailwindcss/plugin";

const tailwindPlugins = plugin(function ({ addUtilities, theme }) {
  const newUtilities = {
    ".flex-layout": {
      display: "flex",
    },
  };

  for (let i = 1; i <= 30; i++) {
    newUtilities[`.row-${i}`] = {
      display: "flex",
      flexDirection: "row",
      gap: `${i * 4}px`,
    };
    newUtilities[`.col-${i}`] = {
      display: "flex",
      flexDirection: "column",
      gap: `${i * 4}px`,
    };
  }

  // Generate dynamic fontName-textSize-fontWeight-textColor utilities
  const fontFamily = theme("fontFamily");
  const fontSize = theme("fontSize");
  const fontWeight = theme("fontWeight");
  const colors = theme("colors");

  Object.keys(fontFamily).forEach((font) => {
    Object.keys(fontSize).forEach((size) => {
      Object.keys(fontWeight).forEach((weight) => {
        Object.keys(colors).forEach((color) => {
          const colorVariants = colors[color];
          if (typeof colorVariants === "object") {
            Object.keys(colorVariants).forEach((shade) => {
              const className = `${font}-${size}-${weight}-${color}-${shade}`;
              newUtilities[`.${className}`] = {
                fontFamily: fontFamily[font],
                fontSize: fontSize[size],
                fontWeight: fontWeight[weight],
                color: colorVariants[shade],
              };
            });
          } else {
            const className = `${font}-${size}-${weight}-${color}`;
            newUtilities[`.${className}`] = {
              fontFamily: fontFamily[font],
              fontSize: fontSize[size],
              fontWeight: fontWeight[weight],
              color: colorVariants,
            };
          }
        });
      });
    });
  });

  addUtilities(newUtilities, ["responsive", "hover"]);
});

export default tailwindPlugins;