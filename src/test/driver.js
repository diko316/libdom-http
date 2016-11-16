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
    method: 'get',
    onsubmit: function (event) {
        event.preventDefault();

        // test submit form
        http.request("data.json", event.target).
            then(function(data) {
                console.log('gud!', data);
            },
            function (error) {
                console.log('failed!' , error);
            });
        
    },
    
    childNodes: [{
        childNodes: [{
            tag: 'label',
            text: 'get ni!'
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

console.log('URL: ', global.URL);

// test application/json
dom.add(global.document.body, {
    tag: 'form',
    enctype: 'multipart/form-data',
    action: 'data.json',
    method: 'post',
    onsubmit: function (event) {
        event.preventDefault();

        // test submit form
        http.request("data.json", {
            driver: 'form-upload',
            params: event.target
        }).
            then(function (response) {
                console.log(response);
                console.log(JSON.stringify(response.data));
            });
        
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
            value: 'firstValue'
        },
        {
            tag: 'input',
            name: 'text-input[][top]',
            type: 'text',
            value: 'topValue[][top]'
        },
        {
            tag: 'input',
            name: 'text-input[top[]',
            type: 'text',
            value: 'topValue[top][]'
        },
        {
            tag: 'input',
            name: 'text-input[top][0][sh]',
            type: 'text',
            value: 'topValue[top][0][sh]'
        }]
    },
    {
        childNodes: [{
            tag: 'input',
            type: 'hidden',
            name: 'pet[0][species]',
            value: 'petValue[0][species]'
        },
        {
            tag: 'input',
            type: 'hidden',
            name: 'pet[0][name]',
            value: 'petValue[0][name]'
        },
        {
            tag: 'input',
            type: 'hidden',
            name: 'pet[1][species]',
            value: 'petValue[1][species]'
        },
        {
            tag: 'input',
            type: 'hidden',
            name: 'pet[1][name]',
            value: 'petValue[1][name]'
            
        },
        {
            tag: 'input',
            type: 'file',
            name: 'file-ni'
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
            value: 'lastValue'
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


