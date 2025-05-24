<template>
  <header>
    <h1>Io e i miei polmoni</h1>
  </header>
  <CounterSig :label="nickname" />
</template>

<script>
import CounterSig from './CounterSig.vue';

export default {
  components: {
    CounterSig
  },
  data() {
    return {
      nickname: localStorage.getItem('nickname')
    };
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
</style>