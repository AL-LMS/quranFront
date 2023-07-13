export const authPass = (data) => {
  const errors = {};
  if (data.password !== data.repetition_pass) {
    errors.repetition_pass = "رمزعبور مطابقت ندارد";
  } else {
    delete errors.repetition_pass;
  }
  return errors;
};
