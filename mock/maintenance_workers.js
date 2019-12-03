function query() {
  return {
    errcode: 0,
    errmsg: "",
    data: [
      {
        pid: "1",
        name: "john"
      },
      {
        pid: "2",
        name: "mike"
      },
      {
        pid: "3",
        name: "lion"
      }
    ]
  };
}

module.exports = query;
