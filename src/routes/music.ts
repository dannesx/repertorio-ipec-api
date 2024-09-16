import { Router } from 'express'
import {
	getMusics,
	getMusicByID,
	createMusic,
	updateMusic,
	deleteMusic,
	uploadMusicPDF,
	deleteMusicPDF
} from '../controllers/music'
import upload from '../config/multer'
const router = Router()

router.get('/', getMusics)
router.get('/:id', getMusicByID)
router.post('/', createMusic)
router.put('/:id', updateMusic)
router.patch('/upload/:id', upload.single('pdf'), uploadMusicPDF)
router.delete('/:id', deleteMusic)
router.delete('/pdf/:id', deleteMusicPDF)

export default router
