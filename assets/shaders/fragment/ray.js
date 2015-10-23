uniform vec3 color;
			uniform sampler2D texture;
			uniform float globalTime;

			varying vec2 vUv;
			varying float vAlpha;

			void main() {

				vec4 textureColor = texture2D(texture, vUv);
				gl_FragColor = vec4( textureColor.xyz*color.xyz, textureColor.w*vAlpha );
				gl_FragColor.w *= pow( gl_FragCoord.z, 50.0 );

			}