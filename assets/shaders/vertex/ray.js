attribute float time;

			uniform float globalTime;
			varying vec2 vUv;
			varying float vAlpha;

			void main() {

				vec3 pos = position;

				// time
				float localTime = time + globalTime*0.01;
				float modTime = mod( localTime, 1.0 );
				float accTime = modTime * modTime;

				pos.x += cos(accTime*60.0)*20.0;

				pos.z += (accTime)*1500.0;

				vAlpha = min( 1.0, accTime*10.0 ) * (0.3 + sin(accTime*80.0)*0.25);

                vUv = vec2(uv.x*2.0, uv.y);

				vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

				gl_Position = projectionMatrix * mvPosition;

			}