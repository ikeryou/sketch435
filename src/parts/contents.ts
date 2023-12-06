import { MyDisplay } from "../core/myDisplay";
import { Item } from "./item";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _item: Array<Item> = []

  constructor(opt:any) {
    super(opt)

    // spanタグに分解
    const item = this.qs('.js-item')
    const txt = item.innerHTML
    item.innerHTML = ''
    for(let i = 0; i < txt.length; i++) {
      const span = document.createElement('span')
      span.innerHTML = txt.substring(i, i + 1)
      item.appendChild(span)

      this._item.push(new Item({
        el: span,
      }))
    }
  }
}