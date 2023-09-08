import moment from "jalali-moment";

export const convertToPersianDate = (isoDate) => {
  const gregorianDate = moment(isoDate, "YYYY-MM-DD");
  console.log(gregorianDate);
  const persianDate = gregorianDate.format("jYYYY-jMM-jDD");
  console.log(persianDate);
  return persianDate;
};
