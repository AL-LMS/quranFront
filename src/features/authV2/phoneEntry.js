// The server owns canonical normalization. This only makes Persian/Arabic input usable.
export const v2DomesticPhonePattern = /^09[0-9]{9}$/;

export function toAsciiDigits(value) {
  return String(value ?? "")
    .replace(/[۰-۹]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 48))
    .replace(/[٠-٩]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x0660 + 48));
}

export function v2DomesticPhoneEntry(value) {
  const ascii = toAsciiDigits(value);
  // Never silently accept +98 or 0098 input. Keep invalid input visible for validation.
  if (/^(?:[0-9]+|\([0-9]+\))(?:[ -](?:[0-9]+|\([0-9]+\)))*$/.test(ascii) &&
      (ascii.match(/\(/g) || []).length <= 1) {
    return ascii.replace(/[() -]/g, "");
  }
  return ascii;
}
