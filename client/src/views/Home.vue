<template lang="pug">
  .home
    .home__pairs
      Pairs(v-model="selected" @subscribe="subscribePairs" ref="pairs")
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
      handler(selectedPairSymbol) {
        console.log("selectedPairSymbol", selectedPairSymbol);
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
        default:
          console.log(data.table);
          break;
      }
    },
    pairsHandler(data) {
      switch(data.action) {
        case "update":
          this.$refs.pairs.updatePairs(data.data)
          break;
        default:
          console.log("action", data.action);
          break;
      }
    },
    subscribePairs() {
      if (this.webSocket) this.webSocket.send(`{"op": "subscribe", "args": "instrument"}`);
    },
    getQuotes() {
      let path = process.env.VUE_APP_API_URL + "/trade/bucketed?symbol=" + this.selected.pairSymbol;
      fetch(path, { method: "GET" })
        .then(response => response.json())
        .then(data => {
          console.log("getQuotes", data);
          this.quotes = data
        })
        .catch(error => {
          console.log("getQuotes error:", error);
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
