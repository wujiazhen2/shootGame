import Animation from '../base/animation'
import DataBus from '../databus'

const ENEMY_IMG_SRC = 'images/explosion.png'
const ENEMY_WIDTH = window.innerWidth/4
const ENEMY_HEIGHT = window.innerHeight/6

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

export default class HitedEnemy extends Animation {
  constructor(enemy) {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)
    this.x=enemy.x
    this.y=enemy.y
    this[__.speed]=6
  }

  // 每一帧更新子弹位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if (this.y > window.innerHeight + 2 * this.height)
      databus.removehitedEnemey(this)
  }
}