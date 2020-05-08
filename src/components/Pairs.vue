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
import EventBus from "@/event-bus";

export default {
  name: "Pairs",
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          pairSymbol: ""
        }
      }
    }
  },
  data() {
    return {
      pairs: []
    }
  },
  mounted() {
    this.getPairs()
    EventBus.$on("updatePairs", payload => this.updateData(payload))
  },
  methods: {
    getPairs() {
      let path = process.env.VUE_APP_API_URL + '/api/v1/instrument/active';

      fetch(path)
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            this.pairs = data.map(el => {
              let {symbol, lastPrice} = { ...el };
              return {symbol, lastPrice}
            });
            EventBus.$emit("subscribeForPairs")
          }
        })
        .catch(error => {
          console.log("getPairs error:", error);
        })
    },
    updateData(data) {
      for (let i = 0; i < data.length; i++) {
        if (Object.prototype.hasOwnProperty.call(data[i], "lastPrice")) {
          for (let j = 0; j < this.pairs.length; j++) {
            if (this.pairs[j].symbol === data[i].symbol) {
              this.pairs[j].lastPrice = data[i].lastPrice
            }
          }
        }
      }
    }
  }
}
</script>
