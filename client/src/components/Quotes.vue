<template lang="pug">
  .items.items_quotes
    .item.border-bottom
      span
        strong timestamp
      span
        strong open
      span
        strong high
      span
        strong low
      span
        strong close
      span
        strong grossValue
    transition-group(name="fade" mode="out-in" tag="div")
      .item(v-for="quote in quotes" :key="quote.timestamp")
        span {{ formatDate(quote.timestamp) }}
        span {{ quote.open }}
        span {{ quote.high }}
        span {{ quote.low }}
        span {{ quote.close }}
        span {{ quote.grossValue }}
</template>

<script>
export default {
  name: "Quotes",
  data() {
    return {
      quotes: []
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString("ru", {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      })
    },
    getQuotes(symbol) {
      let path = process.env.VUE_APP_API_URL + "/trade/bucketed?symbol=" + symbol;
      fetch(path, { method: "GET" })
        .then(response => response.json())
        .then(data => {
          this.quotes = data;
          this.$emit("subscribe");
        })
        .catch(error => {
          console.log("getQuotes error:", error);
        })
    },
    updateData(data) {
      data.map(el => {
        return {
          timestamp: el.timestamp,
          open: el.open,
          high: el.high,
          low: el.low,
          close: el.close,
          grossValue: el.grossValue // TODO: не существующий параметр?
        }
      }).forEach(el => {
        this.quotes.pop();
        this.quotes.unshift(el);
      })
    }
  }
}
</script>
