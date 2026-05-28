export const formatedDate = (isoDate) => {
  const date = new Date(isoDate);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("id-ID", options);
};
