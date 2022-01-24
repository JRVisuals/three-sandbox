import * as THREE from 'three';

/**
 * Full-screen textured quad shader
 */

var SparkShader = {
  uniforms: {
    tDiffuse: { value: null },
    opacity: { value: 1.0 },
    u_active: { type: 'bool', value: false },
    u_time: { type: 'f', value: 1.0 },
    u_resolution: { type: 'v2', value: new THREE.Vector2() },
    u_pos: { type: 'v2', value: new THREE.Vector2() },
    u_color: { type: 'v3', value: { r: 1, g: 1, b: 1 } },
    u_str: { type: 'f', value: 0.09 }, //0.01 hi / 0.08 low
    u_spd: { type: 'f', value: 3.0 },
  },

  vertexShader: /* glsl */ `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `

/**
 *  Common Code from ShaderToy
*/

/**
 *  Spark Shader ----------------------------
*/

    uniform float opacity;
		uniform sampler2D tDiffuse;
    
    uniform bool u_active;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_pos;
    uniform vec3 u_color;
    uniform float u_str;
    uniform float u_spd;

		varying vec2 vUv;

      
    /**
     * Common Functions from ShaderToy example
     * 
     * https://www.shadertoy.com/view/XlGcRh
     * https://www.pcg-random.org/
     * 
     */
    
    uint pcg(uint v)
    {
      uint state = v * 747796405u + 2891336453u;
      uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
      return (word >> 22u) ^ word;
    }

    uvec2 pcg2d(uvec2 v)
    {
        v = v * 1664525u + 1013904223u;

        v.x += v.y * 1664525u;
        v.y += v.x * 1664525u;

        v = v ^ (v>>16u);

        v.x += v.y * 1664525u;
        v.y += v.x * 1664525u;

        v = v ^ (v>>16u);

        return v;
    }

    // http://www.jcgt.org/published/0009/03/02/
    uvec3 pcg3d(uvec3 v) {

        v = v * 1664525u + 1013904223u;

        v.x += v.y*v.z;
        v.y += v.z*v.x;
        v.z += v.x*v.y;

        v ^= v >> 16u;

        v.x += v.y*v.z;
        v.y += v.z*v.x;
        v.z += v.x*v.y;

        return v;
    }


    float hash11(float p) {
        return float(pcg(uint(p)))/4294967296.;
    }

    vec2 hash21(float p) {
        return vec2(pcg2d(uvec2(p, 0)))/4294967296.;
    }

    vec3 hash33(vec3 p3) {
        return vec3(pcg3d(uvec3(p3)))/4294967296.;
    }

    vec3 sampleSplit(sampler2D tex, vec2 coord)
    {
      vec3 frag;
      frag.r = texture(tex, vec2(coord.x, coord.y)).r;
      frag.g = texture(tex, vec2(coord.x, coord.y)).g;
      frag.b = texture(tex, vec2(coord.x, coord.y)).b;
      return frag;
    }

    /**
     * Main --------
     * 
     */

		void main() {

      

      float c0 = 0., c1 = 0.;
      float numSpark = 6.;


      for(float i = 0.; i < numSpark; ++i) {
        
        float t = u_spd*u_time + hash11(i);

        vec2 v = hash21(i + 90.*floor(t));
        t = fract(t);
        v = vec2(sqrt(-8.*log(1.-v.x)), 12.283185*v.y);
        v = 50.*v.x*vec2(cos(v.y), sin(v.y));

        vec2 mousePos = vec2 (u_pos.x, u_pos.y);

        vec2 p = mousePos + t*v - gl_FragCoord.xy;
        c0 += 20.*(1.-t)/(1. + u_str*dot(p,p));

        p = p.yx;
        v = v.yx;
        p = vec2(
            p.x/v.x,
            p.y - p.x/v.x*v.y
        );

        float a = abs(p.x) < 0.1 ? 200./abs(v.x) : 0.0;
        float b0 = max(6. - abs(p.y), 0.);
        float b1 = 0.4/(1.+0.001*p.y*p.y);
        c0 += (2.-t)*b0*a;
        c1 += (1.-t)*b1*a;

    }

       vec3 rgb = c0*u_color + c1*u_color;
      rgb = pow(rgb, vec3(0.5));

      vec4 color = vec4(rgb.r, rgb.g, rgb.b,1.0);

      vec4 texel = texture2D( tDiffuse, vUv );

      if(u_active){
        gl_FragColor = vec4(texel.r + color.r, texel.g + color.g, texel.b + color.b, texel.a);
      }else{
        gl_FragColor = texel;
      } 
			

    }



  `,
};

export { SparkShader };
