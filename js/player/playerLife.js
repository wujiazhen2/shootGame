import Sprite from '../base/sprite'
import Bullet from './bullet'
import DataBus from '../databus'
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
const LIFE_IMG_SRC = 'images/enemy.png'
const LIFE_WIDTH   = 10
const LIFE_HEIGHT  = 10
const BUTTON_HEIGHT = 20
export default class PlayerLife extends Sprite{
	constructor(ctx){
		super(LIFE_IMG_SRC, LIFE_WIDTH, LIFE_HEIGHT)
		this.y = screenHeight - this.height-BUTTON_HEIGHT-20
	}
	init(index){
		this.x=this.width + (this.width + 5) * index
	}
	update(){
		
	}
}