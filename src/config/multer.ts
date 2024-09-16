import multer from 'multer'
import path from 'path'

// Configuração do multer para armazenar os PDFs na pasta "public/chords"
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../public/chords')) // Define o diretório "public/chords" como destino
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname) // Nomeia o arquivo com a data atual + nome original
	},
})

// Filtro para aceitar apenas arquivos PDF
const pdfFilter = (
	req: Express.Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback
) => {
	if (file.mimetype !== 'application/pdf') {
		return cb(null, false) // Rejeita o arquivo, mas passa null no primeiro argumento
	}
	// Passar null como primeiro argumento, indicando que não há erro, e true no segundo para aceitar o arquivo
	cb(null, true)
}

// Configuração do upload para ser usada no restante da aplicação
const upload = multer({
	storage: storage,
	fileFilter: pdfFilter,
	dest: 'public/chords/'
})

export default upload
