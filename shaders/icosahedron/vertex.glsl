
uniform float uTime;

varying vec3 vPosition;

void main() {
    vPosition = position;
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