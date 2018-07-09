import Player from './player/index'
import Enemy from './npc/enemy'
import HitedEnemy from './npc/hitedEnemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import Rank from './runtime/rank.js'


let ctx = canvas.getContext('2d')
let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.start()
   	
   
  }
  start(){
  	this.bg = new BackGround(ctx)
  	this.gameinfo = new GameInfo()
    this.rank=new Rank(ctx)
  	databus.start=false;
  	this.hasEventBind = false
  	this.bindLoop = this.loop.bind(this)    
     // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
  
  restart() {
    databus.reset()
    this.clearEvent()
    if(!this.player) {
    	this.player = new Player(ctx)
    }
    this.player.init()
    this.music = new Music()
    this.hasEventBind = false
    databus.music=this.music
    databus.player=this.player
    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
  clearEvent() {
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
    canvas.removeEventListener(
      'touchmove',
      this.touchHandler
    )
    canvas.removeEventListener(
      'touchend',
      this.touchHandler
    )
  }


  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 100 === 0) {
      let enemy = databus.pool.getItemByClass("enemy",Enemy);
      enemy.init(3)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {

          let hitedEnemy=new HitedEnemy(enemy)
          console.log(hitedEnemy)
          databus.hitedEnemys.push(hitedEnemy)
          databus.removeEnemey(enemy)
          databus.removeBullets(bullet)
          bullet.visible = false
          databus.score += 1
          break
        }
      }
    })

    for (let i = 0, il = databus.hitedEnemys.length; i < il; i++) {
      let hitedEnemy = databus.hitedEnemys[i]

      if (this.player.isCollideWith(hitedEnemy)) {
        databus.removehitedEnemey(hitedEnemy)
        this.player.recoverBullet()
        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
  	
    e.preventDefault()
    let touch= e.changedTouches[0]
    let x = touch.clientX
    let y = touch.clientY


    let area = this.gameinfo.btnArea
    if(area) {
      if (x >= area.startX
          && x <= area.endX
          && y >= area.startY
          && y <= area.endY)
        this.restart()
    }
    let rank = this.gameinfo.rankBtn
    if(rank) {
      if (x >= rank.startX
          && x <= rank.endX
          && y >= rank.startY
          && y <= rank.endY) {
        databus.rank = true;
      }
    }


    let returnBtn = this.gameinfo.returnBtn
    if(returnBtn) {
      if (x >= returnBtn.startX
          && x <= returnBtn.endX
          && y >= returnBtn.startY
          && y <= returnBtn.endY) {

        databus.rank = false;
      }
    }
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.bg.render(ctx)

    if(databus.rank){
      if(!databus.refreshRank){
        this.rank.refreshRank()
        databus.refreshRank=true
      }
      this.gameinfo.renderRank(ctx)
    }else if(databus.start) {
	    databus.bullets
	      .concat(databus.enemys)
	      .concat(databus.hitedEnemys)
	      .concat(this.player.playerBullets)
	      .concat(this.player.playerLifes)
	      .forEach((item) => {
	        item.drawToCanvas(ctx)
	      })
	
	    this.player.drawToCanvas(ctx)
	   // this.shootButton.drawToCanvas(ctx)
	    databus.animations.forEach((ani) => {
	      if (ani.isPlaying) {
	        ani.aniRender(ctx)
	      }
	    })
	    this.gameinfo.renderGameScore(ctx, databus.score)
	    // 游戏结束停止帧循环
	    if (databus.gameOver) {
          if(!databus.refreshRank){
            this.rank.writeScore(databus.score)
            databus.refreshRank=true
          }
          this.gameinfo.renderGameOver(ctx, databus.score)
	      if (!this.hasEventBind) {
	      	this.clearEvent()
			this.player.removeEvent()	      	
	        this.hasEventBind = true

	        this.touchHandler = this.touchEventHandler.bind(this)
	        canvas.addEventListener('touchend', this.touchHandler)
	      }
	    }
   }else{
   	   this.gameinfo.renderGameIndex(ctx)
   	    if (!this.hasEventBind) {
		   this.hasEventBind = true
	   	   this.touchHandler = this.touchEventHandler.bind(this)
		   canvas.addEventListener('touchend', this.touchHandler)
	   }
   }
  
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;
    this.bg.update()
	if(databus.start) {
	    databus.bullets
	      .concat(databus.enemys)
	      .concat(databus.hitedEnemys)
	      .forEach((item) => {
	        item.update()
	      })
	    this.enemyGenerate()
	    this.collisionDetection()
	    /*if (databus.frame % 20 === 0) {
	      this.player.shoot()
	      this.music.playShoot()
	    }*/
   }
  
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
