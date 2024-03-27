//Mirror from the frontend as placeholders or for continued use.

export interface Building {
  id: string;
  name: string;
  description: string;
  address: string;
}

export interface Room {
  id: string;
  buildingId: string;
  name: string;
  description: string;
  isAvailable: boolean;
}

export interface Point {
  time: number; //Integer since 1970 in milliseconds
  y: number; //Number of people in a room as an integer
}

export const buildings: Building[] = [
  {
    id: '1',
    name: 'EDIT-Huset',
    description:
      'Byggnaden för Elektronik, Data och IT. Innehåller flera grupprum.',
    address: 'Maskingränd 2'
  },
  {
    id: '2',
    name: 'Fysik-Origo',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    address: 'Kemigården 1'
  },
  {
    id: '3',
    name: 'Biblioteket',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    address: 'Chalmers Tvärgata 1'
  },
  {
    id: '4',
    name: 'Idéläran',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    address: 'Rännvägen 8'
  },
  {
    id: '5',
    name: 'Samhällsbyggnad 1',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    address: 'Sven Hultins gata 6'
  },
  {
    id: '6',
    name: 'Samhällsbyggnad 2',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    address: 'Sven Hultins gata 6'
  },
  {
    id: '7',
    name: 'Samhällsbyggnad 3',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    address: 'Sven Hultins gata 8'
  }
];

