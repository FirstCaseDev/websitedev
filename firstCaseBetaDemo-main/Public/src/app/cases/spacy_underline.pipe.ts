import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'SpacyUnderline' })
export class SpacyUnderline implements PipeTransform {
  css =
    '.spacy-underlined {text-decoration: underline solid #0077ff 2px;color: #000; margin:0 5px;background-color: rgba(201, 218, 248, 0.4);}';

  transform(value: any, query: any): any {
    var array: string = query.split(' ');
    console.log(array);
    var value_array: string[] = value.split(' ');
    for (let i = 0; i < value_array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        if (value_array[i].toLowerCase() == array[j].toLowerCase()) {
          value_array[
            i
          ] = `<span class="spacy-underlined">${value_array[i]}</span><style>${this.css}</style>`;
        }
      }
    }

    console.log(value_array);
    console.log(value_array.join(' '));

    return value_array.join(' ');

    // for (let i = 0; i < this.array.length; i++) {
    //   const element = this.array[i];
    //   if (element.)

    // }
    var result = value.replace();

    // var re = new RegExp(query, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
    // if (value != undefined) {
    //   return value.replace(
    //     re,
    // '<span style="text-decoration: underline solid #0077ff 2px;">' +
    //   query +
    //   '</span>'
    //   );
    // }
  }
}
