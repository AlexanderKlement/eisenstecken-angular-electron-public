
  import { Pipe, PipeTransform, SecurityContext } from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

  @Pipe({ name: 'boldSpan' })
export class BoldSpanPipe implements PipeTransform {

  constructor(
    protected sanitizer: DomSanitizer
  ) {
  }

  transform(value: string, regex): any {
    return this.sanitize(this.replace(value, regex));
  }

  replace(str, regex) {
    return str.replace(new RegExp(`(${regex})`, "gi"), "<b>$1</b>");
  }

  sanitize(str) {
    return this.sanitizer.sanitize(SecurityContext.HTML, str);
  }
}
