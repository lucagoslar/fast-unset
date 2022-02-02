/*
 * Note that results may differ (by far) on different devices and runs.
 */

import Benchmark from 'benchmark';

import funset from '@src/index';
import { bare } from '@src/bare';

import unset from 'unset-value';
import fastRedact from 'fast-redact';

const suite = new Benchmark.Suite();

const redact = fastRedact({
	paths: ['a.b.c'],
	remove: true,
});

suite
	.add('fast-redact', function () {
		let object = {
			a: {
				b: {
					c: 1,
				},
			},
		};

		object = JSON.parse(redact(object) as string);

		if (object.a.b.c) throw new Error('Expected b in a in object to be empty');
	})
	.add('unset-value', function () {
		const object = {
			a: {
				b: {
					c: 1,
				},
			},
		};

		unset(object, 'a.b.c');

		if (object.a.b.c) throw new Error('Expected b in a in object to be empty');
	})
	.add('fast-unset (copy)', function () {
		const object = {
			a: {
				b: {
					c: 1,
				},
			},
		};

		const cloned = funset(
			object,
			{
				a: { b: { c: null } },
			},
			{ clone: true }
		) as typeof object;

		if (cloned.a.b.c) throw new Error('Expected b in a in object to be empty');
	})
	.add('fast-unset', function () {
		const object = {
			a: {
				b: {
					c: 1,
				},
			},
		};

		funset(object, {
			a: { b: { c: null } },
		});

		if (object.a.b.c) throw new Error('Expected b in a in object to be empty');
	})
	.add('fast-unset (bare)', function () {
		const object = {
			a: {
				b: {
					c: 1,
				},
			},
		};

		bare(object, {
			a: { b: { c: null } },
		});

		if (object.a.b.c) throw new Error('Expected b in a in object to be empty');
	})
	.on('cycle', function (e: { target: { error: string } }) {
		console.log(String(e.target));
		if (e.target.error) throw e.target.error;
	})
	.run();
