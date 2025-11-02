<template>
  <footer class="footer-section">
    <!-- Top footer -->
    <div class="footer-main">
      <!-- Company details -->
      <div class="footer-col company">
        <h2 class="logo">BlueStock</h2>
        <p>Beautiful photos and videos sorted by geographic location.</p>
      </div>

      <!-- Company links -->
      <div class="footer-col">
        <h3>Company</h3>
        <ul>
          <li>About us</li>
          <li>Frequently asked questions</li>
          <li>Contact us</li>
          <li>Privacy policy</li>
          <li>Terms and conditions</li>
        </ul>
      </div>

      <!-- Popular categories -->
      <div class="footer-col">
        <h3>Popular categories</h3>
        <ul>
          <li>Sydney photos</li>
          <li>Brisbane photos</li>
          <li>Melbourne photos</li>
          <li>Adelaide photos</li>
          <li>Western Australia photos</li>
        </ul>
      </div>

      <!-- Social -->
      <div class="footer-col social">
        <h3>Connect with us</h3>
        <div class="icons">
          <span class="icon fb"></span>
          <span class="icon ig"></span>
          <span class="icon tw"></span>
        </div>
      </div>
    </div>

    <!-- Copyright bar -->
    <div class="footer-bottom">
      <p>© 2025 - BlueStock</p>
      <p>Specific moments captured.</p>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
/* --- Make footer appear after all content --- */
html, body, #__nuxt, #app {
  height: 100%;
}
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Allow footer to sit at the bottom if page is short */
.footer-section {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background: #1c212e;
  padding-top: 64px;
  gap: 20px;
  width: 100%;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #f8fafc;
}

/* --- Top Section --- */
.footer-main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 32px;
  gap: 20px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 329px;
  flex-grow: 1;
}

.footer-col h3 {
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 8px;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li {
  font-size: 14px;
  line-height: 20px;
  color: #f8fafc;
  opacity: 0.9;
  cursor: pointer;
}

.footer-col ul li:hover {
  text-decoration: underline;
}

/* --- Company --- */
.company h2.logo {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}

.company p {
  font-size: 14px;
  line-height: 20px;
  color: #fff;
  opacity: 0.8;
}

/* --- Social --- */
.social {
  align-items: flex-end;
}

.social .icons {
  display: flex;
  flex-direction: row;
  gap: 13px;
}

.icon {
  width: 20px;
  height: 20px;
  border: 2px solid #f8fafc;
  border-radius: 50%;
  display: inline-block;
}

.icon:hover {
  background: #f8fafc;
  cursor: pointer;
}

/* --- Bottom Bar --- */
.footer-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  height: 70px;
  width: 100%;
  background: #131825;
}

.footer-bottom p {
  font-size: 14px;
  color: #fff;
  margin: 0;
}
</style>
