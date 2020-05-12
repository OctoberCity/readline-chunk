<!--
 * @Author: your name
 * @Date: 2020-05-12 10:53:10
 * @LastEditTime: 2020-05-12 18:19:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \readline-chunk\README.md
 -->
# readline-chunk
读取文件块，返回以换行为单位的buffer数组。


install 

`npm  install  readline-chunk`

test 

`cd test && npm run test`


-----------------------------------
### init
new linechunk(fd,[option])  

**option**

* `fd` - 文件描述符
* `option` 
   * `chunkSize` - 一次pop读取的文件二进制流  default:1024
   * `beginPosition` - readfile begin position 

----------------

### pop
从文件读取chunksize大小数据，返回buffer数组，数组成员为单行数据，buffer类型

-----------------  

### close
所释放资源

### example
```
const LineChunk =  require("readline-chunk");
const fs =require("fs");
const fd = fs.openSync("./test/examplefile/readme.txt","r"); 
const lineChunk = new LineChunk(fd,{chunkSize:10});
let data = lineChunk.pop(); 
if(data.length > 0){
  const bufferall = Buffer.from(data);
  console.log(bufferall.toString("utf-8"));
}

```