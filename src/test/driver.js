'use strict';

var http = global.main;
var request = {
        method: 'post',
        params: {
            name: "diko"
        }
    };
console.log("------------------ xhr");


http.request("data.json", request).
    then(function (data) {
        console.log("success! ", data);
    }, function (error) {
        console.log("failed! ", error);
    });



var dom = require("libdom");

dom.add(global.document.body, {
    tag: 'form',
    action: 'data.json',
    method: 'post',
    enctype: 'multipart/form-data',
    onsubmit: function (event) {
        event.preventDefault();

        // test submit form
        http.request("data.json", event.target);
        
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
            tag: 'label',
            text: 'another'
        },
        {
            tag: 'input',
            name: 'another-text-input',
            type: 'text'
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










// test application/x-www-form-urlencoded
dom.add(global.document.body, {
    tag: 'form',
    action: 'data.json',
    method: 'post',
    onsubmit: function (event) {
        event.preventDefault();

        // test submit form
        http.request("data.json", event.target);
        
    },
    
    childNodes: [{
        childNodes: [{
            tag: 'label',
            text: 'text'
        },
        {
            tag: 'input',
            name: 'text-input[][first]',
            type: 'text',
            value: 'first'
        }]
    },
    {
        
        childNodes: [{
            tag: 'label',
            text: 'another'
        },
        {
            tag: 'input',
            name: 'another-text-input[]',
            type: 'text',
            value: 'last'
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


// test application/json
dom.add(global.document.body, {
    tag: 'form',
    enctype: 'application/json',
    action: 'data.json',
    method: 'post',
    onsubmit: function (event) {
        event.preventDefault();

        // test submit form
        http.request("data.json", event.target);
        
    },
    
    childNodes: [{
        childNodes: [{
            tag: 'label',
            text: 'text'
        },
        {
            tag: 'input',
            name: 'text-input[][first]',
            type: 'text',
            value: 'first'
        }]
    },
    {
        
        childNodes: [{
            tag: 'label',
            text: 'another'
        },
        {
            tag: 'input',
            name: 'another-text-input[]',
            type: 'text',
            value: 'last'
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


