import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Request, Response, NextFunction } from 'express'

export function errorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const statusCode = err.statusCode || 500
	const message = err.message || 'Internal Server Error'

	console.log(`[ERROR]: ${message}`)

	if (err instanceof PrismaClientKnownRequestError) {
		if (err.code == 'P2002') {
			return res
				.status(500)
				.json({ status: 'error', message: 'User already exists' })
		}

		if (err.code == 'P2025') {
			return res
				.status(404)
				.json({ status: 'error', message: 'Record does not exist' })
		}
	}

	res.status(statusCode).json({ status: 'error', message })
}
