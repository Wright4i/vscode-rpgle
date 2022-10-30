import { Definition, ImplementationParams, Location, Range } from 'vscode-languageserver';
import { documents, parser, getWordRangeAtPosition } from '..';

import * as Project from '.';

export default function implementationProvider(params: ImplementationParams): Definition | undefined {
	if (Project.isEnabled) {
		const currentPath = params.textDocument.uri;
		const document = documents.get(currentPath);

		if (document) {
			const word = getWordRangeAtPosition(document, params.position);
			if (word) {
				const upperName = word.toUpperCase();
				const parsedFiles = Object.keys(parser.parsedCache);

				for (const uri of parsedFiles) {
					const cache = parser.getParsedCache(uri);
					for (const proc of cache.procedures) {
						const keyword = proc.keyword[`EXPORT`];
						if (keyword) {
							if (proc.name.toUpperCase() === upperName) {
								return Location.create(
									proc.position.path,
									Range.create(
										proc.position.line,
										0,
										proc.position.line,
										0
									)
								);
							}
						}
					}
				};
			}
		}
	}

	return;
}