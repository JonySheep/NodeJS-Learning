const PORT = 3000;

var http = require('http'),
    url = require('url'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    async = require('async'),
    eventproxy = require('eventproxy');

var top25 = 'https://movie.douban.com/top250';
var ep = new eventproxy();
var movieList = [];

var onRequest = (req, res) => {
    // 设置字符编码
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});

    superagent.get(top25).end((err, pres)=>{
        var $ = cheerio.load(pres.text);
        
        var titles = $('.hd .title');
        for (var i = 0; i < titles.length; i+=2) {
            var title = titles.eq(i).text() + titles.eq(i+1).text();
            movieList.push(title);
        }
    })

    movieList.map((name)=>{
        res.write('Movie name is ' + name );
    })
    res.end();
}

// 开启服务器
http.createServer(onRequest).listen(PORT);
console.log("Server runing at port: " + PORT + ".");
