function createShadow() {
  return "box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05)";
}

const shadows = [
  "none",
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
];

export const baseShadow = {
  primary: "rgb(0 0 0 / 11%) 0px 2px 6px",
  secondary: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
};

export default shadows;
