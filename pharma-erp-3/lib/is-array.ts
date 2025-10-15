// Replaced any with unknown as the input parameter type. This is a better practice because:
// unknown is the type-safe counterpart of any
// It forces type checking before using the value
// It's more explicit about the fact that we don't know the type of the inpu

// export function isArrayOfNumbers(arr: any): arr is number[] {
export function isArrayOfNumbers(arr: unknown): arr is number[] {
  if (!Array.isArray(arr)) return false;
  return arr.every((item) => typeof item === "number");
}

export function isArrayOfDates(arr: unknown): arr is Date[] {
  if (!Array.isArray(arr)) return false;
  return arr.every((item) => item instanceof Date);
}

export function isArrayOfStrings(arr: unknown): arr is string[] {
  if (!Array.isArray(arr)) return false;
  return arr.every((item) => typeof item === "string");
}

export function isArrayOfBooleans(arr: unknown): arr is boolean[] {
  if (!Array.isArray(arr)) return false;
  return arr.every((item) => typeof item === "boolean");
}
