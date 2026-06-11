export interface Diagram {
  id: string;
  title: string;
  type: 'Diagram klas' | 'Diagram sekwencji' | 'Przypadek użycia' | 'Diagram aktywności' | 'Diagram stanów' | 'Diagram komponentów';
  lastEdited: Date;
  thumbnail: string;
}

export const mockDiagrams: Diagram[] = [
  {
    id: '1',
    title: 'Architektura Systemu E-Commerce',
    type: 'Diagram klas',
    lastEdited: new Date('2026-04-14T15:30:00'),
    thumbnail: 'https://images.unsplash.com/photo-1730578725695-714b52eed8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVTUwlMjBkaWFncmFtJTIwZmxvd2NoYXJ0fGVufDF8fHx8MTc3NjI0ODQ4OHww&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: '2',
    title: 'Przepływ Autentykacji Użytkownika',
    type: 'Diagram sekwencji',
    lastEdited: new Date('2026-04-13T10:15:00'),
    thumbnail: 'https://images.unsplash.com/photo-1753715613388-7e03410b1dce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGFyY2hpdGVjdHVyZSUyMGRpYWdyYW18ZW58MXx8fHwxNzc2MTk2NTkxfDA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: '3',
    title: 'System Przetwarzania Płatności',
    type: 'Diagram aktywności',
    lastEdited: new Date('2026-04-12T14:45:00'),
    thumbnail: 'https://images.unsplash.com/photo-1742415106160-594d07f6cc23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzcyUyMGRpYWdyYW0lMjBibHVlcHJpbnR8ZW58MXx8fHwxNzc2MjQ4NDg5fDA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: '4',
    title: 'Przypadki Użycia Zarządzania Zamówieniami',
    type: 'Przypadek użycia',
    lastEdited: new Date('2026-04-10T09:20:00'),
    thumbnail: 'https://images.unsplash.com/photo-1686984197046-1925353b0ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeXN0ZW0lMjBkZXNpZ24lMjB3aGl0ZWJvYXJkfGVufDF8fHx8MTc3NjI0ODQ4OXww&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: '5',
    title: 'Projekt Schematu Bazy Danych',
    type: 'Diagram komponentów',
    lastEdited: new Date('2026-04-09T16:00:00'),
    thumbnail: 'https://images.unsplash.com/photo-1573166364266-356ef04ae798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobmljYWwlMjBmbG93Y2hhcnQlMjBwbGFubmluZ3xlbnwxfHx8fDE3NzYyNDg0OTB8MA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: '6',
    title: 'Architektura Mikroserwisów',
    type: 'Diagram komponentów',
    lastEdited: new Date('2026-04-08T11:30:00'),
    thumbnail: 'https://images.unsplash.com/photo-1642356692954-3fbb84baf1a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhYmFzZSUyMHNjaGVtYSUyMGRpYWdyYW18ZW58MXx8fHwxNzc2MjIwODU2fDA&ixlib=rb-4.1.0&q=80&w=400',
  },
];