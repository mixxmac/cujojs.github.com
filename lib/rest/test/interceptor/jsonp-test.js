/*
 * Copyright 2012-2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute, fail;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;
	fail = buster.assertions.fail;

	define('rest/interceptor/jsonp-test', function (require) {

		var jsonp, rest, jsonpClient, when;

		jsonp = require('rest/interceptor/jsonp');
		jsonpClient = require('rest/client/jsonp');
		rest = require('rest');
		when = require('when');

		buster.testCase('rest/interceptor/jsonp', {
			'should include callback info from config in request by default': function (done) {
				var client = jsonp(
					function (request) { return when({ request: request }); },
					{ callback: { param: 'callback', prefix: 'jsonp' } }
				);
				client({}).then(function (response) {
					assert.equals('callback', response.request.callback.param);
					assert.equals('jsonp', response.request.callback.prefix);
				}).otherwise(fail).ensure(done);
			},
			'should include callback info from request overridding config values': function (done) {
				var client = jsonp(
					function (request) { return when({ request: request }); },
					{ callback: { param: 'callback', prefix: 'jsonp' } }
				);
				client({ callback: { param: 'customCallback', prefix: 'customPrefix' } }).then(function (response) {
					assert.equals('customCallback', response.request.callback.param);
					assert.equals('customPrefix', response.request.callback.prefix);
				}).otherwise(fail).ensure(done);
			},
			'should have the jsonp client as the parent by default': function () {
				refute.same(rest, jsonp().skip());
				assert.same(jsonpClient, jsonp().skip());
			},
			'should support interceptor chaining': function () {
				assert(typeof jsonp().chain === 'function');
			}
		});

	});

}(
	this.buster || require('buster'),
	typeof define === 'function' && define.amd ? define : function (id, factory) {
		var packageName = id.split(/[\/\-]/)[0], pathToRoot = id.replace(/[^\/]+/g, '..');
		pathToRoot = pathToRoot.length > 2 ? pathToRoot.substr(3) : pathToRoot;
		factory(function (moduleId) {
			return require(moduleId.indexOf(packageName) === 0 ? pathToRoot + moduleId.substr(packageName.length) : moduleId);
		});
	}
	// Boilerplate for AMD and Node
));
