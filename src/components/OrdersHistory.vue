<template lang="pug">
  .items.items_orders
    .item.item_order.border-bottom
      span
        strong orderID
      span
        strong symbol
      span
        strong orderQty
      span
        strong timestamp
      span
        strong side
      span
        strong price
      span
        strong ordStatus
    .item.item_order(v-for="order in value" :key="order.timestamp")
      span {{ order.orderID }}
      span {{ order.symbol }}
      span {{ order.orderQty }}
      span {{ formatDate(order.timestamp) }}
      span {{ order.side }}
      span {{ order.price }}
      span {{ order.ordStatus }}
</template>

<script>
export default {
  name: "OrdersHistory",
  props: {
    value: {
      type: Array,
      default: () => {}
    }
  },
  // mounted() {
  //   this.getOrdersHistory()
  // },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString("ru", {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      })
    }
  }
}
</script>
