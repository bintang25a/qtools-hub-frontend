export const formatedDate = (isoDate) => {
  const date = new Date(isoDate);

  if (!isoDate) {
    return "";
  }

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("id-ID", options);
};

export const formatedDateFull = (isoDate) => {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return date.toLocaleString("id-ID", options);
};
