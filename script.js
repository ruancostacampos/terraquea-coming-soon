import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { gsap } from 'gsap'
import frases from './frases.json'

let idealLeaf
let mainZoom = false
let playedStartAnimation = false
let currentSelectedLeaf;
let mouse = new THREE.Vector2()
const LEAVES_COUNT = 180

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)


camera.position.set(-10.4, 11, 3.73)
camera.rotation.set(-1.2, -0.73, -1.1)
camera.updateProjectionMatrix()

//renderer.setClearColor(0xA3A3A3)

//const orbit = new OrbitControls(camera, renderer.domElement)

//orbit.update()

const grid = new THREE.GridHelper(30, 30)
//scene.add(grid)

const axesHelper = new THREE.AxesHelper(30);
//scene.add(axesHelper);

const raycaster = new THREE.Raycaster();


const ambientLight = new THREE.AmbientLight(0xededed, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
scene.add(directionalLight)

directionalLight.position.set(10, 11, 7)

const gltfLoader = new GLTFLoader()

const rgpeLoader = new RGBELoader()

// LOAD LEAF MODEL

gltfLoader.load('./assets/leaf/model.gltf',

    // WHEN LOADED
    (gltf) => {

        console.log('Leaf loaded.')

        // Create green leaf material
        let leafMaterial = new THREE.MeshLambertMaterial({ color: '#4CAF50' })

        const model = gltf.scene

        model.position.y = 5
        model.position.x = 5
        // Change the material of loaded GLTF Object
        model.traverse((o) => {
            if (o.isMesh) {
                o.material = leafMaterial
            }
        })

        //Reduce the object size by scaling down
        model.scale.set(0.01, 0.01, 0.01)

        idealLeaf = model
        spawnLeaves()
    },

    // WHEN LOADING 
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    //WHEN SOME ERROR
    (err) => {
        console.log(err)
    }
)

// END OF LOAD MODEL PART

const randomPhrase = () => {
    let phrase = frases[THREE.MathUtils.randInt(0, frases.length - 1)]
    return phrase
}

const render = () => {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
}


window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

//Random select an animation

const randomWindBehavior = (obj) => {
    switch (Math.floor(Math.random() * 4)) {
        case 0:
            windLeafAnimation0(obj)
            break
        case 1:
            windLeafAnimation1(obj)
            break
        case 2:
            windLeafAnimation2(obj)
            break
        case 3:
            windLeafAnimation3(obj)
            break
    }
}

const windLeafAnimation0 = (obj) => {

    gsap.to(obj.rotation, {
        z: obj.rotation.z + (Math.PI * 2), ease: "none", duration: 2, repeat: -1,
    })

    gsap.fromTo(obj.position,
        { id: obj.id, x: "random(20, 120, 0.1)", y: "random(0, 5, 0.1)" },
        { id: obj.id, x: -20, ease: "none", duration: (obj.position.x + 20) / 8, repeat: -1, repeatRefresh: true }
    )


}

const windLeafAnimation1 = (obj) => {

    gsap.to(obj.rotation, {
        y: obj.rotation.y + (Math.PI * 2), ease: "none", duration: 2, repeat: -1,
    })

    gsap.fromTo(obj.position,
        { id: obj.id, x: "random(20, 120, 0.1)", y: "random(0, 5, 0.1)" },
        { id: obj.id, x: -20, ease: "none", duration: (obj.position.x + 20) / 8, repeat: -1, repeatRefresh: true }
    )
}

const windLeafAnimation2 = (obj) => {


    gsap.to(obj.rotation, {
        z: obj.rotation.z + (Math.PI * 2), ease: "none", repeat: -1, duration: 2,
        y: obj.rotation.y + (Math.PI * 2), ease: "none", repeat: -1, duration: 2,
    })

    gsap.fromTo(obj.position,
        { id: obj.id, x: "random(20, 120, 0.1)", y: "random(0, 5, 0.1)" },
        { id: obj.id, x: -20, ease: "none", duration: (obj.position.x + 20) / 8, repeat: -1, repeatRefresh: true }
    )


}

const windLeafAnimation3 = (obj) => {


    gsap.to(obj.rotation, {
        z: obj.rotation.z + (Math.PI * 2), ease: "none", repeat: -1, duration: 2,
        y: obj.rotation.y + (Math.PI * 2), ease: "none", repeat: -1, duration: 2,
        z: obj.rotation.z + (Math.PI * 2), ease: "none", repeat: -1, duration: 2,
    })

    gsap.fromTo(obj.position,
        { id: obj.id, x: "random(20, 120, 0.1)", y: "random(0, 5, 0.1)" },
        { id: obj.id, x: -20, ease: "none", duration: (obj.position.x + 20) / 8, repeat: -1, repeatRefresh: true }
    )


}


const spawnLeaves = () => {

    // console.log(`Camera Position -> X: ${camera.position.x}  Y: ${camera.position.y} Z: ${camera.position.z}`)
    // console.log(`Camera Rotation -> X: ${camera.rotation.x}  Y: ${camera.rotation.y} Z: ${camera.rotation.z}`)

    // SPAWN LEAVES INTO SCREEN WHEN U IS PRESSED
    for (let i = 0; i < LEAVES_COUNT; i++) {

        let cacheObject = idealLeaf.clone()

        cacheObject.position.x = THREE.MathUtils.randFloat(35, 20);
        cacheObject.position.y = THREE.MathUtils.randFloat(-8, 8);
        cacheObject.position.z = THREE.MathUtils.randFloat(25, -15);
        scene.add(cacheObject)
        randomWindBehavior(cacheObject)

    }


}

const zoomCameraAnimation = () => {
    //Animation to add zoom  (Best for product details or something like this)
    if (!mainZoom) {
        gsap.to(camera.position, { x: 0, ease: "none", duration: 1 })
        gsap.to(camera.rotation, { x: -1.55, y: -0.04, z: -1.18, ease: "easeInOut", duration: 1 })
        mainZoom = true
        return
    }

    if (mainZoom) {
        gsap.to(camera.position, { x: -10.4, y: 11, z: 3.73, ease: "easeInOut", duration: 1 })
        gsap.to(camera.rotation, { x: -1.2, y: -0.73, z: -1.1, ease: "easeInOut", duration: 1 })
        mainZoom = false
        return
    }
}


if (!playedStartAnimation) {
    element = document.getElementById("container")
    gsap.fromTo(
        element,
        { translateX: -50, opacity: 0 },
        {
            translateX: 0, opacity: 1, ease: "easeInOut", duration: 2, delay: 3,
            onComplete: () => { playedStartAnimation = true }
        }
    )
}

const onMouseClick = (e) => { // HANDLE MOUSE WHEN CLICK A LEAF

    e.preventDefault();

    if (!playedStartAnimation) return // WHEN USER CLICK A LEAF WITHOUT FINISH THE INTRO ANIMATION

    if (currentSelectedLeaf !== undefined) return

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);


    for (var i = 0; i < intersects.length; i++) {


        currentSelectedLeaf = intersects[0].object.parent
        gsap.killTweensOf(intersects[0].object.parent.position)
        gsap.killTweensOf(intersects[0].object.parent.rotation)
        gsap.to(intersects[0].object.parent.position, { x: -10.4, y: 11, z: 3.73, duration: 1.3 })
        gsap.to(intersects[0].object.parent.rotation, { x: 1, y: 1.8, z: 0, duration: 1.3 })

        newPhrase = randomPhrase()

        message = document.getElementById("message")
        autor = document.getElementById("autor")

        message.innerText = newPhrase.mensagem
        autor.innerText = `- ${newPhrase.autor}`

        element = document.getElementById("container")
        gsap.to(element, { translateX: -50, opacity: 0, ease: "easeInOut", duration: 1.3 })

        messageContainer = document.getElementById("messageContainer")
        messageContainer.style.display = 'flex'
        gsap.fromTo(messageContainer, { opacity: 0 }, { opacity: 1, ease: "ease", duration: 1.3, delay: 1 })


    }


}

document.getElementById("closeMessage").addEventListener("mousedown", () => {

    messageContainer = document.getElementById("messageContainer")
    messageContainer.style.display = 'none'

    gsap.to(currentSelectedLeaf.rotation, { x: 0, y: 0, z: 0, ease: "none", duration: 1 })
    gsap.to(currentSelectedLeaf.position, {
        x: -12, y: -2, z: -2, ease: "bounce.out", duration: 2, onComplete: () => {
            currentSelectedLeaf.position.x = THREE.MathUtils.randFloat(35, 20);
            currentSelectedLeaf.position.y = THREE.MathUtils.randFloat(-8, 8);
            currentSelectedLeaf.position.z = THREE.MathUtils.randFloat(25, -15);
            randomWindBehavior(currentSelectedLeaf)
            currentSelectedLeaf = undefined
        }
    })


})

window.addEventListener("mousedown", onMouseClick)


render()