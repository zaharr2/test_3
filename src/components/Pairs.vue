<template lang="pug">
  .items
    .item.item_pair.border-bottom
      span
        strong symbol
      span
        strong lastPrice
    label.item.item_pair(v-for="(pair, index) in pairs" :class="{ selected: pair.symbol === value.pairSymbol }" :key="'pair-' + index")
      input(type="radio" name="radio" v-model="value.pairSymbol" :value="pair.symbol")
      span {{ pair.symbol }}
      transition(name="slide-fade" mode="out-in")
        span(:key="pair.lastPrice") {{ pair.lastPrice }}
</template>

<script>
export default {
  name: "Pairs",
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          pairSymbol: ""
        };
      }
    },
    pairs: {
      type: Array,
      default: () => []
    }
  }
};
</script>
