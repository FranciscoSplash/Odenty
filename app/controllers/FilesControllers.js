import File from '../models/Files.js';


class FilesControllers {
    async create(req, res){
        // Pegamos o nome original e o nome novo (path) que o Multer gerou
        const {originalname: name, filname:path}= req.file
       


        //Salvamos no banco de dados
       const file = await File.create({
        name,
        path,
       });
       
       // Retornamos os dados que o banco criou (incluindo o ID)
       return res.json(file)
    }

}



export default new FilesControllers();