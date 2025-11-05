<template>
  <div style="padding: 25px">
    <section class="popular-areas">
    <div class="footer-heading">
      <h2>Popular areas</h2>
    </div>

    <div class="footer-cols">
      <div v-for="(col, i) in columns" :key="i" class="footer-col">
        <div v-for="group in col" :key="group.title" class="footer-group">
          <h3 class="group-title">{{ group.title }}</h3>
          <ul class="group-links">
            <li v-for="(link, j) in group.links" :key="j">{{ link }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
 </div>

</template>

<script setup lang="ts">
const columns = [
  [
    {
      title: "Sydney",
      links: [
        "Sydney Opera House photos",
        "Harbour Bridge photos",
        "Sydney Harbour photos",
        "Cairns photos",
        "Brisbane City photos",
      ],
    },
    {
      title: "Melbourne",
      links: [
        "Royal Botanic Gardens photos",
        "Federation Square photos",
        "St Kilda photos",
        "Phillip Island photos",
      ],
    },
  ],
  [
    {
      title: "Adelaide",
      links: [
        "Barossa Valley photos",
        "Glenelg Beach photos",
        "Rundle Mall photos",
        "Adelaide Hills photos",
      ],
    },
    {
      title: "Brisbane",
      links: [
        "South Bank photos",
        "Story Bridge photos",
        "Mount Coot-tha photos",
      ],
    },
  ],
  [
    {
      title: "Perth",
      links: [
        "Kings Park photos",
        "Elizabeth Quay photos",
        "Cottesloe Beach photos",
        "Rottnest Island photos",
      ],
    },
    {
      title: "Canberra",
      links: [
        "Parliament House photos",
        "Lake Burley Griffin photos",
        "National Gallery photos",
      ],
    },
  ],
  [
    {
      title: "Darwin",
      links: [
        "Mindil Beach photos",
        "Litchfield Park photos",
        "Kakadu National Park photos",
      ],
    },
    {
      title: "Tasmania",
      links: [
        "Cradle Mountain photos",
        "Freycinet photos",
        "Hobart photos",
      ],
    },
  ],
]
</script>

<style scoped>
/* ✅ Fixed — now naturally follows other content */
.popular-areas {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  width: 100%;
  padding: 64px 32px;
  gap: 40px;

  background: linear-gradient(
    180deg,
    rgba(248, 250, 252, 0) 0%,
    rgba(248, 250, 252, 0.79) 32.8%,
    #f8fafc 74.09%
  );

  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative; /* Removed absolute! */
  z-index: 1;
  margin-top: 80px; /* gives visual separation from content above */
}

/* Heading */
.footer-heading h2 {
  font-size: 33px;
  font-weight: 700;
  color: #000;
  letter-spacing: -0.02em;
  margin: 0;
}

/* Columns Layout */
.footer-cols {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  max-width: 1375px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 329px;
  flex-grow: 1;
}

/* Groups */
.footer-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.group-links li {
  font-size: 14px;
  font-weight: 400;
  color: #1e293b;
  line-height: 20px;
  list-style: none;
  transition: color 0.2s ease;
}

.group-links li:hover {
  text-decoration: underline;
  cursor: pointer;
}

/* Responsive behavior */
@media (max-width: 1024px) {
  .footer-col {
    width: 45%;
  }
}

@media (max-width: 640px) {
  .footer-cols {
    flex-direction: column;
  }
  .footer-col {
    width: 100%;
  }
}
</style>
