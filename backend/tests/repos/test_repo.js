// scripts/test_repo.js
const { connectDB, disconnectDB } = require('../../database/db');
const UserRepository = require('../../database/repo/user_repo')
const User = require('../../database/models/user/User');

(async () => {
  try {
    await connectDB();

    const repo = new UserRepository();

    // Crear
    const u = await repo.createUser({ email: 'a@a.com', 
                                      firstName:'Ana',
                                      lastName: 'Julia',
                                      phone: '1230123',
                                    
                                      password: '12345',
                                      
                                    });
    console.log('Creado:', u);

    // Listar
    const all = await repo.getUsers();
    console.log('Usuarios:', all.length);

    // Buscar por id
    const byId = await repo.getUserById(u._id);
    console.log('Por ID:', byId?.email);

    // Actualizar
    const updated = await repo.updateUser(u._id, { name: 'Ana María' });
    console.log('Actualizado:', updated?.name);

    // Borrar
    const deleted = await repo.deleteUser(u._id);
    console.log('Eliminado:', deleted);

  } catch (e) {
    console.error(e);
  } finally {
    await disconnectDB();
  }
})();
