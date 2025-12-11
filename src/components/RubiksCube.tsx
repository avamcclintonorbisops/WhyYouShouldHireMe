import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export type CubeColor = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'white'

export type CubeFace = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom'

export type CubeSticker = {
  id: number
  face: CubeFace
  row: number
  col: number
  color: CubeColor
  title: string
  description: string
}

interface RubiksCubeProps {
  allStickers: CubeSticker[]
  onSelectSticker: (stickerId: number) => void
}

// Color values for each CubeColor
const colorMap: Record<CubeColor, string> = {
  red: '#e74c3c',
  blue: '#3498db',
  green: '#2ecc71',
  yellow: '#f1c40f',
  orange: '#e67e22',
  white: '#ffffff'
}

// Sticker component - a clickable plane
interface StickerProps {
  position: [number, number, number]
  rotation: [number, number, number]
  color: CubeColor
  stickerId: number
  onSelectSticker: (stickerId: number) => void
}

function Sticker({ position, rotation, color, stickerId, onSelectSticker }: StickerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1.0)
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    onSelectSticker(stickerId)
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <planeGeometry args={[0.9, 0.9]} />
      <meshStandardMaterial 
        color={colorMap[color]} 
        emissive={colorMap[color]}
        emissiveIntensity={hovered ? 0.4 : 0.2}
        metalness={0.1}
        roughness={0.3}
      />
    </mesh>
  )
}

// Face component - creates a 3×3 grid of stickers on one face
interface FaceProps {
  face: CubeFace
  stickers: CubeSticker[]
  onSelectSticker: (stickerId: number) => void
  cubeSize: number
}

function Face({ face, stickers, onSelectSticker, cubeSize }: FaceProps) {
  const stickerSize = 0.9
  const gap = 0.05
  const offset = (cubeSize / 2) + 0.01 // Slightly outside the cube
  const totalSize = 3 * stickerSize + 2 * gap
  const startOffset = -totalSize / 2 + stickerSize / 2

  // Filter stickers for this face and sort by row, then col
  const faceStickers = stickers
    .filter((s) => s.face === face)
    .sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row
      return a.col - b.col
    })

  const stickerElements: React.ReactElement[] = []

  // Create 3×3 grid of stickers
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const sticker = faceStickers[row * 3 + col]
      if (!sticker) continue

      // Calculate local x and y positions in the face's coordinate system
      const localX = startOffset + col * (stickerSize + gap)
      const localY = startOffset + (2 - row) * (stickerSize + gap) // Flip Y so top row is first
      
      let position: [number, number, number] = [0, 0, 0]
      let rotation: [number, number, number] = [0, 0, 0]

      // Calculate position and rotation based on face
      switch (face) {
        case 'front': // +Z face
          position = [localX, localY, offset]
          rotation = [0, 0, 0]
          break
        case 'back': // -Z face
          position = [-localX, localY, -offset]
          rotation = [0, Math.PI, 0]
          break
        case 'right': // +X face
          position = [offset, localY, -localX]
          rotation = [0, Math.PI / 2, 0]
          break
        case 'left': // -X face
          position = [-offset, localY, localX]
          rotation = [0, -Math.PI / 2, 0]
          break
        case 'top': // +Y face
          position = [localX, offset, -localY]
          rotation = [-Math.PI / 2, 0, 0]
          break
        case 'bottom': // -Y face
          position = [localX, -offset, localY]
          rotation = [Math.PI / 2, 0, 0]
          break
      }

      stickerElements.push(
        <Sticker
          key={`${face}-${row}-${col}-${sticker.id}`}
          position={position}
          rotation={rotation}
          color={sticker.color}
          stickerId={sticker.id}
          onSelectSticker={onSelectSticker}
        />
      )
    }
  }

  return <>{stickerElements}</>
}

// Main cube mesh component
interface CubeMeshProps {
  allStickers: CubeSticker[]
  onSelectSticker: (stickerId: number) => void
}

