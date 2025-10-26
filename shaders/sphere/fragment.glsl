varying vec3 vPosition;
varying vec3 vNormal;

uniform float uRadius;

varying vec2 vUv;

// adding flat disables interpolation (hard edges)
//flat varying vec2 vUv;

void main() {    

    // template: gl_FragColor = vec4(vec3()), 1.0);    

    // idea for shield in game?
    vec3 viewDirection = normalize(cameraPosition - vPosition);   
    float fresnel = 1.0 - dot(viewDirection, vNormal);
    gl_FragColor = vec4(vec3(fresnel), 1.0); 
}