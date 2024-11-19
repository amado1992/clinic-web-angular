const { series, dest, src } = require('gulp');
const zip = require('gulp-zip');
const buildWebXml = require('./build-web-xml');
const buildMetaInf = require('./build-meta-inf');
const buildEnvironment = require('./build-environment')
const fs = require('fs');
const colors = require('ansi-colors');

const paths = {
  src: 'src',
  dist: 'dist',
  deploy: 'deploy',
  e2e: 'e2e'
};
// for tomcat deploynment base-href must be '/' + deploy_folder + '/'
// contextRoot does not matter, is for weblogic
const webXMLParams = {
  displayName: "Clinic",
  welcomeFile: "index.html",
  version: "1.0.0",
  notFound: "index.html",
  contextRoot:  "/"
}

const buildEnvironmentParams = {
  productionMode: true,
  targetPath: 'src/environments/environment.prod.ts',
  // clinicBase: 'https://68.183.145.254:8080/ClinicAdminService-1.0/'
  clinicBase: 'https://services.holistichealthcaremiami.com/'
}

function cleanTask(cb) {
  // body omitted
  cb();
}

function buildEnvironmentTask(cb) {
  const envConfigData = buildEnvironment(buildEnvironmentParams);
  fs.writeFile(buildEnvironmentParams.targetPath, envConfigData, function (err) {
    if (err) {
      throw console.error(err);
    } else {
      console.log(colors.magenta(`Angular environment file generated correctly at ${buildEnvironmentParams.targetPath} \n`));
    }
  });
  cb();
}

function buildWarTask() {
  return src([paths.dist + '/Clinic' + '/**/*'])
    .pipe(buildWebXml(webXMLParams))
    .pipe(buildMetaInf())
    .pipe(zip('Clinic.war'))
    .pipe(dest(paths.deploy))
}

exports.buildWar = series(cleanTask, buildWarTask);
exports.buildEnv = series(buildEnvironmentTask)

