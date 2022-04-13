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
import { Garden } from '../app/core/garden/garden';
import '../app/core/gate/gate';
import { Gate } from '../app/core/gate/gate';
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
        let isProd = process.env['DEV_MODE'] === 'PROD'
        // if (process.env['NODE_ENV'] === "production")
        return createPostgresConnection({ configuration: "heroku", sslInDev: isProd })
        // return undefined;
    }
    let api = remultExpress({
        dataProvider,
        initApi: async remult => {
            if(false)
            if (process.env['NODE_ENV'] !== "production") {
                const gan = 'גן שמש';
                try {
                    console.log("123");
                    const garden = await remult.repo(Garden).findFirst({ name: gan });
                    console.log("423");
                    if (garden.pickTimes ?? '' == '') {
                        await remult.repo(Gate).insert([{ garden, from: '15:45', to: '15:50' }, { garden, from: '16:15', to: '16:30' }]);
                        // await remult.repo(Gate).insert([{ garden, from: '08:00', to: '10:00' }, { garden, from: '11:00', to: '12:00' }]);
                        console.log("987");
                        // await remult.repo(Gate).insert([{ garden, from: '08-00', to: '10-00' }]);
                        // await remult.repo(Gate).insert([{ garden, from: '11-00', to: '12-00' }]);
                    }
                    console.table(await remult.repo(Garden).find());
                } catch (err) {
                    console.log("456");
                    console.log(err);
                }
            }
        }
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