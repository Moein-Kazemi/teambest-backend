export default function isObjectChanged(oldObj: any, newObj: any): boolean {
  // IF ONE OF THEM IS NULL.
  if (oldObj === null || newObj === null) return true;

  // IF THE TYPE IS DIFFERENCE.
  if (typeof oldObj !== typeof newObj) return true;

  // IF TWO INPUT VALUE ARE NOT OBJECT
  if (typeof oldObj !== "object") return oldObj !== newObj;

  // IF TWO INPUT VALUE ARE ARRAY
  if (Array.isArray(oldObj) !== Array.isArray(newObj)) return true;

  if (Array.isArray(oldObj)) {
    if (oldObj.length !== newObj.length) return true;
    for (let i = 0; i < oldObj.length; i++) {
      if (isObjectChanged(oldObj[i], newObj[i])) return true;
    }
    return false;
  }

  // IF THE OLDOBJ AND NEWOBJ ARE OBJECT
  const oldKeys = Object.keys(oldObj);
  const newKeys = Object.keys(newObj);

  // ADD PROPERTY
  if (oldKeys.length !== newKeys.length) return true;

  // CHECK THE VALUE OF THE KEYS
  for (const key of oldKeys) {
    if (!(key in newObj)) return true; // DELETE KEY
    if (isObjectChanged(oldObj[key], newObj[key])) return true; // CHECK IF THE VALUE ARE CHANGED
  }

  // CHECK IF THE ADDED KEYS
  for (const key of newKeys) {
    if (!(key in oldObj)) return true; // ADD KEY
  }

  return false;
}
