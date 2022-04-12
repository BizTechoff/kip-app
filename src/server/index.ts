import * as compression from 'compression';
import { config } from 'dotenv';
import * as express from 'express';
import * as jwt from 'express-jwt';
import * as helmet from 'helmet';
import sslRedirect from 'heroku-ssl-redirect';
import { createPostgresConnection } from 'remult/postgres';
import { remultExpress } from 'remult/remult-express';
import * as swaggerUi from 'swagger-ui-express';
import '../app/core/child/child';
import '../app/core/garden/garden';
import '../app/core/picking/picking';
import { getJwtTokenSignKey } from '../app/users/user';
import '../server/send-sms';
 
async function startup() {
    config(); //loads the configuration from the .env file
    const app = express();
    app.use(sslRedirect());
    app.use(jwt({ secret: getJwtTokenSignKey(), credentialsRequired: false, algorithms: ['HS256'] }));
    app.use(compression());
    app.use(
        helmet({
            contentSecurityPolicy: false,
        })
    );
    const dataProvider = async () => {
        // if (process.env['NODE_ENV'] === "production")
        return createPostgresConnection({ configuration: "heroku", sslInDev: true })
        // return undefined;
    }
    let api = remultExpress({
        dataProvider
    });
    app.use(api);
    app.use('/api/docs', swaggerUi.serve,
        swaggerUi.setup(api.openApiDoc({ title: 'kip-app-docs' })));

    app.use(express.static('dist/kip-app'));
    app.use('/*', async (req, res) => {
        try {
            res.sendFile(process.cwd() + '/dist/kip-app/index.html');
        } catch (err) {
            res.sendStatus(500);
        }
    });
    let port = process.env['PORT'] || 3000;
    app.listen(port);
}
startup();