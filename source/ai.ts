import {AI, environment} from '@raycast/api';
import {Language} from './types.js';
import {languageCodeToName} from './utils.js';

export const makePrompt = (text: string, languageCodes?: string[]) => {
	return [
		languageCodes
			? `Here is a list of supported language codes: ${languageCodes.join(', ')}`
			: 'Supported language codes can only be in the "xx_XX" format.',
		"(Please note a lanauge may have different branches, like 'en' for English, 'en_US' for American English, and 'en_GB' for British English.)",
		"(For example, some American English words are spelled differently in British English, like 'color' and 'colour'.)",
		"(Chinese has different branches like 'zh_CN' for Simplified Chinese and 'zh_HK' for Traditional Chinese.)",
		'Here are some texts below, please tell what the language is:',
		text,
		"(Please answer with the supported language codes I've mentioned above. Don't reply with any unsupported codes.)",
		'(The answer format is one-line only, no commas, no spaces, no "xx", no "XX", and no extra characters.)',
	].join('\n');
};

const ask = async (prompt: string, aiAskOptions?: AI.AskOptions) => {
	const languageCode = await AI.ask(prompt, aiAskOptions);
	if (languageCode.startsWith('und')) return undefined;
	const languageName = languageCodeToName(languageCode);
	return {languageCode, languageName};
};

export type AiDetectOptions = {
	aiAskOptions?: AI.AskOptions;
	langaugeCodes?: string[];
};

export const detect = async (
	text: string,
	options: AiDetectOptions = {},
): Promise<Language | undefined> => {
	if (!environment.canAccess(AI)) return undefined;
	const {aiAskOptions, langaugeCodes} = options;
	const prompt = makePrompt(text, langaugeCodes);
	return ask(prompt, aiAskOptions);
};

export type CustomPromptDetectOptions = {
	aiAskOptions?: AI.AskOptions;
};

export const customPromptDetect = async (
	prompt: string,
	options: CustomPromptDetectOptions = {},
): Promise<Language | undefined> => {
	if (!environment.canAccess(AI)) return undefined;
	const {aiAskOptions} = options;
	return ask(prompt, aiAskOptions);
};
