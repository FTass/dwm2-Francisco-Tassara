const express = require('express')
const cors = require('cors')

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.paths = {
           
            //* User
            users: '/api/users',
            profiles: '/api/profiles',
            sessionTokens: '/api/session-tokens',

            //* Product
            products: '/api/products',
            categories: '/api/categories',
 
            //* order

            carts : '/api/carts',
            
            orders: '/api/orders', 
            
            //* report / Notification / Payments
            
            payments: '/api/payments',
            
            salesReports: '/api/sales-report',

            notifications: '/api/notifications',
    
            printManager: '/api/print-manager'
        }
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {

        //* User

        this.app.use(this.paths.users, require('./routes/user/user_route.js'));
        
        this.app.use(this.paths.profiles, require('./routes/user/profile_route.js'));
        
        this.app.use(this.paths.sessionTokens, require('./routes/user/sessionTokens_route.js'));

        //* Product
        this.app.use(this.paths.products, require('./routes/product/product_route'));
        this.app.use(this.paths.categories, require('./routes/product/category_route'));

        
        //* order
        
        this.app.use(this.paths.carts, require('./routes/order/cart_route'));
        
        this.app.use(this.paths.orders, require('./routes/order/order_route'));
        
        //* Payment
        this.app.use(this.paths.payment, require('./routes/payment/payment_route'));
        
        //* Notification
        this.app.use(this.paths.notifications, require('./routes/notification/notification_routes'));

        //* report
        this.app.use(this.paths.salesReport, require('./routes/report/sales_report_routes.js'));
        
        this.app.use(this.paths.printManager, require('./routes/report/print_manager_routes'));

    }

    listen() {
        this.app.listen(this.port, () =>{
            console.log('Corriendo en el puerto', this.port);
            
        });

    }

}




module.exports = Server;