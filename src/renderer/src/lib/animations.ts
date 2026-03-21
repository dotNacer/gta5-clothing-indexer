import gsap from 'gsap'

/**
 * Svelte action: fade in + slide up on mount
 */
export function fadeIn(
  node: HTMLElement,
  params: { duration?: number; y?: number; delay?: number } = {}
) {
  const { duration = 0.4, y = 12, delay = 0 } = params
  gsap.from(node, {
    opacity: 0,
    y,
    duration,
    delay,
    ease: 'power2.out',
    clearProps: 'transform'
  })
  return { destroy() {} }
}

/**
 * Svelte action: stagger children on mount
 */
export function staggerIn(
  node: HTMLElement,
  params: { duration?: number; y?: number; stagger?: number; childSelector?: string } = {}
) {
  const { duration = 0.35, y = 10, stagger = 0.04, childSelector = ':scope > *' } = params
  const children = node.querySelectorAll(childSelector)
  if (children.length === 0) return { destroy() {} }

  gsap.from(children, {
    opacity: 0,
    y,
    duration,
    stagger,
    ease: 'power2.out',
    clearProps: 'transform'
  })
  return { destroy() {} }
}

/**
 * Svelte action: hover lift effect (translateY + shadow)
 */
export function hoverLift(node: HTMLElement, params: { y?: number } = {}) {
  const { y = -2 } = params
  let hoverTween: gsap.core.Tween | null = null

  function onEnter() {
    hoverTween?.kill()
    hoverTween = gsap.to(node, {
      y,
      duration: 0.2,
      ease: 'power2.out'
    })
  }

  function onLeave() {
    hoverTween?.kill()
    hoverTween = gsap.to(node, {
      y: 0,
      duration: 0.2,
      ease: 'power2.out'
    })
  }

  node.addEventListener('mouseenter', onEnter)
  node.addEventListener('mouseleave', onLeave)

  return {
    destroy() {
      hoverTween?.kill()
      node.removeEventListener('mouseenter', onEnter)
      node.removeEventListener('mouseleave', onLeave)
      gsap.set(node, { clearProps: 'transform' })
    }
  }
}

/**
 * Svelte action: slide up from below
 */
export function slideUp(
  node: HTMLElement,
  params: { duration?: number; y?: number } = {}
) {
  const { duration = 0.35, y = 40 } = params
  gsap.from(node, {
    y,
    opacity: 0,
    duration,
    ease: 'back.out(1.2)',
    clearProps: 'transform'
  })
  return { destroy() {} }
}

/**
 * Animate panel open (width expand)
 */
export function animatePanelOpen(el: HTMLElement, targetWidth: string): gsap.core.Tween {
  gsap.set(el, { width: 0, opacity: 0, overflow: 'hidden' })
  return gsap.to(el, {
    width: targetWidth,
    opacity: 1,
    duration: 0.4,
    ease: 'power3.out',
    clearProps: 'overflow'
  })
}

/**
 * Animate panel close (width collapse)
 */
export function animatePanelClose(el: HTMLElement): gsap.core.Tween {
  return gsap.to(el, {
    width: 0,
    opacity: 0,
    duration: 0.3,
    ease: 'power3.in',
    overflow: 'hidden'
  })
}

/**
 * Svelte action: click scale pulse
 */
export function clickPulse(node: HTMLElement) {
  function onClick() {
    gsap.fromTo(
      node,
      { scale: 0.97 },
      { scale: 1, duration: 0.2, ease: 'power2.out', clearProps: 'transform' }
    )
  }

  node.addEventListener('click', onClick)
  return {
    destroy() {
      node.removeEventListener('click', onClick)
    }
  }
}

// ── Drag & Drop animations ──────────────────────────────────

/**
 * Dim the source card when drag starts
 */
export function dragLift(node: HTMLElement): gsap.core.Tween {
  return gsap.to(node, {
    scale: 0.95,
    opacity: 0.4,
    duration: 0.2,
    ease: 'power2.out'
  })
}

/**
 * Restore the source card when drag is cancelled
 */
export function dragRelease(node: HTMLElement): gsap.core.Tween {
  return gsap.to(node, {
    scale: 1,
    opacity: 1,
    duration: 0.25,
    ease: 'power2.out',
    clearProps: 'transform,opacity'
  })
}

/**
 * Pop-in animation for the drag ghost
 */
export function ghostAppear(node: HTMLElement): gsap.core.Tween {
  return gsap.from(node, {
    scale: 0.6,
    opacity: 0,
    duration: 0.2,
    ease: 'back.out(2)'
  })
}

/**
 * Fly the ghost clone to the cart drop zone
 */
export function flyToCart(
  node: HTMLElement,
  targetRect: DOMRect
): Promise<void> {
  return new Promise((resolve) => {
    gsap.to(node, {
      x: targetRect.x + targetRect.width / 2 - 60,
      y: targetRect.y + targetRect.height / 2 - 20,
      scale: 0.2,
      opacity: 0,
      rotation: -12,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: resolve
    })
  })
}

/**
 * Svelte action: pop-in for a cart thumbnail item
 */
export function cartItemPopIn(
  node: HTMLElement,
  params: { delay?: number } = {}
) {
  const { delay = 0 } = params
  gsap.from(node, {
    scale: 0,
    opacity: 0,
    duration: 0.3,
    delay,
    ease: 'back.out(3)'
  })
  return { destroy() {} }
}

/**
 * Animate cart item removal, returns a promise
 */
export function cartItemPopOut(node: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    gsap.to(node, {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: resolve
    })
  })
}

/**
 * Toggle glow effect on the drop zone
 */
export function dropZoneGlow(
  node: HTMLElement,
  active: boolean
): gsap.core.Tween {
  if (active) {
    return gsap.to(node, {
      boxShadow: '0 -4px 24px 0 oklch(0.65 0.25 290 / 0.35), inset 0 1px 0 0 oklch(0.65 0.25 290 / 0.25)',
      borderColor: 'oklch(0.65 0.25 290 / 0.6)',
      duration: 0.3,
      ease: 'power2.out'
    })
  } else {
    return gsap.to(node, {
      boxShadow: '0 0 0 0 transparent',
      borderColor: '',
      duration: 0.25,
      ease: 'power2.in',
      clearProps: 'boxShadow,borderColor'
    })
  }
}
