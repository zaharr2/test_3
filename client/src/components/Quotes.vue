<template lang="pug">
  h1 Quotes
</template>

<script>
export default {
  name: "Quotes",
  mounted() {
    this.getQuotes()
  },
  methods: {
    getQuotes() {
      console.log(process.env.VUE_APP_API_URL);
      let path = process.env.VUE_APP_API_URL + "/trade/bucketed";
      fetch(path, { method: "GET" })
        .then(response => response.json())
        .then(data => {
          console.log("getQuotes", JSON.parse(data));
        })
        .catch(error => {
          console.log("getQuotes error:", error);
        })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
