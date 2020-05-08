<template lang="pug">
  .home
    .home__pairs
      Pairs(v-model="selected")
    .home__qotes
      Quotes(:selected="selected")
    .home__order-form
      OrderForm(:selected="selected")
    .home__orders-history
      OrdersHistory
</template>

<script>
import Pairs from "@/components/Pairs";
import Quotes from "@/components/Quotes";
import OrderForm from "@/components/OrderForm";
import OrdersHistory from "@/components/OrdersHistory";
import EventBus from "@/event-bus";

export default {
  name: "Home",
  components: {OrdersHistory, OrderForm, Quotes, Pairs},
  data() {
    return {
      selected: {
        pairSymbol: ""
      },
      webSocket: undefined
    }
  },
  watch: {
    "selected.pairSymbol": {
      handler(newSelectedPairSymbol, oldSelectedPairSymbol) {
        if (oldSelectedPairSymbol) this.subscriber("unsubscribe", `tradeBin1m:${oldSelectedPairSymbol}`);
      }
    }
  },
  mounted() {
    this.goLive()
    EventBus.$on("subscribeForQuotes", () => this.subscriber('subscribe', `tradeBin1m:${this.selected.pairSymbol}`))
    EventBus.$on("subscribeForPairs", () => this.subscriber('subscribe', 'instrument'))
  },
  methods: {
    goLive() {
      this.webSocket = new WebSocket(process.env.VUE_APP_WSS_URL);

      this.webSocket.onopen = () => {
        console.log("Соединение установлено.");
      };

      this.webSocket.onclose = event => {
        if (event.wasClean) {
          console.log('Соединение закрыто чисто');
        } else {
          console.log('Обрыв соединения');
        }
        console.log('Код: ' + event.code + ' причина: ' + event.reason);
      };

      this.webSocket.onmessage = event => {
        this.dataHandler(JSON.parse(event.data))
      };

      this.webSocket.onerror = error => {
        console.log("Ошибка " + error.message);
      };
    },
    dataHandler(data) {
      switch(data.table) {
        case "instrument":
          this.pairsHandler(data);
          break;
        case "tradeBin1m":
          this.quotesHandler(data);
          break;
        default:
          console.log("table: ", data);
          break;
      }
    },
    pairsHandler(data) {
      switch(data.action) {
        case "update":
          EventBus.$emit("updatePairs", data.data)
          break;
        default:
          console.log("action: ", data.action);
          break;
      }
    },
    quotesHandler(data) {
      switch(data.action) {
        case "insert":
          EventBus.$emit("updateQuotes", data.data)
          break;
        default:
          console.log("action: ", data.action);
          break;
      }
    },
    subscriber(op, args) {
      if (this.webSocket) this.webSocket.send(`{"op": "${op}", "args": "${args}"}`);
    }
  }
};
</script>
