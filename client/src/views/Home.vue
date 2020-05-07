<template lang="pug">
  .home
    .home__pairs
      Pairs(v-model="selected" @subscribe="subscriber('subscribe', 'instrument')" ref="pairs")
    .home__qotes
      Quotes(:quotes="quotes")
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
        this.getQuotes();
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
          this.$refs.pairs.updatePairs(data.data)
          break;
        default:
          console.log("action: ", data.action);
          break;
      }
    },
    qoutesHandler(data) {
      switch(data.action) {
        case "insert":
          this.updateQuotes(data.data)
          break;
        default:
          console.log("action: ", data.action);
          break;
      }
    },
    subscriber(op, args) {
      if (this.webSocket) this.webSocket.send(`{"op": "${op}", "args": "${args}"}`);
    },
    getQuotes() {
      let path = process.env.VUE_APP_API_URL + "/trade/bucketed?symbol=" + this.selected.pairSymbol;
      fetch(path, { method: "GET" })
        .then(response => response.json())
        .then(data => {
          this.quotes = data
          this.subscriber("subscribe", `tradeBin1m:${this.selected.pairSymbol}`)
        })
        .catch(error => {
          console.log("getQuotes error:", error);
        })
    },
    updateQuotes(data) {
      data.map(el => {
        return {
          timestamp: el.timestamp,
          open: el.open,
          high: el.high,
          low: el.low,
          close: el.close,
          grossValue: el.grossValue // TODO: не существующий параметр?
        }
      }).forEach(el => {
        this.quotes.pop();
        this.quotes.unshift(el);
      })
    }
  }
};
</script>

<style lang="scss">
.home {
  display: flex;
  flex-flow: row wrap;
  &__pairs,
  &__qotes,
  &__order-form {
    order: 1;
    height: 70vh;
  }

  &__pairs,
  &__order-form {
    width: 25%;
  }

  &__pairs {
    overflow-y: auto;
    background: antiquewhite;
  }

  &__qotes {
    width: 50%;
    overflow-y: auto;
    background: aqua;
  }

  &__order-form {
    background: bisque;
  }

  &__orders-history {
    width: 100%;
    height: 70vh;
    background: burlywood;
    order: 2;
  }
}

.border-bottom {
  border-bottom: 2px solid black;
}

.item {
  display: flex;
  width: 100%;

  span {
    flex: 1;
    padding: 2px;
  }
}
</style>
