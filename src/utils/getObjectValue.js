export default function getObjectValue(obj, path, defaultValue) {
  // Check if the path contains a separator
  if (!path.includes(".")) {
    // If no separator found, directly access the property
    return obj[path] !== undefined && obj[path] !== null
      ? obj[path]
      : defaultValue
      ? defaultValue
      : null;
  }
  // Split the path by dot
  const keys = path.split(".");

  // Initialize result with the object
  let result = obj;

  // Traverse each key in the path
  for (const key of keys) {
    if (result !== null && result !== undefined && typeof result === "object") {
      // If the key exists in the current result, update result with its value
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result = result[key];
      } else {
        // If the key doesn't exist, return undefined
        return defaultValue ? defaultValue : null;
      }
    } else {
      return defaultValue ? defaultValue : null;
    }
  }

  // Return the final result
  return result !== undefined && result !== null
    ? result
    : defaultValue
    ? defaultValue
    : null;
}
