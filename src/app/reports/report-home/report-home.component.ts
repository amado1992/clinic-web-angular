import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-home',
  templateUrl: './report-home.component.html',
  styleUrls: ['./report-home.component.scss']
})
export class ReportHomeComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }
}
