// set moment.js locale
moment.locale(window.navigator.language);
// create Vue instance
const app = Vue.createApp({
  data() {
    return {
      alerts: [],
      log: "",
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
    },
    addLog(log) {
      if (this.log.length > 1000000) {
        this.log = this.log.substring(0, 800000);
      }
      // escape HTML chars
      let text = this.escapeHtml(log.text);
      // set colors
      text = text.replace(/{(#[a-zA-Z0-9]+)-fg}([\S ]+?){\/(#[a-zA-Z0-9]+)-fg}/g, "<span style=\"color: $1\">$2</span>");
      // set bold
      text = text.replace(/{bold}([\S ]+?){\/bold}/g, "<strong>$1</strong>");
      // remove other tags
      text = text.replace(/{[a-zA-Z0-9#\-_]+}([\S ]+?){\/[a-zA-Z0-9#\-_]+}/g, "$1");
      this.log = `[${moment(log.date || Date.now()).format("LTS")}] ${text}\n` + this.log;
    },
    escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    connectWS() {
      const hostname = window.location.hostname;
      const host = hostname === "localhost" ? hostname + ":80" : window.location.host;
      const secure = window.location.protocol !== "http:";
      const ws = new WebSocket((secure ? "wss://" : "ws://") + host);
      ws.addEventListener("error", () => {
        this.alert("Connection error");
      });
      ws.addEventListener("close", () => {
        this.alert("Disconnected from server, reconnecting");
        setTimeout(this.connectWS, 1000);
      });
      ws.addEventListener("message", m => {
        let message = JSON.parse(m.data);
        switch (message.type) {
          case "ERROR":
            this.alert("Error: " + message.error);
            break;
          case "LOG":
            this.addLog(message);
            break;
          case "PREVIOUS_LOGS":
            for (let log of message.logs) {
              this.addLog(log);
            }
            break;
          case "DATA_FETCHED":
            this.balance = message.balance;
            this.orders = message.orders;
            this.price = message.price;
            this.high = message.high;
            break;
          case "ORDER":
            const asset = message.asset;
            const params = message.params;
            let alert = `${params.type.toUpperCase()} ${params.volume} ${asset.name}`;
            if (params.price) {
              alert += " @ " + params.price;
            }
            this.alert(alert);
            break;
        }
      });
    }
  },
  mounted() {
    this.connectWS();
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
