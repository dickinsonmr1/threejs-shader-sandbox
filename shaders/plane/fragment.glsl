varying vec3 vPosition;
varying vec3 vNormal;

uniform float uRadius;

varying vec2 vUv;

// adding flat disables interpolation (hard edges)
//flat varying vec2 vUv;

void main() {    

    // template: gl_FragColor = vec4(vec3()), 1.0);    

    //gl_FragColor = vec4(vPosition, 1.0);
    //gl_FragColor = vec4(vNormal, 1.0);
    //gl_FragColor = vec4(vUv, 0, 1.0);
    
    // interpolation: all the same
    //gl_FragColor = vec4(vUv.xxx, 1.0);
    //gl_FragColor = vec4(vUv.rrr, 1.0);    
    //gl_FragColor = vec4(mix(vec3(0), vec3(1), vUv.x), 1.0);

    //gl_FragColor = vec4(vec3(pow(vUv.x, 2.0)), 1.0);    
    
    // step: provides a hard edge
    //  - equivalent in js: return uV.x >= edge ? 1 : 0;
    //gl_FragColor = vec4(vec3(step(0.5, vUv.x)), 1.0);    

    // smoothstep: provides a smooth edge/transition within min and max
    //gl_FragColor = vec4(vec3(smoothstep(0.15, 0.55, vUv.x)), 1.0);    

    // length
    vec2 uv = vUv;
    uv -= vec2(0.5);
    uv *= 2.0;    

    //gl_FragColor = vec4(vec3(length(uv)), 1.0);    
    //gl_FragColor = vec4(vec3(step(uRadius, length(uv))), 1.0);    
    
    // fract: x - floor(x)
    //gl_FragColor = vec4(vec3(fract(vUv.x * 10.0)), 1.0);    
    //gl_FragColor = vec4(vec3(step(0.5, fract(vUv.x * 10.0))), 1.0);    

    // mod(1) = fract
    //gl_FragColor = vec4(vec3(step(0.5, mod(vUv.x * 10.0, 2.0))), 1.0);    

    // mix (lerp)
    //gl_FragColor = vec4(vec3(mix(0.0, 0.5, vUv.x)), 1.0);    

    // dot
    /*
    vec3 vectorA = vec3(1.0);
    vec3 vectorB = vec3(0.0);
    float dotProduct = dot(vectorA, vectorB);
    // a.x*b.x + a.y*b.y + a.z*b.z
    gl_FragColor = vec4(vec3(dotProduct), 1.0); 
    */

    //vec3 viewDirection = normalize(cameraPosition - vPosition);   
    //gl_FragColor = vec4(viewDirection, 1.0); 

    // patterns: line
    //gl_FragColor = vec4(vec3(1.0 - abs(vUv.x - 0.5)), 1.0);
    
    // vertical line
    //gl_FragColor = vec4(vec3(step(0.99, 1.0 - abs(vUv.x - 0.5))), 1.0);

    // horizontal line
    //gl_FragColor = vec4(vec3(step(0.99, 1.0 - abs(vUv.y - 0.5))), 1.0);

    // circle: step(uRadius, length(vUv - 0.5))
    gl_FragColor = vec4(vec3(step(uRadius, length(vUv - 0.5))), 1.0);
}