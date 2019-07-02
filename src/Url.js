require('@amjs/data-types/src/Boolean');
require('@amjs/data-types/src/Number');
require('@amjs/data-types/src/String');
const AmjsDataTypesObject = require('@amjs/data-types/src/Object');

/**
 * Handles everything related to an URL.
 * @namespace   amjs
 * @class       amjs.ajax.URL
 * @extends     amjs.dataTypes.Object
 */
class AmjsAjaxURL extends AmjsDataTypesObject
{
    /**
     * @inheritDoc
     */
    constructor(values)
    {
        super();

        /**
         * @override
         */
        this.$propertyTypes = {
            domain      : 'String',
            port        : 'Number',
            path        : 'String',
            params      : '*',
            unsecure    : 'Boolean',
            protocol    : 'String'
        };

        /**
         * URL domain
         * @property    domain
         * @type        {amjs.dataTypes.String}
         * @default     null
         */
        this.domain     = null;

        /**
         * Domain's port
         * @property    port
         * @type        {amjs.dataTypes.Number}
         * @default     null
         */
        this.port       = null;

        /**
         * URL endpoint's path
         * @property    path
         * @type        {amjs.dataTypes.String}
         * @default     null
         */
        this.path       = null;

        /**
         * Params to replace as URI params or to be added as query params
         * @property    params
         * @type        {Object}
         * @default     {}
         */
        this.params     = {};

        /**
         * Flags if this URL must use unsecure protocol ('http') instead of secure one, used by default.
         * @property    unsecure
         * @type        {amjs.dataTypes.Boolean}
         * @default     null
         */
        this.unsecure   = null;

        /**
         * URL request protocol: `https` (by default) for secure connections, `http` for unsecure
         * @property    protocol
         * @type        {amjs.dataTypes.String}
         * @default     null
         */
        this.protocol   = null;

        this.value = values;
    }

    /**
     * Adds any extra query param to URL
     * @param   {String}    url     Base URL
     * @param   {Object}    params  Query params
     * @return  {String}    URL with additional query params
     * @private
     */
    _applyQueryParams(url = '', params = {})
    {
        const keys = Object.keys(params);
        if (keys.length)
        {
            url = `${url}?${keys.map(key => (`${key}=${encodeURIComponent(params[key])}`)).join('&')}`;
        }

        return url;
    }

    /**
     * Replaces URI param encapsulated with brackets with value from params.
     * For example: URL "https://my-domain/my-path/{id}" and params { "id" : 1 } is transformed into
     *      "https://my-domain/my-path/1"
     * @param   {String}    url Base URL
     * @return  {String}    URL with replaced URI params.
     * @private
     */
    _applyParams(url = '')
    {
        const cpyParams = JSON.parse(JSON.stringify(this.params));
        if (url.lastIndexOf('{') !== -1)
        {
            url = url.replace(/({\w+})/g, match =>
            {
                const key = match.replace(/[{}]+/g, '');
                const value = cpyParams[key];
                if (value)
                {
                    delete cpyParams[key];

                    return value;
                }
                else
                {
                    throw new Error(`Param ${key} is undefined`);
                }
            });
        }

        return this._applyQueryParams(url, cpyParams);
    }

    /**
     * Extracts current values from this instance properties
     * @return  {Object}    With current properties values
     * @private
     */
    _extractValues()
    {
        const values = {
            domain      : '',
            path        : '',
            port        : 0,
            protocol    : 'https',
            unsecure    : false
        };
        ['domain', 'path', 'port', 'protocol', 'unsecure'].forEach(
            prop =>
            {
                const ref = this[prop];
                values[prop] = ref ? ref.value : values[prop];
            },
            this
        );
        return values;
    }

    /**
     * Fix path value.
     * @private
     */
    _fixPath()
    {
        let { path } = this._extractValues();
        if (path.startsWith('/'))
        {
            path = path.substr(1);
        }

        this._setProperties({ path });
    }

    /**
     * Fix domain value an extracts protocol and port value if are assigned.
     * @private
     */
    _fixDomain()
    {
        const portExpReg = /:\d{4}/;
        const protocolExpReg = /^http?s:\/\//;

        let { domain, port, protocol, unsecure } = this._extractValues();

        if (portExpReg.test(domain))
        {
            port = Number(domain.match(portExpReg).pop()
                .replace(':', ''));
            domain = domain.replace(portExpReg, '');
        }

        if (domain.endsWith('/'))
        {
            domain = domain.substr(0, domain.length - 1);
        }

        if (protocolExpReg.test(domain))
        {
            protocol = domain.match(protocolExpReg).pop();
            protocol = protocol.replace('://', '');

            domain = domain.replace(protocolExpReg, '');
        }

        if (unsecure)
        {
            protocol = 'http';
        }

        this._setProperties({ domain, port, protocol, unsecure });
    }

    /**
     * Applies fixes to inner values and builds URL.
     * @return  {String}    Complete URL.
     * @private
     */
    _buildURL()
    {
        this._fixDomain();
        this._fixPath();

        let url = `${this.protocol}://${this.domain}`;
        url += `${this.port.value ? `:${this.port.value}` : ''}`;
        url += `${this.path.value ? `/${this.path}` : ''}`;

        return this._applyParams(url);
    }

    /**
     * @override
     */
    _parseValue(value)
    {
        switch (typeof value)
        {
            case 'string':
                this._setProperties({ path : value });
                break;
            case 'object':
            default:
                if (value && !Array.isArray(value))
                {
                    this._setProperties(value);
                }
                break;
        }

        return super._parseValue(this._buildURL());
    }
}

AmjsDataTypesObject.register('URL', AmjsAjaxURL);
module.exports = AmjsAjaxURL;
