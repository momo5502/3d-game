uniform float globalTime;

			varying vec2 vUv;
			varying float vDarken;
			varying vec2 shadowUv;

			void main() {

				vUv = uv*2.0;

				vDarken = min( max( 0.35, (position.y-10.0)/10.0 ), 1.5);

				vec3 animated = position;

				animated.x += sin(position.z*1.4+globalTime)*0.25;
				animated.z += cos(position.x*1.8+globalTime)*0.25;

				vec4 mvPosition = modelViewMatrix * vec4( animated, 1.0 );

				gl_Position = projectionMatrix * mvPosition;

				vec2 size = vec2(36.0, 36.0);
				shadowUv = vec2((position.x+cos(position.z*1.4+globalTime)*2.85)/size.x, (position.z+sin(position.x*1.8+globalTime)*2.85)/size.y)*1.0;
