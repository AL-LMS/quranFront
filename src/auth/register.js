export const registerAuth =  (data) => {
  const errors = {};
  if (!data.first_name) {
    errors.first_name = "نام اجباری است";
  } else {
    delete errors.first_name;
  }
  if (!data.last_name) {
    errors.last_name = "نام خانوادگی اجباری است";
  } else {
    delete errors.last_name;
  }
  if (!data.phone) {
    errors.phone = "شماره همراه ضروری است";
  } else if (
    !/^(?:0|98|\+98|\+980|0098|098|00980)?(9\d{9})$/.test(data.phone)
  ) {
    errors.phone = "شماره موبایل وارد شده صحیح نیست";
  } else {
    delete errors.phone;
  }
  return errors;
};

export const registerAuth222222 = (data) => {
  const errors = {};
  if (!data.first_name) {
    errors.first_name = "نام اجباری است";
  } else {
    delete errors.first_name;
  }
  if (!data.last_name) {
    errors.last_name = "نام خانوادگی اجباری است";
  } else {
    delete errors.last_name;
  }
  if (!data.phone) {
    errors.phone = "شماره همراه ضروری است";
  } else if (
    !/^(?:0|98|\+98|\+980|0098|098|00980)?(9\d{9})$/.test(data.phone)
  ) {
    errors.phone = "شماره موبایل وارد شده صحیح نیست";
  } else {
    delete errors.phone;
  }
  if (!data.national_code) {
    errors.national_code = "کدملی ضروری است";
  } else if (!/^([0-9]){10}$/.test(data.national_code)) {
    errors.national_code = "کد ملی وارد شده صحیح نیست";
  } else {
    delete errors.national_code;
  }
  if (!data.birth) {
    errors.birth = "تاریخ تولد ضروری است";
  } else {
    delete errors.birth;
  }
  if (!data.departement) {
    errors.departement = "رشته تحصیلی ضروری است";
  } else {
    delete errors.departement;
  }
  if (!data.grade) {
    errors.grade = "مقطع تحصیلی ضروری است";
  } else {
    delete errors.grade;
  }
  if (!data.school) {
    errors.school = "نام مدرسه ضروری است";
  } else {
    delete errors.school;
  }
  if (!data.gavrage) {
    errors.gavrage = "معدل کل ضروری است";
  } else {
    delete errors.gavrage;
  }
  if (!data.parent_name) {
    errors.parent_name = "نام پدر ضروری است";
  } else {
    delete errors.parent_name;
  }
  if (!data.parent_phone) {
    errors.parent_phone = "شماره همراه ولی ضروری است";
  } else if (
    !/^(?:0|98|\+98|\+980|0098|098|00980)?(9\d{9})$/.test(data.parent_phone)
  ) {
    errors.parent_phone = "شماره موبایل وارد شده صحیح نیست";
  } else {
    delete errors.parent_phone;
  }
  if (!data.address) {
    errors.address = "آدرس ضروری است";
  } else {
    delete errors.address;
  }
  if (!data.picture) {
    errors.picture = "test";
  } else {
    delete errors.picture;
  }
  if (!data.policy) {
    errors.policy = "لطفا قوانین و مقررات را خوانده واین قسمت را علامت بزنید";
  } else {
    delete errors.policy;
  }
  if (!data.picture) {
    errors.picture = "تصویر کارت ملی یا شناسنامه ضروری است";
  } else {
    delete errors.picture;
  }

  return errors;
};
