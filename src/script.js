import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import {
    RectAreaLightHelper
} from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import * as dat from 'lil-gui'


/**
 * Base
 */
// Debug
const gui = new dat.GUI();
gui.close();

const params = {
    printCameraPosition: () => {
        alert(JSON.stringify(camera.position));
    },
    printScreenDimensions: () => {
        alert(`Width: ${window.screen.width}, Height: ${window.screen.height}`);
    },
    color: 0xffffff,
    color_directionalLight: 0xfee4a8,
    skyColor: 0x0061fe,
    groundColor: 0x669d34,
    color_pointLight: 0xff9000,
    color_rectAreaLight: 0x5e30eb,
    color_spotLight: 0x78ff00
};


// MULTIPLIERS
const m = {
    x: 21.6,
    y: 6.6 + 3.3,
    z: 19.6
}

gui.add(params, 'printCameraPosition').name('Print Camera Position')
gui.add(params, 'printScreenDimensions').name('Print Screen Dimensions')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xDED7D3)

// MATERIAL
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
// gui.add(material, 'roughness', 0, 1, 0.01).name('Roughness');
// gui.add(material, 'wireframe');

// OBJECTS
const loader = new GLTFLoader();
let object; 

loader.load( 'villa-savoye.glb', function ( gltf ) {
    object = gltf.scene;

       // Traverse the model to find all the meshes
    //    console.log(object);
       console.log(object.children[0].children[1].material.transparent = true);
       
       object.traverse((child) => {
        console.log(child);
        // console.log(child.castShadow);
        // child.castShadow = true;
        // child.receiveShadow = true;
        // console.log(child.castShadow);
        
        if (child.children.isMesh) {
            
            // child.castShadow = true;
            // child.receiveShadow = true;
            // child.receiveShadow = true;
            // Set the material to be transparent
            // console.log(child.material);
            
            // child.material.transparent = true;
            // child.material.opacity = 0.5; // Adjust opacity as needed
        }

        object.position.y = 3.3;
        // object.castShadow = true;
        // plane.receiveShadow = true;
        adjustCameraPosition();
    });

	scene.add(object);

}, undefined, function ( error ) {

	console.error( error );

} );

   // Adjust camera position based on screen size
   function adjustCameraPosition() {
    if (window.innerWidth <= 768) { // Assuming 768px as the breakpoint for mobile devices
        camera.position.set(0, 0.5, 38); // Zoom in for mobile
    } else {
        // camera.position.set(5, 5, 10); // Zoom out for larger screens
        camera.position.set(0, -0.2, 27);
    }
    camera.lookAt(scene.position); // Ensure the camera looks at the center of the scene
    controls.update(); // Update controls
}


// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(5, 1, 5),
//     material
// )

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(25, 25),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = 0;
// plane.receiveShadow = true;

scene.add(plane)
const axesHelper = new THREE.AxesHelper(m.x * 1.5);
scene.add(axesHelper);

gui.add(axesHelper, 'visible').name('Axes Helper');

// LIGHTS
// $$AmbientLight
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight);

const ambientLightFolder = gui.addFolder('Ambient Light');
ambientLightFolder.addColor(params, 'color').onChange(() => {
    ambientLight.color.set(params.color);
});
ambientLightFolder.add(ambientLight, 'intensity', 0, 1, 0.01);
ambientLightFolder.close();

// $$Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0x0061fe, 0x669d34, 0);
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.1 * m.y);
scene.add(hemisphereLight, hemisphereLightHelper);
hemisphereLightHelper.visible = false;

const hemisphereLightFolder = gui.addFolder('Hemisphere Light');
hemisphereLightFolder.addColor(params, 'skyColor').onChange(() => {
    //skycolor - note: 'color.set'
    hemisphereLight.color.set(params.skyColor);
}).name('skyColor');
hemisphereLightFolder.add(hemisphereLight, 'intensity', 0, 1, 0.01);
hemisphereLightFolder.addColor(params, 'groundColor').onChange(() => {
    hemisphereLight.groundColor.set(params.groundColor);
}).name('groundColor');
// hemisphereLightFolder.add(hemisphereLightHelper, 'visibility');
hemisphereLightFolder.add(hemisphereLightHelper, 'visible');
hemisphereLightFolder.close();


// $$DirectionalLight
const directionalLight = new THREE.DirectionalLight(0xfee4a8, 0.85);
directionalLight.position.set(0.85 * m.x, 2.15 * m.y, 0.35 * m.z);
// directionalLight.castShadow = true;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.1 * m.y);
directionalLightHelper.visible = false;

scene.add(directionalLight, directionalLightHelper);

