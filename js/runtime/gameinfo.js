const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/Common.png'
const  START_IMG  ='images/start.png'
const  RANKBOTTOM_IMG  ='images/rankButton.png'
const  BOTTOM_IMG  ='images/roundButton.png'
const  START_BUTTON='images/startButton.png'
const INDEX_HIGHT= screenHeight/3
const INDEX_WIDtH=screenWidth-20
export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"

    ctx.fillText(
      score,
      10,
      30
    )
  }
	renderGameIndex(ctx){
		let img =new Image()
		img.src=START_IMG
		ctx.drawImage(img,
			10,
			screenHeight/3-30,
			INDEX_WIDtH,
			INDEX_HIGHT)
		let img2 =new Image()
		img2.src=START_BUTTON
		 ctx.drawImage(
      img2,
      screenWidth / 5,
      screenHeight / 3*2,
      screenWidth /5*3  , screenHeight / 10
    )
    this.renderRankBtn(ctx)
		/**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
      this.btnArea = {
        startX: screenWidth / 5,
        startY: screenHeight / 3*2,
        endX  : screenWidth / 5*4,
        endY  : screenHeight / 3*2 +screenHeight / 10
      }

	}
  renderRankBtn(ctx){
    let img3 =new Image()
    img3.src=RANKBOTTOM_IMG
    ctx.drawImage(
        img3,
        10,
        screenHeight-screenWidth /5-20 ,
        screenWidth /5  ,  screenWidth /5
    )
    this.rankBtn = {
      startX:10,
      startY: screenHeight-screenWidth /5-20,
      endX  : 10+screenWidth /5,
      endY  : screenHeight-20
    }
  }
  renderRank(ctx){
    let openDataContext = wx.getOpenDataContext();
    let sharedCanvas = openDataContext.canvas;
    ctx.drawImage(sharedCanvas,0,0, window.innerWidth, window.innerHeight)
    // 返回按钮
    this.returnBtn={
      startX:80*(screenWidth / 750),
      startY: 1120*(screenWidth / 750),
      endX  : 180*(screenWidth / 750),
      endY  : 1220*(screenWidth / 750)
    }
  }
  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )
    this.renderRankBtn(ctx)
    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX  : screenWidth / 2  + 50,
      endY  : screenHeight / 2 - 100 + 255
    }
  }
}

