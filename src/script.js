import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'lil-gui'

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
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let obj = null

gltfLoader.load(
    '/models/carbon-dwellers1.gltf',
    (gltf) => {
        console.log('glTF', gltf)
        // One way to bring all of a imported models parts
        // const children = [...gltf.scene.children]
        // for (const child of children) {
        //     scene.add(child)
        // }
        obj = gltf
        const model = gltf.scene
        // Create new mixer for the imported models animations
        mixer = new THREE.AnimationMixer(model)
        const action = mixer.clipAction(obj.animations[1])

        action.play()
        // Set scale of imported scene
        gltf.scene.scale.set(1, 1, 1)
        // A simpler way to add elements from an imported model
        scene.add(obj.scene)
        scene.add(obj.cameras[0])
        scene.add(obj.scene.children[5], obj.scenes[0].children[6]) // add Cyan point light.
    },
    (progress) => {
        // console.log('XHR:', progress.timeStamp);
    },
    (error) => {
        console.log('An error occured.');
    }
)
console.log('gltf', obj);
/**
 * Floor
 */
// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(50, 50),
//     new THREE.MeshStandardMaterial({
//         color: '#444444',
//         metalness: 0,
//         roughness: 0.5
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)
const ground = scene;
console.log('Ground: ', ground);


/**
 * Lights
 */
console.log('Lights', scene.children[5], scene.children[4]);
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
// scene.add(ambientLight)
const pinkPointLight = new THREE.PointLight(scene.children[5]);
const cyanPointLight = new THREE.PointLight(scene.children[4]);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)

// pinkPointLight.shadow.mapSize.set(1024, 1024)
// pinkPointLight.shadow.camera.far = 15
// pinkPointLight.shadow.camera.left = - 7
// pinkPointLight.shadow.camera.top = 7
// pinkPointLight.shadow.camera.right = 7
// pinkPointLight.shadow.camera.bottom = - 7
// pinkPointLight.position.set(5, 5, 5)
// scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
console.log('The scene camera: ', scene);
const camera = new THREE.PerspectiveCamera(scene.children[3])
camera.position.set(- 8, 4, 8)
console.log(camera);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.gammaOutput = true
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()