<template lang="pug">
  .form
    h1 Order form
      span(v-if="selected.pairSymbol.length")  for {{ selected.pairSymbol }}
    input(type="number" v-model="orderQty" min="1" @keypress="isNumber")
    br
    button(@click="sendForm('Buy')") Купить
    button(@click="sendForm('Sell')") Продать
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
    methods: {
      isNumber(event) {
        if (event.keyCode < 48 || event.keyCode > 57) {
          event.preventDefault();
        }
      },
      sendForm(side) {
        console.log(side)
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
            console.log("sendForm", data);
          })
          .catch(error => {
            console.log("sendForm error:", error);
          })

      }
    }
  }
</script>

<style scoped lang="scss">
.form {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;

  input {
    display: block;
    padding: 5px 10px;
    width: calc(25vw - 42px);
    font-size: 30px;
  }

  button {
    font-size: 30px;
    padding: 10px 40px;


    &:last-of-type {
      float: right;
    }
  }
}
</style>
