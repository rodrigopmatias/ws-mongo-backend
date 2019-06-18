import path from 'path';
import fs from 'fs';

export default app => {
    app.controllers = {};

    fs.readdirSync(__dirname)
        .filter(filename => /^.*\.js$/.test(filename))
        .filter(filename => filename !== 'index.js')
        .map(filename => path.join(__dirname, filename))
        .forEach(filepath => {
            const pkg = require(filepath);
            const controller = pkg.default(app);

            Object.defineProperty(app.controllers, controller.controllerName, {
                enumerable: true,
                value: controller,
                writable: false
            });
        });
}