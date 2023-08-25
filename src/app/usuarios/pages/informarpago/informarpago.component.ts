import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-informarpago',
  templateUrl: './informarpago.component.html',
  styleUrls: ['./informarpago.component.scss']
})
export class InformarpagoComponent implements OnInit {

  constructor(private renderer: Renderer2,
    @Inject(DOCUMENT) private _document : any) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(){
    var s = this.renderer.createElement("script");
    s.type = "text/javascript";
    s.src = "assets/plugins/nice-select/js/jquery.nice-select.min.js";
    this.renderer.appendChild(this._document.body, s);

    var s2 = this.renderer.createElement("script");
    s2.type = "text/javascript";
    s2.src = "assets/js/custom.js";
    this.renderer.appendChild(this._document.body, s2);

  }

}