export const rooms: Room[] = [
  {
    id: '1',
    buildingId: '1',
    name: 'EG-3215A',
    description:
      'EG-3215A och B delas med ett draperi Behöver men hela rummet får man boka både A och B',
    isAvailable: true
  },
  {
    id: '2',
    buildingId: '1',
    name: 'EG-3215B',
    description:
      'EG-3215A och B delas med ett draperi Behöver men hela rummet får man boka både A och B',
    isAvailable: false
  },
  {
    id: '3',
    buildingId: '1',
    name: '3128',
    description: `3128 finns på Campus Johanneberg.
      Gå till byggnad EDIT trappa D, E och F. Ingång från Rännvägen 6B. Gå till våning 3.`,
    isAvailable: true
  },
  {
    id: '4',
    buildingId: '1',
    name: '4128',
    description: `4128 finns på Campus Johanneberg.
      Gå till byggnad EDIT trappa D, E och F. Ingång från Rännvägen 6B. Gå till våning 4.`,
    isAvailable: true
  },
  {
    id: '5',
    buildingId: '2',
    name: 'F-G7154',
    description: `F-G7154 finns på Campus Johanneberg.
    Gå till byggnad Fysik Origo. Ingång från Fysikgården 2. Gå till våning 7.`,
    isAvailable: false
  },
  {
    id: '6',
    buildingId: '2',
    name: 'F-G7160',
    description: `F-G7160 finns på Campus Johanneberg.
    Gå till byggnad Fysik Origo. Ingång från Fysikgården 2. Gå till våning 7.`,
    isAvailable: true
  },
  {
    id: '7',
    buildingId: '2',
    name: 'F-G7160B',
    description: `F-G7160B finns på Campus Johanneberg.
    Gå till byggnad Fysik Origo. Ingång från Fysikgården 2. Gå till våning 7.`,
    isAvailable: true
  },
  {
    id: '8',
    buildingId: '2',
    name: 'F4042',
    description: `F4042 finns på Campus Johanneberg.
    Gå till byggnad Fysik Origo. Ingång från Fysikgården 2B.`,
    isAvailable: false
  },
  {
    id: '9',
    buildingId: '2',
    name: 'F4043',
    description: `F4043 finns på Campus Johanneberg.
    Gå till byggnad Fysik Origo. Ingång från Fysikgården 2B.`,
    isAvailable: true
  },
  {
    id: '10',
    buildingId: '3',
    name: '154',
    description: `154 finns på Campus Johanneberg.
    Gå till byggnad Biblioteket. Ingång från Hörsalsvägen 2. Gå till våning 1.`,
    isAvailable: true
  },
  {
    id: '11',
    buildingId: '3',
    name: '245',
    description: `245 finns på Campus Johanneberg.
    Gå till byggnad Biblioteket. Ingång från Hörsalsvägen 2. Gå till våning 2.`,
    isAvailable: true
  },
  {
    id: '12',
    buildingId: '3',
    name: '255',
    description: `255 finns på Campus Johanneberg.
    Gå till byggnad Biblioteket. Ingång från Hörsalsvägen 2. Gå till våning 2.`,
    isAvailable: true
  },
  {
    id: '13',
    buildingId: '4',
    name: 'EG-2514',
    description: `EG-2514 finns på Campus Johanneberg.
    Gå till byggnad Idéläran (NC). Ingång från Rännvägen 8. Entréplan.`,
    isAvailable: true
  },
  {
    id: '14',
    buildingId: '4',
    name: 'EG-2515',
    description: `EG-2515 finns på Campus Johanneberg.
    Gå till byggnad Idéläran (NC). Ingång från Rännvägen 8. Entréplan. Rum 2515.`,
    isAvailable: false
  },
  {
    id: '15',
    buildingId: '4',
    name: 'EG-2516',
    description: `EG-2516 finns på Campus Johanneberg.
    Gå till byggnad Idéläran (NC). Ingång från Rännvägen 8. Entréplan. Rum 2516.`,
    isAvailable: false
  },
  {
    id: '16',
    buildingId: '4',
    name: 'EG-3503',
    description: `EG-3503 finns på Campus Johanneberg.
    Gå till byggnad Idéläran (NC). Ingång från Rännvägen 8. Gå till våning 2. Rum 3503.`,
    isAvailable: true
  },
  {
    id: '17',
    buildingId: '4',
    name: 'EG-3504',
    description: `EG-3504 finns på Campus Johanneberg.
    Gå till byggnad Idéläran (NC). Ingång från Rännvägen 8. Gå till våning 2. Rum 3504.`,
    isAvailable: true
  },
  {
    id: '18',
    buildingId: '5',
    name: 'SB-D025',
    description: `SB-D025 finns på Campus Johanneberg.
    Gå till byggnad Samhällsbyggnad I-II. Ingång från Sven Hultins Gata 6. Ta trappa B (SB1). Gå till våning -1. Rum 0111.`,
    isAvailable: true
  },
  {
    id: '19',
    buildingId: '5',
    name: 'SB-D040',
    description: `SB-D040 finns på Campus Johanneberg.
    Gå till byggnad Samhällsbyggnad I-II. Ingång från Sven Hultins Gata 6. Ta trappa B (SB1). Gå till våning -1. Rum 0112.`,
    isAvailable: true
  },
  {
    id: '20',
    buildingId: '5',
    name: 'SB-D042',
    description: `SB-D042 finns på Campus Johanneberg.
    Gå till byggnad Samhällsbyggnad I-II. Ingång från Sven Hultins Gata 6. Ta trappa B (SB1). Gå till våning -1. Rum 0123.`,
    isAvailable: false
  },
  {
    id: '21',
    buildingId: '6',
    name: 'SB-D080',
    description: `SB-D080 finns på Campus Johanneberg.
    Gå till byggnad Samhällsbyggnad I-II. Ingång från Sven Hultins Gata 6. Ta trappa A (SB1). Gå till våning -1. Rum 0125.`,
    isAvailable: false
  },
  {
    id: '22',
    buildingId: '7',
    name: 'SB-D209',
    description: `SB-D209 finns på Campus Johanneberg.
    Gå till byggnad Samhällsbyggnad I-II. Ingång från Sven Hultins Gata 6. Ta trappa E (SB2). Gå till våning 2. Rum 2233.`,
    isAvailable: true
  }
];

export const getExampleTimePoints = (): Point[] => {
  const numPoints = 100;
  return new Array(100).fill(0).map((_, i) => {
    return {
      time: new Date().getTime() + i * 86400 * 1000,
      y:
        1 +
        Math.round(
          (1 + Math.sin(((2 * Math.PI * i) / numPoints) * 5)) *
            8 *
            Math.random()
        )
    };
  });
};
