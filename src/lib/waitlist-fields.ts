export function nameError(value: string): string {
  const name = value.trim();
  if (!name) return "Please enter your name.";
  if (name.length > 100 || /[\r\n\x00-\x1f\x7f]/.test(name)) {
    return "Please enter a name of 100 characters or fewer.";
  }
  return "";
}

export function phoneError(value: string): string {
  const phone = value.trim();
  if (!phone) return "Please enter your phone number.";
  // Accept international or national formatting, including + and 00 prefixes.
  // This checks format only; it does not verify ownership or enroll anyone in SMS.
  const digits = phone.replace(/[ ().\-\u00a0\u202f]/g, "").replace(/^(?:\+|00)/, "");
  if (phone.length > 40 || !/^\+?[0-9 ().\u00a0\u202f-]+$/.test(phone) || !/^[0-9]{7,15}$/.test(digits)) {
    return "Enter a phone number with 7–15 digits. You can use a country code, spaces, parentheses or dashes.";
  }
  return "";
}
