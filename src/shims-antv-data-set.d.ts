declare module "@antv/data-set" {
  namespace DataSet {}
  class DataSet {
    isDataSet: boolean;
  }

  interface transformOptions {
    type: "rename" | "percent" | "map";
    field?: string;
    fields?: string[];
    dimension?: string;
    as?: string;
    map?: object;
    callback?(row: any): void;
  }
  class View {
    isView: boolean;
    transform(options: transformOptions): void;
    source(data: any, options?: object): View;
  }
}
