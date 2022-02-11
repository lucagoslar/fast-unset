/*
 * Note: Tests can be found at src/__tests__/resolver.spec.ts.
 */

import { merge } from '@src/merge';

export function resolver(
	mod: Record<string, unknown> | Array<Record<string, unknown>>,
	path: Record<string, unknown> = {},
	location: Array<string> = [],
	valued: Record<string, unknown> = {}
): undefined | Record<string, unknown> {
	if (Array.isArray(mod)) {
		const length = mod.length;
		let index = 0;
		const res = [];
		while (index < length) {
			res.push(resolver(mod[index], path, location, valued));
			index++;
		}

		let base;

		if (res.length > 0) {
			base = res[0] as Record<string, unknown>;
			let resindex = 1;
			const reslength = res.length;
			while (resindex < reslength) {
				if (res[resindex]) {
					base = merge(base, res[resindex] as Record<string, unknown>);
				}
				resindex++;
			}
		}

		return base;
	} else if (mod) {
		const keys = Object.keys(mod);
		const keyslength = keys.length;
		let keysindex;

		for (keysindex = 0; keysindex < keyslength; keysindex++) {
			const key = keys[keysindex];
			const value = mod[key];

			if (value && typeof value === 'object' && value.constructor === Object) {
				const tmp = location.slice();

				const direct = (value as Record<string, unknown>).direct === true;
				const set = 'value' in value;
				const rule = 'rule' in value;

				let pathcursor = path;
				const passedpath: Record<string, unknown> = {};
				let cursor = passedpath;

				if (direct || !(set && rule)) {
					const tmplength = tmp.length;
					let tmpindex = 0;
					while (tmpindex < tmplength) {
						const step = tmp[tmpindex];
						pathcursor = pathcursor[step] as Record<string, unknown>;
						cursor[step] = {};
						cursor = cursor[step] as Record<string, unknown>;
						tmpindex++;
					}

					tmp.push(key);
					cursor[key] = {};

					let sub;

					if (!direct && rule) {
						sub = resolver(
							(value as Record<string, unknown>)['rule'] as
								| Record<string, unknown>
								| Array<Record<string, unknown>>,
							passedpath,
							tmp
						);
					} else {
						sub = resolver(value as Record<string, unknown>, passedpath, tmp);
					}

					if (sub) {
						valued = merge(valued, sub);
					}
				}

				if (!direct && set) {
					// delete pathcursor[key];
					// pathcursor[key] = (value as any).value;
					valued = merge(valued, path);
				}
			}
		}

		return valued;
	}
}
