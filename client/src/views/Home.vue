<template lang="pug">
  .home
    .home__pairs
      Pairs
    .home__qotes
      Quotes
    .home__order-form
      OrderForm
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
  mounted() {
    // this.goLive()
  },
  methods: {
    goLive() {
      let socket = new WebSocket(process.env.VUE_APP_WSS_URL);

      socket.onopen = function() {
        console.log("Соединение установлено.");

        socket.send(`{"op": "subscribe", "args": "instrument"}`);
      };

      socket.onclose = function(event) {
        if (event.wasClean) {
          console.log('Соединение закрыто чисто');
        } else {
          console.log('Обрыв соединения'); // например, "убит" процесс сервера
        }
        console.log('Код: ' + event.code + ' причина: ' + event.reason);
      };

      socket.onmessage = function(event) {
        console.log("Получены данные " + JSON.parse(event.data));
      };

      socket.onerror = function(error) {
        console.log("Ошибка " + error.message);
      };
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
    background: antiquewhite;
  }

  &__qotes {
    width: 50%;
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
</style>
