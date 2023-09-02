import moment from "jalali-moment";

export const convertToPersianDate = (isoDate) => {
  const gregorianDate = moment(isoDate, "YYYY-MM-DDTHH:mm:ss.SSSZ");
  const persianDate = gregorianDate.format("jYYYY-jMM-jDD HH:mm:ss");
  return persianDate;
};
