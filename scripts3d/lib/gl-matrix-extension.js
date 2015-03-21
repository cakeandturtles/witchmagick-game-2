/**
 * vec3.min(a, b[, dest]) -> vec3
 * – a (vec3): first vector
 * – b (vec3): second vector
 * – dest (vec3): optional destination vector
 *
 * Stores the minimum value for each element of a and b
 * within dest. If dest is omitted, a new vec3 is created.
 **/
vec3.min = function(a, b, dest) {
        if (!dest) dest = vec3.create();
        dest[0] = Math.min(a[0], b[0]);
        dest[1] = Math.min(a[1], b[1]);
        dest[2] = Math.min(a[2], b[2]);
        return dest;
};
/**
 * vec3.max(a, b[, dest]) -> vec3
 * – a (vec3): first vector
 * – b (vec3): second vector
 * – dest (vec3): optional destination vector
 *
 * Stores the maximum value for each element of a and b
 * within dest. If dest is omitted, a new vec3 is created.
 **/
vec3.max = function(a, b, dest) {
        if (!dest) dest = vec3.create();
        dest[0] = Math.max(a[0], b[0]);
        dest[1] = Math.max(a[1], b[1]);
        dest[2] = Math.max(a[2], b[2]);
        return dest;
};