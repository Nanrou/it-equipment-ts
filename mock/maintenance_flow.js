function query() {
  return {
    errcode: 0,
    errmsg: "",
    data: [
      {
        status: "R",
        content: "start"
      },
      {
        status: "D",
        content: "dispatch"
      },
      {
        status: "H",
        content: "doing"
      }
    ]
  };
}
module.exports = query;
