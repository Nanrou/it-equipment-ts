import Vue from "vue";
import {
  Button,
  Container,
  Header,
  Aside,
  Footer,
  Main,
  Menu,
  MenuItem,
  Submenu,
  Input,
  Row,
  Col,
  Dialog,
  Table,
  TableColumn,
  Message,
  Loading,
  Tooltip,
  Tag,
  Drawer,
  Divider,
  Form,
  FormItem,
  Select,
  Option,
  DatePicker,
  InputNumber,
  Switch,
  MessageBox,
  Tree,
  Popover,
  Steps,
  Step,
  Tabs,
  TabPane,
  Pagination
} from "element-ui";

Vue.component(Button.name, Button);
Vue.component(Container.name, Container);
Vue.component(Header.name, Header);
Vue.component(Aside.name, Aside);
Vue.component(Footer.name, Footer);
Vue.component(Main.name, Main);
Vue.component(Menu.name, Menu);
Vue.component(MenuItem.name, MenuItem);
Vue.component(Submenu.name, Submenu);
Vue.component(Input.name, Input);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Dialog.name, Dialog);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Tag.name, Tag);
Vue.component(Drawer.name, Drawer);
Vue.component(Divider.name, Divider);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(DatePicker.name, DatePicker);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Switch.name, Switch);
Vue.component(Tree.name, Tree);
Vue.component(Popover.name, Popover);
Vue.component(Steps.name, Steps);
Vue.component(Step.name, Step);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(Pagination.name, Pagination);

Vue.use(Loading.directive);
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
