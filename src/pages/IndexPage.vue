<template>
  <div class="studio-page">
    <header class="topbar page-width">
      <a class="brand" href="#/" aria-label="QR Studio home">
        <span class="brand-mark">QR</span>
        <span class="brand-copy">
          <strong>QR Studio</strong>
          <small>yours to keep</small>
        </span>
      </a>

      <div class="topbar-note">
        <span class="status-dot"></span>
        <span>Private by default</span>
        <span class="topbar-divider"></span>
        <span>Runs in your browser</span>
        <button class="share-link-button" type="button" @click="copyShareLink">
          <span>↗</span> Copy share link
        </button>
      </div>
    </header>

    <main class="page-width">
      <section class="intro-row">
        <div>
          <p class="eyebrow">A calmer way to make QR codes</p>
          <h1>Make a QR code<br /><span>that stays yours.</span></h1>
          <p class="intro-copy">
            Create, customize, and download a real QR code without a hidden
            redirect, a tracking layer, or a subscription surprise.
          </p>
        </div>

        <div class="intro-stamp" aria-label="No account or backend needed">
          <span class="stamp-icon">✦</span>
          <span>No account<br />needed</span>
        </div>
      </section>

      <div class="studio-grid">
        <section class="editor-card">
          <div class="step-heading">
            <span class="step-number">1</span>
            <div>
              <h2>What should it open?</h2>
              <p>Start with a link or a little piece of text.</p>
            </div>
          </div>

          <div class="segmented-control" role="tablist" aria-label="QR content type">
            <button
              v-for="mode in contentModes"
              :key="mode.value"
              class="segment-button"
              :class="{ active: contentMode === mode.value }"
              type="button"
              role="tab"
              :aria-selected="contentMode === mode.value"
              @click="contentMode = mode.value"
            >
              <span class="segment-icon">{{ mode.icon }}</span>
              {{ mode.label }}
            </button>
          </div>

          <q-input
            v-if="contentMode === 'url'"
            v-model="urlValue"
            class="content-input"
            outlined
            stack-label
            label="Your link"
            placeholder="https://example.com"
            type="url"
            autocomplete="url"
            spellcheck="false"
          >
            <template #prepend>
              <span class="input-prefix">↗</span>
            </template>
          </q-input>

          <q-input
            v-else
            v-model="textValue"
            class="content-input text-content-input"
            outlined
            stack-label
            label="Your text"
            placeholder="Write something worth sharing"
            type="textarea"
            autogrow
            maxlength="1500"
          >
            <template #prepend>
              <span class="input-prefix">Aa</span>
            </template>
          </q-input>

          <div class="input-meta">
            <span>{{ contentLength }} characters · updates live</span>
            <button class="text-button" type="button" @click="copyContent">
              <span>□</span> Copy content
            </button>
          </div>

          <div class="section-rule"></div>

          <div class="step-heading design-heading">
            <span class="step-number">2</span>
            <div>
              <h2>Design your QR code</h2>
              <p>Make it feel like your brand, not a generic square.</p>
            </div>
          </div>

          <div class="design-tabs" role="tablist" aria-label="QR design settings">
            <button
              v-for="tab in designTabs"
              :key="tab.value"
              class="design-tab"
              :class="{ active: designTab === tab.value }"
              type="button"
              role="tab"
              :aria-selected="designTab === tab.value"
              @click="designTab = tab.value"
            >
              <span>{{ tab.icon }}</span>{{ tab.label }}
            </button>
          </div>

          <div v-if="designTab === 'shape'" class="design-panel">
            <div class="panel-title-row">
              <h3>Modules & color</h3>
              <span class="panel-hint">The little pieces</span>
            </div>

            <p class="control-label">Module style</p>
            <div class="choice-grid module-choice-grid">
              <button
                v-for="style in moduleStyles"
                :key="style.value"
                class="style-choice"
                :class="{ selected: moduleStyle === style.value }"
                type="button"
                :aria-label="style.label"
                :title="style.label"
                @click="moduleStyle = style.value"
              >
                <span class="module-glyph" :class="`glyph-${style.value}`"></span>
                <small>{{ style.shortLabel }}</small>
              </button>
            </div>

            <div class="slider-control module-size-control">
              <div class="control-label-row">
                <label for="module-size">Module size</label>
                <span>{{ moduleScale }}%</span>
              </div>
              <input id="module-size" v-model.number="moduleScale" type="range" min="55" max="100" step="1" aria-label="Module size" />
            </div>

            <div class="control-card color-card">
              <div class="color-control">
                <div class="control-label-row">
                  <span class="control-label">Shape color</span>
                  <span class="color-value">{{ colors.foreground }}</span>
                </div>
                <div class="color-input-row">
                  <input v-model="colors.foreground" class="hex-input" type="text" maxlength="7" aria-label="Shape color hex value" @blur="normalizeColor('foreground')" />
                  <input v-model="colors.foreground" class="native-color" type="color" aria-label="Choose shape color" />
                </div>
              </div>

              <div class="color-control">
                <div class="control-label-row">
                  <span class="control-label">Background</span>
                  <span class="color-value">{{ transparentBackground ? 'clear' : colors.background }}</span>
                </div>
                <div class="color-input-row">
                  <input v-model="colors.background" class="hex-input" type="text" maxlength="7" :disabled="transparentBackground" aria-label="Background color hex value" @blur="normalizeColor('background')" />
                  <input v-model="colors.background" class="native-color" type="color" :disabled="transparentBackground" aria-label="Choose background color" />
                </div>
              </div>

              <div class="toggle-row">
                <q-toggle v-model="transparentBackground" color="primary" dense />
                <span>Transparent background</span>
              </div>
              <div class="toggle-row">
                <q-toggle v-model="gradient" color="primary" dense />
                <span>Use a soft gradient</span>
              </div>

              <div v-if="gradient" class="gradient-control">
                <div class="control-label-row">
                  <span class="control-label">Gradient finish</span>
                  <span class="color-value">{{ colors.secondary }}</span>
                </div>
                <div class="color-input-row">
                  <input v-model="colors.secondary" class="hex-input" type="text" maxlength="7" aria-label="Gradient finish hex value" @blur="normalizeColor('secondary')" />
                  <input v-model="colors.secondary" class="native-color" type="color" aria-label="Choose gradient finish" />
                </div>
              </div>
            </div>

            <div class="fine-tune-row">
              <div class="select-control">
                <label for="error-correction">Error correction</label>
                <select id="error-correction" v-model="errorCorrection">
                  <option v-for="level in errorLevels" :key="level.value" :value="level.value">
                    {{ level.label }}
                  </option>
                </select>
              </div>
              <div class="select-control">
                <label for="quiet-zone">Quiet zone</label>
                <select id="quiet-zone" v-model.number="quietZone">
                  <option v-for="margin in [2, 3, 4, 5, 6, 8]" :key="margin" :value="margin">
                    {{ margin }} modules
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div v-else-if="designTab === 'markers'" class="design-panel">
            <div class="panel-title-row">
              <h3>Finder markers</h3>
              <span class="panel-hint">The three anchors</span>
            </div>
            <p class="control-label">Outer marker style</p>
            <div class="choice-grid marker-choice-grid">
              <button
                v-for="style in eyeStyles"
                :key="style.value"
                class="style-choice marker-choice"
                :class="{ selected: eyeStyle === style.value }"
                type="button"
                :aria-label="style.label"
                :title="style.label"
                @click="eyeStyle = style.value"
              >
                <span class="eye-glyph" :class="`eye-${style.value}`"><i></i></span>
                <small>{{ style.shortLabel }}</small>
              </button>
            </div>

            <p class="control-label marker-inner-label">Center marker style</p>
            <div class="choice-grid inner-choice-grid">
              <button
                v-for="style in innerEyeStyles"
                :key="style.value"
                class="style-choice marker-choice"
                :class="{ selected: eyeInnerStyle === style.value }"
                type="button"
                :aria-label="style.label"
                :title="style.label"
                @click="eyeInnerStyle = style.value"
              >
                <span class="inner-eye-glyph" :class="`inner-eye-${style.value}`"></span>
                <small>{{ style.shortLabel }}</small>
              </button>
            </div>

            <div class="control-card single-color-card">
              <div class="color-control wide-color-control">
                <div class="control-label-row">
                  <span class="control-label">Marker color</span>
                  <span class="color-value">{{ colors.eye }}</span>
                </div>
                <div class="color-input-row">
                  <input v-model="colors.eye" class="hex-input" type="text" maxlength="7" aria-label="Marker color hex value" @blur="normalizeColor('eye')" />
                  <input v-model="colors.eye" class="native-color" type="color" aria-label="Choose marker color" />
                </div>
              </div>
            </div>

            <div class="tip-box">
              <span>✦</span>
              <p>Markers are kept high-contrast so your custom code stays easy to scan.</p>
            </div>
          </div>

          <div v-else class="design-panel logo-panel">
            <div class="panel-title-row">
              <h3>Center logo</h3>
              <span class="panel-hint">A little signature</span>
            </div>

            <input ref="logoInput" class="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" @change="handleLogoUpload" />

            <div v-if="!logoDataUrl" class="logo-dropzone" @click="triggerLogoUpload">
              <div class="upload-icon">↥</div>
              <strong>Upload an image</strong>
              <span>PNG, JPG, WEBP, or SVG · up to 3 MB</span>
              <button class="outline-button" type="button">Choose image</button>
            </div>

            <div v-else class="logo-preview-row">
              <div class="logo-thumbnail checkerboard">
                <img :src="logoDataUrl" alt="Uploaded logo preview" />
              </div>
              <div class="logo-file-info">
                <strong>{{ logoName }}</strong>
                <span>Original used locally · share links carry a compact copy</span>
                <button class="text-button danger-text" type="button" @click="removeLogo">Remove image</button>
              </div>
            </div>

            <div class="slider-control">
              <div class="control-label-row">
                <label for="logo-size">Logo size</label>
                <span>{{ logoSize }}%</span>
              </div>
              <input id="logo-size" v-model.number="logoSize" type="range" min="12" max="30" step="1" />
            </div>

            <div class="select-control logo-bg-select">
              <label for="logo-background">Logo backing</label>
              <select id="logo-background" v-model="logoBackground">
                <option value="transparent">Keep transparent</option>
                <option value="white">Soft white tile</option>
                <option value="background">Match background</option>
              </select>
            </div>

            <div class="tip-box">
              <span>◎</span>
              <p>The original proportions are preserved and modules are cleared behind the logo. For reliable scans, keep it under 25% and use error correction H.</p>
            </div>
          </div>
        </section>

        <aside class="preview-column">
          <div class="preview-card">
            <div class="preview-heading">
              <div class="preview-step"><span class="step-number">3</span><h2>Download QR code</h2></div>
              <span class="live-badge"><span class="live-dot"></span> Live</span>
            </div>

            <div class="canvas-frame" :class="{ checkerboard: transparentBackground }">
              <canvas ref="previewCanvas" aria-label="Live QR code preview"></canvas>
              <div v-if="qrError" class="canvas-error">
                <span>!</span>
                <strong>That content is too long</strong>
                <small>Try a shorter link or text.</small>
              </div>
            </div>

            <div class="preview-meta">
              <span><i class="meta-icon">⌁</i> {{ matrix ? `${matrix.length} × ${matrix.length} modules` : 'Waiting for content' }}</span>
              <span><i class="meta-icon">◈</i> {{ errorCorrection }} correction</span>
            </div>

            <div class="download-block">
              <div class="download-title-row">
                <div>
                  <h3>Save it your way</h3>
                  <p>High resolution · generated locally</p>
                </div>
                <span class="download-icon">⇩</span>
              </div>

              <div class="download-grid">
                <button class="download-button primary-download" type="button" :disabled="!matrix || isDownloading" @click="downloadImage('png')">
                  <span>PNG</span><small>best all-rounder</small>
                </button>
                <button class="download-button" type="button" :disabled="!matrix || isDownloading" @click="downloadImage('jpg')">
                  <span>JPG</span><small>easy to share</small>
                </button>
                <button class="download-button wide-download" type="button" :disabled="!matrix || isDownloading" @click="downloadImage('transparent-png')">
                  <span>Transparent PNG</span><small>ready to place anywhere</small>
                </button>
              </div>
              <p v-if="isDownloading" class="download-status">Preparing your image…</p>
            </div>

            <div class="privacy-note">
              <span class="privacy-lock">⌑</span>
              <p><strong>Your content stays here.</strong> This app has no backend, analytics, or redirect service. The share link stores a compact copy of this QR setup.</p>
            </div>
          </div>

          <div class="preview-footer">
            <span class="footer-spark">✦</span>
            <span>Make it once. Keep it forever.</span>
          </div>
        </aside>
      </div>
    </main>

    <footer class="site-footer page-width">
      <span>QR Studio · open, local, and yours</span>
      <span>No accounts · No tracking · No expiry</span>
      <span class="footer-links">
        <a href="https://github.com/jeancaffou" target="_blank" rel="noopener noreferrer">@jeancaffou</a>
        <span aria-hidden="true">·</span>
        <a href="https://github.com/jeancaffou/qr-studio" target="_blank" rel="noopener noreferrer">GitHub repo</a>
      </span>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { Notify } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import LZString from 'lz-string'
