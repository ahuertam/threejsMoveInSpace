uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

attribute vec3 position;
attribute vec2 uv;

varying float vElevation;
varying vec2 vUV;

void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.z * 0.3) * sin(modelPosition.x * 0.4) * 1.0;
  modelPosition.y += elevation;

  vElevation=elevation;
  vUV=uv;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition; 
}