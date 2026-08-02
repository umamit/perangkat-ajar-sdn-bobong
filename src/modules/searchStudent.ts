import { filterSiswa } from './filterSiswa';

export function searchStudent(query: string): void {
  filterSiswa(query);
}
