			uniform vec3 color;
			uniform sampler2D texture;

			void main() {

				vec4 outColor = texture2D( texture, gl_PointCoord );

				gl_FragColor = vec4(outColor.xyz*color, outColor.x*0.5);
				gl_FragColor.w *= pow( gl_FragCoord.z, 50.0 );

			}