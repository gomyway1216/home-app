export const convertFbTimeToDate = (val) => {
  const d = new Date(val.seconds * 1000);
  return d;
};
