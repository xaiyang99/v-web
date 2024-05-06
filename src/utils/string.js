//automatically parse and replace HTML entities
export const decodeHtmlEntities = (encodedString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(encodedString, "text/html");
  return doc.documentElement.textContent;
};
