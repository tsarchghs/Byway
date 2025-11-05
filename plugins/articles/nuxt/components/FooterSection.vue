<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Brand / About -->
      <div class="footer-col footer-about">
        <img src="http://localhost:4000/plugins/homepage/image 4.png" alt="Byway Logo" class="footer-logo" />
        <p>
          Empowering learners through accessible and engaging online education.
          Byway is a leading online learning platform dedicated to providing
          high-quality, flexible, and affordable educational experiences.
        </p>
      </div>

      <!-- Get Help -->
      <div class="footer-col">
        <h5>Get Help</h5>
        <ul>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Latest Articles</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>

      <!-- Programs -->
      <div class="footer-col">
        <h5>Programs</h5>
        <ul>
          <li><a href="#">Art & Design</a></li>
          <li><a href="#">Business</a></li>
          <li><a href="#">IT & Software</a></li>
          <li><a href="#">Languages</a></li>
          <li><a href="#">Programming</a></li>
        </ul>
      </div>

      <!-- Contact -->
      <div class="footer-col footer-contact">
        <h5>Contact Us</h5>
        <ul>
          <li>Address: 123 Main Street, Anytown, CA 12345</li>
          <li>Tel: +(123) 456-7890</li>
          <li>Mail: bywayedu@webkul.in</li>
        </ul>
        <img src="socials.png" alt="Social Links" class="footer-socials" />
      </div>
    </div>
  </footer>
</template>

<script setup>
// purely presentational
</script>

<style scoped>
.footer {
  width: 100%;
  background: #1e293b;
  color: #cbd5e1;
  padding: 80px 20px;
  font-family: 'Inter', sans-serif;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 75px;
  flex-wrap: wrap;
}

/* --- Columns --- */
.footer-col {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-about {
  max-width: 420px;
}

.footer-logo {
  width: 111px;
  height: auto;
  margin-bottom: 10px;
}

.footer-socials {
  width: 180px;
  height: auto;
  margin-top: 20px;
}

.footer-col h5 {
  font-weight: 600;
  font-size: 18px;
  color: #f1f5f9;
  margin-bottom: 8px;
}

.footer-col p,
.footer-col li,
.footer-col a {
  font-size: 14px;
  line-height: 1.6;
  color: #cbd5e1;
  font-weight: 400;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-col a {
  text-decoration: none;
  color: inherit;
  transition: color 0.3s ease;
}

.footer-col a:hover {
  color: #f1f5f9;
}

/* 📱 Responsive layout */
@media (max-width: 1000px) {
  .footer-container {
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 40px;
  }

  .footer-col {
    width: 100%;
  }

  .footer-about p {
    max-width: 100%;
  }

  .footer-socials {
    margin-top: 10px;
  }
}
</style>
