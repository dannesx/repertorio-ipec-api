import { fileURLToPath } from 'url'
import path from 'path'
import { NextFunction, Request, Response } from 'express'

// Middleware para definir __filename e __dirname globalmente
const globalPathMiddleware = (req: Request, res: Response, next: NextFunction) => {
	if (
		typeof global.__dirname === 'undefined' ||
		typeof global.__filename === 'undefined'
	) {
		global.__filename = fileURLToPath(import.meta.url)
		global.__dirname = path.dirname(global.__filename)
	}
	next()
}

export default globalPathMiddleware
