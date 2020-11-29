import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RenderComponent } from './render.component';
import {SelectButtonModule} from 'primeng/selectbutton';
import { FileSelectDirective } from 'ng2-file-upload';

@NgModule({
  declarations: [
    RenderComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    SelectButtonModule,
    FileSelectDirective
  ]
})
export class RenderModule { }
