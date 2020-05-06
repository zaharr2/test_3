<template lang="pug">
  h1 Pairs
</template>

<script>
export default {
  name: "Pairs",
  mounted() {
    this.getPairs()
  },
  methods: {
    getPairs() {
      let path = process.env.VUE_APP_API_URL + "/instrument/active";
      fetch(path, { method: "GET" })
        .then(response => response.json())
        .then(data => {
          console.log("getPairs", JSON.parse(data));
        })
        .catch(error => {
          console.log("getPairs error:", error);
        })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
