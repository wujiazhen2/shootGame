import Sprite   from '../base/sprite'
import Bullet   from './bullet'
import PlayerBullet from './playerBullet'
import PlayerLife from './playerLife'
import DataBus  from '../databus'

const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'
const PLAYER_WIDTH   = screenWidth/3
const PLAYER_HEIGHT  = screenHeight/5
const PLAYERY = screenHeight - PLAYER_HEIGHT - 70;
const BULLETCOUNT=10;
const LIFECOUNT=5;
let databus = new DataBus()
export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)
    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = PLAYERY
    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false
    this.touchStartHander=this.touchStartHander.bind(this)
   
    
  }
  init(){
  	this.initLifes()
  	this.initBullets()
    this.initEvent()
  }
	initLifes(){
		this.playerLifes = []
    this.usedLifes = []
    let playerLife;
    for(var i=0;i<LIFECOUNT;i++){
      playerLife=new PlayerLife()
      playerLife.init(i);
      this.playerLifes.push(playerLife)
    }
  }
  initBullets(){
    this.playerBullets = []
    //回收子弹
    this.usedBullets = []
    let playerBullet;
    for(var i=0;i<BULLETCOUNT;i++){
      playerBullet=new PlayerBullet()
      playerBullet.init(i);
      this.playerBullets.push(playerBullet)
    }
  }
  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(   x >= this.x - deviation
              && y >= this.y - deviation
              && x <= this.x + this.width + deviation
              && y <= this.y + this.height + deviation  )
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2
    let disY = y - this.height / 2

    if ( disX < 0 )
      disX = 0

    else if ( disX > screenWidth - this.width )
      disX = screenWidth - this.width

    if (disY <= PLAYERY )
      disY = PLAYERY

    else if ( disY > screenHeight - this.height )
      disY = screenHeight - this.height

    this.x = disX
    this.y = disY
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    canvas.addEventListener('touchstart',(this.touchStartHander=this.touchStartHander.bind(this)))
    canvas.addEventListener('touchmove', (this.touchMoveHander=this.touchMoveHander.bind(this)))
    canvas.addEventListener('touchend', (this.touchEndHander=this.touchEndHander.bind(this)))
  }
  touchStartHander(e){
  	  e.preventDefault()
  		let x = e.touches[0].clientX
      let y = e.touches[0].clientY
      //
      if ( this.checkIsFingerOnAir(x, y) ) {
        this.touched = true
        this.setAirPosAcrossFingerPosZ(x, y)
      }
  }
  touchMoveHander(e){
      e.preventDefault()
      let x = e.touches[0].clientX
      let y = e.touches[0].clientY
      if ( this.touched )
        this.setAirPosAcrossFingerPosZ(x, y)
    }
  touchEndHander(e){
     e.preventDefault()
      this.shoot()
      databus.music.playShoot()
      this.touched = false
    }
  removeEvent(){
    canvas.removeEventListener(
      'touchstart',
      this.touchStartHander
    )
    canvas.removeEventListener(
      'touchmove',
      this.touchMoveHander
    )
    canvas.removeEventListener(
      'touchend',
      this.touchEndHander
    )
  }

  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    if (this.playerBullets.length==0)
      return 
    let bullet = databus.pool.getItemByClass('bullet', Bullet)
    bullet.init(
      this.x + this.width / 2 - bullet.width / 2,
      this.y - 10,
      10
    )
    this.usedBullets.push(this.playerBullets.pop())
    databus.bullets.push(bullet)
  }

  recoverBullet(){
    databus.count--;
    let playerBullet = this.usedBullets.pop()
    playerBullet.init(this.playerBullets.length)
    this.playerBullets.push(playerBullet);
  }
}
