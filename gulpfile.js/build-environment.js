const colors = require('ansi-colors');

function buildEnvironment(params) {
    // `environment.prod.ts` file structure
    const envConfigData = `const url = '${params.clinicBase}';
    export const environment = {
        production: true,
        urls: {
          /* Login */
          login: url + 'login',
      
           /* Logout */
          logout: url + 'logout',
      
          /* User */
          getUser: url + 'getUser',
          getEmployee: url + 'getEmployee/',
          getFilterEmployees: url + 'getFilterEmployees',
          updateEmployee: url + 'updateEmployee',
          getImageEmployee: url + 'getImageEmployee',
          geRegisterEmployees: url + 'geRegisterEmployees',
          deleteEmployee: url + 'deleteEmployee/',
      
          /*Roles*/
          getRoles: url + 'getRoles',
          getFilterRols: url + 'getFilterRols',
          getRol: url + 'getRol/',
          updateRol: url + 'updateRol',
          deleteRol: url + 'deleteRol/',
      
          /* Especialidades */
          getFilterSpecialtys: url + 'getFilterSpecialtys',
          addEmployeeSpecialities: url + 'addEmployeeSpecialities',
          removeEmployeeSpecialities: url + 'removeEmployeeSpecialities',
      
      
          /* Servicios */
          getFilterServices: url + 'getFilterServices',
          getService: url + 'getService/',
          updateService: url + 'updateService',
          deleteService: url + 'deleteService/',
      
          /* Ramas */
          getFilterBranchs: url + 'getFilterBranchs',
          updateBranch: url + 'updateBranch/',
          deleteBranch: url + 'deleteBranch/',
      
          /* Salas */
          getFilterRooms: url + 'getFilterRooms',
          updateRoom: url + 'updateRoom/',
          deleteRoom: url + 'deleteRoom/',
      
          /* Permisos */
          getFilterPermissions: url + 'getFilterPermissions',
          updatePermission: url + 'updatePermission/',
          deletePermission: url + 'deletePermission/',
      
          /* Dispositivos externos*/
      
          getFilterExternalDevices: url + 'getFilterExternalDevices',
          updateExternalDevice: url + 'updateExternalDevice/',
          deleteExternalDevice: url + 'deleteExternalDevice/',
      
          /* Tratamientos*/
      
          getReportFilterTreatments: url + 'getReportFilterTreatments',
      
          /* Asistencia*/
          getFilterRegisterAssistance: url + 'getFilterRegisterAssistance',
      
          /* Graficos*/
          getServicesCount: url + 'getServicesCount',
          getRoomsCount: url + 'getRoomsCount',
          getEmployeesCount: url + 'getEmployeesCount',
          getTreatmentsCountByStatus: url + 'getTreatmentsCountByStatus',
          getCitationsCount: url + 'getCitationsCount',
          getCitationsCountByStatus: url + 'getCitationsCountByStatus',
      
          /* Citas planificadas*/
          getFilterEmployeesBySpecialities: url + 'getFilterEmployeesBySpecialities',
          getFilterCitations: url + 'getFilterCitations',
      
          /* Pacientes por fecha */
          getPatientsCitationByDate: url + 'getPatientsCitationByDate',

          /* Localizacion de dispositivos */
          getLocationsDevices: url + 'getLocationsDevices',

          /* Clasificadores */
          getFilterClassificatorsSB: url + 'getFilterClassificatorsSB',
          updateClassificatorSB: url + 'updateClassificatorSB/',
          deleteClassificatorSB: url + 'deleteClassificatorSB/',
      
          /* Codificadores */
          getFilterCodClassificatorsSB: url + 'getFilterCodClassificatorsSB',
          updateCodClassificatorSB: url + 'updateCodClassificatorSB/',
          deleteCodClassificatorSB: url + 'deleteCodClassificatorSB/',
      
          /* Opciones de pago */
          getFilterPayOptions: url + 'getFilterPayOptions',
          updatePayOption: url + 'updatePayOption/',
          deletePayOption: url + 'deletePayOption/',
      
        },
        originName: 'Clinic_APP',
        cacheableResources: [
          url + 'getRoles'
        ]
      };
`;
    console.log(colors.magenta(`The file ${params.productionMode ? 'environment.prod.ts' : 'environment.ts'} will be written with the following content:`));
    console.log(colors.grey('Clinic API base: ' + params.clinicBase));

    return envConfigData
}

module.exports = buildEnvironment
