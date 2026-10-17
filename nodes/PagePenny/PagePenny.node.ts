import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';

const renderOps = { resource: ['render'] };
const fromTemplate = { resource: ['render'], operation: ['template'] };
const fromHtml = { resource: ['render'], operation: ['html'] };

export class PagePenny implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PagePenny',
		name: 'pagePenny',
		icon: { light: 'file:pagepenny.svg', dark: 'file:pagepenny.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] === "html" ? "Render HTML" : "Render template"}}',
		description: 'Render PDFs and images from templates or HTML, one cent per render',
		defaults: { name: 'PagePenny' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'pagePennyApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.pagepenny.com',
			headers: { 'Content-Type': 'application/json' },
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [{ name: 'Render', value: 'render' }],
				default: 'render',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: renderOps },
				options: [
					{
						name: 'From Template',
						value: 'template',
						action: 'Render a template',
						description: 'Fill a template with data and get a PDF or image',
					},
					{
						name: 'From HTML',
						value: 'html',
						action: 'Render HTML',
						description: 'Render your own HTML (with optional Jinja placeholders) to a PDF or image',
					},
				],
				routing: {
					request: {
						method: 'POST',
						url: '/v1/render',
						encoding: 'arraybuffer',
						returnFullResponse: true,
						body: { output: 'binary' },
					},
					output: {
						postReceive: [
							{
								type: 'binaryData',
								properties: { destinationProperty: '={{$parameter.binaryProperty}}' },
							},
						],
					},
				},
				default: 'template',
			},
			{
				displayName: 'Template Name or ID',
				name: 'templateId',
				type: 'options',
				required: true,
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				displayOptions: { show: fromTemplate },
				typeOptions: {
					loadOptions: {
						routing: {
							request: { method: 'GET', url: '/v1/templates' },
							output: {
								postReceive: [
									{ type: 'rootProperty', properties: { property: 'templates' } },
									{
										type: 'setKeyValue',
										properties: { name: '={{$responseItem.name}}', value: '={{$responseItem.id}}' },
									},
									{ type: 'sort', properties: { key: 'name' } },
								],
							},
						},
					},
				},
				routing: { send: { type: 'body', property: 'template_id' } },
			},
			{
				displayName: 'HTML',
				name: 'html',
				type: 'string',
				required: true,
				default: '',
				placeholder: '<h1>Hello {{ name }}</h1>',
				typeOptions: { rows: 8 },
				displayOptions: { show: fromHtml },
				routing: { send: { type: 'body', property: 'html' } },
			},
			{
				displayName: 'Data (JSON)',
				name: 'data',
				type: 'json',
				default: '{}',
				description: 'Values to fill into the template',
				displayOptions: { show: renderOps },
				routing: {
					send: {
						type: 'body',
						property: 'data',
						value: '={{ typeof $value === "string" ? JSON.parse($value || "{}") : $value }}',
					},
				},
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				default: 'pdf',
				options: [
					{ name: 'PDF', value: 'pdf' },
					{ name: 'PNG', value: 'png' },
					{ name: 'JPEG', value: 'jpeg' },
					{ name: 'WebP', value: 'webp' },
				],
				displayOptions: { show: renderOps },
				routing: { send: { type: 'body', property: 'format' } },
			},
			{
				displayName: 'Put Output File in Field',
				name: 'binaryProperty',
				type: 'string',
				default: 'data',
				description: 'The name of the binary field to write the rendered file to',
				displayOptions: { show: renderOps },
			},
		],
	};
}
