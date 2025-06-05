import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'desPipe',
  standalone: true,
})
export class DesPipePipe implements PipeTransform {
  transform(desc: string, wordLimit: number = 15): string {
    if (!desc) return '';
    const words = desc.match(/\S+/g) || [];
    if (words.length <= wordLimit) {
      return desc;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  }
}
