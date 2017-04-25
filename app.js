var express = require("express");
var app = express();
var proxy = require("http-proxy-middleware");
var serverList = ["http://www.google.co.in", "http://www.yahoo.com", "http://www.bing.com"];
var endpoints = {};
var endpoint = function(req){
    var index = parseInt((Math.random()*10)%3);
    console.log(index,serverList[index]);
	return serverList[index];
}

var magicKeys = {};

app.use("/api/", proxy({
    target: "http://localhost:9899",
    router: endpoint,
    changeOrigin: true,
    pathRewrite: {
        "^/api": ""
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.path = req.url;
        console.log(req.user);
        if (endpoints.user) proxyReq.setHeader('Validation-URL', endpoints.user);
    }
}));
app.get("*",function(req,res){
    res.status(200).json({message:"reached here"});
});

app.listen(9899, () => {
    console.log("Server started on port 9899")
});
