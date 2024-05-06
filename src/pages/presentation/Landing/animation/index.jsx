export const mapAnimation = {
  hidden: {
    opacity: 0,
    y: "50px",
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export const slideFromBottomAnimation = {
  hidden: {
    opacity: 0,
    y: "50px",
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 1,
      ease: "easeInOut",
    },
  },
};
