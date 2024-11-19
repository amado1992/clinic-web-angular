import {ComponentItem} from './ComponentItem';

export class ComponentClickedButton {
  id: number;
  name: any;
  component: ComponentItem;

  constructor(name, component?) {
    this.name = name;
    this.id = Math.random();
    this.component = component;
  }
}
