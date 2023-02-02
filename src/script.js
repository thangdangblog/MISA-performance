import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matCapTexture = textureLoader.load('/textures/matcaps/5.png');

/**
 * Fonts
 */
const fontLoaded = new FontLoader()

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

fontLoaded.load(
    'fonts/gentilis_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry('MISA Customize', {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        });

        textGeometry.computeBoundingBox();

        textGeometry.center();

        const textMaterial = new THREE.MeshNormalMaterial();
        //    textMaterial.wireframe = true;
        const text = new THREE.Mesh(textGeometry, textMaterial);

        scene.add(text);

        console.time("donus");

        for (let index = 0; index < 2000; index++) {

            const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
            const donusMaterial = new THREE.MeshMatcapMaterial({
                matcap: matCapTexture
            });

            const donus = new THREE.Mesh(torusGeometry, donusMaterial);

            donus.position.x = getRndInteger(-10, 10);
            donus.position.y = getRndInteger(-10, 10);
            donus.position.z = getRndInteger(-10, 10);

            donus.rotateX(Math.floor(Math.random() * 5));
            donus.rotateY(Math.floor(Math.random() * 5));
            donus.rotateZ(Math.floor(Math.random() * 5));

            scene.add(donus);

        }

        console.timeEnd("donus");
    }
);

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()