import qrcode from 'qrcode-generator'

const router = useRouter()
const route = useRoute()

const contentModes = [
  { value: 'url', label: 'Link', icon: '↗' },
  { value: 'text', label: 'Text', icon: 'Aa' }
]

const designTabs = [
  { value: 'shape', label: 'Shape & color', icon: '✦' },
  { value: 'markers', label: 'Markers', icon: '⊙' },
  { value: 'logo', label: 'Logo', icon: '◌' }
]

const moduleStyles = [
  { value: 'square', label: 'Square', shortLabel: 'Square' },
  { value: 'rounded', label: 'Rounded', shortLabel: 'Soft' },
  { value: 'dots', label: 'Dots', shortLabel: 'Dots' },
  { value: 'diamond', label: 'Diamond', shortLabel: 'Diamond' },
  { value: 'bars', label: 'Bars', shortLabel: 'Bars' },
  { value: 'leaf', label: 'Leaf', shortLabel: 'Leaf' }
]

const eyeStyles = [
  { value: 'square', label: 'Square', shortLabel: 'Square' },
  { value: 'rounded', label: 'Rounded', shortLabel: 'Rounded' },
  { value: 'circle', label: 'Circle', shortLabel: 'Circle' },
  { value: 'squircle', label: 'Squircle', shortLabel: 'Squircle' }
]

