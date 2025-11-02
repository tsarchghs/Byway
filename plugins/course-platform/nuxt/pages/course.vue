<template>
  <section class="course-player">
    <h2 class="title">Introduction to User Experience Design</h2>

    <div class="layout">
      <!-- LEFT: video preview -->
      <div class="video-preview">
        <img src="/course-thumbnail.jpg" alt="Course thumbnail" class="thumb" />
        <button class="play-button">
          <div class="play-bg"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="play-icon"
          >
            <path
              d="M8 5v14l11-7z"
              fill="#0F172A"
            />
          </svg>
        </button>
      </div>

      <!-- RIGHT: chapters list -->
      <aside class="chapters">
        <h3>Course Completion</h3>

        <div
          v-for="(chapter, i) in chapters"
          :key="i"
          class="chapter"
          :class="{ active: i === activeIndex }"
          @click="activeIndex = i"
        >
          <div class="left">
            <input
              type="checkbox"
              v-model="chapter.done"
              :checked="chapter.done"
            />
            <span class="index">{{ i + 1 }}.</span>
            <span class="title">{{ chapter.title }}</span>
          </div>
          <div class="right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="icon"
            >
              <circle cx="12" cy="12" r="10" stroke="#64748B" stroke-width="2" fill="none" />
              <polygon points="10,8 16,12 10,16" fill="#64748B" />
            </svg>
            <span class="time">{{ chapter.duration }}</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- Overview text -->
    <div class="overview">
      <div class="block">
        <h4>Course Overview</h4>
        <p>
          Embark on a transformative journey into the dynamic world of User Experience (UX) Design with our comprehensive course.
          You’ll gain a foundational understanding of the principles, methodologies, and tools that drive exceptional user experiences in the digital landscape.
        </p>
      </div>

      <div class="block">
        <h4>Key Learning Objectives</h4>
        <p>
          Gain a clear understanding of what UX Design entails and its importance in today’s digital world. Explore the principles of user-centered design
          and how to apply them to create intuitive interfaces. Learn the various elements that contribute to a positive user experience — information architecture,
          interaction design, and visual design.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "CoursePlayer",
  data() {
    return {
      activeIndex: 1,
      chapters: [
        {
          title: "The Role of UX Design in Digital Products",
          duration: "4 min",
          done: true,
        },
        {
          title: "Design Principles for Beginners",
          duration: "6 min",
          done: true,
        },
        {
          title: "User Research Basics",
          duration: "5 min",
          done: false,
        },
        {
          title: "Prototyping and Testing",
          duration: "7 min",
          done: false,
        },
        {
          title: "Final Project",
          duration: "8 min",
          done: false,
        },
      ],
    };
  },
};
</script>

<style scoped>
.course-player {
  background: #f8fafc;
  border-radius: 16px;
  padding: 40px 5%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
}

.layout {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
}

/* ─── Left Video ───────────────────────────── */
.video-preview {
  flex: 1 1 60%;
  position: relative;
  max-width: 800px;
  border-radius: 16px;
  overflow: hidden;
}
.video-preview .thumb {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 16px;
}
.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: none;
  background: transparent;
  cursor: pointer;
}
.play-bg {
  width: 100px;
  height: 100px;
  background: #f8fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-icon {
  position: absolute;
  width: 44px;
  height: 44px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* ─── Right Chapters Panel ─────────────────── */
.chapters {
  flex: 0 0 360px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  max-height: 800px;
  overflow-y: auto;
}
.chapters h3 {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 16px;
}

.chapter {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease;
}
.chapter:hover {
  background: #f1f5f9;
}
.chapter.active {
  background: #0f172a;
  color: white;
}
.chapter.active .title,
.chapter.active .index,
.chapter.active .time {
  color: white;
}
.chapter .left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.chapter .left input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #3b82f6;
}
.chapter .index {
  font-size: 16px;
  color: #0f172a;
}
.chapter .title {
  font-size: 16px;
  line-height: 1.6;
  color: #0f172a;
  max-width: 220px;
}
.chapter .right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.chapter .icon {
  width: 22px;
  height: 22px;
}
.chapter .time {
  font-size: 14px;
  color: #64748b;
}

