<template lang="pug">
  .home
    .home__pairs
      Pairs(v-model="selected" :pairs="pairs")
    .home__qotes
      Quotes(v-model="quotes")
    .home__order-form
      OrderForm(:selected="selected" @orderCreated="updateOrders")
    .home__orders-history
      OrdersHistory(v-model="orders")
</template>

<script>
import Pairs from "@/components/Pairs";
import Quotes from "@/components/Quotes";
import OrderForm from "@/components/OrderForm";
import OrdersHistory from "@/components/OrdersHistory";
import crypto from "crypto";

export default {
  name: "Home",
  components: { OrdersHistory, OrderForm, Quotes, Pairs },
  data() {
    return {
      selected: {
        pairSymbol: ""
      },
      orders: [],
      quotes: [],
      pairs: [],
      webSocket: undefined
    };
  },
  watch: {
    "selected.pairSymbol": {
      handler(newSelectedPairSymbol, oldSelectedPairSymbol) {
        if (oldSelectedPairSymbol)
          this.subscriber("unsubscribe", `tradeBin1m:${oldSelectedPairSymbol}`);
        this.getQuotes(newSelectedPairSymbol);
      }
    }
  },
  mounted() {
    this.goLive();
    this.getOrdersHistory();
    this.getPairs();
  },
  methods: {
    goLive() {
      this.webSocket = new WebSocket(process.env.VUE_APP_WSS_URL);

      this.webSocket.onopen = () => {
        console.log("Соединение установлено.");
      };

      this.webSocket.onclose = event => {
        if (event.wasClean) {
          console.log("Соединение закрыто чисто");
        } else {
          console.log("Обрыв соединения");
        }
        console.log("Код: " + event.code + " причина: " + event.reason);
      };

      this.webSocket.onmessage = event => {
        this.dataHandler(JSON.parse(event.data));
      };

      this.webSocket.onerror = error => {
        console.log("Ошибка " + error.message);
      };
    },
    dataHandler(data) {
      switch (data.table) {
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
      switch (data.action) {
        case "update":
          this.updatePairs(data.data);
          break;
        default:
          console.log("action: ", data.action);
          break;
      }
    },
    quotesHandler(data) {
      switch (data.action) {
        case "insert":
          this.updateQuotes(data.data);
          break;
        default:
          console.log("action: ", data.action);
          break;
      }
    },
    subscriber(op, args) {
      if (this.webSocket)
        this.webSocket.send(`{"op": "${op}", "args": "${args}"}`);
    },
    getOrdersHistory() {
      let path = "/api/v1/order?count=100&reverse=true";
      let verb = "GET";
      let expires = Math.round(new Date().getTime() / 1000) + 60;
      let signature = crypto
        .createHmac("sha256", process.env.VUE_APP_API_SECRET)
        .update(verb + path + expires.toFixed())
        .digest("hex");
      let headers = {
        "content-type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "api-expires": expires,
        "api-key": process.env.VUE_APP_API_KEY,
        "api-signature": signature
      };
      let requestOptions = {
        headers: headers,
        method: verb
      };

      fetch(process.env.VUE_APP_API_URL + path, requestOptions)
        .then(response => response.json())
        .then(data => {
          this.orders = data.map(el => {
            let {
              orderID,
              symbol,
              orderQty,
              timestamp,
              side,
              price,
              ordStatus
            } = { ...el };
            return {
              orderID,
              symbol,
              orderQty,
              timestamp,
              side,
              price,
              ordStatus
            };
          });
        })
        .catch(error => {
          console.log("OrdersHistory error:", error);
        });
    },
    updateOrders(order) {
      let { orderID, symbol, orderQty, timestamp, side, price, ordStatus } = {
        ...order
      };
      if (
        this.orders.unshift({
          orderID,
          symbol,
          orderQty,
          timestamp,
          side,
          price,
          ordStatus
        }) > 100
      )
        this.orders.pop();
    },
    getQuotes(symbol) {
      let path =
        process.env.VUE_APP_API_URL +
        "/api/v1/trade/bucketed?binSize=1m&partial=false&count=100&reverse=true&symbol=" +
        symbol;

      fetch(path)
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            this.quotes = data.map(el => {
              let { timestamp, open, high, low, close, grossValue } = { ...el };
              return { timestamp, open, high, low, close, grossValue };
            });
            this.subscriber(
              "subscribe",
              `tradeBin1m:${this.selected.pairSymbol}`
            );
          }
        })
        .catch(error => {
          console.log("getQuotes error:", error);
        });
    },
    updateQuotes(data) {
      data
        .map(el => {
          let { timestamp, open, high, low, close, grossValue } = { ...el };
          return { timestamp, open, high, low, close, grossValue };
        })
        .forEach(el => {
          if (this.quotes.unshift(el) > 100) this.quotes.pop();
        });
    },
    getPairs() {
      let path = process.env.VUE_APP_API_URL + "/api/v1/instrument/active";

      fetch(path)
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            this.pairs = data.map(el => {
              let { symbol, lastPrice } = { ...el };
              return { symbol, lastPrice };
            });
            this.subscriber("subscribe", "instrument");
          }
        })
        .catch(error => {
          console.log("getPairs error:", error);
        });
    },
    updatePairs(data) {
      for (let i = 0; i < data.length; i++) {
        if (Object.prototype.hasOwnProperty.call(data[i], "lastPrice")) {
          for (let j = 0; j < this.pairs.length; j++) {
            if (this.pairs[j].symbol === data[i].symbol) {
              this.pairs[j].lastPrice = data[i].lastPrice;
            }
          }
        }
      }
    }
  }
};
</script>
