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
  components: {OrdersHistory, OrderForm, Quotes, Pairs}
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
