function query() {
  return {
    errcode: 0,
    errmsg: "",
    data: {
      totalPage: 3,
      tableData: [
        {
          oid: "1",
          status: "R",
          pid: "1",
          name: "john",
          eid: "1",
          equipment: "台式电脑",
          department: "where",
          content: "abcdef",
          reason: "just do it",
          rank: 1
        },
        {
          oid: "2",
          status: "D",
          pid: "1",
          name: "john",
          eid: "1",
          equipment: "台式电脑",
          department: "where",
          content: "abcdef",
          reason: "just do it",
          rank: 1
        },
        {
          oid: "3",
          status: "C",
          pid: "1",
          name: "john",
          eid: "1",
          equipment: "台式电脑",
          department: "where",
          content: "abcdef",
          reason: "just do it",
          rank: 1
        }
      ]
    }
  };
}

module.exports = query;
