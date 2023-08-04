import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import nebula from '../assets/img/nebula.e286acc0.jpg'
import stars from '../assets/img/stars.755a6d17.jpg'
import moon from '../assets/img/iss069e008558orig.jpg'


//basic code
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
//renderer.setClearColor(0xFFEA00); bg as yellow
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

//orbit controloer by mouse
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

//x,y,z axis code
const axisHelper = new THREE.AxesHelper(18);
//axisHelper.setColors(0x00FFFF);
scene.add(axisHelper);



// camera for everything
camera.position.set(0, 30, 30);


// **************** bg starts and milky way *****************

const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(stars);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    moon,
    stars,
    stars,
    stars,
    stars,
    stars
])


// box shaped code
const boxGeometry = new THREE.BoxGeometry(4,4,4);
const boxMeterial = new THREE.MeshBasicMaterial({color : 0x00FFFF});
const box = new THREE.Mesh(boxGeometry, boxMeterial);
scene.add(box);

//sphere

const sphereGeometry = new THREE.SphereGeometry(5,50,50);
const basicShpereGeometry = new THREE.MeshStandardMaterial({
    color : 0xffffff,
    wireframe : false
});
const sphere = new THREE.Mesh(sphereGeometry, basicShpereGeometry);
sphere.castShadow = true
sphere.position.set(-10, -29,0)

scene.add(sphere);


//************************box 2 ******************

const box2Geometry = new THREE.BoxGeometry(4,4,4);
// const box2Material = new THREE.MeshBasicMaterial({
//     //color : 0x00ff00,
//     map : textureLoader.load(nebula)
// });
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map : textureLoader.load(moon)}),
    new THREE.MeshBasicMaterial({map : textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map : textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map : textureLoader.load(moon)}),
    new THREE.MeshBasicMaterial({map : textureLoader.load(moon)}),
    new THREE.MeshBasicMaterial({map : textureLoader.load(moon)}),
]
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial );
box2.position.set(15,10,11)
scene.add(box2)


// plane geometry like ash color wall (before)

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeGeoMaterial = new THREE.MeshStandardMaterial({
    color : 0xa0a0a0,
    side : THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeGeoMaterial);
plane.rotation.x = -0.5 * Math.PI;

plane.receiveShadow = true;

scene.add(plane);

//ambient light

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);



// *************shadow and directional light *********************

//directional light

// const directionalLight = new THREE.DirectionalLight(0xffffff);
// directionalLight.position.set(-30, 50 , 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;
// scene.add(directionalLight);

// //directional helper

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
// scene.add(dLightHelper);

// //dLshadow helper for camera
// const dlShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dlShadowHelper);

// *************shadow and directional light *********************

// **************** spot light ****************
// spot light

const spotLight = new THREE.SpotLight(0xFFFFFF,.5);
scene.add(spotLight);
spotLight.position.set(-100,100,0);
spotLight.castShadow = true;
spotLight.angle = 0.09;

//spot light helper

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

scene.fog = new THREE.Fog(0xFFFFFF,0,100)
// **************** spot light ****************




// grid

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);


// ********************** mouse handling obejct **********************

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function (e) {
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientY / this.window.innerHeight) * 2 + 1;
})

const rayCaster = new THREE.Raycaster();


const spehereId = sphere.id
//dat gui

const gui = new dat.GUI()

const options = {
    sphereColor : '#ffea00',
    wireframe : false,
    speed : 0.01,
    angle : 0.2,
    penumbra : 0,
    intensify : 1
}
gui.addColor(options, 'sphereColor').onChange(function (e) {
    sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function (e) {
    sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0 , 0.1);
gui.add(options, 'angle', 0 , 1);
gui.add(options, 'penumbra', 0 , 1);
gui.add(options, 'intensify', 0 , 1);

let step = 0;
// animate function 
function animate (time) {
    box.rotation.x = (time / 1000);
    box.rotation.y = (time / 1000);
    step += options.speed;
    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensify;
    spotLightHelper.update()
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    rayCaster.setFromCamera(mousePosition ,camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    //console.log(intersects)

    for (let i = 0; i < intersects.length; i++) {
        if( intersects[i].object.id === spehereId ) {
            intersects[i].object.material.color.set(0xFF0000)
        }
    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
 


// sphere at 16:43