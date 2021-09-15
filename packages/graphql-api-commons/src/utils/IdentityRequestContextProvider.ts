/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FastifyRequest } from 'fastify'
import {
	IAuthenticator,
	IBaseConfiguration,
	IRequestAppContext,
	RequestContextProvider,
} from '..'

export interface IdentityRequestContext<Identity> {
	identity: Identity | null
}

export class IdentityRequestContextProvider<
	Configuration extends IBaseConfiguration,
	Components extends { authenticator: IAuthenticator<unknown, Identity> },
	RequestContext extends IdentityRequestContext<Identity>,
	Identity,
> implements RequestContextProvider<Configuration, Components, RequestContext>
{
	public async apply(
		ctx: IRequestAppContext<Configuration, Components, RequestContext>,
		request: FastifyRequest,
	): Promise<Partial<RequestContext>> {
		const { authenticator } = ctx.components
		const identity = await authenticator.verifyAuthorization(
			request.headers.authorization ?? null,
		)
		return { identity } as Partial<RequestContext>
	}
}
