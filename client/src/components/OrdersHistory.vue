<template lang="pug">
  h1 Order history
</template>

<script>
  export default {
    name: "OrdersHistory",
    mounted() {
      // this.getOrdersHistory()
    },
    methods: {
      getOrdersHistory() {
        let path = process.env.VUE_APP_API_URL + "/order";
        fetch(path, { method: "GET" })
          .then(response => {
            console.log("getPairs", JSON.parse(response.data));
          })
          .catch(error => {
            console.log("OrdersHistory error:", error);
          })
      }
    }
  }
</script>
