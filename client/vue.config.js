module.exports = {
  devServer: {
    proxy: {
      "/": {
        target: "https://testnet.bitmex.com"
      }
    }
  }
};
