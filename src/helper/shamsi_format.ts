/** Formats the existing hyphen-separated date parts with slash separators. */
export function shamsi_format(date: string): string {
  const parts = date.split("-");
  return parts[0] + "/" + parts[1] + "/" + parts[2];
}
