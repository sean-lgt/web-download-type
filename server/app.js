const Koa = require('koa') //引进koa
const router = require('koa-router')() // 使用Koa路由
const cors = require('koa2-cors') // 处理Koa跨域
const send = require('koa-send') //实现文件下载
const fs = require('fs')
const path = require('path')

const app = new Koa()
app.use(cors()) //配置跨域

/**
 * @description: 下载文件
 * @return {*}
 */
router.get('/downloadFile/:name', async (ctx) => {
  const name = ctx.params.name;
  console.log('🚀【文件名称】', name);
  const filePath = `/static/${name}`
  const absoluteFilePath = path.join(__dirname, filePath)
  const fileExistFlag = await isFileExisted(absoluteFilePath)
  if (!fileExistFlag) {
    ctx.set("Content-Type", "application/json");
    ctx.body = {
      url: "aaaa",
      code: 0,
      message: fileExistFlag
    }
    return false
  }
  ctx.attachment(filePath);
  await send(ctx, filePath)
})


/**
 * @description: 判断文件是否存在
 * @return {Boolean}
 * @param {*} filePath 文件路径
 */
const isFileExisted = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, (err) => {
      if (err) {
        // reject(false); //"不存在"
        resolve(false); //"不存在"
      } else {
        resolve(true); //"存在"
      }
    })
  })
};

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3002, '127.0.0.1', () => {
  console.log('server is listen in 3002');
});