'use strict';

var http = global.main;

console.log("------------------ xhr");


main.request("data.json").
    then(function (data) {
        console.log("success! ", data);
    }, function (error) {
        console.log("failed! ", error);
    });



var dom = require("libdom");

var form = dom.add(global.document.body, {
            tagName: 'form',
            childNodes: [{
                childNodes: [{
                    tagName: 'label',
                    text: 'text'
                },
                {
                    tagName: 'input',
                    name: 'text-input',
                    type: 'text'
                }]
            },
            {
                childNodes: [{
                    tagName: 'label',
                    text: 'file'
                },
                {
                    tagName: 'input',
                    name: 'file-upload',
                    type: 'file'
                }]
            },
            {
                childNodes: [{
                    tagName: 'button',
                    type: 'submit',
                    text: 'submit'
                }]
            }]
            
        });


dom.on(form, 'submit',
    function (event, element) {
        event.preventDefault();
        console.log('submitting ', element);
    });
