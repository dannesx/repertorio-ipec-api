import { Reference, Theme } from '@prisma/client'
import prisma from '../config/prisma'
import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'

export async function getMusics(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const musics = await prisma.music.findMany({
		include: { themes: true, references: true },
	})

	res.json(musics)
}

export async function getMusicByID(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params

	const music = await prisma.music.findUnique({
		where: { id: parseInt(id) },
		include: { themes: true, references: true },
	})

	if (!music) {
		return res.status(404).json({ status: 'error', message: 'Music not found' })
	}

	res.json(music)
}

export async function createMusic(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { title, artist, references, themes, key, tempo, bpm, lyrics } =
		req.body

	if (!title || !artist) {
		return res.status(400).json({
			status: 'error',
			message: 'Title and artist are required',
		})
	}

	try {
		let themeRecords: Theme[] = []
		let referenceRecords: Reference[] = []

		if (themes && Array.isArray(themes)) {
			themeRecords = await Promise.all(
				themes.map(async (themeName: string) => {
					return await prisma.theme.upsert({
						where: { name: themeName },
						update: {},
						create: { name: themeName },
					})
				})
			)
		}

		if (references && Array.isArray(references)) {
			referenceRecords = await Promise.all(
				references.map(async (referenceName: string) => {
					return await prisma.reference.upsert({
						where: { name: referenceName },
						update: {},
						create: { name: referenceName },
					})
				})
			)
		}

		const newMusic = await prisma.music.create({
			data: {
				title,
				artist,
				references:
					referenceRecords.length > 0
						? {
								connect: referenceRecords.map(reference => ({
									id: reference.id,
								})),
						  }
						: undefined,
				themes:
					themeRecords.length > 0
						? { connect: themeRecords.map(theme => ({ id: theme.id })) }
						: undefined,
				key,
				tempo,
				bpm,
				lyrics,
			},
			include: { themes: true, references: true },
		})

		res.status(201).json(newMusic)
	} catch (error) {
		next(error)
	}
}

export async function uploadMusicPDF(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params

	console.log(id, req.file?.filename)

	if (!id || !req.file) {
		return res.status(400).json({
			status: 'error',
			message: 'Music ID and PDF file are required',
		})
	}

	try {
		const music = await prisma.music.findUnique({ where: { id: parseInt(id) } })

		if (!music) {
			return res.status(404).json({
				status: 'error',
				message: 'Music not found',
			})
		}
		const tempFilePath = path.join(
			__dirname,
			'../../public/chords',
			req.file.filename
		)
		const newFileName = `${music.id}_${music.title.split(' ').join('_')}.pdf`
		const newFilePath = path.join(__dirname, '../../public/chords', newFileName)

		fs.renameSync(tempFilePath, newFilePath)

		const updatedMusic = await prisma.music.update({
			where: { id: parseInt(id) },
			data: { chords: `/chords/${newFileName}` },
		})

		res.json(updatedMusic)
	} catch (error) {
		next(error)
	}
}

export async function updateMusic(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params
	const { title, artist, references, themes, key, tempo, bpm, lyrics } =
		req.body

	try {
		let themeRecords: Theme[] = []
		let referenceRecords: Reference[] = []

		if (themes && Array.isArray(themes)) {
			themeRecords = await Promise.all(
				themes.map(async (themeName: string) => {
					return await prisma.theme.upsert({
						where: { name: themeName },
						update: {},
						create: { name: themeName },
					})
				})
			)
		}

		if (references && Array.isArray(references)) {
			referenceRecords = await Promise.all(
				references.map(async (referenceName: string) => {
					return await prisma.reference.upsert({
						where: { name: referenceName },
						update: {},
						create: { name: referenceName },
					})
				})
			)
		}

		const updatedMusic = await prisma.music.update({
			where: { id: parseInt(id) },
			data: {
				title,
				artist,
				references:
					referenceRecords.length > 0
						? {
								connect: referenceRecords.map(reference => ({
									id: reference.id,
								})),
						  }
						: undefined,
				themes:
					themeRecords.length > 0
						? { connect: themeRecords.map(theme => ({ id: theme.id })) }
						: undefined,
				key,
				tempo,
				bpm,
				lyrics,
			},
			include: { themes: true, references: true },
		})
		res.json(updatedMusic)
	} catch (error) {
		next(error)
	}
}

export async function deleteMusic(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params

	try {
		await prisma.music.delete({ where: { id: parseInt(id) } })

		res.status(204).send()
	} catch (error) {
		next(error)
	}
}

export async function deleteMusicPDF(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id } = req.params

	try {
		const music = await prisma.music.findUnique({ where: { id: parseInt(id) } })

		if (!music || !music.chords) {
			return res.status(404).json({
				status: 'error',
				message: 'Music or PDF not found',
			})
		}

		const pdfPath = path.join(__dirname, '../../public', music.chords)

		if (fs.existsSync(pdfPath)) {
			fs.unlinkSync(pdfPath)
		}

		await prisma.music.update({
			where: { id: parseInt(id) },
			data: {
				chords: null,
			},
		})

		res.status(204).send()
	} catch (error) {
		next(error)
	}
}
