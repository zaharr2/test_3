<template lang="pug">
  .home
    .home__pairs
      Pairs(v-model="selected" @subscribe="subscriber('subscribe', 'instrument')" ref="pairs")
    .home__qotes
      Quotes(:quotes="quotes" @subscribe="subscriber('subscribe', `tradeBin1m:${selected.pairSymbol}`)" ref="quotes")
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

export default {
  name: "Home",
  components: {OrdersHistory, OrderForm, Quotes, Pairs},
  data() {
    return {
      selected: {
        pairSymbol: ""
      },
      quotes: [],
      webSocket: undefined
    }
  },
  watch: {
    "selected.pairSymbol": {
      handler(newSelectedPairSymbol, oldSelectedPairSymbol) {
        console.log("selectedPairSymbol", newSelectedPairSymbol, oldSelectedPairSymbol);
        if (oldSelectedPairSymbol) this.subscriber("unsubscribe", `tradeBin1m:${oldSelectedPairSymbol}`);
        this.$refs.quotes.getQuotes(newSelectedPairSymbol);
      }
    }
  },
  mounted() {
    this.goLive()
  },
  methods: {
    goLive() {
      this.webSocket = new WebSocket(process.env.VUE_APP_WSS_URL);

      this.webSocket.onopen = () => {
        console.log("Соединение установлено.");

        // socket.send(`{"op": "subscribe", "args": "instrument"}`);
      };

      this.webSocket.onclose = event => {
        if (event.wasClean) {
          console.log('Соединение закрыто чисто');
        } else {
          console.log('Обрыв соединения'); // например, "убит" процесс сервера
        }
        console.log('Код: ' + event.code + ' причина: ' + event.reason);
      };

      this.webSocket.onmessage = event => {
        // console.log("Получены данные ", JSON.parse(event.data));

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
          this.qoutesHandler(data);
          break;
        default:
          console.log("table: ", data);
          break;
      }
    },
    pairsHandler(data) {
      switch(data.action) {
        case "update":
          this.$refs.pairs.updateData(data.data)
          break;
        default:
          console.log("action: ", data.action);
          break;
      }
    },
    qoutesHandler(data) {
      switch(data.action) {
        case "insert":
          this.$refs.quotes.updateData(data.data)
          // this.updateQuotes(data.data)
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