const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.addColor(params, 'color_directionalLight').onChange(() => {
    directionalLight.color.set(params.color_directionalLight);
}).name('color');
directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.01);
directionalLightFolder.add(directionalLight.position, 'x', -3 * m.x, 3 * m.x, 0.1);
directionalLightFolder.add(directionalLight.position, 'y', -3 * m.y, 3 * m.y, 0.1);
directionalLightFolder.add(directionalLight.position, 'z', -3 * m.z, 3 * m.z, 0.1);
directionalLightFolder.add(directionalLightHelper, 'visible');
directionalLightFolder.close();


// $$PointLight
const pointLight = new THREE.PointLight(0xff9000, 0.5)
// pointLight.position.set(1 * m.x, -0.5 * m.y, 1 * m.z);
pointLight.position.set(-3.45, -2.7, 8.28);
// pointLight.castShadow = true;


const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1 * m.y);
pointLightHelper.visible = false;
scene.add(pointLight, pointLightHelper);


const pointLightFolder = gui.addFolder('Point Light');
pointLightFolder.addColor(params, 'color_pointLight').onChange(() => {
    pointLight.color.set(params.color_pointLight);
}).name('color');
pointLightFolder.add(pointLight, 'intensity', 0, 1, 0.1);
pointLightFolder.add(pointLight, 'distance', 1, 10, 0.1);
pointLightFolder.add(pointLight, 'decay', 1, 10, 0.1);
pointLightFolder.add(pointLight.position, 'x', -3 * m.x, 3 * m.x, 0.01);
pointLightFolder.add(pointLight.position, 'y', -3 * m.y, 3 * m.y, 0.01);
pointLightFolder.add(pointLight.position, 'z', -3 * m.z, 3 * m.z, 0.01);
pointLightFolder.add(pointLightHelper, 'visible');
pointLightFolder.close();



// $$Rect Area Light
const rectAreaLight = new THREE.RectAreaLight(0x5e30eb, 0.8, 19.7, 1);
// rectAreaLight.position.set(0 * m.x, 0 * m.y, 1.5 * m.z);
rectAreaLight.position.set(0.1, 1.2+3.3, 11.5);
rectAreaLight.lookAt(new THREE.Vector3());

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLightHelper.visible = false
scene.add(rectAreaLight, rectAreaLightHelper);

const rectAreaLightFolder = gui.addFolder('Rect Area Light');
rectAreaLightFolder.addColor(params, 'color_rectAreaLight').onChange(() => {
    rectAreaLight.color.set(params.color_rectAreaLight);
}).name('color');
rectAreaLightFolder.add(rectAreaLight, 'intensity', 0, 5, 0.1);
rectAreaLightFolder.add(rectAreaLight, 'width', 1, 3 * m.x, 0.1);
rectAreaLightFolder.add(rectAreaLight, 'height', 1, 3 * m.y, 0.1);
rectAreaLightFolder.add(rectAreaLight.position, 'x', -3 * m.x, 3 * m.x, 0.1);
rectAreaLightFolder.add(rectAreaLight.position, 'y', -3 * m.y, 3 * m.y, 0.1);
rectAreaLightFolder.add(rectAreaLight.position, 'z', -3 * m.z, 3 * m.z, 0.1);
rectAreaLightFolder.add(rectAreaLightHelper, 'visible');
rectAreaLightFolder.close();


// $$Spot Light
// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, 0.1, 0.5, 1);
// // spotLight.position.set(0 * m.x, 2 * m.y, 3 * m.z);
// spotLight.position.set(-1, 6.5, 19.3);
// // spotLight.position.set(2.1, 7, 20.7);
// // spotLight.target.position.set(0 * m.x, 1 * m.y, 1.5 * m.z);
// spotLight.target.position.set(-1, 6.5, 19.3);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0xffffff);
// scene.add(spotLight, spotLight.target, spotLightHelper);

// const spotLightFolder = gui.addFolder('Spot Light');
// spotLightFolder.add(spotLight, 'intensity', 0, 1, 0.01);
// spotLightFolder.addColor(params, 'color_spotLight').onChange(() => {
//     spotLight.color.set(params.color_spotLight);
// }).name('color');
// spotLightFolder.add(spotLight, 'distance', 1, 20, 0.1);
// spotLightFolder.add(spotLight, 'angle', 0, Math.PI * 0.25, 0.1);
// spotLightFolder.add(spotLight, 'penumbra', 0, 1, 0.01);
// spotLightFolder.add(spotLight, 'decay', 0, 1, 0.1);
// spotLightFolder.add(spotLight.position, 'x', -3 * m.x, 3 * m.x, 0.1);
// spotLightFolder.add(spotLight.position, 'y', -3 * m.y, 3 * m.y, 0.1);
// spotLightFolder.add(spotLight.position, 'z', -3 * m.z, 3 * m.z, 0.1);
// spotLightFolder.add(spotLightHelper, 'visible');
// spotLightFolder.close();
// // console.log(spotLight.target);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    // height: window.innerHeight
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = 0.1 * elapsedTime
    // cube.rotation.y = 0.1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime

    // sphere.rotation.x = 0.15 * elapsedTime
    // cube.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()