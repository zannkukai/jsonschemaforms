/**
 * Fix order in JSONSchema
 * This re-order the object properties given a local defined
 * `propertiesOrder` property.
 * @param schema - object, the JSONSchema
 * @returns object, a fresh copy of the ordred JSONSchema
 */
export function orderedJsonSchema(schema) {
  if (schema.properties) {
    if (schema.propertiesOrder) {
      // copy the data
      schema._properties = { ...schema.properties };
      // new ordered properties
      schema.properties = {};
      // copy in the right order
      for (const property of schema.propertiesOrder) {
        schema.properties[property] = schema._properties[property];
      }
    }
    // recursion for objects
    for (const property of Object.keys(schema.properties)) {
      orderedJsonSchema(schema.properties[property]);
    }
  }
  // recursion for array
  if (schema.items) {
    orderedJsonSchema(schema.items);
  }
  return schema;
}

/**
 * Tell if a value can be considered as empty
 * @param value - any, the value to check
 * @returns boolean, true if the value is empty
 */
export function isEmpty(value) {
  return (
    // null or undefined
    value == null ||
    // has length and it's zero (array, string)
    (value.hasOwnProperty('length') && value.length === 0) ||
    // is an Object and has no keys
    (value instanceof Object && Object.keys(value).length === 0)
  );
}

/**
 * Recursively remove the empty values
 * @param data - object, the data to be cleaned
 * @returns object, a fresh copy of the clean data
 */
export function removeEmptyValues(data) {
  // array?
  if (data instanceof Array) {
    // new array with non empty values
    const newArray = [];
    for (const d of data) {
      // recursion
      const value = removeEmptyValues(d);
      if (!isEmpty(value)) {
        newArray.push(value);
      }
    }
    return newArray;
  }
  // object?
  if (data instanceof Object) {
    // new object with non empty values
    const newObject = {};
    for (const key of Object.keys(data)) {
      const value = removeEmptyValues(data[key]);
      if (!isEmpty(value)) {
        newObject[key] = value;
      }
    }
    return newObject;
  }
  return data;
}
