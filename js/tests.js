var scene, camera, renderer;
var controls, shaderMat;	
var torusKnot;		

init();
setupGui();
animate();


function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 2000);
    camera.position.set(5, 5, 5);

    controls = new THREE.OrbitControls(camera);

    var ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(3, 3, 3);
    scene.add(light);

    var texture = THREE.ImageUtils.loadTexture("../resources/texture/grass_ext.jpg");

    var geometry = new THREE.TorusKnotGeometry(1.5, 0.3, 128, 32);

    shaderMat = new THREE.ShaderMaterial({ 
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            {	
                ambientFactor: { type: 'f' , value: 0.0 },
                shin: { type: 'f' , value: 100.0 },
                ks: { type: 'f' , value: 0.9 },
                kd: { type: 'f' , value: 0.9 },
                uMatColor: { type: 'c' , value: new THREE.Color(0x00ee15) }, 
                imgText: {type: 't', value: null }
            }
        ]),
        vertexShader: document.getElementById('vs').textContent, 
        fragmentShader: document.getElementById('fs').textContent,
        lights: true // THREE.js needs this to import automatically light's uniforms
    });
    shaderMat.uniforms.imgText.value = texture;

    torusKnot = new THREE.Mesh(geometry, shaderMat);
    scene.add(torusKnot);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupGui() {
    effectController = {
        kd: 0.9,
        ks: 0.9,
        shin: 100,
        ambientFactor: 0.0
    };

    var gui = new dat.GUI();
    var menu;
    
    menu = gui.addFolder("Parameters");
    menu.add(effectController, "kd", 0.0, 1.0, 0.01).name("kDiffuse");
    menu.add(effectController, "ks", 0.0, 1.0, 0.01).name("kSpecular");
    menu.add(effectController, "shin", 0.1, 500, 0.1).name("Shininess");
    menu.add(effectController, "ambientFactor", 0.0, 1.0, 0.01).name("Ambient");
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    shaderMat.uniforms.kd.value = effectController.kd;
    shaderMat.uniforms.ks.value = effectController.ks;
    shaderMat.uniforms.shin.value = effectController.shin;
    shaderMat.uniforms.ambientFactor.value = effectController.ambientFactor;

    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    torusKnot.rotation.z += 0.01;

    renderer.render(scene, camera);
}