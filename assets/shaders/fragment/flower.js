uniform vec3 color;
			uniform sampler2D texture;
			uniform float globalTime;

			varying vec2 vUv;

			uniform vec3 fogColor;
			uniform float fogNear;
			uniform float fogFar;

			const float threshold = 0.5;

			varying float vDarken;
			varying float vAlpha;

			void main() {

				vec4 textureColor = texture2D(texture, vUv);

				if (textureColor.w < threshold) {
					discard;

				} else {

				float depth = gl_FragCoord.z / gl_FragCoord.w;
				float fogFactor = smoothstep( fogNear, fogFar, depth );

				gl_FragColor = textureColor * vec4(color.xyz, 1.0);

				vec4 color = mix( gl_FragColor, vec4( fogColor, 1.0 ), fogFactor );
				gl_FragColor = vec4( color.xyz*vDarken , textureColor.w*vAlpha );

				}




			}
