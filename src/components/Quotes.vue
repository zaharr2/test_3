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
      .item(v-for="quote in value" :key="quote.timestamp")
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
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString("ru", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
      });
    }
  }
};
</script>
