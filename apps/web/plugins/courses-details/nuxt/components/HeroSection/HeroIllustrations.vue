<template>
  <div class="hero-illustrations">
    <!-- Frame 427318761 -->
    <div class="illustration-frame frame-blue">
      <div class="ellipse ellipse-blue"></div>
      <div class="image image-8"></div>
    </div>

    <!-- Frame 427318762 -->
    <div class="illustration-frame frame-red">
      <div class="ellipse ellipse-red"></div>
      <div class="image image-6"></div>
    </div>

    <!-- Frame 469322 -->
    <div class="illustration-frame frame-yellow">
      <div class="ellipse ellipse-yellow"></div>
      <div class="image image-7"></div>
    </div>

    <!-- Grey outline ellipses -->
    <div class="ellipse-outline ellipse-outline-1"></div>
    <div class="ellipse-outline ellipse-outline-2"></div>
  </div>
</template>

<script setup lang="ts">
// Static illustration component for hero layout
</script>

<style scoped>
.hero-illustrations {
  position: relative;
  width: 100%;
  height: 600px;
}

/* ===== Base Circle Containers ===== */
.illustration-frame {
  position: absolute;
  border-radius: 50%;
  overflow: visible;
}

/* ===== Blue Frame ===== */
.frame-blue {
  width: 217.35px;
  height: 217.35px;
  left: 1063px;
  top: 84.56px;
}

.ellipse-blue {
  position: absolute;
  width: 217.35px;
  height: 217.35px;
  border-radius: 50%;
  background: #60a5fa; /* primary/400 */
}

.image-8 {
  position: absolute;
  width: 217.35px;
  height: 289.08px;
  left: 0px;
  bottom: -27.17px;
  background: url('http://localhost:4000/plugins/homepage/illustrations/image8.png') no-repeat center/contain;
}

/* ===== Red Frame ===== */
.frame-red {
  width: 204.54px;
  height: 204.54px;
  left: 845.72px;
  top: 202.78px;
}

.ellipse-red {
  position: absolute;
  width: 204.54px;
  height: 204.54px;
  border-radius: 50%;
  background: #f87171; /* error/400 */
}

.image-6 {
  position: absolute;
  width: 183.62px;
  height: 260.32px;
  left: 0px;
  top: -55.78px;
  background: url('http://localhost:4000/plugins/homepage/illustrations/image6.png') no-repeat center/contain;
}

/* ===== Yellow Frame ===== */
.frame-yellow {
  width: 222px;
  height: 222px;
  left: 1070px;
  top: 337px;
}

.ellipse-yellow {
  position: absolute;
  width: 222px;
  height: 222px;
  border-radius: 50%;
  background: #facc15; /* warning/400 */
}

.image-7 {
  position: absolute;
  width: 331.64px;
  height: 221.09px;
  left: -33.78px;
  top: 11px;
  background: url('http://localhost:4000/plugins/homepage/illustrations/image7.png') no-repeat center/contain;
  transform: scaleX(-1);
}

/* ===== Grey Outlines ===== */
.ellipse-outline {
  position: absolute;
  box-sizing: border-box;
  border: 1px solid #cbd5e1; /* grey/300 */
}

.ellipse-outline-1 {
  width: 235.52px;
  height: 113.42px;
  left: 830px;
  top: 308.33px;
}

.ellipse-outline-2 {
  width: 148.82px;
  height: 211.68px;
  left: 1159.18px;
  top: 363.32px;
}

/* ===== Responsive Scaling ===== */
@media (max-width: 1279px) {
  .hero-illustrations {
    transform: scale(0.8);
    transform-origin: right top;
  }
}

@media (max-width: 1023px) {
  .hero-illustrations {
    transform: scale(0.6);
    transform-origin: center top;
  }
}

@media (max-width: 767px) {
  .hero-illustrations {
    transform: scale(0.45);
    transform-origin: center top;
  }
}
/* === Additive fixes for visibility and centering === */
.hero-illustrations {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.illustration-frame {
  z-index: 1;
  transition: transform 0.3s ease;
}

.illustration-frame:hover {
  transform: scale(1.05);
}

.ellipse,
.ellipse-blue,
.ellipse-red,
.ellipse-yellow {
  border-radius: 50%;
  overflow: hidden;
}

.image img,
.image {
  object-fit: cover;
  border-radius: 50%;
}

.frame-red {
  left: auto;
  right: 180px; /* pushes red circle inward */
  top: 180px;
}

.frame-yellow {
  left: auto;
  right: 40px; /* aligns yellow circle to screen edge */
  top: 320px;
}

.frame-blue {
  left: auto;
  right: 80px;
  top: 60px;
}

/* keep smaller on tablets */
@media (max-width: 1024px) {
  .hero-illustrations {
    transform: scale(0.8);
    transform-origin: right center;
  }
}

@media (max-width: 767px) {
  .hero-illustrations {
    transform: scale(0.6);
    transform-origin: center top;
  }
}

</style>
