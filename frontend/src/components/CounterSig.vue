<template>
  <div class="counter">
    <div class="counter-card">
      <h2 class="label">{{ label }}</h2>
      <div class="count-display">{{ count }}</div>
      <button @click="increment" class="increment-btn">
        <span>⬆️ 🚬</span>
      </button>
      <button @click="decrement" class="decrement-btn">
        <span>⬇️ 🚬</span>
      </button>
    </div>
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
    decrement() {
      if(this.count >= 0) {
        this.count -= 1;
        this.updateCounter();
      }
    },
    async updateCounter() {
      const date = new Date().toISOString().split('T')[0];
      await http.put(`/api/data/${date}`, { [this.label]: this.count });
    },
    async getCounters(date) {
      try {
        const response = await http.get(`/api/data`);
        if (!response.data[date]) {
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
.counter-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 50%;
  transition: transform 0.2s ease;
}

.counter-card:hover {
  transform: translateY(-2px);
}

.label {
  color: #4a5568;
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.count-display {
  font-size: 3rem;
  font-weight: 400;
  color: #48bb78;
  margin: 1.5rem 0;
}

.decrement-btn {
  background: #48bb78;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.decrement-btn:hover {
  background: #38a169;
  transform: scale(1.05);
}

.decrement-btn:active {
  transform: scale(0.95);
}

.increment-btn {
  background: #48bb78;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 10px;
}

.increment-btn:hover {
  background: #38a169;
  transform: scale(1.05);
}

.increment-btn:active {
  transform: scale(0.95);
}

.counter-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 200px;
  /* Reduced width for mobile */
  transition: transform 0.2s ease;
  flex-shrink: 0;
}


.count-display {
  font-size: 2.5rem;
  margin: 1rem 0;
}

.increment-btn {
  padding: 0.6rem 1rem;
}

.decrement-btn {
  padding: 0.6rem 1rem;
}

@media (max-width: 480px) {
  .counter-card {
    width: 45%;
    /* Percentage-based width for better responsiveness */
    padding: 1rem;
    min-width: 120px;
  }

  .count-display {
    font-size: 2rem;
  }

  .increment-btn {
    padding: 0.5rem 0.75rem;
  }

  .decrement-btn {
    padding: 0.6rem 1rem;
  }
}
</style>