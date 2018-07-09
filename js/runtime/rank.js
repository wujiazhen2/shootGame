/**
 * Created by wujiazhen on 2018/7/2.
 */
import DataBus from "../databus.js"
let instance;
let dataBus = new DataBus()
export  default class Rank {
    constructor(ctx){
        if(instance)
           return instance
        this.ctx=ctx
        instance=this
    }
    writeScore(score){
        wx.setUserCloudStorage({
            KVDataList: [{ 'key': 'score', 'value': (score+'') }],
            success: res => {
                this.refreshRank()
            },
            fail: res => {
                console.log("fail")
            }
        })
    }
    refreshRank(type,text){
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            type:type|| 1,
            text: text,
            success:function(){

            }
        });
    }

}