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
    .item.item_order(v-for="order in orders" :key="order.timestamp")
      span {{ order.orderID }}
      span {{ order.symbol }}
      span {{ order.orderQty }}
      span {{ formatDate(order.timestamp) }}
      span {{ order.side }}
      span {{ order.price }}
      span {{ order.ordStatus }}
</template>

<script>
import crypto from "crypto";
import EventBus from "@/event-bus";

export default {
  name: "OrdersHistory",
  data() {
    return {
      orders: []
    }
  },
  mounted() {
    this.getOrdersHistory()
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
    getOrdersHistory() {
      let path = '/api/v1/order?count=100&reverse=true';
      let verb = 'GET';
      let expires = Math.round(new Date().getTime() / 1000) + 60;
      let signature = crypto.createHmac('sha256', process.env.VUE_APP_API_SECRET).update(verb + path + expires.toFixed()).digest('hex');
      let headers = {
        'content-type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'api-expires': expires,
        'api-key': process.env.VUE_APP_API_KEY,
        'api-signature': signature
      };
      let requestOptions = {
        headers: headers,
        method: verb
      };

      fetch(process.env.VUE_APP_API_URL + path, requestOptions)
        .then(response => response.json())
        .then(data => {
          this.orders = data.map(el => {
            let {orderID, symbol, orderQty, timestamp, side, price, ordStatus} = { ...el };
            return {orderID, symbol, orderQty, timestamp, side, price, ordStatus}
          });
          EventBus.$on("orderCreated", payload => this.updateData(payload))
        })
        .catch(error => {
          console.log("OrdersHistory error:", error);
        })
    },
    updateData(order) {
      let {orderID, symbol, orderQty, timestamp, side, price, ordStatus} = { ...order };
      if (this.orders.unshift({orderID, symbol, orderQty, timestamp, side, price, ordStatus}) > 100) this.orders.pop();
    }
  }
}
</script>