const innerEyeStyles = [
  { value: 'square', label: 'Square', shortLabel: 'Square' },
  { value: 'rounded', label: 'Rounded', shortLabel: 'Soft' },
  { value: 'circle', label: 'Circle', shortLabel: 'Circle' }
]

const errorLevels = [
  { value: 'L', label: 'L · 7%' },
  { value: 'M', label: 'M · 15%' },
  { value: 'Q', label: 'Q · 25%' },
  { value: 'H', label: 'H · 30%' }
]

const contentMode = ref('url')
const urlValue = ref('https://jeancaffou.github.io/qr-studio/')
const textValue = ref('A QR code made to stay yours.')
const designTab = ref('shape')
const moduleStyle = ref('rounded')
const eyeStyle = ref('rounded')
const eyeInnerStyle = ref('square')
const errorCorrection = ref('H')
const quietZone = ref(4)
const transparentBackground = ref(false)
const gradient = ref(false)
const moduleScale = ref(94)
const logoSize = ref(22)
const logoBackground = ref('white')
const logoDataUrl = ref('')
const logoShareDataUrl = ref('')
const logoName = ref('')
const logoInput = ref(null)
const previewCanvas = ref(null)
const isDownloading = ref(false)
const qrError = ref('')
const renderId = ref(0)
const isHydrating = ref(true)
const lastShareCode = ref('')

