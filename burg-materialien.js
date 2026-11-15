// Seamless, meter-scaled surface detail for both meshes and instanced masonry.
export function burgMaterialien(THREE){
  function texture(style){
    const size=512;
    const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
    const context=canvas.getContext('2d');
    const image=context.createImageData(size,size);
    const grid=(x,y,n)=>{
      const rx=x*n/size,ry=y*n/size;
      const ix=Math.floor(rx),iy=Math.floor(ry);
      const smooth=t=>t*t*(3-2*t);
      const hash=(a,b)=>{
        const value=Math.sin((a%n)*127.1+(b%n)*311.7)*43758.5453;
        return value-Math.floor(value);
      };
      const a=smooth(rx-ix),b=smooth(ry-iy);
      return (hash(ix,iy)*(1-a)+hash(ix+1,iy)*a)*(1-b)+(hash(ix,iy+1)*(1-a)+hash(ix+1,iy+1)*a)*b;
    };
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const broad=grid(x,y,5), grain=grid(x,y,77), pores=grid(x,y,183);
      let value=177+49*broad+34*grid(x,y,19)+27*grain-39*Math.pow(pores,5);
      if(style==='oak')value=146+65*grid(x,y,10)+35*Math.sin(x/size*Math.PI*60+grid(x,y,4)*3)+20*grain;
      if(style==='cloth')value=195+16*Math.cos(x*Math.PI/2)+14*Math.cos(y*Math.PI/2)+21*broad;
      const i=(y*size+x)*4;
      const patina=style==='stone'?Math.pow(grid(x,y,8),3)*24:0;
      image.data[i]=value-patina*.47;image.data[i+1]=value-patina*.79;image.data[i+2]=value-patina;image.data[i+3]=255;
    }
    context.putImageData(image,0,0);
    const map=new THREE.CanvasTexture(canvas);
    map.wrapS=map.wrapT=THREE.RepeatWrapping;
    map.anisotropy=4;
    return map;
  }
  const maps=Object.fromEntries(['stone','oak','cloth'].map(style=>[style,texture(style)]));
  return function material(color,style='stone',roughness=.88){
    const surface=new THREE.MeshStandardMaterial({color,roughness});
    surface.onBeforeCompile=program=>{
      program.uniforms.burgDetail={value:maps[style]};
      program.uniforms.burgFrequency={value:style==='cloth'?3.8:style==='oak'?.92:1.35};
      program.uniforms.burgRelief={value:style==='stone'?.038:.012};
      program.uniforms.burgPatina={value:style==='stone'?1:0};
      program.vertexShader='varying vec3 burgPosition;\n'+program.vertexShader.replace('#include <project_vertex>',`
        #include <project_vertex>
        vec4 burgVertex = vec4(transformed, 1.);
        #ifdef USE_INSTANCING
          burgVertex = instanceMatrix * burgVertex;
        #endif
        burgPosition = (modelMatrix * burgVertex).xyz;
      `);
      program.fragmentShader=`
        varying vec3 burgPosition;
        uniform sampler2D burgDetail;
        uniform float burgFrequency;
        uniform float burgRelief;
        uniform float burgPatina;
      `+program.fragmentShader.replace('#include <map_fragment>',`
        #include <map_fragment>
        vec3 burgFace = abs(normalize(cross(dFdx(burgPosition),dFdy(burgPosition))));
        vec3 burgMix = pow(burgFace,vec3(5.));
        burgMix /= max(.0001,burgMix.x+burgMix.y+burgMix.z);
        vec3 burgUV = burgPosition * burgFrequency;
        vec3 burgTexel = burgMix.x * texture2D(burgDetail,burgUV.zy).rgb
                       + burgMix.y * texture2D(burgDetail,burgUV.xz).rgb
                       + burgMix.z * texture2D(burgDetail,burgUV.xy).rgb;
        float burgGrain = dot(burgTexel,vec3(.299,.587,.114));
        float burgWeather = texture2D(burgDetail,burgPosition.xz*.21+burgPosition.y*.09).r;
        float burgDamp = burgPatina * (1.-smoothstep(.08,1.65,burgPosition.y)) * (1.-burgFace.y);
        diffuseColor.rgb *= mix(vec3(.38),vec3(1.22),burgTexel)
                          * mix(1.,mix(.73,1.06,burgWeather),burgPatina)
                          * mix(vec3(1.),vec3(.56,.61,.51),burgDamp*.62);
      `).replace('#include <normal_fragment_maps>',`
        #include <normal_fragment_maps>
        vec3 burgDx = dFdx(-vViewPosition);
        vec3 burgDy = dFdy(-vViewPosition);
        vec3 burgR1 = cross(burgDy,normal);
        vec3 burgR2 = cross(normal,burgDx);
        float burgDet = dot(burgDx,burgR1);
        vec3 burgGradient = sign(burgDet)*(dFdx(burgGrain)*burgR1+dFdy(burgGrain)*burgR2);
        normal = normalize(max(abs(burgDet),.0000001)*normal-burgRelief*burgGradient);
      `);
    };
    return surface;
  };
}
