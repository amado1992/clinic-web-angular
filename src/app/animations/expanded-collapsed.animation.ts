import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export const expandedCollapsed = trigger('expandedCollapsed', [
  state('collapsed', style({
  })),
  state('expanded', style({
    transform: 'rotate(180deg)'
  })),
  transition('collapsed <=> expanded', animate(100))
]);

export const checkedUnchecked = trigger('checkedUnchecked', [
  state('checked', style({
  })),
  state('unchecked', style({
  })),
  transition('checked => unchecked', [
    animate('1s',  keyframes([
      style({transform: 'translateX(3px)', offset: 0.2}),
      style({transform: 'translateX(-3px)', offset: 0.4}),
      style({transform: 'translateX(1px)', offset: 0.6}),
      style({transform: 'translateX(-1px)', offset: 0.8}),
      style({transform: 'translateX(0)', offset: 0.9})
    ]))
  ]),
  transition('unchecked => checked', [
    animate('1s',  keyframes([
      style({transform: 'translateX(3px)', offset: 0.2}),
      style({transform: 'translateX(-3px)', offset: 0.4}),
      style({transform: 'translateX(1px)', offset: 0.6}),
      style({transform: 'translateX(-1px)', offset: 0.8}),
      style({transform: 'translateX(0)', offset: 0.9})
    ]))
  ]),
]);
