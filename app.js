const koa = require('koa')
const app = new koa()
const staticServer = require('koa-static')
const mysql = require('promise-mysql')
const koaRouter = require('koa-router')
const koaBody = require('koa-body')
const router = new koaRouter()
const login = __dirname + '/login'
const static = __dirname + '/static'
const connSetting1 = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Yy11373979',
    database: 'nodejs'
}
router.get('/', async (ctx, next) => {
    console.log('index')
    ctx.body = 'index'
    await next()
})
router.post('/login', koaBody(), async (ctx, next) => {
    let data = null
    let text = null
    if (ctx.request.body.hasOwnProperty('username') && ctx.request.body.hasOwnProperty('password')) {
        let username = ctx.request.body.username
        let password = ctx.request.body.password
        let queryString = `select password from users where name='${username}' and password='${password}'`
        let checkString = `select name from users where name='${username}' `
        await mysql
            .createConnection(connSetting1)
            .then(conn => {
                return conn.query(checkString)
                conn.end()
            })
            .then(async rows => {
                console.log(rows)
                if (rows.length == 1) {
                    await mysql.createConnection(connSetting1)
                        .then(conn => {
                            return conn.query(queryString)
                            conn.end()
                        })
                        .then(rows => {
                            if (rows.length == 1) {
                                data = 1
                                text = '登陆成功'
                            } else {
                                data = 0
                                text = '密码有误'
                            }
                        })
                } else {
                    data = 0
                    text = '该用户未注册'
                }
            })
            .catch(err => {
                console.log(err)
            })
        if (data) {
            ctx.response.status = 200
            ctx.body = {
                status: 1,
                text

            }
        } else {
            ctx.response.status = 200
            ctx.body = {
                status: 0,
                text
            }
        }
    } else {
        ctx.response.status = 200
        ctx.body = {
            status: 3,
            text: '参数有误'
        }
    }
})
router.post('/singup', koaBody(), async (ctx, next) => {
    let data = null
    let text = null
    if (ctx.request.body.hasOwnProperty('username') && ctx.request.body.hasOwnProperty('password') && ctx.request.body.hasOwnProperty('password_confirm')) {
        let username = ctx.request.body.username
        let password = ctx.request.body.password
        let password_confirm = ctx.request.body.password_confirm
        let queryString = `insert into users (name, password) values ('${username}', '${password}')`
        let checkkString = `select * from users where name='${username}'`

        await mysql
            .createConnection(connSetting1)
            .then(conn => {
                return conn.query(checkkString)
                conn.end()
            })
            .then(async rows => {
                if (rows.length == 1) {
                    data = 1
                } else {
                    data = 0
                    await mysql
                        .createConnection(connSetting1).then(conn => {
                            return conn.query(queryString)
                            conn.end()
                        })
                        .then(rows => {
                            rows.affectedRows == 1 ? text = '注册成功' : text = '注册失败'
                        })
                }
            })
            .catch(err => {
                console.log(err)
            })
        if (data == 1) {
            ctx.response.status = 200
            ctx.response.body = {
                status: 0,
                text: '已存在该用户'
            }
        } else {
            ctx.response.status = 200
            ctx.response.body = {
                status: 1,
                text: '注册成功'
            }
        }
    } else {
        ctx.response.status = 200
        ctx.response.body = {
            status: 3,
            text: '参数有误'
        }
    }
})
app.use(router.routes())
app.use(
    staticServer(login, {
        extensions: ['html']
    })
)
app.use(
    staticServer(static, {
        extensions: ['js', 'html', 'json', 'png', 'jpg', 'svg']
    })
)
app.listen(8080)