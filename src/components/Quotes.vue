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
import EventBus from "@/event-bus";

export default {
  name: "Quotes",
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
      quotes: []
    }
  },
  watch: {
    "selected.pairSymbol": {
      handler(symbol) {
        this.getQuotes(symbol)
      }
    }
  },
  mounted() {
    EventBus.$on("updateQuotes", payload => this.updateData(payload))
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
      let path = process.env.VUE_APP_API_URL + "/api/v1/trade/bucketed?binSize=1m&partial=false&count=100&reverse=true&symbol=" + symbol;

      fetch(path)
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            this.quotes = data.map(el => {
              let {timestamp, open, high, low, close, grossValue} = { ...el };
              return {timestamp, open, high, low, close, grossValue}
            });
            EventBus.$emit("subscribeForQuotes")
          }
        })
        .catch(error => {
          console.log("getQuotes error:", error);
        })
    },
    updateData(data) {
      data.map(el => {
        let {timestamp, open, high, low, close, grossValue} = { ...el };
        return {timestamp, open, high, low, close, grossValue}
      }).forEach(el => {
        if (this.quotes.unshift(el) > 100) this.quotes.pop();
      })
    }
  }
}
</script>
