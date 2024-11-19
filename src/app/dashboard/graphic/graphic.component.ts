import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { getDocumentDefinition } from './pdf-format.generator';
import { faSearch,faFileDownload, faArrowRight, faFilter, faEraser } from '@fortawesome/free-solid-svg-icons';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import 'chartjs-plugin-labels';
import zoomPlugin from 'chartjs-plugin-zoom';
import outlabelsPlugin from 'chartjs-plugin-piechart-outlabels'



@Component({
  selector: 'app-dashboard',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit, OnDestroy {

  downloadIcon = faFileDownload;
  faArrowRightIcon = faArrowRight;
  faFilterIcon = faFilter;
  faEraserIcon = faEraser;
  faSearch=faSearch;


  language: string;
  subscriptions: Subscription[] = [];
  loadingListData: boolean;
  errorLoadingListData: boolean;
  error: HttpErrorResponse;

  fechaIni: any;
  fechaFin: any;

  constructor(private messageService: MessageService,private translateService: TranslateService, private adminService: AdminUsersService, private datePipe: DatePipe) {
  }

  chartOptionsTreatmentEmployee: any;
  chartDataTreatmentEmployee = [];

  chartOptionsCitationDate: any;
  chartDataCitationDate = [];

  chartOptionsTreatmentEmployee2: any;
  chartDataTreatmentEmployee2 = [];
  chartDataTreatmentEmployeeLabels2 = [];

  chartOptionsCitationDate2: any;
  chartDataCitationDate2 = [];
  chartDataCitationDateLabels2 = [];

  barChartOptions = {
   
    responsive: true,
    labels: 
       
        {
          render: function(options){
            var value = options.value; // something like a floating point number, possibly an integer
            return options.percentage + " (" + value.toFixed(2) + "%)";  // this is probably enough
        },
        }
  };

  barChartOptionsNew = {
    /*tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.labels[tooltipItem.index];
          let count: any = data
            .datasets[tooltipItem.datasetIndex]
            .data[tooltipItem.index];
          return label + ": " + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(count);
        },
      },
    },*/
    tooltips:{
      callbacks:{
         title: ()=>{}
      }
    },
    plugins: {
      responsive: true,
      labels: 
  
      {
        render: function(options){
          var value = options.value; // something like a floating point number, possibly an integer
          return value + " (" +  options.percentage + "%)";  // this is probably enough
      },
      fontColor: '#000000',
      position: 'outside',
      },
    
    
      zoom: {
        // Boolean to enable zooming
        enabled: true,

        // Enable drag-to-zoom behavior
        drag: true,

        // Zooming directions. Remove the appropriate direction to disable 
        // Eg. 'y' would only allow zooming in the y direction
        mode: 'xy',
        rangeMin: {
            // Format of min zoom range depends on scale type
            x: null,
            y: null
        },
        rangeMax: {
            // Format of max zoom range depends on scale type
            x: null,
            y: null
        }
    }
      
    },
  };


  barChartOptionsNew1 = {
    /*tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.labels[tooltipItem.index];
          let count: any = data
            .datasets[tooltipItem.datasetIndex]
            .data[tooltipItem.index];
          return label + ": " + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(count);
        },
      },
    },*/
    plugins: {
      responsive: true,
      labels: 
     /* {*/
      {
        render: function(options){
          var value = options.value; // something like a floating point number, possibly an integer
          return value + " (" +  options.percentage + "%)";  // this is probably enough
      },
      fontColor: '#000000',
      position: 'border',
      }
      
    },
  };

  barChartDataTreatmentService = {
    
    labels: [], /*General y axes*/
    datasets: [
      {
        data: [],
        label: 'Test 2',
        borderColor: '#8e5ea2',
        fill: false
        
      }
    ]
  };

  barChartDataTreatmentRoom = {
    labels: [], /*General y axes*/
    datasets: [
      {
        data: [],
        label: 'Test 2',
        borderColor: '#8e5ea2',
        fill: false
      }
    ]
  };

  barChartDataTreatmentStatus = {
    labels: [], /*General y axes*/
    datasets: [
      {
        data: [],
        label: 'Test 2',
        borderColor: '#8e5ea2',
        fill: false
      }
    ]
  };

  barChartDataCitationStatus = {
    labels: [], /*General y axes*/
    datasets: [
      {
        data: [],
        label: 'Test 2',
        borderColor: '#8e5ea2',
        fill: false
      }
    ]
  };

  onChartClick(event) {
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  ngOnInit() {
    this.initDateFilter();
    this.hookLanguageChanges();
    this.getData();
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
  private hookLanguageChanges(): void {
    this.language = this.translateService.currentLang;
    const subscription = this.translateService.onLangChange
      .subscribe(
        (data: LangChangeEvent) => {
          this.language = data.lang;
        }
      );
    this.subscriptions.push(subscription);
  }

  private getData(): void {
    this.loadingListData = true;
    this.errorLoadingListData = false;

    var currentFilter =
    {
      fechaIni: this.BuildDate(this.fechaIni, false),
      fechaFin: this.BuildDate(this.fechaFin, true)
    };

    if(this.fechaIni>this.fechaFin){
   
      var message: string = this.language == "es" ? "Fecha final es menor que la inicial." : "Date end is less than begin.";
      this.messageService.generalMessage(false, message);
      this.loadingListData = false;
      return
      
    } else {
    const sources = [
      this.adminService.getServicesCount(currentFilter),
      this.adminService.getRoomsCount(currentFilter),
      this.adminService.getEmployeesCount(currentFilter),
      this.adminService.getTreatmentsCountByStatus(currentFilter),
      this.adminService.getCitationsCount(currentFilter),
      this.adminService.getCitationsCountByStatus(currentFilter)
    ];

    const subscription = forkJoin(sources)
      .subscribe(
        ([services, rooms, employees, treatmentsStatus, citations, citationsStatus]: any[]) => {
          let servicesData = services.slice();
          let roomsData = rooms.slice();
          let treatmentsStatusData = treatmentsStatus.slice();
          let employeesData = employees.slice();
          let citationssData = citations.slice();
          let citationsStatusData = citationsStatus.slice();

          this.barChartDataTreatmentService.datasets = [
            {
              data: [],
              label: 'Test 2',
              borderColor: '#8e5ea2',
              fill: false
            }
          ]

          if (servicesData.length > 0) {
            this.barChartDataTreatmentService.labels = servicesData.map(
              current => {
                return current[0];
              }
            );

            let data = servicesData.map(
              current => {
                return +current[1];
              }
            );
            this.barChartDataTreatmentService.datasets = [
              {
                data: data,
                label: 'Test 2',
                borderColor: '#8e5ea2',
                fill: false,
              
              }
            ]
          }

          this.barChartDataTreatmentRoom.datasets = [
            {
              data: [],
              label: 'Test 2',
              borderColor: '#8e5ea2',
              fill: false
            }
          ]

          if (roomsData.length > 0) {
            this.barChartDataTreatmentRoom.labels = roomsData.map(
              current => {
                return current[0];
              }
            );

            let data = roomsData.map(
              current => {
                return +current[1];
              }
            );
            this.barChartDataTreatmentRoom.datasets = [
              {
                data: data,
                label: 'Test 2',
                borderColor: '#8e5ea2',
                fill: false
              }
            ]
          }


          this.barChartDataTreatmentStatus.datasets = [
            {
              data: [],
              label: 'Test 2',
              borderColor: '#8e5ea2',
              fill: false
            }
          ]

          if (treatmentsStatusData.length > 0) {
            this.barChartDataTreatmentStatus.labels = treatmentsStatusData.map(
              current => {
                return current[0];
              }
            );

            let data = treatmentsStatusData.map(
              current => {
                return +current[1];
              }
            );
            this.barChartDataTreatmentStatus.datasets = [
              {
                data: data,
                label: 'Test 2',
                borderColor: '#8e5ea2',
                fill: false
              }
            ]
          }

          this.chartDataTreatmentEmployee = [];

          if (employeesData.length > 0) {
            let maxValue = 0;
            this.chartDataTreatmentEmployee = employeesData.map(
              current => {
                if (current[2] > maxValue) {
                  maxValue = current[2];
                }

                return { data: [current[2]], label: current[0] + " " + current[1] };
              }
            );
            this.chartOptionsTreatmentEmployee = {

              
              responsive: true,
              scales: {
                yAxes: [{
                  ticks: {
                    max: maxValue,
                    min: 0
                  }
                }]
              }
            };
          }
          this.chartDataCitationDate= [];

          if (citationssData.length > 0) {
            let maxValue2 = 0;
            this.chartDataCitationDate = citationssData.map(
              current => {
                if (current[1] > maxValue2) {
                  maxValue2 = current[1];
                }

                return { data: [current[1]], label: this.datePipe.transform(current[0].toString(), 'shortDate') };
              }
            );
            this.chartOptionsCitationDate = {

              responsive: true,
              scales: {
                yAxes: [{
                  ticks: {
                    max: maxValue2,
                    min: 0
                  }
                }]
              }
            };
          }

       
          this.chartDataTreatmentEmployee2= [];
          if (employeesData.length > 0) {
            let maxValue = 0;
            var dataList: any[] = [];
            var dataListLabels: any[] = [];
            employeesData.map(
              current => {
                if (current[2] > maxValue) {
                  maxValue = current[2];
                }
                dataList.push(current[2])
                dataListLabels.push(current[0] + " " + current[1]);
              }
            );
   
            this.chartDataTreatmentEmployee2 = [{ data: dataList, label: dataListLabels.length }];

            this.chartDataTreatmentEmployeeLabels2 = dataListLabels;
            this.chartOptionsTreatmentEmployee2 = {

              responsive: true,
              scales: {
                yAxes: [{
                  ticks: {
                    max: maxValue,
                    min: 0
                  }
                }]
              }
            };
          }

          this.chartDataCitationDate2= [];
          if (citationssData.length > 0) {
            let maxValue2 = 0;
            var dataList2: any[] = [];
            var dataListLabels2: any[] = [];
            citationssData.map(
              current => {
                if (current[1] > maxValue2) {
                  maxValue2 = current[1];
                }

                dataList2.push(current[1])
                dataListLabels2.push(this.datePipe.transform(current[0].toString(), 'shortDate'));
              }
            );

            this.chartDataCitationDate2 = [{ data: dataList2, label: dataListLabels2.length }];

            this.chartDataCitationDateLabels2 = dataListLabels2;
            this.chartOptionsCitationDate2 = {

              responsive: true,
              scales: {
                yAxes: [{
                  ticks: {
                    max: maxValue2,
                    min: 0
                  }
                }]
              }
            };
          }

          this.barChartDataCitationStatus.datasets = [
            {
              data: [],
              label: 'Test 2',
              borderColor: '#8e5ea2',
              fill: false
            }
          ]

          if (citationsStatusData.length > 0) {
            this.barChartDataCitationStatus.labels = citationsStatusData.map(
              current => {
                return current[0];
              }
            );

            let data = citationsStatusData.map(
              current => {
                return +current[1];
              }
            );
            this.barChartDataCitationStatus.datasets = [
              {
                data: data,
                label: 'Test 2',
                borderColor: '#8e5ea2',
                fill: false
              }
            ]
          }

          // if (employeesData.length > 0) {
          //   let maxValue = 0;
          //   var dataList : any[] = [];
          //   for (let index = 1; index < 360; index++) 
          //   {
          //     dataList.push({ data: [index], label: index + " " + index });              
          //   }
          //   this.chartDataTreatmentEmployee = dataList;

          //   this.chartOptionsTreatmentEmployee = {

          //     responsive: true,
          //     scales: {
          //       yAxes: [{
          //         ticks: {
          //           max: 360,
          //           min: 1
          //         }
          //       }]
          //     }
          //   };
          // }

          // if (citationssData.length > 0) {
          //   let maxValue2 = 0;
          //   var dataList : any[] = [];
          //   for (let index = 1; index < 200; index++) 
          //   {
          //     dataList.push({ data: [index], label: index + " " + index });              
          //   }
          //   this.chartDataCitationDate = dataList;
          //   this.chartOptionsCitationDate = {

          //     responsive: true,
          //     scales: {
          //       yAxes: [{
          //         ticks: {
          //           max: 200,
          //           min: 1
          //         }
          //       }]
          //     }
          //   };
          // }

          // if (employeesData.length > 0) {
          //   let maxValue = 0;
          //   var dataList : any[] = [];
          //   var dataListLabels : any[] = [];
          //   for (let index = 1; index < 1000; index++) 
          //   {
          //     dataList.push(index)
          //     dataListLabels.push(index + " " + index );              
          //   }
          //   this.chartDataTreatmentEmployee2 = [{ data: dataList, label:dataListLabels.length}];

          //   this.chartDataTreatmentEmployeeLabels2 = dataListLabels;

          //   this.chartOptionsTreatmentEmployee2 = {

          //     responsive: true,
          //     scales: {
          //       yAxes: [{
          //         ticks: {
          //           max: 1000,
          //           min: 1
          //         }
          //       }]
          //     }
          //   };
          // }

          // if (citationssData.length > 0) {
          //   let maxValue2 = 0;
          //   var dataList2 : number[] = [];
          //   var dataListLabels2 : any[] = [];
          //   for (let index = 1; index < 200; index++) 
          //   {
          //     dataList2.push(index)
          //     dataListLabels2.push(index + " " + index );              
          //   }

          //   this.chartDataCitationDate2 = [{ data: dataList2, label: dataListLabels2.length}];

          //   this.chartDataCitationDateLabels2 = dataListLabels2;

          //   this.chartOptionsCitationDate2 = {

          //     responsive: true,
          //     scales: {
          //       yAxes: [{
          //         ticks: {
          //           max: 200,
          //           min: 1
          //         }
          //       }]
          //     }
          //   };
          // }

          this.loadingListData = false;
        },
        (error: any) => {
          this.error = error;
          this.loadingListData = false;
          this.errorLoadingListData = true;
          var message: string = this.language == "es" ? "No fue posible obtener los datos." : "Data could not be obtained.";
          this.messageService.generalMessage(false, message);
        }
      );
    this.subscriptions.push(subscription);
      }
  }


  downloadCanvas(event,indice) {
    // get the `<a>` element from click event
    var anchor = event.target;
    var namesGraph = ['TreatmentbyService','TreatmentbyRoom','TreatmentbyStatus','CitationByStatus','TreatmentByEmployee','CitationByDate'];
    // get the canvas, I'm getting it by tag name, you can do by id
    // and set the href of the anchor to the canvas dataUrl
    anchor.href = document.getElementsByTagName('canvas')[indice].toDataURL();
    // set the anchors 'download' attibute (name of the file to be downloaded)
    anchor.download = namesGraph[indice]+".png";

  }
  BuildDate(currentDate: Date, end: boolean): Date {
    if (!currentDate || currentDate.toString() == "")
      return null;
    else {
      var newDate = new Date(currentDate);

      newDate.setDate(newDate.getDate() + 1);
      if (!end)
        newDate.setHours(0, 0, 0, 0);
      else
        newDate.setHours(23, 59, 59, 0);

     // var newDateString = this.datePipe.transform(newDate, 'yyyy-MM-ddThh:mm:ss.SSSZ')
      return newDate;
    }
  }

  FilterAction(actionId: string) {
    switch (actionId) {
      case 'filter':
        this.getData();
        break;
      case 'clean':
        this.fechaIni = null;
        this.fechaFin = null;
        this.initDateFilter();
        this.hookLanguageChanges();
        this.getData();
        break;
    }
  }

  private initDateFilter() {

    const beginDate = new Date();

    beginDate.setMonth(beginDate.getMonth() + 1);
    beginDate.setDate(beginDate.getDate() - 30);

    //this.fechaIni = `${beginDate.getFullYear()}-${beginDate.getMonth() < 10 ? '0' + beginDate.getMonth() : beginDate.getMonth()}-${beginDate.getDate() < 10 ? '0' + beginDate.getDate() : beginDate.getDate()}`;
 
    const currentDate = new Date();

    this.fechaIni = `${beginDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}-${'01'}`;


    this.fechaFin = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}-${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}`;
   
  }
}
