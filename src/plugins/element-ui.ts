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
  Message
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

Vue.prototype.$message = Message;