/* ─── Overview Section ─────────────────────── */
.overview {
  background: white;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.block h4 {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}
.block p {
  font-size: 16px;
  color: #334155;
  line-height: 1.6;
}

/* ─── Responsive ───────────────────────────── */
@media (max-width: 1024px) {
  .layout {
    flex-direction: column;
  }
  .chapters {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .course-player {
    padding: 24px;
  }
  .title {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .chapters {
    padding: 16px;
  }
  .overview {
    padding: 20px;
  }
}
/* ──────────────────────────────── */
/* 🎨 ADDITIVE POLISHING LAYER     */
/* ──────────────────────────────── */

/* General layout fine-tune */
.course-player {
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
}

.course-player * {
  box-sizing: border-box;
  transition: all 0.25s ease;
}

/* Headings */
.title {
  letter-spacing: -0.2px;
  margin-bottom: 12px;
}

.chapters h3 {
  letter-spacing: -0.3px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e2e8f0;
}

/* ─── Video Section Polish ───── */
.video-preview {
  position: relative;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.video-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.1);
}

.play-button {
  border-radius: 50%;
  overflow: hidden;
}

.play-bg {
  box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.play-button:hover .play-bg {
  transform: scale(1.1);
  box-shadow: 0 0 0 12px rgba(255, 255, 255, 0.5);
}

.play-icon {
  fill: #0f172a;
  transition: transform 0.2s ease;
}

.play-button:hover .play-icon {
  transform: scale(1.15);
}

/* ─── Chapters Polish ────────── */
.chapters {
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f8fafc;
}

.chapters::-webkit-scrollbar {
  width: 8px;
}

.chapters::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}

.chapters::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.chapter {
  border-radius: 8px;
  margin-bottom: 6px;
  position: relative;
  overflow: hidden;
}

.chapter input[type="checkbox"] {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.chapter input[type="checkbox"]:checked {
  transform: scale(1.1);
}

.chapter.active {
  background: #1e293b;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.25);
  border-radius: 8px;
}

.chapter.active:hover {
  background: #0f172a;
}

.chapter:hover:not(.active) {
  background: #f1f5f9;
}

.chapter .index {
  font-weight: 500;
  opacity: 0.9;
}

.chapter .title {
  font-weight: 500;
  word-break: break-word;
}

.chapter .time {
  font-weight: 400;
  font-size: 14px;
  letter-spacing: -0.2px;
}

.chapter .icon {
  stroke: #64748b;
  opacity: 0.9;
}

.chapter.active .icon {
  stroke: #ffffff;
}

/* ─── Checkbox Enhancements ───── */
.chapter input[type="checkbox"] {
  width: 18px;
  height: 18px;
  border: 1px solid #cbd5e1;
  border-radius: 5px;
  background: #ffffff;
  appearance: none;
  position: relative;
}

.chapter input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid #3b82f6;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* ─── Overview Section Polish ─── */
.overview {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.block {
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.block:last-child {
  border-bottom: none;
}

.block h4 {
  letter-spacing: -0.3px;
  margin-bottom: 10px;
}

.block p {
  color: #475569;
  text-align: justify;
}

/* ─── Hover, Focus, Animation ─── */
.chapter,
.play-button {
  transition: all 0.25s ease;
}

.chapter:active {
  transform: scale(0.99);
}

.play-button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 4px;
}

/* ─── Responsive Polish ──────── */
@media (max-width: 1024px) {
  .course-player {
    padding: 32px 24px;
  }

  .layout {
    flex-direction: column;
    align-items: center;
  }

  .video-preview {
    max-width: 100%;
  }

  .chapters {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .course-player {
    padding: 24px 16px;
  }

  .chapters h3 {
    font-size: 20px;
  }

  .title {
    font-size: 22px;
  }

  .chapter .title {
    font-size: 15px;
  }

  .chapter .time {
    font-size: 13px;
  }

  .overview {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 18px;
    text-align: center;
  }

  .layout {
    gap: 24px;
  }

  .chapters {
    padding: 16px 12px;
    border-radius: 12px;
  }

  .overview {
    padding: 20px;
    border-radius: 12px;
  }

  .chapter {
    padding: 12px 8px;
  }

  .chapter .title {
    max-width: 160px;
  }

  .play-bg {
    width: 80px;
    height: 80px;
  }

  .play-icon {
    width: 36px;
    height: 36px;
  }
}

/* ─── Microinteractions ──────── */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chapter,
.block {
  animation: fadeIn 0.4s ease forwards;
}

.play-bg {
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.4);
  }
}

</style>
