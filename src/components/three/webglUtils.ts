import * as THREE from 'three';

export function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scheduleSoftwareFrame(
  renderer: THREE.WebGLRenderer,
  cb: () => void,
  registerTimer: (id: number) => void
): void {
  const gl = renderer.getContext();
  if ('fenceSync' in gl && typeof gl.fenceSync === 'function') {
    const webgl2 = gl as WebGL2RenderingContext;
    const sync = webgl2.fenceSync(webgl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
    webgl2.flush();
    const poll = () => {
      const state = sync ? webgl2.getSyncParameter(sync, webgl2.SYNC_STATUS) : webgl2.SIGNALED;
      if (state === webgl2.UNSIGNALED) {
        registerTimer(window.setTimeout(poll, 6));
      } else {
        if (sync) webgl2.deleteSync(sync);
        registerTimer(window.setTimeout(cb, 80));
      }
    };
    registerTimer(window.setTimeout(poll, 6));
  } else {
    registerTimer(window.setTimeout(cb, 80));
  }
}

export function disposeObjectHierarchy(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    const mat = (mesh as { material?: THREE.Material | THREE.Material[] }).material;
    if (mat) {
      const list = Array.isArray(mat) ? mat : [mat];
      list.forEach((m) => {
        const record = m as unknown as Record<string, unknown>;
        Object.values(record).forEach((val) => {
          if (val instanceof THREE.Texture) {
            val.dispose();
          }
        });
        m.dispose();
      });
    }
  });
}
