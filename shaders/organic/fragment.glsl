
uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplacement;

void main() {
    //vec3 coords = vNormal;
    //coords.y += uTime;
    //vec3 noisePattern = vec3(noise(coords));
    //float pattern = wave(noisePattern);

    //gl_FragColor = vec4(vec3(step(0.5, mod(uv.y * 10.0, 1.0))), 1);
    gl_FragColor = vec4(vec3(0.1, 0.3, 0.8), 1);
}