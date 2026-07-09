import { Component, Suspense, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Cloud } from "@react-three/drei";
import type { Group } from "three";

// Real WebGL smoke, layered over the (still admin-editable, untouched) hero
// photo - volumetric-looking cloud puffs drifting and slowly rotating in 3D
// space, in place of the flat CSS blur blobs. Dynamically imported by
// ScrollDepthHero (see the `lazy()` call there) so this module - and the
// three.js/r3f/drei weight it pulls in - only ever downloads for visitors
// who are actually going to see it (client mounted, motion not reduced);
// everyone else never fetches this chunk at all. Wrapped in an error
// boundary: if WebGL context creation fails on some device/browser, this
// silently renders nothing instead of taking the whole page down - the CSS
// SmokeLayer underneath is the fallback in both cases.
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function DriftingSmoke() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.02;
    group.current.position.y = -1.4 + Math.sin(t * 0.15) * 0.15;
  });

  return (
    <group ref={group} position={[0, -1.4, 0]}>
      <Cloud
        seed={1}
        segments={30}
        bounds={[5, 2.4, 2]}
        volume={7}
        color="#f5efe4"
        opacity={0.55}
        fade={40}
        speed={0.15}
        growth={4}
        position={[-0.6, 0, 0]}
      />
      <Cloud
        seed={7}
        segments={24}
        bounds={[4, 2, 2]}
        volume={6}
        color="#c9a876"
        opacity={0.4}
        fade={40}
        speed={0.2}
        growth={4}
        position={[1, 0.5, -0.5]}
      />
    </group>
  );
}

// Caller (ScrollDepthHero) only renders this - via lazy() - once it has
// already confirmed client-mounted + motion-safe, so no gating needed here.
export function SmokeScene3D() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <WebGLBoundary>
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: false }}
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={1.2} />
            <DriftingSmoke />
          </Canvas>
        </Suspense>
      </WebGLBoundary>
    </div>
  );
}
