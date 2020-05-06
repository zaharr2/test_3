<template lang="pug">
  h1 Order history
</template>

<script>
  export default {
    name: "OrdersHistory",
    mounted() {
      this.getOrdersHistory()
    },
    methods: {
      getOrdersHistory() {
        console.log(process.env.VUE_APP_API_URL);
        let path = process.env.VUE_APP_API_URL + "/order";
        fetch(path, { method: "GET" })
          .then(response => response.json())
          .then(data => {
            console.log("OrdersHistory", JSON.parse(data));
          })
          .catch(error => {
            console.log("OrdersHistory error:", error);
          })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
