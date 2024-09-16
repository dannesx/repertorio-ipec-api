import { Router } from 'express'
import {
	getMusics,
	getMusicByID,
	createMusic,
	updateMusic,
	deleteMusic,
} from '../controllers/music'
const router = Router()

router.get('/', getMusics)
router.get('/:id', getMusicByID)
router.post('/', createMusic)
router.put('/:id', updateMusic)
router.delete('/:id', deleteMusic)

export default router
