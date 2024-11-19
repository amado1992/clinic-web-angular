//const url = 'https://services.holistichealthcaremiami.com/';
//const url = 'https://68.183.145.254:8080/ClinicAdminService%2D1.0/';
//const url = 'https://68.183.145.254:8080/ClinicAdminService-1.0/';
// nuevo entorno de desarrollo
const url = 'https://45.56.75.116:8080/ClinicAdminService-1.0/';//development environment
//const url ="https://services.holistichealthcaremiami.com/";//production environment
//const url =  'http://localhost:8080/ClinicAdminService/';
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

    /* Company */
    getFilterInsuranceCompany: url + 'getFilterInsuranceCompany',
    updateInsuranceCompany: url + 'updateInsuranceCompany/',
    deleteInsuranceCompany: url + 'deleteInsuranceCompany/',

    /*All report*/
    getAllReport: url + 'getReports',
    executeReport: url + 'executeReport',

    /*Obtener reportes API*/
    getReportList: url + 'getReports',

      /*Referidos a los setting de Reportes Diarios*/
      setSettingRD: url + 'setSettingRD/',
      getSettingRD: url + 'getSettingRD',

      
  },
  originName: 'Clinic_APP',
  cacheableResources: [
    url + 'getRoles'
  ]
};
