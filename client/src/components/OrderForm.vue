<template lang="pug">
  .form
    h1 Order form
      span(v-if="selected.pairSymbol.length")  for {{ selected.pairSymbol }}
    input(type="number" v-model="orderQty" min="1" @keypress="isNumber" :disabled="isDisabled")
    br
    button(@click="sendForm('Buy')" :disabled="isDisabled") Купить
    button(@click="sendForm('Sell')" :disabled="isDisabled") Продать
</template>

<script>
export default {
  name: "OrderForm",
  props: {
    selected: {
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
      orderQty: 1
    }
  },
  computed: {
    isDisabled() {
      return !this.selected.pairSymbol.length
    }
  },
  methods: {
    isNumber(event) {
      if (event.keyCode < 48 || event.keyCode > 57) {
        event.preventDefault();
      }
    },
    sendForm(side) {
      let path = process.env.VUE_APP_API_URL + "/order";
      let data = {
        ordType: "Market",
        symbol: this.selected.pairSymbol,
        orderQty: this.orderQty,
        side: side
      };
      let options = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      fetch(path, options)
        .then(response => response.json())
        .then(data => {
          this.$emit("sendForm", data)
        })
        .catch(error => {
          console.log("sendForm error:", error);
        })
    }
  }
}
</script>
