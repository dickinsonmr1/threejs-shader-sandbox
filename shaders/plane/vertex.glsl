
uniform float uTime;
uniform float uRadius;
uniform sampler2D uTexture;

varying vec3 vPosition;
varying vec3 vNormal;



varying vec2 vUv;

// adding flat disables interpolation (hard edges)
//flat varying vec2 vUv;

void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;
    // transform -> position, scale, rotation
    // modelMatrix -> position, scale, and rotation of model    
    // viewMatrix -> position and orientation of camera
    // projectionMatrix -> projects object onto the screen (aspect ratio and perspective)

    // projection * view * model * position
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 projectedPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectedPosition;

    //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}