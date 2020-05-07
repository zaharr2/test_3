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
  },
  methods: {
    getPairs() {
      // const crypto = require('crypto');
      // let verb = 'GET';
      let path = process.env.VUE_APP_API_URL + '/api/v1/instrument/active';
      // let expires = Math.round(new Date().getTime() / 1000) + 60;
      // let signature = crypto.createHmac('sha256', process.env.VUE_APP_API_SECRET).update(verb + path + expires.toFixed()).digest('hex');
      // let headers = {
      //   'content-type': 'application/json',
      //   'Accept': 'application/json',
      //   'X-Requested-With': 'XMLHttpRequest',
      //   'api-expires': expires,
      //   'api-key': process.env.VUE_APP_API_KEY,
      //   'api-signature': signature
      // };

      fetch(path)
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            this.pairs = data;
            this.$emit("subscribe")
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
