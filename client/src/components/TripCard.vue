<script setup>
defineProps({
  country: String,
  description: String,
  image: String
})
</script>

<template>
  <div class="card">
    <div class="image-wrapper" :style="{ backgroundImage: `url(${image})` }">
      <div class="overlay">
        <h2 class="country-name">{{ country }}</h2>
      </div>
    </div>
    
    <div class="content">
      <p class="desc">
        {{ description ? description.substring(0, 100) + '...' : 'O destinație de vis te așteaptă.' }}
      </p>
      
      <div class="footer">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white; 
  border-radius: 12px; 
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08); /* Umbră fină */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex; 
  flex-direction: column; 
  height: 100%;
}

.card:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 12px 24px rgba(0,0,0,0.12); 
}

.image-wrapper {
  height: 200px;
  background-color: #bdc3c7; /* Culoare de siguranță (gri) */
  background-size: cover; 
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute; bottom: 0; left: 0; width: 100%;
  padding: 15px 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}

.country-name {
  color: white; 
  margin: 0;
  font-size: 1.5rem; 
  font-weight: 700; 
  letter-spacing: 0.5px;
}

.content {
  padding: 20px;
  flex-grow: 1;
  display: flex; flex-direction: column; justify-content: space-between;
}

.desc {
  color: #555; 
  font-size: 0.95rem; 
  line-height: 1.6; 
  margin: 0 0 20px 0;
}

.footer {
  margin-top: auto;
}
</style>