import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
    BoxGeometry,
    GridHelper,
    Texture,
    TextureLoader
} from 'three'

/**
 * Loaders
 */
let sceneReady = false
const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
    () =>
    {    window.setTimeout(() =>
        {
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        }, 500)

        window.setTimeout(() => {
            sceneReady = true
        }, 2000)
    },
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//Axes Helper
const axesHelper = new THREE.AxesHelper(50);
axesHelper.position.set(0, 0, 0)
//scene.add(axesHelper);

/**
 * Models
 */
//Group
const rotationGroup = new THREE.Group()
scene.add(rotationGroup)

gltfLoader.load(
    'models/Svetistskoveli/scene.gltf',
    (gltf) => {
        gltf.scene.scale.set(5, 5, 5)
        gltf.scene.position.set(30, 0, 0)
        gltf.scene.rotation.y = Math.PI * 0.5

        rotationGroup.add(gltf.scene)


    }
)

//Fog
const fog = new THREE.Fog('#D1CCCE', 3, 60)
scene.fog = fog

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
    uniform float uAlpha;

    void main()
    {
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    }
`,
    transparent: true,

})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

//** Cubes */

const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const material = new THREE.MeshBasicMaterial({
    color: 'white',
    wireframe: true
})

const cube1 = new THREE.Mesh(geometry, material)
cube1.position.set(0.9, 3.5, 3)
scene.add(cube1)

const cube2 = new THREE.Mesh(geometry, material)
cube2.position.set(-2.5, 3.5, -4.5)
scene.add(cube2)


const cube3 = new THREE.Mesh(geometry, material)
cube3.position.set(0, 5.5, -8)
scene.add(cube3)


const cube4 = new THREE.Mesh(geometry, material)
cube4.position.set(4.5, 2.5, -2)
scene.add(cube4)


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
//Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)

cameraGroup.add(camera)


scene.add(camera)



function lerp(x, y, a) {
    return (1 - a) * x + a * y
}

// Used to fit the lerps to start and end at specific scrolling percentages
function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start)
}

const animationScripts = []

//Loader  animation
animationScripts.push({
    start: 0,
    end: 1,
    func: () => {


        camera.position.x = lerp(0, 0, scalePercent(1, 2)) - 37;
        camera.position.y = lerp(0, 0, scalePercent(1, 2)) + 27;
        camera.position.z = lerp(0, 0, scalePercent(1, 2)) - 41;
    }
})

//First animation 
animationScripts.push({
    start: 1,
    end: 21,
    func: () => {
        camera.position.x = lerp(-37, 0.9, scalePercent(1, 21));
        camera.position.y = lerp(27, 3.5, scalePercent(1, 21));
        camera.position.z = lerp(-41, 10, scalePercent(1, 21));
    }
})

//Second animation 
animationScripts.push({
    start: 21,
    end: 41,
    func: () => {

        camera.position.x = lerp(0.9, -8, scalePercent(21, 41));
        camera.position.y = lerp(3.5, 3.5, scalePercent(21, 41));
        camera.position.z = lerp(10, -4.5, scalePercent(21, 41));
    }

})


//Third animation 
animationScripts.push({
    start: 41,
    end: 60,
    func: () => {
        camera.position.x = lerp(-8, -10, scalePercent(41, 60));
        camera.position.y = lerp(3.5, 4, scalePercent(41, 60));
        camera.position.z = lerp(-4.5, -6, scalePercent(41, 60));
    }
})

//Forth animation
animationScripts.push({
    start: 60,
    end: 80,
    func: () => {
        camera.position.x = lerp(-10, 20, scalePercent(60, 80));
        camera.position.y = lerp(4, 9, scalePercent(60, 80));
        camera.position.z = lerp(-6, -20, scalePercent(60, 80));
    }
})

//fifth Animation
animationScripts.push({
    start: 80,
    end: 100,
    func: () => {
        camera.position.x = lerp(20, 15, scalePercent(80, 100));
        camera.position.y = lerp(9, 2.5, scalePercent(80, 100));
        camera.position.z = lerp(-20, 2, scalePercent(80, 100));
    }

})


/** 
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setClearColor('#D1CCCE')
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



function playScrollAnimations() {
    animationScripts.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func()
        }
    })
}

let scrollPercent = 0

document.body.onscroll = () => {
    console.log(
        'scrolling'
    )
    //calculate the current scroll progress as a percentage
    scrollPercent =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight ||
                    document.body.scrollHeight) -
                document.documentElement.clientHeight)) *
        100;
}




//Camera Movment
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

function animate() {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    requestAnimationFrame(animate)

    playScrollAnimations()

    render()

    camera.lookAt(.5, 2, -4)

    //Animate Camera

    const parallaxX = cursor.x
    const parallaxY = -cursor.y

    rotationGroup.rotation.y = (parallaxX) * 0.1
    rotationGroup.position.y = (parallaxY) * 0.3

    cube1.rotation.y = (parallaxX) * 0.1
    cube1.rotation.y = (parallaxX) * 0.3





    cube1.rotation.x += 0.01
    cube1.rotation.y += 0.03
    cube1.rotation.z += 0.02



    cube2.rotation.x += 0.01
    cube2.rotation.y += 0.03
    cube2.rotation.z += 0.02



    cube3.rotation.x += 0.01
    cube3.rotation.y += 0.03
    cube3.rotation.z += 0.02



    cube4.rotation.x += 0.01
    cube4.rotation.y += 0.03
    cube4.rotation.z += 0.02


}

function render() {
    renderer.render(scene, camera)
}

window.scrollTo({
    top: 0,
    behavior: 'smooth'
})
animate()