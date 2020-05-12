<template lang="pug">
  .form
    h1 Order form
      span(v-if="selected.pairSymbol.length")  for {{ selected.pairSymbol }}
    input(type="number" v-model="orderQty" min="1" @keypress="isNumber" :disabled="isDisabled")
    br
    button(@click="sendForm('Buy')" :disabled="isDisabled") Buy
    button(@click="sendForm('Sell')" :disabled="isDisabled") Sell
</template>

<script>
import crypto from "crypto";

export default {
  name: "OrderForm",
  props: {
    selected: {
      type: Object,
      default: () => {
        return {
          pairSymbol: ""
        };
      }
    }
  },
  data() {
    return {
      orderQty: 1
    };
  },
  computed: {
    isDisabled() {
      return !this.selected.pairSymbol.length;
    }
  },
  methods: {
    isNumber(event) {
      if (event.keyCode < 48 || event.keyCode > 57) {
        event.preventDefault();
      }
    },
    sendForm(side) {
      let path = "/api/v1/order";
      let verb = "POST";
      let expires = Math.round(new Date().getTime() / 1000) + 60;
      let body = {
        ordType: "Market",
        symbol: this.selected.pairSymbol,
        orderQty: this.orderQty,
        side: side
      };
      let postBody = JSON.stringify(body);
      let signature = crypto
        .createHmac("sha256", process.env.VUE_APP_API_SECRET)
        .update(verb + path + expires.toFixed() + postBody)
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
        method: verb,
        body: postBody
      };

      fetch(process.env.VUE_APP_API_URL + path, requestOptions)
        .then(response => response.json())
        .then(data => {
          // if (!data.error) this.$emit("sendForm", data)
          if (!data.error) this.$emit("orderCreated", data);
        })
        .catch(error => {
          console.log("sendForm error:", error);
        });
    }
  }
};
</script>
