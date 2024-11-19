import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent  {
  faAngleDoubleLeftIcon = faAngleDoubleLeft;
  faAngleDoubleRightIcon = faAngleDoubleRight;
  faAngleLeftIcon = faAngleLeft;
  faAngleRightIcon = faAngleRight;
  @Input() maxPage = 1500;
  @Output() pageChange = new EventEmitter<number>();
  @Input() totalItems = 1500;
  cPage = 1;

  @Input()
  set currentPage(value: number) {
    if (value <= this.maxPage && value >= 1) {
      this.cPage = value;
    }
  }

  goRight() {
    if (this.cPage < this.maxPage) {
      this.cPage++;
      this.emitCurrentPage();
    }   
  }

  goLeft() {
    if (this.cPage < 2) 
    {
      this.cPage = 1;
    } 
    else 
    {
      this.cPage--;      
      this.emitCurrentPage();
    }
  }

  goEnd() {
    var emit: boolean = false;
    if(this.cPage != this.maxPage)
        emit = true;
    this.cPage = this.maxPage;

    if(emit)
      this.emitCurrentPage();
  }

  goBegin() {
    var emit: boolean = false;
    if(this.cPage != 1)
        emit = true;
    this.cPage = 1;

    if(emit)
      this.emitCurrentPage();
  }

  emitCurrentPage() {
    this.pageChange.emit(this.cPage ? this.cPage - 1 : 0);
  }
}

