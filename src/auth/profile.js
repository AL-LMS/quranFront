export const profileAuth = (data) => {
  const errors = {};
  if (!data.national_code) {
    errors.national_code = "کدملی ضروری است";
  } else if (!/^([0-9]){10}$/.test(data.national_code)) {
    errors.national_code = "کد ملی وارد شده صحیح نیست";
  } else {
    delete errors.national_code;
  }
  if (!data.department) {
    errors.department = "رشته تحصیلی ضروری است";
  } else {
    delete errors.department;
  }
  if (!data.grade) {
    errors.grade = "مقطع تحصیلی ضروری است";
  } else {
    delete errors.grade;
  }

  return errors;
};
