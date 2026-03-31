import sequilize, {Model} from 'sequelize';



class Files extends Model{
    static init(sequelize){
        super.init({
           name: Sequelize.STRING, // Nome original do arquivo (ex: foto.jpg)
        path: Sequelize.STRING, // Nome gerado pelo crypto (ex: abc123.jpg)
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // Retorna o link completo para abrir a imagem no navegador
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'files', // Garante que use a tabela correta no MySQL
        underscored: true,
      }
    );

    return this;
  
        }
    }



    export default Files;