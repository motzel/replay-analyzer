export const objSet = (obj, key, value, createKeys = true) => {
    const keys = key.split('.');
    const last = keys.pop();
    if (!last) return false;

    const startObj = obj || {};

    let current = startObj;
    for (const i of keys) {
        const propertyExists = current.hasOwnProperty(i);
        if (!propertyExists && !createKeys) return obj;

        if (!propertyExists || current[i] === null || current[i] === undefined) current[i] = {};

        current = current[i];
    }

    current[last] = value;

    return startObj;
}