export function checkHomeWorkDeadLine(date) {
  let date1 = new Date();
  var getYear = date1.toLocaleString("fa-IR-u-nu-latn", { year: "numeric" });
  var getMonth = date1.toLocaleString("fa-IR-u-nu-latn", { month: "2-digit" });
  var getDay = date1.toLocaleString("fa-IR-u-nu-latn", { day: "2-digit" });
  var dateToday = getYear + "-" + getMonth + "-" + getDay;
  if (date >= dateToday) {
    return false;
  } else {
    return true;
  }
}

export function checkQuizLine(date, start_time, end_time) {
  let date1 = new Date();
  var getYear = date1.toLocaleString("fa-IR-u-nu-latn", { year: "numeric" });
  var getMonth = date1.toLocaleString("fa-IR-u-nu-latn", { month: "2-digit" });
  var getDay = date1.toLocaleString("fa-IR-u-nu-latn", { day: "2-digit" });
  var getHour = date1.toLocaleString("fa-IR-u-nu-latn", { hour: "2-digit" });
  var getMinute = date1.toLocaleString("fa-IR-u-nu-latn", {
    minute: "2-digit",
  });
  var nowTime = getHour + ":" + getMinute;
  var dateToday = getYear + "-" + getMonth + "-" + getDay;
  if (date == dateToday) {
    if (start_time <= nowTime && end_time >= nowTime) {
      return 1;
    } else {
      return 2;
    }
  }
  if (date >= dateToday) {
    return 2;
  } else {
    return 0;
  }
}