const SHARE_VERSION = 1
const MAX_LOGO_SHARE_SIDE = 768
const MAX_ORIGINAL_SHARE_LENGTH = 96_000

const colors = reactive({
  foreground: '#18233F',
  secondary: '#486BFF',
  background: '#FFFFFF',
  eye: '#18233F'
})

const content = computed(() => (contentMode.value === 'url' ? urlValue.value : textValue.value).trim())
const contentLength = computed(() => (content.value ? content.value.length : 0).toLocaleString())

const matrix = computed(() => {
  try {
    qrError.value = ''
    const code = qrcode(0, errorCorrection.value)
    code.addData(content.value || ' ')
    code.make()
    const count = code.getModuleCount()
    return Array.from({ length: count }, (_, row) =>
      Array.from({ length: count }, (_, column) => code.isDark(row, column))
    )
  } catch (error) {
    qrError.value = error instanceof Error ? error.message : 'Unable to create this QR code.'
    return null
  }
})

const renderSignature = computed(() => JSON.stringify({
  content: content.value,
  errorCorrection: errorCorrection.value,
  moduleStyle: moduleStyle.value,
  moduleScale: moduleScale.value,
  eyeStyle: eyeStyle.value,
  eyeInnerStyle: eyeInnerStyle.value,
  quietZone: quietZone.value,
  transparentBackground: transparentBackground.value,
  gradient: gradient.value,
  logoSize: logoSize.value,
  logoBackground: logoBackground.value,
  logoDataUrl: logoDataUrl.value,
  logoShareDataUrl: logoShareDataUrl.value,
  ...colors
}))

