"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'

interface Obj{
    width: number,
    height: number,
    length: number,
    name?: string
  }

interface ObjProps{
    moneyObject: Obj,
    searchObject: Obj
}

export default function Viewer(props:ObjProps){

    return(
        <Canvas camera={{position: [Math.max(props.moneyObject.height, props.searchObject.height)*2, 10, 2]}}>
            <ambientLight intensity={1} />
            <directionalLight color="white" position={[0, 0, 5]} />
            <mesh 
                scale={[props.moneyObject.width, props.moneyObject.height, props.moneyObject.length]}
                position={[-props.moneyObject.width*0.5, 0, 0]}
            >
                <boxGeometry attach="geometry" />
                <meshStandardMaterial attach="material" color="#6be092" />
            </mesh>
            <mesh 
                scale={[props.searchObject.width, props.searchObject.height, props.searchObject.length]}
                position={[props.searchObject.width, 0, 0]}
            >
                <boxGeometry attach="geometry" />
                <meshStandardMaterial attach="material" color="blue" />
            </mesh>
            <OrbitControls />
        </Canvas>
    );
}