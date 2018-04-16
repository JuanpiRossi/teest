import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterComponent } from './roster.component';
import {DragulaExtendedDirective} from '../../../../directives/dragula/dragula-extended.directive';
import {DragulaModule, DragulaService} from 'ng2-dragula';
import { NgxDatatableModule,DatatableComponent } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule,
    NgxDatatableModule
  ],
  providers:[DragulaService],
  declarations: [RosterComponent,DragulaExtendedDirective],
  exports:[DragulaExtendedDirective],
  bootstrap: [ RosterComponent ]
})
export class RosterModule { }
