import { Color, Vector3 } from "three";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { HSL } from "../libs/hsl";
import { Val } from "../libs/val";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _baseCol: Vector3 = new Vector3()
  private _effectRate: Val = new Val(0)

  constructor(opt:any) {
    super(opt)
    this._baseCol.x = Util.random(0, 1)

    this.useGPU(this.el)
    this._setHover()
  }

  //
  protected _eRollOver() {
    const t = 0.25
    Tween.a(this._effectRate, {
      val: [0, 1]
    }, t, 0, Tween.Power3EaseOut)
  }

  //
  protected _eRollOut() {
    const t = 0.5
    Tween.a(this._effectRate, {
      val: 0
    }, t, 0, Tween.Power3EaseOut)
  }

  private _makeShadow(ang: number, color: Color, interval: number):string {
    let radius = 0;
    const num = ~~(Util.mix(100, 100, this._effectRate.val))
    const blur = 0

    const speed = this._c * 2 * Util.map(this._baseCol.x, 1, 2, 0, 1)

    let res = '';
    for(let i = 0; i <= num; i++) {
      const alpha = Util.mix(0, 1, this._effectRate.val) * Util.map(i, 1, 0, 0, num - 1)

      const col = color.clone()
      col.offsetHSL(Util.map(i, 0, Util.mix(1, 0, this._effectRate.val), 0, num), 0, Util.map(i, 1, 0, 0, num - 1))

      // rgbaに変換
      const cssCol = `rgba(${~~(col.r * 255)}, ${~~(col.g * 255)}, ${~~(col.b * 255)}, ${alpha})`

      let rad = Util.radian(ang + speed)
      let x = ~~(Math.sin(rad * 1) * radius) * (i % 2 == 0 ? 1 : -1);
      let y = ~~(Math.cos(rad * 1) * radius) * (i % 2 == 0 ? 1 : -1);
      res += x + 'px ' + y + 'px ' + blur + 'px ' + cssCol;
      res += ', ';

      rad = Util.radian(ang * -1 + speed)
      x = ~~(Math.sin(rad * 1) * radius) * (i % 2 == 0 ? 1 : -1);
      y = ~~(Math.cos(rad * 1) * radius) * (i % 2 == 0 ? 1 : -1);
      res += x + 'px ' + y + 'px ' + blur + 'px ' + cssCol;

      // res += ', ';
      if(i != num) {
        res += ', ';
      }

      radius += interval;
    }

    return res;
  }

  protected _update():void {
    super._update();

    const hsl = new HSL()
    hsl.s = 1
    hsl.l = 0.2
    hsl.h = this._baseCol.x
    const col = new Color().setHSL(hsl.h, hsl.s, hsl.l)

    let ang = Util.mix(-360 * 4, 45, this._effectRate.val)
    const it = Util.mix(0, 2, this._effectRate.val)
    const txtCol = new Color(0x000000)
    // txtCol.offsetHSL(this._baseCol.x * 2, 1, -1)

    const txtShadow = this._makeShadow(ang, col, it)

    Tween.set(this.el, {
      textShadow: this._effectRate.val <= 0.01 ? '' : txtShadow,
      color: txtCol.getStyle()
    })
  }
}







