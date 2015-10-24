attribute float time;

			uniform float globalTime;
			uniform float darken;
			varying vec2 vUv;
			varying float vDarken;
			varying float vAlpha;

			void main() {

				vec3 pos = position;

				// time
				float localTime = time + globalTime*0.01;
				float modTime = mod( localTime, 1.0 );
				float accTime = modTime * modTime;

				pos.x += cos(globalTime+pos.x*0.01)*pos.y*0.05;

				//pos.z += (accTime)*1500.0;
				pos.z += sin(globalTime+pos.x*0.01)*pos.y*0.05;

				//vAlpha = min( 1.0, accTime*10.0 );
				vAlpha = 1.0;
				vDarken = 1.0;

				if (pos.y <= 5.0) {
					vDarken = darken;
				}

                vUv = uv;

				vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

				gl_Position = projectionMatrix * mvPosition;

			}