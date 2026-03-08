const truncateText = (text, charlimit) => {
  if (text?.length > charlimit) {
    return text.slice(0, charlimit) + "...";
  }
  return text;
};

export default truncateText;
