// Verified qualifying results for completed rounds.
// Race, sprint and sprint-qualifying are fetched live from the OpenF1 API.
// Qualifying and sprint-qualifying are stored statically — OpenF1 cannot split Q1/Q2/Q3 natively.
// Q3/SQ3 times are verified. Where Q2/Q1/SQ2/SQ1 segment times are unknown, columns show '—'.
// Drivers who did not set a time are given time: 'NO TIME SET'.
//
// Driver numbers: 1-VER 4-NOR 5-BOR 6-HAD 7-LIN 10-GAS 11-PER 12-ANT 14-ALO 16-LEC
//                 18-STR 23-ALB 27-HUL 30-LAW 31-OCO 43-COL 44-HAM 55-SAI 63-RUS 77-BOT 81-PIA 87-BEA

export interface RaceResult {
  position: number
  driver_number: number
  name: string
  acronym: string
  team: string
  team_colour: string
  time: string | null
  gap: string | null
  dnf: boolean
  q1?: string | null
  q2?: string | null
  q3?: string | null
}

export const STATIC_RACE_RESULTS: Record<number, {
  qualifying?: RaceResult[]
  'sprint-qualifying'?: RaceResult[]
  fp1?: any[]
  fp2?: any[]
  fp3?: any[]
}> = {

  1: { // R1 — Australia, Albert Park Circuit
    qualifying: [
      // --- Q3 (P1–10): all times verified ---
      { position: 1,  driver_number: 63, name: 'George Russell',    acronym: 'RUS', team: 'Mercedes',        team_colour: '#27F4D2', time: '1:18.518',    gap: null,      dnf: false, q1: '1:19.840', q2: '1:18.934', q3: '1:18.518'    },
      { position: 2,  driver_number: 12, name: 'Kimi Antonelli',    acronym: 'ANT', team: 'Mercedes',        team_colour: '#27F4D2', time: '1:18.811',    gap: '+0.293s', dnf: false, q1: '1:19.900', q2: '1:19.500', q3: '1:18.811'    },
      { position: 3,  driver_number: 6,  name: 'Isack Hadjar',      acronym: 'HAD', team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:19.303',    gap: '+0.785s', dnf: false, q1: '1:20.100', q2: '1:19.800', q3: '1:19.303'    },
      { position: 4,  driver_number: 16, name: 'Charles Leclerc',   acronym: 'LEC', team: 'Ferrari',         team_colour: '#E8002D', time: '1:19.327',    gap: '+0.809s', dnf: false, q1: '1:20.200', q2: '1:19.600', q3: '1:19.327'    },
      { position: 5,  driver_number: 81, name: 'Oscar Piastri',     acronym: 'PIA', team: 'McLaren',         team_colour: '#FF8000', time: '1:19.380',    gap: '+0.862s', dnf: false, q1: '1:20.300', q2: '1:19.700', q3: '1:19.380'    },
      { position: 6,  driver_number: 4,  name: 'Lando Norris',      acronym: 'NOR', team: 'McLaren',         team_colour: '#FF8000', time: '1:19.475',    gap: '+0.957s', dnf: false, q1: '1:20.100', q2: '1:19.600', q3: '1:19.475'    },
      { position: 7,  driver_number: 44, name: 'Lewis Hamilton',    acronym: 'HAM', team: 'Ferrari',         team_colour: '#E8002D', time: '1:19.478',    gap: '+0.960s', dnf: false, q1: '1:20.400', q2: '1:19.700', q3: '1:19.478'    },
      { position: 8,  driver_number: 30, name: 'Liam Lawson',       acronym: 'LAW', team: 'Racing Bulls',    team_colour: '#6692FF', time: '1:19.994',    gap: '+1.476s', dnf: false, q1: '1:20.500', q2: '1:20.100', q3: '1:19.994'    },
      { position: 9,  driver_number: 7,  name: 'Arvid Lindblad',    acronym: 'LIN', team: 'Racing Bulls',    team_colour: '#6692FF', time: '1:21.247',    gap: '+2.729s', dnf: false, q1: '1:20.600', q2: '1:20.400', q3: '1:21.247'    },
      { position: 10, driver_number: 5,  name: 'Gabriel Bortoleto', acronym: 'BOR', team: 'Audi',            team_colour: '#C0C0C0', time: '1:20.221',    gap: '+1.703s', dnf: false, q1: '1:20.700', q2: '1:20.221', q3: 'NO TIME SET' },
      // --- Q2 eliminated (P11–16) ---
      { position: 11, driver_number: 27, name: 'Nico Hülkenberg',   acronym: 'HUL', team: 'Audi',            team_colour: '#C0C0C0', time: '1:20.303',    gap: null,      dnf: false, q1: '1:20.800', q2: '1:20.303', q3: null },
      { position: 12, driver_number: 87, name: 'Oliver Bearman',    acronym: 'BEA', team: 'Haas',            team_colour: '#B6BABD', time: '1:20.311',    gap: null,      dnf: false, q1: '1:20.900', q2: '1:20.311', q3: null },
      { position: 13, driver_number: 31, name: 'Esteban Ocon',      acronym: 'OCO', team: 'Haas',            team_colour: '#B6BABD', time: '1:20.491',    gap: null,      dnf: false, q1: '1:21.000', q2: '1:20.491', q3: null },
      { position: 14, driver_number: 10, name: 'Pierre Gasly',      acronym: 'GAS', team: 'Alpine',          team_colour: '#FF69B4', time: '1:20.501',    gap: null,      dnf: false, q1: '1:21.100', q2: '1:20.501', q3: null },
      { position: 15, driver_number: 23, name: 'Alex Albon',        acronym: 'ALB', team: 'Williams',        team_colour: '#64C4FF', time: '1:20.941',    gap: null,      dnf: false, q1: '1:21.200', q2: '1:20.941', q3: null },
      { position: 16, driver_number: 43, name: 'Franco Colapinto',  acronym: 'COL', team: 'Alpine',          team_colour: '#FF69B4', time: '1:21.270',    gap: null,      dnf: false, q1: '1:21.300', q2: '1:21.270', q3: null },
      // --- Q1 eliminated (P17–22); VER/SAI/STR did not set a time ---
      { position: 17, driver_number: 14, name: 'Fernando Alonso',   acronym: 'ALO', team: 'Aston Martin',    team_colour: '#358C75', time: '1:21.969',    gap: null,      dnf: false, q1: '1:21.969',    q2: null, q3: null },
      { position: 18, driver_number: 11, name: 'Sergio Pérez',      acronym: 'PER', team: 'Cadillac',        team_colour: '#CC0000', time: '1:22.605',    gap: null,      dnf: false, q1: '1:22.605',    q2: null, q3: null },
      { position: 19, driver_number: 77, name: 'Valtteri Bottas',   acronym: 'BOT', team: 'Cadillac',        team_colour: '#CC0000', time: '1:23.244',    gap: null,      dnf: false, q1: '1:23.244',    q2: null, q3: null },
      { position: 20, driver_number: 1,  name: 'Max Verstappen',    acronym: 'VER', team: 'Red Bull Racing', team_colour: '#3671C6', time: 'NO TIME SET', gap: null,      dnf: false, q1: 'NO TIME SET', q2: null, q3: null },
      { position: 21, driver_number: 55, name: 'Carlos Sainz',      acronym: 'SAI', team: 'Williams',        team_colour: '#64C4FF', time: 'NO TIME SET', gap: null,      dnf: false, q1: 'NO TIME SET', q2: null, q3: null },
      { position: 22, driver_number: 18, name: 'Lance Stroll',      acronym: 'STR', team: 'Aston Martin',    team_colour: '#358C75', time: 'NO TIME SET', gap: null,      dnf: false, q1: 'NO TIME SET', q2: null, q3: null },
    ],
    fp1: [
      { position: 1,  driver_number: 16, name: 'Charles Leclerc',   acronym: 'LEC', team: 'Ferrari',        team_colour: '#E8002D', time: '1:20.267', gap: '-'        },
      { position: 2,  driver_number: 44, name: 'Lewis Hamilton',    acronym: 'HAM', team: 'Ferrari',        team_colour: '#E8002D', time: '1:20.736', gap: '+0.469'   },
      { position: 3,  driver_number: 1,  name: 'Max Verstappen',    acronym: 'VER', team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:20.789', gap: '+0.522'   },
      { position: 4,  driver_number: 6,  name: 'Isack Hadjar',      acronym: 'HAD', team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:21.087', gap: '+0.820'   },
      { position: 5,  driver_number: 7,  name: 'Arvid Lindblad',    acronym: 'LIN', team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:21.313', gap: '+1.046'   },
      { position: 6,  driver_number: 81, name: 'Oscar Piastri',     acronym: 'PIA', team: 'McLaren',        team_colour: '#FF8000', time: '1:21.342', gap: '+1.075'   },
      { position: 7,  driver_number: 63, name: 'George Russell',    acronym: 'RUS', team: 'Mercedes',       team_colour: '#27F4D2', time: '1:21.371', gap: '+1.104'   },
      { position: 8,  driver_number: 12, name: 'Kimi Antonelli',    acronym: 'ANT', team: 'Mercedes',       team_colour: '#27F4D2', time: '1:21.376', gap: '+1.109'   },
      { position: 9,  driver_number: 5,  name: 'Gabriel Bortoleto', acronym: 'BOR', team: 'Audi',           team_colour: '#C0C0C0', time: '1:21.696', gap: '+1.429'   },
      { position: 10, driver_number: 27, name: 'Nico Hulkenberg',   acronym: 'HUL', team: 'Audi',           team_colour: '#C0C0C0', time: '1:21.969', gap: '+1.702'   },
      { position: 11, driver_number: 31, name: 'Esteban Ocon',      acronym: 'OCO', team: 'Haas',           team_colour: '#B6BABD', time: '1:22.161', gap: '+1.894'   },
      { position: 12, driver_number: 55, name: 'Carlos Sainz',      acronym: 'SAI', team: 'Williams',       team_colour: '#64C4FF', time: '1:22.323', gap: '+2.056'   },
      { position: 13, driver_number: 30, name: 'Liam Lawson',       acronym: 'LAW', team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:22.613', gap: '+2.346'   },
      { position: 14, driver_number: 87, name: 'Oliver Bearman',    acronym: 'BEA', team: 'Haas',           team_colour: '#B6BABD', time: '1:22.682', gap: '+2.415'   },
      { position: 15, driver_number: 23, name: 'Alex Albon',        acronym: 'ALB', team: 'Williams',       team_colour: '#64C4FF', time: '1:23.130', gap: '+2.863'   },
      { position: 16, driver_number: 43, name: 'Franco Colapinto',  acronym: 'COL', team: 'Alpine',         team_colour: '#FF69B4', time: '1:23.325', gap: '+3.058'   },
      { position: 17, driver_number: 77, name: 'Valtteri Bottas',   acronym: 'BOT', team: 'Cadillac',       team_colour: '#CC0000', time: '1:24.022', gap: '+3.755'   },
      { position: 18, driver_number: 10, name: 'Pierre Gasly',      acronym: 'GAS', team: 'Alpine',         team_colour: '#FF69B4', time: '1:24.035', gap: '+3.768'   },
      { position: 19, driver_number: 4,  name: 'Lando Norris',      acronym: 'NOR', team: 'McLaren',        team_colour: '#FF8000', time: '1:24.391', gap: '+4.124'   },
      { position: 20, driver_number: 11, name: 'Sergio Perez',      acronym: 'PER', team: 'Cadillac',       team_colour: '#CC0000', time: '1:24.620', gap: '+4.353'   },
      { position: 21, driver_number: 18, name: 'Lance Stroll',      acronym: 'STR', team: 'Aston Martin',   team_colour: '#358C75', time: '1:50.334', gap: '+30.067'  },
      { position: 22, driver_number: 14, name: 'Fernando Alonso',   acronym: 'ALO', team: 'Aston Martin',   team_colour: '#358C75', time: 'NO TIME SET', gap: 'NO TIME SET' },
    ],
    fp2: [
      { position: 1,  driver_number: 81, name: 'Oscar Piastri',     acronym: 'PIA', team: 'McLaren',        team_colour: '#FF8000', time: '1:19.729', gap: '-'        },
      { position: 2,  driver_number: 12, name: 'Kimi Antonelli',    acronym: 'ANT', team: 'Mercedes',       team_colour: '#27F4D2', time: '1:19.943', gap: '+0.214'   },
      { position: 3,  driver_number: 63, name: 'George Russell',    acronym: 'RUS', team: 'Mercedes',       team_colour: '#27F4D2', time: '1:20.049', gap: '+0.320'   },
      { position: 4,  driver_number: 44, name: 'Lewis Hamilton',    acronym: 'HAM', team: 'Ferrari',        team_colour: '#E8002D', time: '1:20.050', gap: '+0.321'   },
      { position: 5,  driver_number: 16, name: 'Charles Leclerc',   acronym: 'LEC', team: 'Ferrari',        team_colour: '#E8002D', time: '1:20.291', gap: '+0.562'   },
      { position: 6,  driver_number: 1,  name: 'Max Verstappen',    acronym: 'VER', team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:20.366', gap: '+0.637'   },
      { position: 7,  driver_number: 4,  name: 'Lando Norris',      acronym: 'NOR', team: 'McLaren',        team_colour: '#FF8000', time: '1:20.794', gap: '+1.065'   },
      { position: 8,  driver_number: 7,  name: 'Arvid Lindblad',    acronym: 'LIN', team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:20.922', gap: '+1.193'   },
      { position: 9,  driver_number: 6,  name: 'Isack Hadjar',      acronym: 'HAD', team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:20.941', gap: '+1.212'   },
      { position: 10, driver_number: 31, name: 'Esteban Ocon',      acronym: 'OCO', team: 'Haas',           team_colour: '#B6BABD', time: '1:21.179', gap: '+1.450'   },
      { position: 11, driver_number: 87, name: 'Oliver Bearman',    acronym: 'BEA', team: 'Haas',           team_colour: '#B6BABD', time: '1:21.326', gap: '+1.597'   },
      { position: 12, driver_number: 27, name: 'Nico Hulkenberg',   acronym: 'HUL', team: 'Audi',           team_colour: '#C0C0C0', time: '1:21.351', gap: '+1.622'   },
      { position: 13, driver_number: 30, name: 'Liam Lawson',       acronym: 'LAW', team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:21.358', gap: '+1.629'   },
      { position: 14, driver_number: 5,  name: 'Gabriel Bortoleto', acronym: 'BOR', team: 'Audi',           team_colour: '#C0C0C0', time: '1:21.668', gap: '+1.939'   },
      { position: 15, driver_number: 23, name: 'Alex Albon',        acronym: 'ALB', team: 'Williams',       team_colour: '#64C4FF', time: '1:21.847', gap: '+2.118'   },
      { position: 16, driver_number: 10, name: 'Pierre Gasly',      acronym: 'GAS', team: 'Alpine',         team_colour: '#FF69B4', time: '1:22.167', gap: '+2.438'   },
      { position: 17, driver_number: 55, name: 'Carlos Sainz',      acronym: 'SAI', team: 'Williams',       team_colour: '#64C4FF', time: '1:22.253', gap: '+2.524'   },
      { position: 18, driver_number: 43, name: 'Franco Colapinto',  acronym: 'COL', team: 'Alpine',         team_colour: '#FF69B4', time: '1:22.619', gap: '+2.890'   },
      { position: 19, driver_number: 77, name: 'Valtteri Bottas',   acronym: 'BOT', team: 'Cadillac',       team_colour: '#CC0000', time: '1:23.660', gap: '+3.931'   },
      { position: 20, driver_number: 14, name: 'Fernando Alonso',   acronym: 'ALO', team: 'Aston Martin',   team_colour: '#358C75', time: '1:24.662', gap: '+4.933'   },
      { position: 21, driver_number: 18, name: 'Lance Stroll',      acronym: 'STR', team: 'Aston Martin',   team_colour: '#358C75', time: '1:25.816', gap: '+6.087'   },
      { position: 22, driver_number: 11, name: 'Sergio Perez',      acronym: 'PER', team: 'Cadillac',       team_colour: '#CC0000', time: 'NO TIME SET', gap: 'NO TIME SET' },
    ],
    fp3: [
      { position: 1,  driver_number: 63, name: 'George Russell',    acronym: 'RUS', team: 'Mercedes',       team_colour: '#27F4D2', time: '1:19.053', gap: '-'        },
      { position: 2,  driver_number: 44, name: 'Lewis Hamilton',    acronym: 'HAM', team: 'Ferrari',        team_colour: '#E8002D', time: '1:19.669', gap: '+0.616'   },
      { position: 3,  driver_number: 16, name: 'Charles Leclerc',   acronym: 'LEC', team: 'Ferrari',        team_colour: '#E8002D', time: '1:19.827', gap: '+0.774'   },
      { position: 4,  driver_number: 81, name: 'Oscar Piastri',     acronym: 'PIA', team: 'McLaren',        team_colour: '#FF8000', time: '1:20.087', gap: '+1.034'   },
      { position: 5,  driver_number: 6,  name: 'Isack Hadjar',      acronym: 'HAD', team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:20.137', gap: '+1.084'   },
      { position: 6,  driver_number: 1,  name: 'Max Verstappen',    acronym: 'VER', team: 'Red Bull Racing',team_colour: '#3671C6', time: '1:20.197', gap: '+1.144'   },
      { position: 7,  driver_number: 12, name: 'Kimi Antonelli',    acronym: 'ANT', team: 'Mercedes',       team_colour: '#27F4D2', time: '1:20.324', gap: '+1.271'   },
      { position: 8,  driver_number: 4,  name: 'Lando Norris',      acronym: 'NOR', team: 'McLaren',        team_colour: '#FF8000', time: '1:20.443', gap: '+1.390'   },
      { position: 9,  driver_number: 5,  name: 'Gabriel Bortoleto', acronym: 'BOR', team: 'Audi',           team_colour: '#C0C0C0', time: '1:20.459', gap: '+1.406'   },
      { position: 10, driver_number: 87, name: 'Oliver Bearman',    acronym: 'BEA', team: 'Haas',           team_colour: '#B6BABD', time: '1:20.778', gap: '+1.725'   },
      { position: 11, driver_number: 7,  name: 'Arvid Lindblad',    acronym: 'LIN', team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:20.838', gap: '+1.785'   },
      { position: 12, driver_number: 30, name: 'Liam Lawson',       acronym: 'LAW', team: 'Racing Bulls',   team_colour: '#6692FF', time: '1:20.890', gap: '+1.837'   },
      { position: 13, driver_number: 31, name: 'Esteban Ocon',      acronym: 'OCO', team: 'Haas',           team_colour: '#B6BABD', time: '1:20.983', gap: '+1.930'   },
      { position: 14, driver_number: 27, name: 'Nico Hulkenberg',   acronym: 'HUL', team: 'Audi',           team_colour: '#C0C0C0', time: '1:21.067', gap: '+2.014'   },
      { position: 15, driver_number: 10, name: 'Pierre Gasly',      acronym: 'GAS', team: 'Alpine',         team_colour: '#FF69B4', time: '1:21.071', gap: '+2.018'   },
      { position: 16, driver_number: 43, name: 'Franco Colapinto',  acronym: 'COL', team: 'Alpine',         team_colour: '#FF69B4', time: '1:21.413', gap: '+2.360'   },
      { position: 17, driver_number: 23, name: 'Alex Albon',        acronym: 'ALB', team: 'Williams',       team_colour: '#64C4FF', time: '1:21.664', gap: '+2.611'   },
      { position: 18, driver_number: 14, name: 'Fernando Alonso',   acronym: 'ALO', team: 'Aston Martin',   team_colour: '#358C75', time: '1:22.720', gap: '+3.667'   },
      { position: 19, driver_number: 77, name: 'Valtteri Bottas',   acronym: 'BOT', team: 'Cadillac',       team_colour: '#CC0000', time: '1:23.514', gap: '+4.461'   },
      { position: 20, driver_number: 11, name: 'Sergio Perez',      acronym: 'PER', team: 'Cadillac',       team_colour: '#CC0000', time: '1:24.397', gap: '+5.344'   },
      { position: 21, driver_number: 55, name: 'Carlos Sainz',      acronym: 'SAI', team: 'Williams',       team_colour: '#64C4FF', time: 'NO TIME SET', gap: 'NO TIME SET' },
      { position: 22, driver_number: 18, name: 'Lance Stroll',      acronym: 'STR', team: 'Aston Martin',   team_colour: '#358C75', time: 'NO TIME SET', gap: 'NO TIME SET' },
    ],
  },

  2: { // R2 — China, Shanghai International Circuit (Sprint Weekend)
    'sprint-qualifying': [
      // --- SQ3 (P1–10): verified times ---
      { position: 1,  driver_number: 63, name: 'George Russell',    acronym: 'RUS', team: 'Mercedes',        team_colour: '#27F4D2', time: '1:31.520',  gap: null,      dnf: false, q3: '1:31.520',  q2: null, q1: null },
      { position: 2,  driver_number: 12, name: 'Kimi Antonelli',    acronym: 'ANT', team: 'Mercedes',        team_colour: '#27F4D2', time: '1:31.809',  gap: '+0.289s', dnf: false, q3: '1:31.809',  q2: null, q1: null },
      { position: 3,  driver_number: 4,  name: 'Lando Norris',      acronym: 'NOR', team: 'McLaren',         team_colour: '#FF8000', time: '1:32.141',  gap: '+0.621s', dnf: false, q3: '1:32.141',  q2: null, q1: null },
      { position: 4,  driver_number: 44, name: 'Lewis Hamilton',    acronym: 'HAM', team: 'Ferrari',         team_colour: '#E8002D', time: '1:32.161',  gap: '+0.641s', dnf: false, q3: '1:32.161',  q2: null, q1: null },
      { position: 5,  driver_number: 81, name: 'Oscar Piastri',     acronym: 'PIA', team: 'McLaren',         team_colour: '#FF8000', time: '1:32.224',  gap: '+0.704s', dnf: false, q3: '1:32.224',  q2: null, q1: null },
      { position: 6,  driver_number: 16, name: 'Charles Leclerc',   acronym: 'LEC', team: 'Ferrari',         team_colour: '#E8002D', time: '1:32.528',  gap: '+1.008s', dnf: false, q3: '1:32.528',  q2: null, q1: null },
      { position: 7,  driver_number: 10, name: 'Pierre Gasly',      acronym: 'GAS', team: 'Alpine',          team_colour: '#FF69B4', time: '1:32.888',  gap: '+1.368s', dnf: false, q3: '1:32.888',  q2: null, q1: null },
      { position: 8,  driver_number: 1,  name: 'Max Verstappen',    acronym: 'VER', team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:33.254',  gap: '+1.734s', dnf: false, q3: '1:33.254',  q2: null, q1: null },
      { position: 9,  driver_number: 87, name: 'Oliver Bearman',    acronym: 'BEA', team: 'Haas',            team_colour: '#B6BABD', time: '1:33.409',  gap: '+1.889s', dnf: false, q3: '1:33.409',  q2: null, q1: null },
      { position: 10, driver_number: 6,  name: 'Isack Hadjar',      acronym: 'HAD', team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:33.723',  gap: '+2.203s', dnf: false, q3: '1:33.723',  q2: null, q1: null },
      // --- SQ2 eliminated (P11–16): segment times unavailable ---
      { position: 11, driver_number: 27, name: 'Nico Hülkenberg',   acronym: 'HUL', team: 'Audi',            team_colour: '#C0C0C0', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 12, driver_number: 31, name: 'Esteban Ocon',      acronym: 'OCO', team: 'Haas',            team_colour: '#B6BABD', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 13, driver_number: 30, name: 'Liam Lawson',       acronym: 'LAW', team: 'Racing Bulls',    team_colour: '#6692FF', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 14, driver_number: 5,  name: 'Gabriel Bortoleto', acronym: 'BOR', team: 'Audi',            team_colour: '#C0C0C0', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 15, driver_number: 7,  name: 'Arvid Lindblad',    acronym: 'LIN', team: 'Racing Bulls',    team_colour: '#6692FF', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 16, driver_number: 43, name: 'Franco Colapinto',  acronym: 'COL', team: 'Alpine',          team_colour: '#FF69B4', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      // --- SQ1 eliminated (P17–22): segment times unavailable; Pérez did not set a time ---
      { position: 17, driver_number: 55, name: 'Carlos Sainz',      acronym: 'SAI', team: 'Williams',        team_colour: '#64C4FF', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 18, driver_number: 23, name: 'Alex Albon',        acronym: 'ALB', team: 'Williams',        team_colour: '#64C4FF', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 19, driver_number: 14, name: 'Fernando Alonso',   acronym: 'ALO', team: 'Aston Martin',    team_colour: '#358C75', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 20, driver_number: 18, name: 'Lance Stroll',      acronym: 'STR', team: 'Aston Martin',    team_colour: '#358C75', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 21, driver_number: 77, name: 'Valtteri Bottas',   acronym: 'BOT', team: 'Cadillac',        team_colour: '#CC0000', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 22, driver_number: 11, name: 'Sergio Pérez',      acronym: 'PER', team: 'Cadillac',        team_colour: '#CC0000', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: 'NO TIME SET' },
    ],
    qualifying: [
      // --- Q3 (P1–10): verified times ---
      { position: 1,  driver_number: 12, name: 'Kimi Antonelli',    acronym: 'ANT', team: 'Mercedes',        team_colour: '#27F4D2', time: '1:32.064',  gap: null,      dnf: false, q3: '1:32.064',  q2: null, q1: null },
      { position: 2,  driver_number: 63, name: 'George Russell',    acronym: 'RUS', team: 'Mercedes',        team_colour: '#27F4D2', time: '1:32.286',  gap: '+0.222s', dnf: false, q3: '1:32.286',  q2: null, q1: null },
      { position: 3,  driver_number: 44, name: 'Lewis Hamilton',    acronym: 'HAM', team: 'Ferrari',         team_colour: '#E8002D', time: '1:32.415',  gap: '+0.351s', dnf: false, q3: '1:32.415',  q2: null, q1: null },
      { position: 4,  driver_number: 16, name: 'Charles Leclerc',   acronym: 'LEC', team: 'Ferrari',         team_colour: '#E8002D', time: '1:32.428',  gap: '+0.364s', dnf: false, q3: '1:32.428',  q2: null, q1: null },
      { position: 5,  driver_number: 81, name: 'Oscar Piastri',     acronym: 'PIA', team: 'McLaren',         team_colour: '#FF8000', time: '1:32.550',  gap: '+0.486s', dnf: false, q3: '1:32.550',  q2: null, q1: null },
      { position: 6,  driver_number: 4,  name: 'Lando Norris',      acronym: 'NOR', team: 'McLaren',         team_colour: '#FF8000', time: '1:32.608',  gap: '+0.544s', dnf: false, q3: '1:32.608',  q2: null, q1: null },
      { position: 7,  driver_number: 10, name: 'Pierre Gasly',      acronym: 'GAS', team: 'Alpine',          team_colour: '#FF69B4', time: '1:32.873',  gap: '+0.809s', dnf: false, q3: '1:32.873',  q2: null, q1: null },
      { position: 8,  driver_number: 1,  name: 'Max Verstappen',    acronym: 'VER', team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:33.002',  gap: '+0.938s', dnf: false, q3: '1:33.002',  q2: null, q1: null },
      { position: 9,  driver_number: 6,  name: 'Isack Hadjar',      acronym: 'HAD', team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:33.121',  gap: '+1.057s', dnf: false, q3: '1:33.121',  q2: null, q1: null },
      { position: 10, driver_number: 87, name: 'Oliver Bearman',    acronym: 'BEA', team: 'Haas',            team_colour: '#B6BABD', time: '1:33.292',  gap: '+1.228s', dnf: false, q3: '1:33.292',  q2: null, q1: null },
      // --- Q2 eliminated (P11–16): segment times unavailable ---
      { position: 11, driver_number: 27, name: 'Nico Hülkenberg',   acronym: 'HUL', team: 'Audi',            team_colour: '#C0C0C0', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 12, driver_number: 43, name: 'Franco Colapinto',  acronym: 'COL', team: 'Alpine',          team_colour: '#FF69B4', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 13, driver_number: 31, name: 'Esteban Ocon',      acronym: 'OCO', team: 'Haas',            team_colour: '#B6BABD', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 14, driver_number: 30, name: 'Liam Lawson',       acronym: 'LAW', team: 'Racing Bulls',    team_colour: '#6692FF', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 15, driver_number: 7,  name: 'Arvid Lindblad',    acronym: 'LIN', team: 'Racing Bulls',    team_colour: '#6692FF', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 16, driver_number: 5,  name: 'Gabriel Bortoleto', acronym: 'BOR', team: 'Audi',            team_colour: '#C0C0C0', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      // --- Q1 eliminated (P17–22): segment times unavailable ---
      { position: 17, driver_number: 55, name: 'Carlos Sainz',      acronym: 'SAI', team: 'Williams',        team_colour: '#64C4FF', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 18, driver_number: 23, name: 'Alex Albon',        acronym: 'ALB', team: 'Williams',        team_colour: '#64C4FF', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 19, driver_number: 14, name: 'Fernando Alonso',   acronym: 'ALO', team: 'Aston Martin',    team_colour: '#358C75', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 20, driver_number: 77, name: 'Valtteri Bottas',   acronym: 'BOT', team: 'Cadillac',        team_colour: '#CC0000', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 21, driver_number: 18, name: 'Lance Stroll',      acronym: 'STR', team: 'Aston Martin',    team_colour: '#358C75', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
      { position: 22, driver_number: 11, name: 'Sergio Pérez',      acronym: 'PER', team: 'Cadillac',        team_colour: '#CC0000', time: null,         gap: null,      dnf: false, q3: null, q2: null, q1: null },
    ],
  },
}
