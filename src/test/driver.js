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

dom.add(global.document.body, {
    tag: 'form',
    onsubmit: function (event, form) {
        event.preventDefault();
        // test submit form
        
    },
    childNodes: [{
        childNodes: [{
            tag: 'label',
            text: 'text'
        },
        {
            tag: 'input',
            name: 'text-input',
            type: 'text'
        }]
    },
    {
        childNodes: [{
            tag: 'label',
            text: 'file'
        },
        {
            tag: 'input',
            name: 'file-upload',
            type: 'file'
        }]
    },
    {
        childNodes: [{
            tag: 'button',
            type: 'submit',
            text: 'submit'
        }]
    }]
    
});


