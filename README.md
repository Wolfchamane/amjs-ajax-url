# @amjs/ajax-url 0.1.4

![Statements](https://img.shields.io/badge/Statements-100%25-brightgreen.svg) ![Branches](https://img.shields.io/badge/Branches-100%25-brightgreen.svg) ![Functions](https://img.shields.io/badge/Functions-100%25-brightgreen.svg) ![Lines](https://img.shields.io/badge/Lines-100%25-brightgreen.svg)

> Object URL for any AJAX request

## Installation

```bash
$ npm i @amjs/ajax-url
```
## Usage

```javascript
const AmjsAjaxURL = require('@amjs/ajax-url');
const url = new AmjsAjaxURL({
    domain : 'some-domain',
    port   : 3000,
    path   : 'some-path/{id}',
    params : {
        id : 1,
        key: 'value'
    }
});
console.log(url.value); // 'https://some-domain:3000/some-path/1?key=value'
```

In order to use not secure protocol (http), set the 'unsecure' property to true
```javascript
const AmjsAjaxURL = require('@amjs/ajax-url');
const url = new AmjsAjaxURL({
    domain   : 'some-domain',
    port     : 3000,
    path     : 'some-path/{id}',
    params   : {
        id   : 1,
        key  : 'value'
    },
    unsecure : true
});
console.log(url.value); // 'http://some-domain:3000/some-path/1?key=value'
```

Also you can add values assigning direct value:
```javascript
const AmjsAjaxURL = require('@amjs/ajax-url');
const url = new AmjsAjaxURL();
url.value = {
    domain   : 'some-domain',
    port     : 3000,
    path     : 'some-path/{id}',
    params   : {
        id   : 1,
        key  : 'value'
    },
    unsecure : true
});
console.log(url.value); // 'http://some-domain:3000/some-path/1?key=value'
```