export interface CubeMeshHandle {
  handleDragStart: () => void
  handleDragEnd: () => void
}

const CubeMesh = forwardRef<CubeMeshHandle, CubeMeshProps>(
  ({ allStickers, onSelectSticker }, ref) => {
    const cubeSize = 3
    const faces: CubeFace[] = ['front', 'back', 'left', 'right', 'top', 'bottom']
    
    // Auto-rotation state and refs
    const cubeRef = useRef<THREE.Group>(null)
    const idleTimeoutRef = useRef<number | null>(null)
    
    // Rotation speed with easing
    const currentSpeedRef = useRef(0) // what we're actually using each frame
    const targetSpeedRef = useRef(0.004) // desired speed when fully auto-rotating

    // Auto-rotation with easing
    useFrame(() => {
      const cube = cubeRef.current
      if (!cube) return

      // Smoothly ease currentSpeed toward targetSpeed
      const ease = 0.04 // smaller = slower easing
      currentSpeedRef.current +=
        (targetSpeedRef.current - currentSpeedRef.current) * ease

      // Only rotate if speed is not effectively zero
      if (Math.abs(currentSpeedRef.current) > 0.00001) {
        cube.rotation.y += currentSpeedRef.current
        // Optional tiny wobble:
        cube.rotation.x = THREE.MathUtils.lerp(cube.rotation.x, 0.25, 0.03)
      }
    })

    // Handle drag start - stop auto-rotation immediately
    const handleDragStart = () => {
      targetSpeedRef.current = 0
      if (idleTimeoutRef.current) {
        window.clearTimeout(idleTimeoutRef.current)
        idleTimeoutRef.current = null
      }
    }

    // Handle drag end - resume auto-rotation after idle delay
    const handleDragEnd = () => {
      if (idleTimeoutRef.current) {
        window.clearTimeout(idleTimeoutRef.current)
      }
      idleTimeoutRef.current = window.setTimeout(() => {
        // ramp back up to a gentle speed
        targetSpeedRef.current = 0.004
      }, 4000) // 4s of idle before resuming
    }

    // Expose handlers via ref
    useImperativeHandle(ref, () => ({
      handleDragStart,
      handleDragEnd
    }))

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (idleTimeoutRef.current) {
          window.clearTimeout(idleTimeoutRef.current)
        }
      }
    }, [])

    return (
      <group ref={cubeRef}>
        {/* Central cube structure (semi-visible for reference) */}
        <mesh>
          <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
          <meshStandardMaterial color="#2a2a2a" transparent opacity={0.3} />
        </mesh>

        {/* Create all 6 faces with their stickers */}
        {faces.map((face) => (
          <Face
            key={face}
            face={face}
            stickers={allStickers}
            onSelectSticker={onSelectSticker}
            cubeSize={cubeSize}
          />
        ))}
      </group>
    )
  }
)

// Main RubiksCube component
export default function RubiksCube({ allStickers, onSelectSticker }: RubiksCubeProps) {
  const cubeMeshRef = useRef<CubeMeshHandle>(null)

  const handleDragStart = () => {
    cubeMeshRef.current?.handleDragStart()
  }

  const handleDragEnd = () => {
    cubeMeshRef.current?.handleDragEnd()
  }

  return (
    <div style={{ width: '100%', position: 'relative', aspectRatio: '1 / 1', minHeight: '400px' }}>
      <Canvas
        camera={{ position: [7, 7, 7], fov: 45 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.6} />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          minDistance={6}
          maxDistance={15}
          enablePan={false}
          autoRotate={false}
          onStart={handleDragStart}
          onEnd={handleDragEnd}
        />

        {/* Cube */}
        <CubeMesh 
          ref={cubeMeshRef}
          allStickers={allStickers} 
          onSelectSticker={onSelectSticker}
        />
      </Canvas>
    </div>
  )
}
