const CUTTING_EXPRESSION = /\s+[^\s]*$/;

const createShortcut = (text, limit) => {
  if (text.length > limit) {
    const part = text.slice(0, limit);
    if (part.match(CUTTING_EXPRESSION)) {
      return part.replace(CUTTING_EXPRESSION, "...");
    }
    return part + "...";
  }
  return text;
};

export const LimitCharactor = ({ text, limit }) => {
  const shortcut = createShortcut(text, limit);
  return <span title={text}>{shortcut}</span>;
};

export function cutFileName(fileName, maxLength = 10) {
  const extension = fileName.split(".").pop();
  const nameWithoutExtension = fileName.replace(`.${extension}`, "");
  if (nameWithoutExtension.length <= maxLength) return fileName;
  return `${nameWithoutExtension.slice(0, maxLength)}...${extension}`;
}

export function limitContent(fileName, maxLength) {
  let truncatedText = "";
  if (fileName.length > maxLength) {
    truncatedText = fileName.substr(0, maxLength) + "...";
  } else {
    truncatedText = fileName.substr(0, maxLength);
  }
  return truncatedText;
}

// const extension = fileName.split(".").pop();
// const nameWithoutExtension = fileName.replace(`.${extension}`, "");
// if (nameWithoutExtension.length <= maxLength) return fileName;
// return `${nameWithoutExtension.slice(0, maxLength)}...${extension}`;
