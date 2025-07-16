// src/main.ts

import loadBuiltinSources from './sources'

;(async () => {
  // ──────────────────────────────────────────────────────────────────────────
  // 1) Initialize FingerprintJS’s built-in loader with an empty cache
  // ──────────────────────────────────────────────────────────────────────────
  const loadSources = loadBuiltinSources({ cache: {} })
  const components = await loadSources()

  // ──────────────────────────────────────────────────────────────────────────
  // 2) UTILITY: compute SHA-256 hex from a string
  // ──────────────────────────────────────────────────────────────────────────
  async function computeSha256Hex(str: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

// ──────────────────────────────────────────────────────────────────────────
  // 3) AUDIO FINGERPRINTING WITH ANIMATION
  // ──────────────────────────────────────────────────────────────────────────
  
  // Animation control functions
  function activateStep(stepId: string) {
    const step = document.getElementById(stepId)
    if (step) {
      step.classList.add('active')
    }
  }

  function completeStep(stepId: string) {
    const step = document.getElementById(stepId)
    if (step) {
      step.classList.remove('active')
      step.classList.add('completed')
    }
  }

  function drawWave(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerY = height / 2

    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = '#4a9eff'
    ctx.lineWidth = 2
    ctx.beginPath()

    const frequency = 4
    const amplitude = height * 0.3
    let time = 0

    function animate() {
      if (!ctx) return
      
      ctx.clearRect(0, 0, width, height)
      ctx.beginPath()
      
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin((x / width) * frequency * Math.PI * 2 + time) * amplitude
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()
      time += 0.1
      
      if (document.getElementById('step-oscillator')?.classList.contains('active')) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }

  // Start audio animation sequence
  async function animateAudioProcess(finalValue: number) {
    // Step 1: Oscillator
    activateStep('step-oscillator')
    const canvas = document.getElementById('wave-canvas') as HTMLCanvasElement
    if (canvas) {
      drawWave(canvas)
    }
    await new Promise(resolve => setTimeout(resolve, 2000))
    completeStep('step-oscillator')

    // Step 2: Compressor
    activateStep('step-compressor')
    await new Promise(resolve => setTimeout(resolve, 2000))
    completeStep('step-compressor')

    // Step 3: Browser processing
    activateStep('step-browser')
    await new Promise(resolve => setTimeout(resolve, 2000))
    completeStep('step-browser')

    // Step 4: Show result
    activateStep('step-result')
    const animatedValueEl = document.getElementById('animated-audio-value')
    if (animatedValueEl) {
      // Animate the number counting up
      const duration = 1000
      const startTime = Date.now()
      const startValue = 0
      
      function updateValue() {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const currentValue = Math.floor(startValue + (finalValue - startValue) * progress)
        
        if (animatedValueEl) {
          animatedValueEl.textContent = String(currentValue)
        }
        
        if (progress < 1) {
          requestAnimationFrame(updateValue)
        } else if (animatedValueEl) {
          animatedValueEl.classList.add('highlight')
        }
      }
      
      updateValue()
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    completeStep('step-result')
  }

  const audioComponent = components.audio as { value: unknown }
  const rawAudio = audioComponent.value

  let audioValue: number
  if (typeof rawAudio === 'function') {
    // Some browsers return a function to call
    audioValue = await (rawAudio as () => Promise<number>)()
  } else {
    audioValue = rawAudio as number
  }

  // Start the animation sequence
  animateAudioProcess(audioValue)

  // Plug into HTML placeholder:
  const audioValueEl = document.getElementById('audio-value')
  if (audioValueEl) {
    audioValueEl.textContent = String(audioValue)
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4) CANVAS FINGERPRINTING (with animations & drawings)
  // ──────────────────────────────────────────────────────────────────────────
  const canvasComponent = components.canvas as { value: unknown }
  const rawCanvas = canvasComponent.value as {
    winding: boolean
    geometry: string
    text: string
  }
  const { winding, geometry, text } = rawCanvas

  // Compute the SHA-256 of “winding|geometry|text”
  const canvasCombined = [winding ? '1' : '0', geometry, text].join('|')
  const canvasHash = await computeSha256Hex(canvasCombined)

  // Fill in the “winding” and “hash” spans
  const canvasWindingEl = document.getElementById('canvas-winding')
  if (canvasWindingEl) {
    canvasWindingEl.textContent = String(winding)
  }

  const canvasHashEl = document.getElementById('canvas-hash')
  if (canvasHashEl) {
    canvasHashEl.textContent = canvasHash
  }

  // Set the <img> src attributes (base64 data URLs provided by FingerprintJS)
  const canvasGeomImg = document.getElementById('canvas-geometry-img') as HTMLImageElement | null
  if (canvasGeomImg) {
    canvasGeomImg.src = geometry
  }

  const canvasTextImg = document.getElementById('canvas-text-img') as HTMLImageElement | null
  if (canvasTextImg) {
    canvasTextImg.src = text
  }

  // -- CANVAS DRAWING FUNCTIONS --

  function drawContextCanvas() {
    const canvas = document.getElementById('context-canvas') as HTMLCanvasElement | null
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = '#7b64f1'
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, width - 20, height - 20)
  }

  function drawGeometryCanvas() {
    const canvas = document.getElementById('geometry-canvas') as HTMLCanvasElement | null
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    ctx.beginPath()
    ctx.arc(width * 0.3, height * 0.5, 40, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(123, 100, 241, 0.6)'
    ctx.fill()

    ctx.fillStyle = 'rgba(58, 123, 213, 0.6)'
    ctx.fillRect(width * 0.5, height * 0.3, 80, 80)

    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(width * 0.2, height * 0.8)
    ctx.lineTo(width * 0.8, height * 0.2)
    ctx.stroke()
  }

  function drawTextCanvas() {
    const canvas = document.getElementById('text-canvas') as HTMLCanvasElement | null
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    ctx.font = '20px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Cwm fjord bank glyphs vext quiz', 20, 50)

    ctx.font = 'italic 18px Georgia'
    ctx.fillStyle = '#b0b0b0'
    ctx.fillText('Sphinx of black quartz, judge my vow', 20, 90)
  }

  function samplePixels() {
    const samplingCanvas = document.getElementById('sampling-canvas') as HTMLCanvasElement | null
    const geometryCanvas = document.getElementById('geometry-canvas') as HTMLCanvasElement | null
    const textCanvas = document.getElementById('text-canvas') as HTMLCanvasElement | null
    if (!samplingCanvas || !geometryCanvas || !textCanvas) return
    const sCtx = samplingCanvas.getContext('2d')
    if (!sCtx) return

    const width = samplingCanvas.width
    const height = samplingCanvas.height
    sCtx.clearRect(0, 0, width, height)

    const gCtx = geometryCanvas.getContext('2d')
    const tCtx = textCanvas.getContext('2d')
    if (gCtx && tCtx) {
      sCtx.drawImage(geometryCanvas, 0, 0)
      sCtx.drawImage(textCanvas, 0, 0)
      const pixelData = sCtx.getImageData(0, 0, width, height).data
      // We’re not using pixelData here—this is just to illustrate sampling.
    }
  }

  async function animateCanvasProcess() {
    // Step 1: Context Setup
    activateStep('step-context')
    drawContextCanvas()
    await new Promise((resolve) => setTimeout(resolve, 1500))
    completeStep('step-context')

    // Step 2: Geometric Rendering
    activateStep('step-geometric')
    drawGeometryCanvas()
    await new Promise((resolve) => setTimeout(resolve, 1500))
    completeStep('step-geometric')

    // Step 3: Text Rendering
    activateStep('step-text-rendering')
    drawTextCanvas()
    await new Promise((resolve) => setTimeout(resolve, 1500))
    completeStep('step-text-rendering')

    // Step 4: Pixel Sampling
    activateStep('step-sampling')
    samplePixels()
    await new Promise((resolve) => setTimeout(resolve, 1500))
    completeStep('step-sampling')

    // Step 5: Show Hash Result
    activateStep('step-hash')
    const canvasResultValueEl = document.getElementById('canvas-result-value')
    if (canvasResultValueEl) {
      const duration = 800
      const startTime = Date.now()

      function updateHashText() {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        if (progress < 1) {
          canvasResultValueEl.textContent = 'Computing...'
          requestAnimationFrame(updateHashText)
        } else {
          canvasResultValueEl.textContent = canvasHash
          canvasResultValueEl.classList.add('highlight')
        }
      }
      updateHashText()
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    completeStep('step-hash')
  }
      // Step 5: Show Hash Result
activateStep('step-hash')

const canvasResultValueEl = document.getElementById('canvas-result-value')
if (canvasResultValueEl) {
  // “el” is now strongly typed as HTMLDivElement, not possibly null
  const el = canvasResultValueEl

  const duration = 800
  const startTime = Date.now()

  function updateHashText() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    if (progress < 1) {
      el.textContent = 'Computing...'
      requestAnimationFrame(updateHashText)
    } else {
      el.textContent = canvasHash
      el.classList.add('highlight')
    }
  }
  updateHashText()
}

await new Promise((resolve) => setTimeout(resolve, 1000))
completeStep('step-hash')

await new Promise((resolve) => setTimeout(resolve, 1000))
completeStep('step-hash')
  // Kick off the canvas animation sequence after DOM is ready
  animateCanvasProcess()

// ──────────────────────────────────────────────────────────────────────────
  // 5) WEBGL BASICS
  // ──────────────────────────────────────────────────────────────────────────
  const basicsComponent = components.webGlBasics as { value: unknown }
  const rawBasics = basicsComponent.value as
    | {
        version: string
        vendor: string
        vendorUnmasked: string
        renderer: string
        rendererUnmasked: string
        shadingLanguageVersion: string
      }
    | number

  const webglBasicsJsonEl = document.getElementById('webgl-basics-json')
  const webglBasicsHashEl = document.getElementById('webgl-basics-hash')

  if (typeof rawBasics === 'number') {
    // If it’s just a status code, put that in the <pre> or in a <p>
    if (webglBasicsJsonEl) {
      webglBasicsJsonEl.textContent = `Status code: ${rawBasics}`
    }
    if (webglBasicsHashEl) {
      webglBasicsHashEl.textContent = 'N/A'
    }
  } else {
    // Pretty-print JSON for basics:
    const basicsJsonStr = JSON.stringify(rawBasics, null, 2)
    const basicsHash = await computeSha256Hex(basicsJsonStr)

    if (webglBasicsJsonEl) {
      webglBasicsJsonEl.textContent = basicsJsonStr
    }
    if (webglBasicsHashEl) {
      webglBasicsHashEl.textContent = basicsHash
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6) WEBGL EXTENSIONS & PARAMETERS
  // ──────────────────────────────────────────────────────────────────────────
  const extComponent = components.webGlExtensions as { value: unknown }
  const rawExtensions = extComponent.value as
    | {
        contextAttributes: string[]
        shaderPrecisions: string[]
        
        extensionParameters: string[]
        
      }
    | number

  const webglExtJsonEl = document.getElementById('webgl-extensions-json')
  const webglExtHashEl = document.getElementById('webgl-extensions-hash')

  if (typeof rawExtensions === 'number') {
    if (webglExtJsonEl) {
      webglExtJsonEl.textContent = `Status code: ${rawExtensions}`
    }
    if (webglExtHashEl) {
      webglExtHashEl.textContent = 'N/A'
    }
  } else {
    // Sort arrays so JSON is deterministic
    const sortedExtObj = {
      contextAttributes: [...rawExtensions.contextAttributes].sort(),
      shaderPrecisions: [...rawExtensions.shaderPrecisions].sort(),
      
    }

    const extJsonStr = JSON.stringify(sortedExtObj, null, 2)
    const extHash = await computeSha256Hex(extJsonStr)

    if (webglExtJsonEl) {
      webglExtJsonEl.textContent = extJsonStr
    }
    if (webglExtHashEl) {
      webglExtHashEl.textContent = extHash
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7) MATH FINGERPRINTING
  // ──────────────────────────────────────────────────────────────────────────
  const mathComponent = components.math as { value: unknown }
  const rawMath = mathComponent.value as Record<string, number>

  const mathJsonEl = document.getElementById('math-json')
  const mathHashEl = document.getElementById('math-hash')

  const mathJsonStr = JSON.stringify(rawMath, null, 2)
  const mathHash = await computeSha256Hex(mathJsonStr)

  if (mathJsonEl) {
    mathJsonEl.textContent = mathJsonStr
  }
  if (mathHashEl) {
    mathHashEl.textContent = mathHash
  }
})().catch((error) => {
  console.error('Error computing fingerprints:', error)
})
