/*
 * @Author: OctoberCity
 * @Date: 2020-05-08 14:49:16
 * @LastEditTime: 2020-05-13 11:24:26
 * @LastEditors: Please set LastEditors
 * @Description: 提供读取文件返回文件buffer数组，以及position
 */
'use strict';
const fs = require('fs');



class readlineChunk {
    constructor(fd, option) {
        if (!fd) throw new Error("file  fd is need")
        this.chunkSize = option.chunkSize ? option.chunkSize : 1024 // 默认读取1M数据
        this.endSign = 0x0a; // 换行结尾符号
        this.beginPosition = option.beginPosition ? option.beginPosition : 0; // 此次读取文件初始位置
        this.bufferArray = [] // 存放buffer数组
        this.isEnd = false; // 读到文件末尾了 
        this.fd = fd;
        this.runPosition = this.beginPosition;
        this.option = option;
    }
    /**
     * @description: 按照换行符切割数据，返回最后一个换行符坐标位置
     * @param {type} 
     * @return: number (换行符坐标)
     */
    _handleBufferData(bufferpop, readbyte) {
        let lineBreakPosition = -1;
        let sliceBegin = 0;
        let bufvalue;
        let postion = readbyte;
        while (bufvalue = bufferpop[postion++]) {
            if (bufvalue == this.endSign) {
                this.bufferArray.push(bufferpop.slice(sliceBegin, postion));
                sliceBegin = postion;
                lineBreakPosition = postion;
            }
        }
        return lineBreakPosition;
    }
    /**
     * @description: readfile;
     * @param {type} 
     * @return:
     */
    _popfiledata() {
        let bufferpop = Buffer.alloc(0);
        let readbyte = 0;
        let midlePosition = this.runPosition;
        while (true) {
            let bufferalloc = Buffer.alloc(this.chunkSize);
            let popbyte = fs.readSync(this.fd, bufferalloc, 0, this.chunkSize, midlePosition);
            if (!popbyte) break;
            //去除无效数据
            bufferalloc = bufferalloc.slice(0, popbyte);
            if (this.chunkSize > popbyte) {//到了文件结尾
                this.isEnd = true;
            }
            bufferpop = Buffer.concat([bufferpop, bufferalloc]);
            let handleres = this._handleBufferData(bufferpop, readbyte);

            readbyte = popbyte + readbyte; //针对读块得操作
            midlePosition = midlePosition + popbyte; //整个文件position 
            if (handleres > 0) {
                this.runPosition = this.runPosition + handleres;
                break;
            }
        };
    }
    /**
     * @description: 关闭文件，返回关闭时读取得坐标
     * @param {type} 
     * @return: 
     */
    close() {
        fs.closeSync(this.fd);
        this.fd = null;
        this._clear();
    }
    /**
     * @description: 清除缓存bufferarray 。
     * @param {type} 
     * @return: 
     */
    _clear() {
        this.bufferArray = [];
    }
    pop() {
        this._clear();
        this._popfiledata();
        if(this.bufferArray.length ==0 )this.isEnd =  true;
        return this.bufferArray;
    }
}



module.exports = readlineChunk;

