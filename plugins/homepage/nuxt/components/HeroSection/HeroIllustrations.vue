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
/* =======================================
   🎨 HERO ILLUSTRATIONS (Ant Design Style)
   ======================================= */

.hero-illustrations {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: visible;
  display: block;
  transition: transform 0.3s ease;
}

/* ===== Base Frame ===== */
.illustration-frame {
  position: absolute;
  border-radius: 50%;
  overflow: visible;
  z-index: 2;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.illustration-frame:hover {
  transform: scale(1.06);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

/* ===== Ellipses (Soft Gradient Tone) ===== */
.ellipse {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  transition: background 0.3s ease;
}

/* ===== Blue Frame ===== */
.frame-blue {
  width: 220px;
  height: 220px;
  right: 100px;
  top: 60px;
}

.ellipse-blue {
  background: linear-gradient(135deg, #1677ff 0%, #69b1ff 100%);
}

.image-8 {
  position: absolute;
  width: 220px;
  height: 280px;
  left: 0;
  bottom: -30px;
  background: url('http://localhost:4000/plugins/homepage/illustrations/image8.png')
    no-repeat center/contain;
}

/* ===== Red Frame ===== */
.frame-red {
  width: 205px;
  height: 205px;
  right: 220px;
  top: 180px;
}

.ellipse-red {
  background: linear-gradient(135deg, #ff4d4f 0%, #ffa39e 100%);
}

.image-6 {
  position: absolute;
  width: 185px;
  height: 260px;
  left: 0;
  top: -55px;
  background: url('http://localhost:4000/plugins/homepage/illustrations/image6.png')
    no-repeat center/contain;
}

/* ===== Yellow Frame ===== */
.frame-yellow {
  width: 220px;
  height: 220px;
  right: 40px;
  top: 330px;
}

.ellipse-yellow {
  background: linear-gradient(135deg, #faad14 0%, #ffd666 100%);
}

.image-7 {
  position: absolute;
  width: 330px;
  height: 220px;
  left: -35px;
  top: 12px;
  background: url('http://localhost:4000/plugins/homepage/illustrations/image7.png')
    no-repeat center/contain;
  transform: scaleX(-1);
}

/* ===== Outline Ellipses ===== */
.ellipse-outline {
  position: absolute;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  z-index: 1;
  opacity: 0.6;
}

.ellipse-outline-1 {
  width: 240px;
  height: 120px;
  left: 820px;
  top: 310px;
}

.ellipse-outline-2 {
  width: 150px;
  height: 210px;
  right: 120px;
  top: 360px;
}

/* ===== Hover Motion (Ant Design Feel) ===== */
.ellipse-blue:hover {
  background: linear-gradient(135deg, #4096ff 0%, #91caff 100%);
}
.ellipse-red:hover {
  background: linear-gradient(135deg, #ff7875 0%, #ffccc7 100%);
}
.ellipse-yellow:hover {
  background: linear-gradient(135deg, #ffc53d 0%, #ffe58f 100%);
}

/* ===== Responsive Scaling ===== */
@media (max-width: 1279px) {
  .hero-illustrations {
    transform: scale(0.85);
    transform-origin: right top;
  }
}

@media (max-width: 1023px) {
  .hero-illustrations {
    transform: scale(0.7);
    transform-origin: center top;
  }
}

@media (max-width: 767px) {
  .hero-illustrations {
    transform: scale(0.5);
    transform-origin: center top;
  }

  .ellipse-outline {
    display: none;
  }
}

/* ===== Extra Fine-Tuning ===== */
.image {
  object-fit: contain;
  border-radius: 50%;
}

.illustration-frame {
  cursor: pointer;
}
</style>
