import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: any, query: any): any {
    if (!query) return value;
    var re = new RegExp(query); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
    if (value != undefined) {
      return value.replace(
        re,
        '<mark class="highlighted">' + query + '</mark>'
      );
    }
  }
}
