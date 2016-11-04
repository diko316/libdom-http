'use strict';

var http = global.main;

console.log("------------------ xhr");


main.request("data.json").
    then(function (data) {
        console.log("success! ", data);
    }, function (error) {
        console.log("failed! ", error);
    });
