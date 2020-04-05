uniform mat4 uViewMatrixInverse;
			
varying vec3 viewDirection;
varying vec3 normalDirection; 

void main()
{	
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    viewDirection = worldPosition.xyz - cameraPosition;

    vec3 normalDirectionVS = normalMatrix*normal;
    normalDirection = normalize( vec3( uViewMatrixInverse * vec4(normalDirectionVS,0.0) ) );

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}