const shareState = computed(() => ({
  v: SHARE_VERSION,
  m: contentMode.value === 'url' ? 'u' : 't',
  u: urlValue.value,
  t: textValue.value,
  d: designTab.value,
  s: moduleStyle.value,
  ms: moduleScale.value,
  e: eyeStyle.value,
  i: eyeInnerStyle.value,
  f: colors.foreground,
  a: colors.secondary,
  b: colors.background,
  o: colors.eye,
  x: transparentBackground.value ? 1 : 0,
  g: gradient.value ? 1 : 0,
  q: errorCorrection.value,
  z: quietZone.value,
  ls: logoSize.value,
  lb: logoBackground.value,
  l: logoShareDataUrl.value || logoDataUrl.value || ''
}))

const encodedShareState = computed(() => LZString.compressToEncodedURIComponent(JSON.stringify(shareState.value)))

function normalizeColor(key) {
  const value = String(colors[key] || '').trim().toUpperCase()
  if (/^#[0-9A-F]{6}$/.test(value)) {
    colors[key] = value
  } else if (/^[0-9A-F]{6}$/.test(value)) {
    colors[key] = `#${value}`
  } else {
    colors[key] = key === 'background' ? '#FFFFFF' : '#18233F'
  }
}

function triggerLogoUpload() {
  logoInput.value?.click()
}

function optimizeLogoImage(image, sourceDataUrl = '') {
  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height
  const sourceMaxSide = Math.max(sourceWidth, sourceHeight)

  if (sourceDataUrl &&
    sourceDataUrl.length <= MAX_ORIGINAL_SHARE_LENGTH &&
    (sourceDataUrl.startsWith('data:image/svg+xml') || sourceMaxSide <= MAX_LOGO_SHARE_SIDE)) {
    return sourceDataUrl
  }

  const scale = Math.min(1, MAX_LOGO_SHARE_SIDE / sourceMaxSide)
  const width = Math.max(1, Math.round(sourceWidth * scale))
  const height = Math.max(1, Math.round(sourceHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, 0, 0, width, height)

  const webp = canvas.toDataURL('image/webp', 0.92)
  return webp.length < 200 ? canvas.toDataURL('image/png') : webp
}

function handleLogoUpload(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  if (!file.type.startsWith('image/')) {
    Notify.create({ type: 'negative', message: 'Please choose an image file.' })
    return
  }

  if (file.size > 3 * 1024 * 1024) {
    Notify.create({ type: 'negative', message: 'That image is larger than 3 MB.' })
    return
  }

  const reader = new FileReader()
  reader.onload = async () => {
    const sourceDataUrl = String(reader.result || '')
    const image = await loadImage(sourceDataUrl)
    if (!image) {
      Notify.create({ type: 'negative', message: 'That image could not be read.' })
      return
    }
    logoDataUrl.value = sourceDataUrl
    logoShareDataUrl.value = optimizeLogoImage(image, sourceDataUrl)
    logoName.value = file.name
  }
  reader.readAsDataURL(file)
}

function removeLogo() {
  logoDataUrl.value = ''
  logoShareDataUrl.value = ''
  logoName.value = ''
}

async function copyContent() {
  if (!content.value) return

  try {
    await navigator.clipboard.writeText(content.value)
    Notify.create({ type: 'positive', message: 'Content copied to your clipboard.', timeout: 1600 })
  } catch {
    Notify.create({ type: 'warning', message: 'Clipboard access is not available here.' })
  }
}

function getShareUrl(encoded = encodedShareState.value) {
  const resolved = router.resolve({ path: '/', query: { c: encoded } })
  return new URL(resolved.href, window.location.origin).href
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(getShareUrl())
    Notify.create({ type: 'positive', message: 'Share link copied. It contains this whole QR setup.', timeout: 2000 })
  } catch {
    Notify.create({ type: 'warning', message: 'Clipboard access is not available here.' })
  }
}

