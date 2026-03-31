import {Router} from 'express';
import multer from 'multer';
import multerConfig from './app/config/multer.js';


// Imports dos Controllers
import patients from './app/controllers/PatientsControllers.js'
import consultas from './app/controllers/ConsultasControllers.js';
import medics from './app/controllers/MedicControllers.js';
import especialidades from './app/controllers/EspecialidadesControllers.js';
import users from './app/controllers/UserControllers.js';
import sessions from './app/controllers/SessionsControllers.js';
import appointments from './app/controllers/AppoimentsControllers.js';
import files from './app/controllers/FilesControllers.js';





// Import do Middleware de autenticação
import auth from './app/middlewares/auth.js';


const routes= new Router();
const upload = multer(multerConfig);







// Rota pública (qualquer um pode criar conta ou logar)
routes.post('/users', users.create);  // Cadastro de usuário
routes.post('/sessions', sessions.create);  // Login (Geração de Token)


/**
 * MIDDLEWARE DE AUTENTICAÇÃO
 * Tudo o que vier abaixo desta linha EXIGE o cabeçalho "Authorization: Bearer <token>"
 */

routes.use(auth)

routes.post('/appointments', appointments.store);

//routas Usuários

routes.get('/users', users.index);
routes.get('/users/:id', users.show);
routes.put('/users/:id', users.update);
routes.delete('/users/:id', users.destroy);



//routas pacientes
routes.get('/patient', patients.index);
routes.get('/patient/:id', patients.show);
routes.post('/patient', patients.create);
routes.put('/patient/:id', patients.update);
routes.delete('/patient/:id', patients.destroy);


//routas Medicos

routes.get('/medic', medics.index);
routes.get('/medic/:id', medics.show);
routes.post('/medic', medics.create);
routes.put('/medic/:id', medics.update);
routes.delete('/medic/:id', medics.destroy)




//rotas Especialidades
routes.get('/medic/:medicoId/especialidades', especialidades.index);
routes.get('/medic/:medicoId/especialidades/:id', especialidades.show);
routes.post('/medic/:medicoId/especialidades', especialidades.create);
routes.put('/medic/:medicoId/especialidades/:id', especialidades.update);
routes.delete('/medic/:medicoId/especialidades/:id', especialidades.destroy)


/**
 * ROTAS DE CONSULTAS (Aninhadas ao Paciente)
 */
// Listar consultas de um paciente específico
routes.get('/patients/:patientId/consultas', consultas.index);
// Mostrar uma consulta específica de um paciente
routes.get('/patients/:patientId/consultas/:id', consultas.show);
// CRIAR uma consulta para o paciente (POST)
routes.post('/patients/:patientId/consultas', consultas.create);
// ATUALIZAR uma consulta (PUT) -
routes.put('/patients/:patientId/consultas/:id', consultas.update);
// DELETAR uma consulta (DELETE) - 
routes.delete('/patients/:patientId/consultas/:id', consultas.destroy);




// rota de agendameto para o paciente
routes.get('/appointments', appointments.index);
routes.delete('/appointments/:id', appointments.delete);




// Rota para upload de arquivos (exemplo)
routes.post("/files", upload.single('file'), files.create)
export default routes;