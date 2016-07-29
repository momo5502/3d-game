uniform sampler2D map;
uniform vec3 color;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 vUv;
varying float vDarken;
varying vec2 shadowUv;

uniform sampler2D shadow;
uniform float globalTime;


void main()
{
    vec4 tex = texture2D(map, vUv);

    if (tex.w <= 0.55)
    {
        discard;
    }
    else
    {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(fogNear, fogFar, depth);

        vec4 shd = texture2D(shadow, shadowUv + vUv);
        float shadowAdd = 1.0;

        if (shd.x < 0.5)
        {
            shadowAdd = shd.x + vDarken;
        }

        // Fit the atmosphere
        // TODO: search better skybox, not cod4's downpour, to fit the environment
        //shadowAdd = 0.5;

        gl_FragColor = vec4(tex.xyz * color * shadowAdd * vDarken, 1.0);
        vec4 color = mix(gl_FragColor, vec4(fogColor, 1.0), fogFactor);
        gl_FragColor = vec4(color.xyz, tex.w);
    }
}
