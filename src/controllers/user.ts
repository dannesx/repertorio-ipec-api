import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import prisma from '../config/prisma'
import { NextFunction, Request, Response } from 'express'

const select = {
	id: true,
	username: true,
	email: true,
	createdAt: true,
	updatedAt: true,
}

export async function getUsers(req: Request, res: Response) {
	const users = await prisma.user.findMany({ select })

	res.json(users)
}

export async function getUserByUsername(req: Request, res: Response) {
	const { username } = req.params

	const user = await prisma.user.findUnique({ where: { username }, select })

	if (!user)
		return res.status(404).json({ status: 'error', message: 'User not found' })

	res.json(user)
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
	const { username, email, password } = req.body

	if (!username || !email || !password) {
		return res.status(400).json({
			status: 'error',
			message: 'Username, email and password are required',
		})
	}

	try {
		const newUser = await prisma.user.create({
			data: { username, email, password }, select
		})

		res.status(201).json(newUser)
	} catch (error) {
		next(error)
	}
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
	const { id } = req.params
	const { username, email, password } = req.body

	if (!username && !email && !password) {
		return res.status(400).json({
			status: 'error',
			message:
				'Provide at least one of these: username, email or password. No changes were made',
		})
	}

	try {
		const updatedUser = await prisma.user.update({
			where: { id: parseInt(id) },
			data: { username, email, password },
			select,
		})

		res.json(updatedUser)
	} catch (error) {
		next(error)
	}
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
	const { id } = req.params

	try {
		await prisma.user.delete({
			where: { id: parseInt(id) },
		})

    res.status(204).send()
	} catch (error) {
		next(error)
	}
}
