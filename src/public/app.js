// create Vue instance
const app = Vue.createApp({
  data() {
    return {
      alerts: [],
      balance: {},
      orders: [],
      price: {},
      high: {}
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    alert(text) {
      let time = 5;
      let id = Date.now();
      let alert = {
        id: id,
        text: text
      };
      this.alerts.push(alert);
      setTimeout(() => {
        // remove the alert
        let position = -1;
        for (let i = 0; i < this.alerts.length; i++) {
          if (this.alerts[i].id === id) {
            position = i;
            break;
          }
        }
        if (position >= 0) {
          this.alerts.splice(position, 1);
        }
      }, time * 1000);
    }
  },
  mounted() {
    const hostname = window.location.hostname;
    const host = hostname === "localhost" ? hostname + ":80" : window.location.host;
    const secure = window.location.protocol !== "http:";
    const ws = new WebSocket((secure ? "wss://" : "ws://") + host);
    ws.addEventListener("error", () => {
      this.alert("Connection error");
    });
    ws.addEventListener("message", m => {
      let message = JSON.parse(m.data);
      switch (message.type) {
        case "ERROR":
          this.alert("Error: " + message.error);
          break;
        case "DATA_FETCHED":
          this.balance = message.balance;
          this.orders = message.orders;
          this.price = message.price;
          this.high = message.high;
          break;
      }
    });
  }
});

app.component("toast", {
  props: {
    text: String,
    time: {type: Number, default: 5}
  },
  data() {
    return {
      show: false
    }
  },
  template: `<div class="toast toast-dark fade mb-2" :class="{'show': show}">
                <div class="toast-header">
                  <strong class="me-auto">Notification</strong>
                  <button type="button" class="btn-close"></button>
                </div>
                <div class="toast-body">
                  {{ text }}
                </div>
              </div>`,
  mounted() {
    setTimeout(() => {
      this.show = true;
    }, 100);
    setTimeout(() => {
      this.show = false;
    }, this.time * 1000 - 200);
  }
});

// Mount Vue application
window.vm = app.mount("#app");
