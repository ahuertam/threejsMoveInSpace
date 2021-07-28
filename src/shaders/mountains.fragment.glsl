precision mediump float;

uniform sampler2D grassTexture;
varying float vElevation;
varying vec2 vUV;

void main(){
  vec3 color1 = vec3(1.0);
  vec3 color2 = normalize(vec3(64.0, 168.0, 30.0));
  float combinationStregth = 0.25;
  vec3 combinedColors = mix(color2, color1, vElevation * combinationStregth);
  vec4 appliedTexture = texture2D(grassTexture, vUV);
  
  gl_FragColor = appliedTexture * vec4(combinedColors, 1.0);
}