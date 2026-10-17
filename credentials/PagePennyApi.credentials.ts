import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PagePennyApi implements ICredentialType {
	name = 'pagePennyApi';

	displayName = 'PagePenny API';

	icon = { light: 'file:../nodes/PagePenny/pagepenny.svg', dark: 'file:../nodes/PagePenny/pagepenny.dark.svg' } as const;

	documentationUrl = 'https://github.com/ebrahim575/n8n-nodes-pagepenny?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your pp_live_ key from pagepenny.com/account',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.pagepenny.com',
			url: '/v1/templates',
		},
	};
}
