import Animation from '../base/animation'
import DataBus   from '../databus'

const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_WIDTH   = window.innerWidth/7
const ENEMY_HEIGHT  = window.innerHeight/11

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end){
  return Math.floor(Math.random() * (end - start) + start)
}
const RUNNING=0
const REMOVING=1
const REMOVE=2

export default class Enemy extends Animation {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)
    
  }

  init(speed) {
    this.x = 0;
    this.y = 30 * rnd(1,7);
    this[__.speed] = rnd(1,speed);
    this.visible = true
    this.state=RUNNING
  }

 

  // 每一帧更新爱心位置
  update() {
    this.x += this[__.speed]
    // 对象回收
    if ( this.x > window.innerWidth  && this.state==RUNNING) {
      databus.removeEnemey(this)
      databus.life++
      databus.player.playerLifes.pop()
      databus.isGameOver()
     }
  }
}
