<template>
  <div id="app">
    <header>
      <h1>Io e i miei polmoni</h1>
    </header>
    <section class="counter-section">
      <CounterSig label="Enrico" />
      <CounterSig label="Stefano" />
    </section>
  </div>
</template>

<script>
import CounterSig from './components/CounterSig.vue';

export default {
  components: {
    CounterSig
  }
}
</script>

<style>
body, html {
  margin: 0;
  background: #f5f5f5;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

header {
  text-align: center;
  padding: 2rem 1rem;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.8rem;
  margin: 0;
}

.counter-section {
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 480px) {
  .counter-section {
    gap: 1rem;
    padding: 0 0.5rem;
    max-width: 100%;
  }
  
  header {
    padding: 1.5rem 0.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
</style>