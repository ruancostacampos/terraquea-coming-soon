import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { gsap } from 'gsap'
import frases from '../frases.json'

let idealLeaf
let mainZoom = false
let playedStartAnimation = false
let currentSelectedLeaf;
let mouse = new THREE.Vector2()
let disableLeafHover = false
let disableLeafClick = false
let showingDevInfo = false
const LEAVES_COUNT = 180
let animationSpeed = 7;

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    animationSpeed = 3
    let container = document.getElementById("container")
    let nElement = document.createElement("p")
    nElement.innerHTML = 'Aperte numa folha para ler uma frase especial que eu guardei pra <u>você.</u>'
    container.appendChild(nElement)
}

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

//Random select an animation

const randomWindBehavior = (obj) => {

    let rnd = THREE.MathUtils.randInt(0, 3)
    let rndDuration = THREE.MathUtils.randFloat(1.5, 3)


    // ROTATION ANIMATION 0
    if (rnd === 0) {
        gsap.to(obj.rotation, {
            z: obj.rotation.z + (Math.PI * 2), ease: "none", duration: rndDuration, repeat: -1,
        })
    }
    // ROTATION ANIMATION 1
    if (rnd === 1) {
        gsap.to(obj.rotation, {
            y: obj.rotation.y + (Math.PI * 2), ease: "none", duration: rndDuration, repeat: -1,
        })
    }
    // ROTATION ANIMATION 2
    if (rnd === 2) {
        gsap.to(obj.rotation, {
            z: obj.rotation.z + (Math.PI * 2), ease: "none", repeat: -1, duration: rndDuration,
            y: obj.rotation.y + (Math.PI * 2), ease: "none", repeat: -1, duration: rndDuration,
        })
    }
    // ROTATION ANIMATION 3
    if (rnd === 3) {
        gsap.to(obj.rotation, {
            z: obj.rotation.z + (Math.PI * 2), ease: "none", repeat: -1, duration: rndDuration,
            y: obj.rotation.y + (Math.PI * 2), ease: "none", repeat: -1, duration: rndDuration,
            z: obj.rotation.z + (Math.PI * 2), ease: "none", repeat: -1, duration: rndDuration,
        })
    }

    // MOVE ANIMATION 
    gsap.fromTo(obj.position,
        { id: obj.id, x: "random(20, 120, 0.1)", y: "random(0, 5, 0.1)" },
        { id: obj.id, x: -20, ease: "none", duration: (obj.position.x + 20) / animationSpeed, repeat: -1, repeatRefresh: true }
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

    let devInfo = document.getElementById("devInfo")
    let devSocial = document.getElementById("devSocial")
    let container = document.getElementById("container")

    //Animation to add zoom  (Best for product details or something like this)
    if (!mainZoom) { // If not animated yet
        gsap.to(container, { translateX: -50, opacity: 0, ease: "easeIn", duration: 1.3 })

        devInfo.style.display = 'flex'
        devSocial.style.display = 'flex'
        gsap.fromTo(devInfo, { opacity: 0, translateX: -50 }, { opacity: 1, translateX: 0, ease: "ease", duration: 1.3, delay: 0.3 })
        gsap.fromTo(devSocial, { opacity: 0, translateX: -50 }, { opacity: 1, translateX: 0, ease: "ease", duration: 1.3, delay: 0.3 })

        gsap.to(camera.position, { x: 0, ease: "none", duration: 2.5 })
        gsap.to(camera.rotation, { x: -1.55, y: -0.04, z: -1.8, ease: "easeInOut", duration: 1 })
        mainZoom = true
        return
    }

    if (mainZoom) {

        gsap.to(devSocial, { opacity: 0, translateX: 50, ease: "ease", duration: 1.3, delay: 1 })
        gsap.to(devInfo, {
            opacity: 0, translateX: 50, ease: "ease", duration: 1.3, delay: 1, onComplete: () => {

                devInfo.style.display = 'none'
                devSocial.style.display = 'none'

                let element = document.getElementById("container")

                gsap.fromTo(
                    element,
                    { translateX: +50, opacity: 0 },
                    { translateX: 0, opacity: 1, ease: "easeInOut", duration: 1, delay: 0.3, }
                )

            }
        })
        gsap.to(camera.position, { x: -10.4, y: 11, z: 3.73, ease: "easeInOut", duration: 1 })
        gsap.to(camera.rotation, { x: -1.2, y: -0.73, z: -1.1, ease: "easeInOut", duration: 1 })
        mainZoom = false
        showingDevInfo = false
        return
    }


}


if (!playedStartAnimation) {
    let element = document.getElementById("container")
    let wind = document.getElementById("wind")
    gsap.fromTo(element, { translateX: -50, opacity: 0 },
        {
            translateX: 0, opacity: 1, ease: "easeInOut", duration: 2, delay: 3, onComplete: () => {
                playedStartAnimation = true
                gsap.to(wind, { rotate: 360, duration: 0.8, opacity: 1, ease: "easeInOut" })
            }
        }
    )
}

const onMouseMove = (e) => { // HANDLE MOUSE HOVER A LEAF


    e.preventDefault();

    if (!playedStartAnimation) return // WHEN USER CLICK A LEAF WITHOUT FINISH THE INTRO ANIMATION
    if (showingDevInfo) return

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);

    if (disableLeafClick) return

    if (intersects.length === 0 && currentSelectedLeaf !== undefined && disableLeafHover) {
        document.body.style.cursor = 'default'
        disableLeafHover = false
        gsap.getTweensOf(currentSelectedLeaf.position).forEach(item => item.timeScale(1))
        gsap.getTweensOf(currentSelectedLeaf.rotation).forEach(item => item.timeScale(1))
        currentSelectedLeaf.children[0].material.color.set(new THREE.Color('rgb(61, 143, 81)'))
        currentSelectedLeaf.children[1].material.color.set(new THREE.Color('rgb(61, 143, 81)'))
        currentSelectedLeaf = undefined
    }

    if (currentSelectedLeaf !== undefined) return

    for (let i = 0; i < intersects.length; i++) {

        document.body.style.cursor = 'pointer'

        if (intersects[0].object.parent !== currentSelectedLeaf && currentSelectedLeaf !== undefined) {
            gsap.getTweensOf(currentSelectedLeaf.position).forEach(item => item.timeScale(1))
            gsap.getTweensOf(currentSelectedLeaf.rotation).forEach(item => item.timeScale(1))
            currentSelectedLeaf.children[0].material.color.set(new THREE.Color('rgb(61, 143, 81)'))
            currentSelectedLeaf.children[1].material.color.set(new THREE.Color('rgb(61, 143, 81)'))
            currentSelectedLeaf = intersects[0].object.parent
        }

        currentSelectedLeaf = intersects[0].object.parent
        currentSelectedLeaf.children[0].material = currentSelectedLeaf.children[0].material.clone()
        currentSelectedLeaf.children[1].material = currentSelectedLeaf.children[1].material.clone()
        currentSelectedLeaf.children[0].material.color.set(new THREE.Color('rgb(86, 227, 121)'))
        currentSelectedLeaf.children[1].material.color.set(new THREE.Color('rgb(86, 227, 121)'))
        gsap.getTweensOf(currentSelectedLeaf.position).forEach(item => item.timeScale(0.4))
        gsap.getTweensOf(currentSelectedLeaf.rotation).forEach(item => item.timeScale(0.4))
        disableLeafHover = true

    }


}

