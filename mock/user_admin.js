function query() {
  return {
    errcode: 0,
    errmsg: "",
    data: [
      {
        pid: "1",
        username: "john001",
        name: "john",
        role: 1,
        department: "where",
        phone: "12345678911",
        workNumber: "001"
      },
      {
        pid: "2",
        username: "mike002",
        name: "mike",
        role: 3,
        department: "here",
        phone: "12345678911",
        workNumber: "002"
      },
      {
        pid: "3",
        username: "lion003",
        name: "lion",
        role: 7,
        department: "there",
        phone: "12345678911",
        workNumber: "003"
      }
    ]
  };
}

module.exports = query;
