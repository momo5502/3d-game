

			uniform vec3 color;
			uniform vec3 sunColor;
			uniform sampler2D texture;
			uniform sampler2D shadow;
			uniform float globalTime;

			varying vec3 vColor;
			varying vec2 vUv;
			varying vec2 shadowUv;
			varying float vAlpha;

			uniform vec3 fogColor;
			uniform float fogNear;
			uniform float fogFar;

			const float threshold = 0.1;

			varying float vDarken;

			void main() {

				vec4 textureColor = texture2D(texture, vUv);

				if (textureColor.w < threshold) {
					discard;

				} else {

				vec4 shadowColor1 = texture2D(shadow, vec2(shadowUv.x+sin(globalTime*0.2)*0.025, shadowUv.y+cos(globalTime*0.1)*0.025));
				vec4 shadowColor2 = texture2D(shadow, vec2(shadowUv.x+0.25+cos(globalTime*0.2)*0.025, shadowUv.y+0.25+sin(globalTime*0.05)*0.025));

				vec4 shadowColor = mix(shadowColor1, shadowColor2, 0.5)*1.5;

				float depth = gl_FragCoord.z / gl_FragCoord.w;
				float fogFactor = smoothstep( fogNear, fogFar, depth );

				gl_FragColor = mix(textureColor * vec4(color.xyz*vColor, 1.0), vec4(sunColor.xyz,1.0), pow(shadowColor.x,1.5));

				vec4 color = mix( gl_FragColor, vec4( fogColor, 1.0 ), fogFactor );
				gl_FragColor = vec4( color.xyz*vDarken , (textureColor.w*3.0)*vAlpha );

				}


			}

		