varying vec3 vPosition;
varying vec3 vNormal;

uniform float uRadius;
uniform sampler2D uTexture;

varying vec2 vUv;

// adding flat disables interpolation (hard edges)
//flat varying vec2 vUv;

float drawCircle(vec2 position, vec2 center, float radius) {
    // distance < 0: inside object
    // distance == 0: on object
    // distance > 0: outside object
    return step(radius, distance(position, center));
    //return distance(position, center);
}

float sdBox2(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

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
    //gl_FragColor = vec4(vec3(step(uRadius, length(vUv - 0.5))), 1.0);
    
    //gl_FragColor = vec4(vec3(drawCircle(vUv, vec2(0.5), uRadius)), 1);
    
    // noise
    //gl_FragColor = vec4(vec3(noise(vPosition * 20.0)), 1.0);

    // image
    //vec4 color = texture2D(uTexture, vUv);
    //gl_FragColor = vec4(color.xyz, 1.0);

    // desaturated image (black and white)
    const vec3 DESATURATE = vec3(0.2126, 0.7152, 0.0722);
    vec3 color = texture2D(uTexture, vUv).xyz;
    float finalColor = dot(DESATURATE, color);    
    gl_FragColor = vec4(vec3(finalColor), 1.0);

}