/**
 * Get a nested value at the given path. Returns undefined if any segment is missing.
 * @param {object} obj
 * @param {string[]} path
 * @returns {unknown}
 */
export function getIn(obj, path) {
    if (obj == null || !Array.isArray(path) || path.length === 0) return undefined;
    let current = obj;
    for (const key of path) {
        if (current == null) return undefined;
        current = current[key];
    }
    return current;
}
