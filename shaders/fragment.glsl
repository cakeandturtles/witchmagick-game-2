precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vVertexColor;
varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying vec3 originalVPosition;

//uniform vec3 uAmbientColor;
//uniform vec3 uPointLightingLocation;
//uniform vec3 uPointLightingColor;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void) {
	vec4 fragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)) * vec4(vVertexColor.rgb, 1.0);			
	fragColor = vec4(fragColor.rgb, fragColor.a * uAlpha);
	
	vec3 uPointLightingLocation = vec3(0.0, 0.0, 5.0);
	vec3 uPointLightingColor = vec3(1.0, 1.0, 1.0);
	vec3 uAmbientColor = vec3(0.8, 0.8, 0.8);
	
	vec3 lightDirection = normalize(uPointLightingLocation - vPosition.xyz);
	lightDirection = vec3(0.0, 0.0, 1.0);
	float directionalLightWeighting = max(dot(normalize(vTransformedNormal), lightDirection), 0.0);
	vec3 lightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;
	
	gl_FragColor = vec4(fragColor.rgb, fragColor.a);
}