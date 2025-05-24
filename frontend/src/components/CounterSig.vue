<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-box">
      <h3>Ciao {{ label }} 👋</h3>
      <p>{{ modalMessage }}</p>
      <button @click="closeModal">Chiudi</button>
    </div>
  </div>
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
      winnerUser: "",
      modalMessage: "",
      showModal: false,
    };
  },
  props: ['label'],
  methods: {
    closeModal() {
      this.showModal = false;
    },
    increment() {
      this.count += 1;
      this.updateCounter();
    },
    decrement() {
      if (this.count > 0) {
        this.count -= 1;
        this.updateCounter();
      }
    },
    async updateCounter() {
      const date = new Date().toISOString().split('T')[0];
      await http.put(`/api/data/${date}/${this.label}`, { count: this.count });
    },
    async getCounter(date) {
      try {
        const response = await http.get(`/api/data/${date}/${this.label}`);
        this.count = response.data["count"] || 0;
        if(this.count === 0) {
          let yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday = yesterday.toISOString().split('T')[0];
          this.getYesterdayCounters(yesterday)
          this.showModal = true;
        }
      } catch (error) {
        console.error('Failed to get counts:', error);
      }
    },
    async getYesterdayCounters(date) {
      const response = await http.get(`/api/data/${date}`);
      console.log(response)
      let min = 1000000;
      let winnerUser = "";
      for (const user in response.data) {
        const count = response.data[user];
        if(count < min) {
          min = count;
          winnerUser = user;
        }
      }
      if(winnerUser === this.label) {
        this.modalMessage = "Bravissimoh! Ieri hai fumato meno sigarette di tutti!"
      } else {
        this.modalMessage = "Mi spiace...ma hai qualcun altro ha fumato meno sigarette di te. Il vincitore è " + winnerUser
      }
    }
  },
  mounted() {
    const date = new Date().toISOString().split('T')[0];
    this.getCounter(date);
  }
};
</script>


<style scoped>

.counter {
  display: flex;
  /* align-content: center; */
  justify-content: center;
  width: 100%;
}
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
    width: 60%;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background: white;
  padding: 30px;
  margin: 0 20px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  text-align: center;
}

.modal-box button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #3fc180;
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
}
.modal-box button:hover {
  background: #38a169;
}

</style>