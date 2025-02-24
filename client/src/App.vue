<template>
  <div id="app">
    <header>Io e i miei polmoni</header>
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
  font-family: Arial, sans-serif;
}

header {
  text-align: center;
  padding-top: 20px;
  color: #4a4a4a;
  background-color: #f8f9fa;
}

.counter-section {
  display: flex;
  justify-content: space-evenly;
  margin: 50px auto;
}
</style>