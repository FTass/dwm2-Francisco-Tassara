const express = require('express')
const cors = require('cors')

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.paths = {
            //! Aca falta agregar los path de las rutas
        }
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        //Aca iran las rutas
        // this.app.use()
    }

    listen() {
        this.app.listen(this.port, () =>{
            console.log('Corriendo en el puerto', this.port);
            
        });

    }

}




module.exports = Server;