function applyShareState(encoded) {
  if (!encoded) return false

  try {
    const decoded = LZString.decompressFromEncodedURIComponent(encoded)
    if (!decoded) throw new Error('empty share state')
    const saved = JSON.parse(decoded)

    if (saved.v !== SHARE_VERSION) throw new Error('unsupported share state')
    if (saved.m === 'u' || saved.m === 't') contentMode.value = saved.m === 'u' ? 'url' : 'text'
    if (typeof saved.u === 'string') urlValue.value = saved.u
    if (typeof saved.t === 'string') textValue.value = saved.t
    if (['shape', 'markers', 'logo'].includes(saved.d)) designTab.value = saved.d
    if (moduleStyles.some((style) => style.value === saved.s)) moduleStyle.value = saved.s
    if (Number.isFinite(Number(saved.ms))) moduleScale.value = Math.min(100, Math.max(55, Number(saved.ms)))
    if (eyeStyles.some((style) => style.value === saved.e)) eyeStyle.value = saved.e
    if (innerEyeStyles.some((style) => style.value === saved.i)) eyeInnerStyle.value = saved.i
    if (typeof saved.f === 'string') colors.foreground = saved.f
    if (typeof saved.a === 'string') colors.secondary = saved.a
    if (typeof saved.b === 'string') colors.background = saved.b
    if (typeof saved.o === 'string') colors.eye = saved.o
    transparentBackground.value = Boolean(saved.x)
    gradient.value = Boolean(saved.g)
    if (errorLevels.some((level) => level.value === saved.q)) errorCorrection.value = saved.q
    if ([2, 3, 4, 5, 6, 8].includes(Number(saved.z))) quietZone.value = Number(saved.z)
    if (Number.isFinite(Number(saved.ls))) logoSize.value = Math.min(30, Math.max(12, Number(saved.ls)))
    if (['transparent', 'white', 'background'].includes(saved.lb)) logoBackground.value = saved.lb
    if (typeof saved.l === 'string' && saved.l.startsWith('data:image/')) {
      logoDataUrl.value = saved.l
      logoShareDataUrl.value = saved.l
      logoName.value = 'Shared logo'
    }
    lastShareCode.value = encoded
    return true
  } catch {
    Notify.create({ type: 'warning', message: 'This share link could not be read, so a fresh QR setup was opened.' })
    return false
  }
}

function syncShareUrl() {
  const encoded = encodedShareState.value
  if (!encoded || encoded === lastShareCode.value || route.query.c === encoded) return
  lastShareCode.value = encoded
  router.replace({ path: '/', query: { c: encoded } }).catch(() => {})
}

function isFinderModule(row, column, size) {
  return (row < 7 && column < 7) ||
    (row < 7 && column >= size - 7) ||
    (row >= size - 7 && column < 7)
}

function safeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function drawStyledShape(ctx, x, y, size, style, fill, scale = 100) {
  const moduleScale = Math.min(100, Math.max(55, Number(scale) || 100)) / 100
  const shapeSize = size * moduleScale
  const shapeX = x + (size - shapeSize) / 2
  const shapeY = y + (size - shapeSize) / 2
  const gap = Math.max(shapeSize * 0.06, 0.45)
  const innerSize = shapeSize - gap * 2
  const innerX = shapeX + gap
  const innerY = shapeY + gap

  ctx.fillStyle = fill

  if (style === 'square') {
    ctx.fillRect(shapeX, shapeY, shapeSize, shapeSize)
    return
  }

  if (style === 'rounded') {
    roundedRect(ctx, innerX, innerY, innerSize, innerSize, size * 0.25)
    ctx.fill()
    return
  }

  if (style === 'dots') {
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, Math.max(shapeSize * 0.44, 0.8), 0, Math.PI * 2)
    ctx.fill()
    return
  }

  if (style === 'diamond') {
    ctx.beginPath()
    ctx.moveTo(shapeX + shapeSize / 2, shapeY + gap)
    ctx.lineTo(shapeX + shapeSize - gap, shapeY + shapeSize / 2)
    ctx.lineTo(shapeX + shapeSize / 2, shapeY + shapeSize - gap)
    ctx.lineTo(shapeX + gap, shapeY + shapeSize / 2)
    ctx.closePath()
    ctx.fill()
    return
  }

  if (style === 'bars') {
    const barInset = Math.max(shapeSize * 0.07, 0.45)
    const barHeight = Math.max(shapeSize * 0.34, 1)
    roundedRect(
      ctx,
      shapeX + barInset,
      shapeY + (shapeSize - barHeight) / 2,
      shapeSize - barInset * 2,
      barHeight,
      barHeight / 2
    )
    ctx.fill()
    return
  }

  ctx.save()
  ctx.translate(shapeX + shapeSize / 2, shapeY + shapeSize / 2)
  ctx.rotate(0.28)
  roundedRect(ctx, -innerSize / 2, -innerSize / 2, innerSize, innerSize, size * 0.38)
  ctx.fill()
  ctx.restore()
}

