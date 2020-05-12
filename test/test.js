/*
 * @Author: your name
 * @Date: 2020-05-11 17:09:37
 * @LastEditTime: 2020-05-12 18:20:58
 * @LastEditors: Please set LastEditors
 * @Description: 测试
 * @FilePath: \readlinechunk\test\test.js
 */
const fs = require("fs");
const Readchunk = require("../");
const assert = require("assert");



describe('empty file', () => {
    let fd = fs.openSync("./test/examplefile/empty.txt", 'r');
    let test1 = new Readchunk(fd, { chunkSize: 5 });
    after(function () {
        test1.close();
    });
    it('pop() should return []', () => {
        assert.deepEqual(test1.pop(), []);
    });
    it('this.position should return 0', () => {
        assert.strictEqual(test1.runPosition, 0);
    });
    it('read file end', () => {
        assert(test1.isEnd);
    });
});

// 非空文件，内容数据比一次性读取容量少，无换行
describe('not empty file ,file content Size is less then readchunk', () => {
    let fd = fs.openSync("./test/examplefile/file1.txt", 'r');
    let test1 = new Readchunk(fd, { chunkSize: 30 });
    after(function () {
        test1.close();
    });
    it('pop() should return []', () => {
        assert.deepEqual(test1.pop(), []);
    });
    it('this.position should return 0', () => {
        assert.strictEqual(test1.runPosition, 0);
    });
    it('read file end', () => {
        assert(test1.isEnd);
    });
});

// 非空文件，内容数据比一次性读取容量多，无换行
describe('not empty file ,file content Size is more then readchunk', () => {
    let fd = fs.openSync("./test/examplefile/file1.txt", 'r');
    let test1 = new Readchunk(fd, { chunkSize: 7 });
    after(function () {
        test1.close();
    });
    it('pop() should return []', () => {
        assert.deepEqual(test1.pop(), []);
    });
    it('this.position should return 0', () => {
        assert.strictEqual(test1.runPosition, 0);
    });
    it('read file is end', () => {
        assert(test1.isEnd);
    });
});

// 非空文件，内容数据比一次性读取容量少，有一次换行
describe('not empty file ,file content Size is less then readchunk , one linebreak', () => {
    let fd = fs.openSync("./test/examplefile/file2.txt", 'r');
    let test1 = new Readchunk(fd, { chunkSize: 30 });
    after(function () { 
        test1.close();
    });
    it('pop() should return [buffer]', () => {
        let buarr = test1.pop()
        assert(Buffer.isBuffer(buarr[0])); 
    });
    it('this.position not should return 0', () => {
        assert.notStrictEqual(test1.runPosition, 0);
    });
});

// 非空文件，内容数据比一次性读取容量多，有一次换行
describe('not empty file ,file content Size is more then readchunk,  one linebreak', () => {
    let fd = fs.openSync("./test/examplefile/file2.txt", 'r');
    let test1 = new Readchunk(fd, { chunkSize: 8 });
    after(function () { 
        test1.close();
    });
    it('pop() should return [buffer]', () => {
        let buarr = test1.pop()
        assert(Buffer.isBuffer(buarr[0])); 
    });
    it('this.position not should return 0', () => {
        assert.notStrictEqual(test1.runPosition, 0);
    });
    it('read file is  end', () => {
        assert(!test1.isEnd);
    });
});








