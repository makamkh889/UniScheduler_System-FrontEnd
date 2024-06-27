import { Directive } from '@angular/core';
import { EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDropDirective]',
  standalone: true
})
export class DragAndDropDirectiveDirective {

  constructor() { }
  @Output() filesChangeEmiter: EventEmitter<File[]> = new EventEmitter<File[]>();

  @HostBinding('style.background') private background = '#eee';
  @HostBinding('style.border') private borderStyle = '2px dashed';
  @HostBinding('style.border-color') private borderColor = '#696D7D';
  @HostBinding('style.border-radius') private borderRadius = '5px';

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'lightgray';
    this.borderColor = 'cadetblue';
    this.borderStyle = '3px solid';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    this.borderColor = '#696D7D';
    this.borderStyle = '2px dashed';
  }


  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    this.borderColor = '#696D7D';
    this.borderStyle = '2px dashed';

    const files = evt.dataTransfer?.files;
    if (files) {
      let validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'application/vnd.ms-excel' || files[i].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          validFiles.push(files[i]);
        }
      }
      this.filesChangeEmiter.emit(validFiles);
    }
  }

}