function drawEyeShape(ctx, x, y, size, style, fill) {
  if (!fill) {
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    drawEyeShape(ctx, x, y, size, style, '#000000')
    ctx.restore()
    return
  }

  ctx.fillStyle = fill

  if (style === 'circle') {
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()
    return
  }

  const radius = style === 'square' ? 0 : style === 'squircle' ? size * 0.33 : size * 0.2
  roundedRect(ctx, x, y, size, size, radius)
  ctx.fill()
}

function drawFinder(ctx, originRow, originColumn, moduleSize, options, fill) {
  const x = (options.quietZone + originColumn) * moduleSize
  const y = (options.quietZone + originRow) * moduleSize
  const outerSize = moduleSize * 7
  const middleOffset = moduleSize
  const middleSize = moduleSize * 5
  const innerOffset = moduleSize * 2
  const innerSize = moduleSize * 3
  const emptyFill = options.transparent ? null : options.background

  drawEyeShape(ctx, x, y, outerSize, options.eyeStyle, fill)
  drawEyeShape(ctx, x + middleOffset, y + middleOffset, middleSize, options.eyeStyle, emptyFill)
  drawEyeShape(ctx, x + innerOffset, y + innerOffset, innerSize, options.eyeInnerStyle, fill)
}

function getLogoLayout(outputSize, moduleSize, options, logoImage) {
  const maxSize = outputSize * (options.logoSize / 100)
  const imageWidth = Math.max(1, Number(logoImage.naturalWidth || logoImage.width || 1))
  const imageHeight = Math.max(1, Number(logoImage.naturalHeight || logoImage.height || 1))
  const scale = Math.min(maxSize / imageWidth, maxSize / imageHeight)
  const width = imageWidth * scale
  const height = imageHeight * scale
  const padding = Math.max(moduleSize * 0.7, outputSize * 0.006 * options.logoPadding)
  const tileWidth = width + padding * 2
  const tileHeight = height + padding * 2

  return {
    x: (outputSize - tileWidth) / 2,
    y: (outputSize - tileHeight) / 2,
    width,
    height,
    padding,
    tileWidth,
    tileHeight
  }
}

function isLogoModule(row, column, moduleSize, quietZone, logoLayout) {
  if (!logoLayout) return false

  const cellX = (quietZone + column) * moduleSize
  const cellY = (quietZone + row) * moduleSize
  return cellX < logoLayout.x + logoLayout.tileWidth &&
    cellX + moduleSize > logoLayout.x &&
    cellY < logoLayout.y + logoLayout.tileHeight &&
    cellY + moduleSize > logoLayout.y
}

function drawQrCanvas(canvas, qrMatrix, options, logoImage = null) {
  const outputSize = options.pixelSize || 720
  const count = qrMatrix?.length || 21
  const totalModules = count + options.quietZone * 2
  const moduleSize = outputSize / totalModules
  const ctx = canvas.getContext('2d')
  const logoLayout = logoImage && qrMatrix
    ? getLogoLayout(outputSize, moduleSize, options, logoImage)
    : null

  canvas.width = outputSize
  canvas.height = outputSize
  ctx.clearRect(0, 0, outputSize, outputSize)

  if (!options.transparent) {
    ctx.fillStyle = options.background
    ctx.fillRect(0, 0, outputSize, outputSize)
  }

  const shapeFill = options.gradient
    ? ctx.createLinearGradient(0, 0, outputSize, outputSize)
    : options.foreground

  if (options.gradient) {
    shapeFill.addColorStop(0, options.foreground)
    shapeFill.addColorStop(1, options.secondary)
  }

  if (qrMatrix) {
    qrMatrix.forEach((row, rowIndex) => {
      row.forEach((isDark, columnIndex) => {
        if (isDark &&
          !isFinderModule(rowIndex, columnIndex, count) &&
          !isLogoModule(rowIndex, columnIndex, moduleSize, options.quietZone, logoLayout)) {
          drawStyledShape(
            ctx,
            (options.quietZone + columnIndex) * moduleSize,
            (options.quietZone + rowIndex) * moduleSize,
            moduleSize,
            options.moduleStyle,
            shapeFill,
            options.moduleScale
          )
        }
      })
    })

    const markerFill = options.eye
    drawFinder(ctx, 0, 0, moduleSize, options, markerFill)
    drawFinder(ctx, 0, count - 7, moduleSize, options, markerFill)
    drawFinder(ctx, count - 7, 0, moduleSize, options, markerFill)
  }

  if (logoImage && qrMatrix && logoLayout) {
    const { x, y, width, height, padding, tileWidth, tileHeight } = logoLayout
    const logoFill = options.logoBackground === 'white'
      ? '#FFFFFF'
      : options.logoBackground === 'background'
        ? options.background
        : null

    if (logoFill) {
      ctx.fillStyle = logoFill
      roundedRect(ctx, x, y, tileWidth, tileHeight, Math.min(tileWidth, tileHeight) * 0.16)
      ctx.fill()
    }

    ctx.save()
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    roundedRect(ctx, x + padding, y + padding, width, height, Math.min(width, height) * 0.12)
    ctx.clip()
    ctx.drawImage(logoImage, x + padding, y + padding, width, height)
    ctx.restore()
  }
}

