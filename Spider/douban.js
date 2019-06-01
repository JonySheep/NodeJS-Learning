var mongoDB = require('./db');
const PORT = 3000;

var http = require('http'),
    url = require('url'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    async = require('async'),
    eventproxy = require('eventproxy');

var getPageUrl = (num) => {
    return 'https://movie.douban.com/top250?start=' + (num-1)*25 + '&filter='
}
var ep = new eventproxy();
var movieList = [];

var onRequest = (req, res) => {
    // 设置字符编码
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});

    for(var i = 1; i <= 10; i++) {
        var url = getPageUrl(i);
        superagent.get(url).end((err, pres)=>{
            var $ = cheerio.load(pres.text);
            
            var titles = $('.hd .title');
            var ranks = $('.pic em');
            for (var i = 0,j = 0; i < titles.length; i+=2,j++) {
                var title = titles.eq(i).text() + titles.eq(i+1).text();
                var rank = ranks.eq(j);
                var movie = {
                    title: title,
                    rank: rank
                }
                movieList.push(movie);
            }
        })
    }

    mongoDB.insertManyData(movieList);

    res.write('<ul>' );
    movieList.map((movie)=>{
        res.write('<li>'+ movie.rank +'   ' + movie.title  + '</li>');
    })
    res.write('</ul>')
    res.end();
}

// 开启服务器
http.createServer(onRequest).listen(PORT);
console.log("Server runing at port: " + PORT + ".");
