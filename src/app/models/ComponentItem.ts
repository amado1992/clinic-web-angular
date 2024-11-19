export class ComponentItem {

  constructor(public componentData: any, public type: string, public visible: boolean, public categoryId, public canCirculate) {
    this.componentData = componentData;
    this.type = type;
    this.visible = visible;
    this.categoryId = categoryId;
  }

}
