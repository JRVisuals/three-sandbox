
#extension GL_OES_standard_derivatives:enable

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_position;
varying vec4 v_normal;
varying vec2 v_texcoord;
varying vec4 v_color;

uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_normalMatrix;
uniform vec2 u_resolution;
uniform float u_time;

#if defined(VERTEX)

// attribute vec4 a_position; // myfolder/myfile.obj
attribute vec4 a_position;
attribute vec4 a_normal;
attribute vec2 a_texcoord;
attribute vec4 a_color;

void main(void){
    v_position=u_projectionMatrix*u_modelViewMatrix*a_position;
    v_normal=u_normalMatrix*a_normal;
    v_texcoord=a_texcoord;
    v_color=a_color;
    gl_Position=v_position;
}

#else// fragment shader

uniform vec2 u_mouse;
uniform vec2 u_pos;
// uniform sampler2D u_texture; // https://cdn.jsdelivr.net/gh/actarian/plausible-brdf-shader/textures/mars/4096x2048/diffuse.jpg?repeat=true
// uniform vec2 u_textureResolution;

float checker(vec2 uv,float repeats){
    float cx=floor(repeats*uv.x);
    float cy=floor(repeats*uv.y);
    float result=mod(cx+cy,2.);
    return sign(result);
}

float OctDist(vec2 p){
    // absolute values will "unfold" across the axes
    p=abs(p);
    
    // the dot product of our uv and our angled side ratio (1.,1. is 45')
    float c=dot(p,normalize(vec2(1.,1.)));
    
    // taking the max of the x and y will give us our vertical and horizontal interesctions
    c=max(c,p.x);
    c=max(c,p.y);
    
    return c;
}

float CornerDist(vec2 uv,float x,float y){
    float c=dot(uv,normalize(vec2(x,y)));
    return c;
}

vec2 Tile(vec2 p,float zoom){
    p*=zoom;
    return fract(p);
}

vec2 rotate2D(vec2 p,float a){
    p-=.5;
    p=mat2(cos(a),-sin(a),
    sin(a),cos(a))*p;
    p+=.5;
    return p;
}

vec3 BasePattern(vec2 uv){
    vec3 color;
    // octagon
    float octagon=OctDist(uv);
    
    // corner wedge
    float cornerA=CornerDist(uv,1.,1.);
    float cornerB=CornerDist(uv,-1.,1.);
    float cornerC=CornerDist(uv,-1.,-1.);
    float cornerD=CornerDist(uv,1.,-1.);
    
    // step
    color+=step(octagon,.45)*.05;// fill
    //color-=step(octagon,.47)*.05;// cut
    
    color+=step(cornerA,-.55)*.15;
    color+=step(cornerB,-.55)*.15;
    color+=step(cornerC,-.55)*.15;
    color+=step(cornerD,-.55)*.15;
    
    return color;
}

void main(){
    // position of fragment (same as fragCoord on shadertoy)
    vec2 pos=v_texcoord;
    
    vec3 ambient=vec3(.4);
    vec3 direction=vec3(0.,1.,1.);
    vec3 lightColor=vec3(1.);
    float incidence=max(dot(v_normal.xyz,direction),-1.);
    vec3 light=clamp(ambient+lightColor*incidence,0.,1.);
    
    vec3 color;
    vec2 uv;
    vec2 uv1;
    
    // default checker pattern
    //color=(.2*checker(pos,8.)+v_normal.rgb);
    color=vec3(.0,.184,.329);
    //color=vec3(.5,.0,.0);
    //color=vec3(.0,.5,.0);
    //color=vec3(.65,.45,.0);
    
    // Time based translation for movement
    float aTime=u_time;
    float hamplitude=.25;
    float vspeed=.15;
    float hspeed=.35;
    
    vec2 translate=vec2(hamplitude*(sin(aTime*hspeed)),(-aTime*vspeed));
    uv=pos;
    uv+=translate;
    
    float bTime=u_time-.05;
    float hamplitude1=.25;
    float vspeed1=.15;
    float hspeed1=.35;
    vec2 translate1=vec2(hamplitude1*(sin(bTime*hspeed1)),(-bTime*vspeed1));
    uv1=pos+(translate1);
    //uv1+=vec2(-.0025,.011);
    
    uv=rotate2D(uv,.8);
    uv1=rotate2D(uv1,.8);
    
    // Tiling
    uv*=12.;// number of tiles
    uv=fract(uv);
    
    uv1*=12.;
    uv1=fract(uv1);
    
    // center folds
    
    uv=(uv-(.5*u_resolution.xy/u_resolution.xy));
    
    uv1=(uv1-(.5*u_resolution.xy/u_resolution.xy));
    
    color+=BasePattern(uv);
    color-=BasePattern(uv1)*.5;
    
    gl_FragColor=vec4(color*light,1.);
}

#endif
