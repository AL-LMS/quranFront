import moment from "jalali-moment";

export const convertToPersianDate = (isoDate) => {
  const gregorianDate = moment(isoDate, "YYYY-MM-DD");
  const persianDate = gregorianDate.format("jYYYY-jMM-jDD");
  return persianDate;
};
