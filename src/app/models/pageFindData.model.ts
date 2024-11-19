export class PageFindData {
  private order: string;
  private property: string;
  private page: number;
  private size: number;

  constructor(order: string, property: string, page: number, size: number) {
    this.order = order;
    this.property = property;
    this.page = page;
    this.size = size;
  }
}
