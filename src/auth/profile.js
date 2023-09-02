export const profileAuth = (data) => {
  const errors = {};
  if (!data.national_id) {
    errors.national_id = "کدملی ضروری است";
  } else if (!/^([0-9]){10}$/.test(data.national_id)) {
    errors.id = "کد ملی وارد شده صحیح نیست";
  } else {
    delete errors.national_id;
  }
  if (data.sex === "") {
    errors.sex = "جنسیت خود را انتخاب کنید";
  } else {
    delete errors.sex;
  }
  if (data.ages === "") {
    errors.ages = "رده سنی خود را انتخاب کنید";
  } else {
    delete errors.ages;
  }
  return errors;
};

export const profileAuthStudent = (data) => {
  const errors = {};
  if (!data.national_id) {
    errors.national_id = "کدملی ضروری است";
  } else if (!/^([0-9]){10}$/.test(data.national_id)) {
    errors.id = "کد ملی وارد شده صحیح نیست";
  } else {
    delete errors.national_id;
  }
  if (data.sex === "") {
    errors.sex = "جنسیت خود را انتخاب کنید";
  } else {
    delete errors.sex;
  }
  if (data.ages === "") {
    errors.ages = "رده سنی خود را انتخاب کنید";
  } else {
    delete errors.ages;
  }
  if (data.degree === "") {
    errors.degree = "تحصیلات خود را انتخاب کنید";
  } else {
    delete errors.degree;
  }
  return errors;
};
