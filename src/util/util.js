export const convertFbTimeToDate = (val) => {
  const d = new Date(val.seconds * 1000);
  return d;
};

export const isDatePast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

export const isDateWithInAWeek = (date) => {
  const today = new Date();
  const seventhDay = new Date();
  seventhDay.setDate(today.getDate() + 7);
  today.setHours(0, 0, 0, 0);
  seventhDay.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date >= today && date < seventhDay;
};