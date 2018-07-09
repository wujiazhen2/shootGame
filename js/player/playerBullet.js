import Sprite from '../base/sprite'
import Bullet from './bullet'
import DataBus from '../databus'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
// 相关常量设置
const BUTTON_IMG_SRC = 'images/bullet.png'
const BUTTON_WIDTH = 10
const BUTTON_HEIGHT = 20
const BULLETCOUNT = 10;
let databus = new DataBus()
export default class PlayBullet extends Sprite {
  constructor() {
    super(BUTTON_IMG_SRC, BUTTON_WIDTH, BUTTON_HEIGHT)
    this.y = screenHeight - this.height-20
  }
 init(index){
   this.x = this.width + (this.width + 5) * index
 }
 update(){

 }

}