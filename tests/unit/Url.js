const AmjsAjaxURL           = require('../../src/Url');
const AmjsDataTypesObject   = require('@amjs/data-types/src/Object');
const AmjsFactory           = require('@amjs/factory');
const assert                = require('assert');

(function ()
{
    const sut = new AmjsAjaxURL();
    assert.equal(sut instanceof AmjsDataTypesObject, true, 'AmjsAjaxURL extends from AmjsDataTypesObject');
    const fSut = AmjsFactory.create('URL');
    assert.equal(fSut instanceof AmjsAjaxURL, true, 'AmjsAjaxURL is registered as "URL"');
})();

(function ()
{
    let sut = new AmjsAjaxURL({
        domain  : 'https://mock-domain:8080/',
        path    : '/mock-path/{id}',
        params  : {
            id  : 1,
            key : 'value',
            pct : '100%'
        },
        unsecure : true
    });

    assert.equal(sut.protocol.value === 'http', true, 'unsecure makes protocol to be "http"');
    assert.equal(sut.domain.value === 'mock-domain', true, 'Domain is right extracted');
    assert.equal(sut.port.value === 8080, true, 'Port is right extracted');
    assert.equal(sut.value === 'http://mock-domain:8080/mock-path/1?key=value&pct=100%25', true, 'Expected URL well formed');

    sut = new AmjsAjaxURL({
        domain  : 'no-port-domain',
        path    : 'fake-path'
    });

    assert.equal(sut.protocol.value === 'https', true, 'By default, protocol is secure');
    assert.equal(sut.domain.value === 'no-port-domain', true, 'Domain is right extracted');
    assert.equal(sut.port.value === 0, true, 'Port is right extracted');
    assert.equal(sut.value === 'https://no-port-domain/fake-path', true, 'Expected URL well formed');

})();

(function ()
{
    assert.throws(() =>
    {
        new AmjsAjaxURL({
            domain : 'fail',
            path   : '{id}',
            params : {
                foo : 1
            }
        });
    }, Error, 'Building an URL with missing parameter throws error');
})();

(function ()
{
    const sut = new AmjsAjaxURL();
    let url = sut._applyParams();
    assert.equal(url === '', true, 'By default, applyParams built an empty URL');

    url = sut._applyQueryParams();
    assert.equal(url === '', true, 'By default, applyQueryParams built an empty URL');
})();

(function ()
{
    const sut = new AmjsAjaxURL();
    assert.equal(sut.toString() === 'https://', true, 'By default, toString() returns empty URL');

    sut.value = {
        domain : 'foo',
        path   : 'foo'
    };
    assert.equal(sut.toString() === 'https://foo/foo', true, 'Assigning a value as full props object, returns valid URL');

    sut.value = 'other';
    assert.equal(sut.toString() === 'https://foo/other', true, 'Assigning a value as String, only changes URL path');

    sut.value = ['invalid'];
    assert.equal(sut.toString() === 'https://foo/other', true, 'Assigning a value as Array, does nothing');
})();
