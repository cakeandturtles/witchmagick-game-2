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

mat4.toInverseMat3 = function(a,b){
	var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],i=a[8],j=a[9],k=a[10],l=k*f-h*j,o=-k*g+h*i,m=j*g-f*i,n=c*l+d*o+e*m;
	if(!n)return null;
	n=1/n;b||(b=mat3.create());
	b[0]=l*n;
	b[1]=(-k*d+e*j)*n;
	b[2]=(h*d-e*f)*n;
	b[3]=o*n;
	b[4]=(k*c-e*i)*n;
	b[5]=(-h*c+e*g)*n;
	b[6]=m*n;
	b[7]=(-j*c+d*i)*n;
	b[8]=(f*c-d*g)*n;
	return b
};