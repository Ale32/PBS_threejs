uniform samplerCube cubeMap;

varying vec3 viewDirection;
varying vec3 normalDirection;

void main()
{
    vec3 reflected = reflect(viewDirection, normalize(normalDirection));

    //vec4 diffuse = textureCube(cubeMap, normalize(normalDirection));
    vec4 specular = textureCube(cubeMap, vec3( -reflected.x, reflected.yz ) );

    gl_FragColor = specular;

    //gl_FragColor = textureCube(cubeMap, reflected);
}