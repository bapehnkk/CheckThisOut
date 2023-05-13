import {Component, createEffect, createSignal, onCleanup, onMount} from "solid-js";
import * as THREE from "three";
import {createNoise2D, createNoise3D} from "simplex-noise";
import alea from "alea";
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {useQueueStore} from "../store/AudioPlayer";

// @ts-ignore
import glslify from 'glslify';


function avg(arr: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
}

function max(arr: Uint8Array): number {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

function modulate(val: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
    return ((val - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow) + toLow;
}

function createBall(
    color: THREE.ColorRepresentation | undefined,
    positionZ: THREE.ColorRepresentation | undefined,
    scale: number
) {
    const material = new THREE.MeshPhongMaterial({
        color: color,
        specular: 0x999999,
        shininess: 100,
    });

    const geometry = new THREE.SphereGeometry(scale, 40, 40);
    const ball = new THREE.Mesh(geometry, material);
    if (typeof positionZ === "number") {
        ball.position.set(0, 0, positionZ);
    }
    return ball;
}

export const Visualizer: Component = () => {
    const seed = "seed";
    const noise2D = createNoise2D(alea(seed));
    const noise3D = createNoise3D(alea(seed));


    const rotationAngle: number = 40;
    const rotationTime: number = 1000;

    let startAngle: number = 0;
    let rotationSpeed = (rotationAngle * Math.PI / 180) / rotationTime; // 40 градусов (20 + 20) в радианах, деленные на 10 секунд
    let direction = 1;

    const nordColors = [
        0x88C0D0, // Цвет Nord dark 0
        0xB48EAD, // Цвет Nord dark 1
        0x81A1C1, // Цвет Nord dark 2
        0xEBCB8B, // Цвет Nord dark 3
        0xA3BE8C, // Цвет Nord dark 4
        0xBF616A, // Цвет Nord dark 5
        0xECEFF4, // Цвет Nord dark 6
    ];
    const scaleMultiplier = window.innerWidth < 370 ? 1.7 : window.innerWidth < 400 ? 2 : 2.3;


    let analyser: AnalyserNode;
    let out: HTMLElement;
    let audioContext = new (window.AudioContext)();
    let animationFrameId: number;
    let syncCheckIntervalId: NodeJS.Timer;

    const [queueStore, setQueueStore] = useQueueStore();
    let scene = new THREE.Scene();
    const topScene = new THREE.Scene();
    let renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.autoClear = false;


    async function setupAudioContext(context: AudioContext) {

        const response = await fetch(queueStore.tracks.at((queueStore.nowPlaying))!.music_file!);
        const arrayBuffer = await response.arrayBuffer();

        const source = context.createBufferSource();
        analyser = context.createAnalyser();
        analyser.fftSize = 512;

        // console.log(arrayBuffer)
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        source.buffer = audioBuffer;
        if (queueStore.playing) {
            source.connect(analyser);
            source.start(0, queueStore.audio.currentTime);
        }

    }


    const play = async () => {
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        let group = new THREE.Group();
        let dvd = new THREE.Group();
        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        let outRect = out.getBoundingClientRect();

        camera.aspect = outRect.width / outRect.height;
        camera.updateProjectionMatrix();

        camera.position.set(0, 0, 100);
        camera.lookAt(scene.position);
        scene.add(camera);

        renderer.setSize(outRect.width, outRect.height);

        // renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);


        const colors = [nordColors[6], nordColors[0], nordColors[1], nordColors[4], nordColors[3], nordColors[5]];
        const scales = [13.5, 18.5, 22, 23.5, 26.5, 31];
        const positions = [-50, -90, -110, -120, -150, -185];

        colors.forEach((color, index) => {
            const ball = createBall(color, positions[index], scales[index]);
            ball.scale.multiplyScalar(scaleMultiplier);
            group.add(ball);
        });


        ///////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////
        // Create disk
        const textureLoader = new THREE.TextureLoader();

        // normal color
        createEffect(() => {
            queueStore.nowPlaying
            textureLoader.load(queueStore.tracks.at(queueStore.nowPlaying)!.images[0]!.image_file, (outerTexture) => {
                const geometry = new THREE.RingGeometry(0, 10, 64);

                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        texture1: {value: outerTexture},
                    },
                    vertexShader: glslify(`
                        varying vec2 vUv;
        
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `),
                    fragmentShader: glslify(`
                        uniform sampler2D texture1;
                        varying vec2 vUv;
        
                        void main() {
                            vec4 color = texture2D(texture1, vUv);
                            float alpha = 1.0 - smoothstep(0.9, 0.95, length(vUv - 0.5) * 2.0);
                            gl_FragColor = vec4(color.rgb, color.a * alpha);
                        }
                    `),
                    side: THREE.DoubleSide,
                    transparent: true,
                });

                while (dvd.children.length > 0) {
                    dvd.remove(dvd.children[0]);
                }
                const mesh = new THREE.Mesh(geometry, material);
                mesh.scale.multiplyScalar(scaleMultiplier);
                dvd.add(mesh);
            });
        });


        const geometry = new THREE.RingGeometry(1.9, 2, 64);
        const material = new THREE.MeshBasicMaterial({color: 0x3B4252, side: THREE.DoubleSide});
        const mesh = new THREE.Mesh(geometry, material);
        // dvd.add(mesh);

        const geometry2 = new THREE.RingGeometry(0, 1.9, 50);
        const material2 = new THREE.MeshBasicMaterial({color: 0x626b7d, side: THREE.DoubleSide});
        const mesh2 = new THREE.Mesh(geometry2, material2);

        // dvd.add(mesh2);
        const geometry3 = new THREE.RingGeometry(10, 10.1, 64);
        const material3 = new THREE.MeshBasicMaterial({color: 0x3B4252, side: THREE.DoubleSide});
        const mesh3 = new THREE.Mesh(geometry3, material3);

        // dvd.add(mesh3);


        // create light
        let ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);


        scene.add(group);
        topScene.add(dvd);


        out.appendChild(renderer.domElement);


        onWindowResize();
        window.addEventListener('resize', onWindowResize, false);


        function render() {
            analyser.getByteFrequencyData(dataArray);

            let lowerHalfArray = dataArray.slice(0, (dataArray.length / 2) - 1);
            let upperHalfArray = dataArray.slice((dataArray.length / 2) - 1, dataArray.length - 1);

            let overallAvg = avg(dataArray);
            let lowerMax = max(lowerHalfArray);
            let lowerAvg = avg(lowerHalfArray);
            let upperMax = max(upperHalfArray);
            let upperAvg = avg(upperHalfArray);

            let lowerMaxFr = lowerMax / lowerHalfArray.length;
            let lowerAvgFr = lowerAvg / lowerHalfArray.length;
            let upperMaxFr = upperMax / upperHalfArray.length;
            let upperAvgFr = upperAvg / upperHalfArray.length;


            function applyRoughnessToBalls(
                balls: any,
                lowerMaxFr: number,
                upperAvgFr: number
            ) {
                balls.forEach((ball, index) => {
                    makeRoughBall(
                        ball,
                        modulate(Math.pow(lowerMaxFr, 1 + index * 0.01), 0, 1, 0, 1),
                        modulate(upperAvgFr, 0, 1, 0, 2)
                    );
                });
            }

            applyRoughnessToBalls(group.children, lowerMaxFr, upperAvgFr);


            // Dvd rotations
            startAngle += rotationSpeed * direction;
            if (startAngle >= (rotationAngle * Math.PI / 180)) {
                direction = -1;
            } else if (startAngle <= (-rotationAngle * Math.PI / 180)) {
                direction = 1;
            }

            // Вращаем объект вокруг оси Z
            dvd.rotation.z = startAngle;
            group.rotation.z = startAngle;


            // renderer.render(scene, camera);
            // renderer.clearDepth(); // очистить буфер глубины
            // renderer.render(topScene, camera);
            // animationFrameId = requestAnimationFrame(render);

            renderer.clear();
            renderer.render(scene, camera);
            renderer.clearDepth(); // очистите буфер глубины
            renderer.render(topScene, camera);
            animationFrameId = requestAnimationFrame(render);
        }

        render();

        function onWindowResize() {
            outRect = out.getBoundingClientRect();
            camera.aspect = outRect.width / outRect.height;
            camera.updateProjectionMatrix();
            renderer.setSize(outRect.width, outRect.height);
        }


        function makeRoughBall(mesh: THREE.Mesh, bassFr: number, treFr: number) {
            const positionAttribute = mesh.geometry.getAttribute("position");

            positionAttribute.array.forEach((_, i) => {
                const vertex = new THREE.Vector3(
                    positionAttribute.getX(i),
                    positionAttribute.getY(i),
                    positionAttribute.getZ(i)
                );
                const offset = mesh.geometry.parameters.radius;
                const amp = 7;
                const time = window.performance.now();
                const rf = 0.00005;
                vertex.normalize();
                const distance =
                    (offset + bassFr) +
                    noise3D(
                        vertex.x + time * rf * 7,
                        vertex.y + time * rf * 8,
                        vertex.z + time * rf * 9
                    ) *
                    amp *
                    treFr;
                vertex.multiplyScalar(distance);

                positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
            });

            positionAttribute.needsUpdate = true;
            mesh.geometry.computeVertexNormals();
        }
    };


    function checkingForOutOfSync() {
        let lastKnownAudioTime = queueStore.audio.currentTime;
        let driftThreshold = 0.5; // в секундах

        syncCheckIntervalId = setInterval(() => {
            let expectedAudioTime = lastKnownAudioTime + 5;
            let actualAudioTime = queueStore.audio.currentTime;

            if (Math.abs(expectedAudioTime - actualAudioTime) > driftThreshold) {
                // рассинхронизация обнаружена, перезапуск визуализации
                setupAudioContext(audioContext);
            }

            lastKnownAudioTime = queueStore.audio.currentTime;
        }, 5000);
    }


    onMount(async () => {
        out = document.getElementById("out") as HTMLElement;

        await setupAudioContext(audioContext);

        await play();

        checkingForOutOfSync();
    });

    createEffect(async () => {
        // Здесь вызывается эффект
        queueStore.playing;
        queueStore.audio;
        queueStore.audioTime;
        queueStore.nowPlaying;

        // if (queueStore.playing) {
        //     console.log("play");
        // } else {
        //     console.log("stop");
        // }

        await setupAudioContext(audioContext);
    });

    onCleanup(() => {
        // console.log("Cleaning up");
        cancelAnimationFrame(animationFrameId);
        // window.removeEventListener("resize", onWindowResize);
        try {

            analyser.disconnect();
        } catch (e) {
        }
        cleanupAudioContext(audioContext);
        renderer.clear();
        renderer.dispose();

        scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.geometry.dispose();
                obj.material.dispose();
            }
            if (obj instanceof THREE.Texture) {
                obj.dispose();
            }
        });
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        topScene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.geometry.dispose();
                obj.material.dispose();
            }
            if (obj instanceof THREE.Texture) {
                obj.dispose();
            }
        });
        while (topScene.children.length > 0) {
            topScene.remove(topScene.children[0]);
        }

        // clear out of sync check
        if (syncCheckIntervalId) {
            clearInterval(syncCheckIntervalId);
        }
    });


    function cleanupAudioContext(context: AudioContext) {
        if (context) {
            context.close().then(() => {
                // console.log("Audio context closed");
            });
        }
    }


    return (
        <div class={"visualizer"}>
            <div id="out"></div>
        </div>
    );
}

export default Visualizer;