attribute float time;
attribute vec2 uvScale;
attribute vec3 customColor;

uniform float globalTime;
uniform vec2 size;
varying vec2 vUv;
varying vec2 shadowUv;

varying vec3 vColor;
varying float vDarken;
varying float vAlpha;

void main()
{
    vColor = customColor;

    vec3 pos = position;

    // time
    float localTime = time + globalTime * 0.01;
    float modTime = mod(localTime, 1.0);
    float accTime = modTime * modTime;

    pos.x += (cos(globalTime + pos.x * 0.001) * pos.y * 0.1) - pow(pos.y * 0.1, 1.5);
    //pos.z += (accTime)*1500.0;
    pos.z += sin(globalTime + pos.x * 0.01) * (pos.y * 0.2);

    vAlpha = 1.0; //min( 1.0, accTime*10.0 );
    vDarken = 1.0;

    if (pos.y <= 5.0)
    {
        vDarken = 0.25 + pos.y / 20.0;
    }

    vUv = uvScale * uv;
    shadowUv = vec2(position.x / size.x, position.z / size.y) * 0.75;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    mvPosition.z -= (pos.y * 0.2) * 2.0;

    gl_Position = projectionMatrix * mvPosition;
}
