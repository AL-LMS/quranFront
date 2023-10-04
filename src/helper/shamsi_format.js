export function shamsi_format(date) {
  let x = date.split("-");
  return x[0] + "/" + x[1] + "/" + x[2];
}
