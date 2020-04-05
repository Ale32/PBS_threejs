var scene, camera, renderer;
var controls, myMaterial, m;		

init();
//setupGui();
animate();          

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera.position.set(15, 5, 15);

    controls = new THREE.OrbitControls(camera);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(5,5,5);
    scene.add(light);

    var path = "../resources/texture/cubemap/";
    var format = '.png';
    var urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];

    THREE.ImageUtils.crossOrigin = '';
    var reflectionCube = THREE.ImageUtils.loadTextureCube(urls);
    reflectionCube.format = THREE.RGBFormat;

    m = new THREE.Matrix4();
    m = camera.matrixWorld;	// It correspond to viewMatrix inverse, because camera.matrixWorldInverse gives me the viewMatrix
    
    myMaterial = new THREE.ShaderMaterial({ 
        uniforms:
        {	
            cubeMap: {type: 't', value: reflectionCube },
            uViewMatrixInverse : { type: "m4", value: m }
        },														    
        vertexShader: document.getElementById( 'vs' ).textContent, 
        fragmentShader: document.getElementById( 'fs' ).textContent
    }); 
    var geom;
    geom = new THREE.Mesh( new THREE.SphereGeometry( 5, 32, 32 ) , myMaterial );
    //geom = new THREE.Mesh( new THREE.TorusKnotGeometry( 1.5, 0.3, 128, 32 ) , myMaterial );
    //geom = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1) , myMaterial );
    //geom = new THREE.Mesh( new THREE.TorusGeometry( 3, 1, 16, 100 ) , myMaterial );
    scene.add(geom);
    scene.add(new THREE.AxisHelper(30));

    // ENVIRONMENT BOX
    var shader = THREE.ShaderLib["cube"];
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    uniforms['tCube'].value = reflectionCube;
    var material = new THREE.ShaderMaterial({
        fragmentShader    : shader.fragmentShader,
        vertexShader  : shader.vertexShader,
        uniforms  : uniforms,
        depthWrite: false,
        side: THREE.DoubleSide	// DoubleSide or BackSide
    });
    var skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000), material );
    scene.add(skyboxMesh);
    //

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
/*
function setupGui() {

    effectController = {
        kd: 0.9,
        ks: 0.9,
        shin: 100,
        ambientFactor: 0.0
    };

    var gui = new dat.GUI();
    var menu;
    
    menu = gui.addFolder("Coefficients control");
    menu.add(effectController, "kd", 0.0, 1.0, 0.01).name("kDiffuse");
    menu.add(effectController, "ks", 0.0, 1.0, 0.01).name("kSpecular");
    menu.add(effectController, "shin", 0.1, 500, 0.1).name("Shininess");
    menu.add(effectController, "ambientFactor", 0.0, 1.0, 0.01).name("Ambient");

}*/

function animate() {

    requestAnimationFrame( animate );
    controls.update();

    myMaterial.uniforms.uViewMatrixInverse.value = camera.matrixWorld;
    /*
    myMaterial.uniforms.kd.value = effectController.kd;
    myMaterial.uniforms.ks.value = effectController.ks;
    myMaterial.uniforms.shin.value = effectController.shin;
    myMaterial.uniforms.ambientFactor.value = effectController.ambientFactor;
    */
    renderer.render( scene, camera );

}