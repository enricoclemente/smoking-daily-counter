<template>
  <div class="counter">
    <label>{{ label }}</label>
    <button @click="increment">Increment</button>
    <span>{{ count }}</span>
  </div>
</template>

<script>
import axios from 'axios';

const http = axios; 

export default {
  data() {
    return {
      count: 0,
    };
  },
  props: ['label'],
  methods: {
    increment() {
      this.count += 1;
      this.updateCounter();
    },
    async updateCounter() {
      const date = new Date().toISOString().split('T')[0];
      await http.put(`/data/${date}`, { [this.label]: this.count });
    },
    async getCounters(date) {
      try {
        const response = await http.get(`/data`);
        if(!response.data[date]) {
          this.count = 0
        } else {
          this.count = response.data[date][this.label];
        }
      } catch (error) {
        console.error('Failed to get counts:', error);
      }
    },
  },
  mounted() {
    const date = new Date().toISOString().split('T')[0];
    this.getCounters(date);
  }
};
</script>
  <style scoped>
  .counter {
    margin-right: 20px; /* Ensure some spacing between counters */
  }
  
  span {
    font-size: 2em;
    display: block;
  }
</style>