function loadImage(source) {
  if (!source) return Promise.resolve(null)

  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = source
  })
}

async function redrawPreview() {
  const currentRender = ++renderId.value
  await nextTick()
  const canvas = previewCanvas.value
  if (!canvas) return

  const logoImage = await loadImage(logoDataUrl.value)
  if (currentRender !== renderId.value) return

  drawQrCanvas(canvas, matrix.value, {
    pixelSize: 720,
    quietZone: quietZone.value,
    moduleStyle: moduleStyle.value,
    eyeStyle: eyeStyle.value,
    eyeInnerStyle: eyeInnerStyle.value,
    foreground: safeColor(colors.foreground, '#18233F'),
    secondary: safeColor(colors.secondary, '#486BFF'),
    eye: safeColor(colors.eye, '#18233F'),
    background: safeColor(colors.background, '#FFFFFF'),
    transparent: transparentBackground.value,
    gradient: gradient.value,
    moduleScale: moduleScale.value,
    logoSize: logoSize.value,
    logoPadding: 3,
    logoBackground: logoBackground.value
  }, logoImage)
}

async function downloadImage(format) {
  if (!matrix.value || isDownloading.value) return

  isDownloading.value = true
  try {
    const canvas = document.createElement('canvas')
    const logoImage = await loadImage(logoDataUrl.value)
    const isTransparent = format === 'transparent-png' || transparentBackground.value

    drawQrCanvas(canvas, matrix.value, {
      pixelSize: 2048,
      quietZone: quietZone.value,
      moduleStyle: moduleStyle.value,
      eyeStyle: eyeStyle.value,
      eyeInnerStyle: eyeInnerStyle.value,
      foreground: safeColor(colors.foreground, '#18233F'),
      secondary: safeColor(colors.secondary, '#486BFF'),
      eye: safeColor(colors.eye, '#18233F'),
      background: safeColor(colors.background, '#FFFFFF'),
      transparent: format === 'jpg' ? false : isTransparent,
      gradient: gradient.value,
      moduleScale: moduleScale.value,
      logoSize: logoSize.value,
      logoPadding: 3,
      logoBackground: logoBackground.value
    }, logoImage)

    const mime = format === 'jpg' ? 'image/jpeg' : 'image/png'
    const extension = format === 'jpg' ? 'jpg' : 'png'
    const label = contentMode.value === 'url' ? 'link' : 'text'
    const link = document.createElement('a')
    link.download = `qr-studio-${label}.${extension}`
    link.href = canvas.toDataURL(mime, 0.94)
    link.click()
    Notify.create({ type: 'positive', message: `${format === 'jpg' ? 'JPG' : 'PNG'} downloaded.`, timeout: 1600 })
  } finally {
    isDownloading.value = false
  }
}

watch(renderSignature, () => {
  redrawPreview()
  if (!isHydrating.value) syncShareUrl()
})

onMounted(() => {
  applyShareState(typeof route.query.c === 'string' ? route.query.c : '')
  isHydrating.value = false
  redrawPreview()
  syncShareUrl()
})
</script>
