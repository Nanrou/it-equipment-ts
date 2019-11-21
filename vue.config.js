module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        bypass: function(req, res) {
          if (req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          } else if (process.env.MOCK !== "none") {
            const name = req.path
              .split("/api/")[1]
              .split("/")
              .join("_")
              .split("?")[0];
            const mock = require(`./mock/${name}`); // 用在动态加载
            const result = mock(req);
            delete require.cache[require.resolve(`./mock/${name}`)]; // 手动清除缓存
            return res.send(result);
          }
        }
        // Return null or undefined to continue processing the request with proxy.
      }
    }
  }
};