const onMouseClick = (e) => {

    e.preventDefault()

    if (currentSelectedLeaf === undefined) {
        document.body.style.cursor = 'default'
        return
    }

    if (disableLeafClick) return

    if (showingDevInfo) return

    document.body.style.cursor = 'default'

    gsap.killTweensOf(currentSelectedLeaf.position)
    gsap.killTweensOf(currentSelectedLeaf.rotation)
    gsap.to(currentSelectedLeaf.position, { x: -10.4, y: 11, z: 3.73, duration: 1.3 })
    gsap.to(currentSelectedLeaf.rotation, { x: 1, y: 1.8, z: 0, duration: 1.3 })


    disableLeafClick = true
    let newPhrase = randomPhrase()

    let message = document.getElementById("message")
    let autor = document.getElementById("autor")

    message.innerText = newPhrase.mensagem
    autor.innerText = `- ${newPhrase.autor}`

    let element = document.getElementById("container")
    gsap.to(element, { translateX: -50, opacity: 0, ease: "easeIn", duration: 1.3 })

    let messageContainer = document.getElementById("messageContainer")
    messageContainer.style.display = 'flex'
    gsap.fromTo(messageContainer, { opacity: 0 }, { opacity: 1, ease: "ease", duration: 1.3, delay: 1 })

}

document.getElementById("closeMessage").addEventListener("mousedown", () => {

    let messageContainer = document.getElementById("messageContainer")
    messageContainer.style.display = 'none'

    let element = document.getElementById("container")
    gsap.fromTo(
        element,
        { translateX: +50, opacity: 0 },
        {
            translateX: 0, opacity: 1, ease: "easeInOut", duration: 1, delay: 0.3,
        }
    )

    gsap.to(currentSelectedLeaf.rotation, { x: 0, y: 0, z: 0, ease: "none", duration: 1 })
    gsap.to(currentSelectedLeaf.position, {
        x: -12, y: -2, z: -2, ease: "bounce.out", duration: 1, onComplete: () => {
            currentSelectedLeaf.position.x = THREE.MathUtils.randFloat(35, 20)
            currentSelectedLeaf.position.y = THREE.MathUtils.randFloat(-8, 8)
            currentSelectedLeaf.position.z = THREE.MathUtils.randFloat(25, -15)
            currentSelectedLeaf.children[0].material.color.set(new THREE.Color('rgb(61, 143, 81)'))
            currentSelectedLeaf.children[1].material.color.set(new THREE.Color('rgb(61, 143, 81)'))
            randomWindBehavior(currentSelectedLeaf)
            disableLeafHover = false
            currentSelectedLeaf = undefined
            disableLeafClick = false
        }
    })



})

window.addEventListener("mousemove", onMouseMove)
window.addEventListener("mousedown", onMouseClick)
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

document.getElementById("wind").addEventListener("mouseenter", (e) => {
    if (!disableLeafHover) {
        disableLeafHover = true
        disableLeafClick = true
    }

    if(currentSelectedLeaf !== undefined){
        currentSelectedLeaf.children[0].material.color.set(new THREE.Color('rgb(61, 143, 81)'))
        currentSelectedLeaf.children[1].material.color.set(new THREE.Color('rgb(61, 143, 81)'))
        currentSelectedLeaf = undefined
        disableLeafHover = true
        disableLeafClick = true
    }

    gsap.to(e.target, { rotate: 720, duration: 0.5, ease: "easeInOut" })
})

document.getElementById("wind").addEventListener("mouseleave", (e) => {
    if (!showingDevInfo) {
        disableLeafHover = false
        disableLeafClick = false
    }
    gsap.to(e.target, { rotate: 360, duration: 0.5, ease: "easeInOut" })
})

document.getElementById("wind").addEventListener("mousedown", (e) => {

    let devInfo = document.getElementById("devInfo")
    if (gsap.getTweensOf(devInfo).length > 0 || !playedStartAnimation) return

    showingDevInfo = true
    zoomCameraAnimation()

})


render()