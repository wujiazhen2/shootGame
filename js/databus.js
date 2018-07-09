import Pool from './base/pool'

let instance
    

/**
 * 全局状态管理器
 */
const BULLET_COUNT=10
const LIFE_COUNT=5
let count=1;
export default class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  isGameOver(){
    if (this.count >= BULLET_COUNT || this.life>=LIFE_COUNT) {
      this.gameOver = true
    }
  }
  reset() {
    this.rank=false
    this.refreshRank=false
    this.frame      = 0
    this.score      = 0
    this.bullets    = []
    this.enemys     = []
    this.hitedEnemys=[]
    this.animations = []
    this.count=0
    this.life=0;
    this.gameOver   = false
    this.start=true
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
  	enemy.state=1 //移除中
  	enemy.visible = false
    var i=0
    let temp=null;
    for(i=0;i< this.enemys.length;i++){
    	
        if(enemy.id==this.enemys[i].id){
          temp = this.enemys.splice(i, 1)
          break;
        }
    }
    enemy.state=2 //已经移除 
   	this.pool.recover("enemy",enemy)
    
  }

  /**
  * 回收敌人，进入对象池
  * 此后不进入帧循环
  */
  removehitedEnemey(hitedEnemy) {
    let temp = this.hitedEnemys.shift()
    temp.visible = false
    this.pool.recover('hitedEnemy', hitedEnemy)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    let temp = this.bullets.shift()
    temp.visible = false
    this.count++
    this.pool.recover('bullet', bullet)
  }
  
  updateMaxScore(){
  	
  }
}
