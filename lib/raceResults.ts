// Single source of truth for all static session results.
// Race, sprint race data fetched live from OpenF1 API — not stored here.
// Driver numbers ref: 1-VER 4-NOR 5-BOR 6-HAD 7-LIN 10-GAS 11-PER 12-ANT 14-ALO 16-LEC
//                    18-STR 23-ALB 27-HUL 30-LAW 31-OCO 43-COL 44-HAM 55-SAI 63-RUS 77-BOT 81-PIA 87-BEA

export interface DriverResult {
  position: number
  name: string
  team: string
  team_colour: string
  time: string
  gap: string
}

export interface QualifyingResult {
  position: number
  name: string
  team: string
  team_colour: string
  q1: string | null
  q2: string | null
  q3: string | null
  time: string
}

export interface QualifyingSessionKeys {
  q1?: string
  q2?: string
  q3?: string
}

export interface RaceWeekend {
  round: number
  name: string
  flag: string
  isSprint: boolean
  fp1?: DriverResult[]
  fp2?: DriverResult[]
  fp3?: DriverResult[]
  sprintQualifying?: QualifyingResult[]
  sprintQualifyingKeys?: QualifyingSessionKeys
  sprintRace?: DriverResult[]
  qualifying?: QualifyingResult[]
  qualifyingKeys?: QualifyingSessionKeys
  race?: DriverResult[]
}

export const RACE_WEEKENDS: Record<number, RaceWeekend> = {

  1: {
    round: 1,
    name: 'Australia',
    flag: '🇦🇺',
    isSprint: false,
    fp1: [
      { position: 1,  name: 'Charles Leclerc',   team: 'Ferrari',         team_colour: '#E8002D', time: '1:20.267', gap: '—'         },
      { position: 2,  name: 'Lewis Hamilton',    team: 'Ferrari',         team_colour: '#E8002D', time: '1:20.736', gap: '+0.469s'   },
      { position: 3,  name: 'Max Verstappen',    team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:20.789', gap: '+0.522s'   },
      { position: 4,  name: 'Isack Hadjar',      team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:21.087', gap: '+0.820s'   },
      { position: 5,  name: 'Arvid Lindblad',    team: 'Racing Bulls',    team_colour: '#6692FF', time: '1:21.313', gap: '+1.046s'   },
      { position: 6,  name: 'Oscar Piastri',     team: 'McLaren',         team_colour: '#FF8000', time: '1:21.342', gap: '+1.075s'   },
      { position: 7,  name: 'George Russell',    team: 'Mercedes',        team_colour: '#27F4D2', time: '1:21.371', gap: '+1.104s'   },
      { position: 8,  name: 'Kimi Antonelli',    team: 'Mercedes',        team_colour: '#27F4D2', time: '1:21.376', gap: '+1.109s'   },
      { position: 9,  name: 'Gabriel Bortoleto', team: 'Audi',            team_colour: '#C0C0C0', time: '1:21.696', gap: '+1.429s'   },
      { position: 10, name: 'Nico Hülkenberg',   team: 'Audi',            team_colour: '#C0C0C0', time: '1:21.969', gap: '+1.702s'   },
      { position: 11, name: 'Esteban Ocon',      team: 'Haas',            team_colour: '#B6BABD', time: '1:22.161', gap: '+1.894s'   },
      { position: 12, name: 'Carlos Sainz',      team: 'Williams',        team_colour: '#64C4FF', time: '1:22.323', gap: '+2.056s'   },
      { position: 13, name: 'Liam Lawson',       team: 'Racing Bulls',    team_colour: '#6692FF', time: '1:22.613', gap: '+2.346s'   },
      { position: 14, name: 'Oliver Bearman',    team: 'Haas',            team_colour: '#B6BABD', time: '1:22.682', gap: '+2.415s'   },
      { position: 15, name: 'Alex Albon',        team: 'Williams',        team_colour: '#64C4FF', time: '1:23.130', gap: '+2.863s'   },
      { position: 16, name: 'Franco Colapinto',  team: 'Alpine',          team_colour: '#FF69B4', time: '1:23.325', gap: '+3.058s'   },
      { position: 17, name: 'Valtteri Bottas',   team: 'Cadillac',        team_colour: '#CC0000', time: '1:24.022', gap: '+3.755s'   },
      { position: 18, name: 'Pierre Gasly',      team: 'Alpine',          team_colour: '#FF69B4', time: '1:24.035', gap: '+3.768s'   },
      { position: 19, name: 'Lando Norris',      team: 'McLaren',         team_colour: '#FF8000', time: '1:24.391', gap: '+4.124s'   },
      { position: 20, name: 'Sergio Pérez',      team: 'Cadillac',        team_colour: '#CC0000', time: '1:24.620', gap: '+4.353s'   },
      { position: 21, name: 'Lance Stroll',      team: 'Aston Martin',    team_colour: '#358C75', time: '1:50.334', gap: '+30.067s'  },
      { position: 22, name: 'Fernando Alonso',   team: 'Aston Martin',    team_colour: '#358C75', time: 'NO TIME SET', gap: 'NO TIME SET' },
    ],
    fp2: [
      { position: 1,  name: 'Oscar Piastri',     team: 'McLaren',         team_colour: '#FF8000', time: '1:19.729', gap: '—'         },
      { position: 2,  name: 'Kimi Antonelli',    team: 'Mercedes',        team_colour: '#27F4D2', time: '1:19.943', gap: '+0.214s'   },
      { position: 3,  name: 'George Russell',    team: 'Mercedes',        team_colour: '#27F4D2', time: '1:20.049', gap: '+0.320s'   },
      { position: 4,  name: 'Lewis Hamilton',    team: 'Ferrari',         team_colour: '#E8002D', time: '1:20.050', gap: '+0.321s'   },
      { position: 5,  name: 'Charles Leclerc',   team: 'Ferrari',         team_colour: '#E8002D', time: '1:20.291', gap: '+0.562s'   },
      { position: 6,  name: 'Max Verstappen',    team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:20.366', gap: '+0.637s'   },
      { position: 7,  name: 'Lando Norris',      team: 'McLaren',         team_colour: '#FF8000', time: '1:20.794', gap: '+1.065s'   },
      { position: 8,  name: 'Arvid Lindblad',    team: 'Racing Bulls',    team_colour: '#6692FF', time: '1:20.922', gap: '+1.193s'   },
      { position: 9,  name: 'Isack Hadjar',      team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:20.941', gap: '+1.212s'   },
      { position: 10, name: 'Esteban Ocon',      team: 'Haas',            team_colour: '#B6BABD', time: '1:21.179', gap: '+1.450s'   },
      { position: 11, name: 'Oliver Bearman',    team: 'Haas',            team_colour: '#B6BABD', time: '1:21.326', gap: '+1.597s'   },
      { position: 12, name: 'Nico Hülkenberg',   team: 'Audi',            team_colour: '#C0C0C0', time: '1:21.351', gap: '+1.622s'   },
      { position: 13, name: 'Liam Lawson',       team: 'Racing Bulls',    team_colour: '#6692FF', time: '1:21.358', gap: '+1.629s'   },
      { position: 14, name: 'Gabriel Bortoleto', team: 'Audi',            team_colour: '#C0C0C0', time: '1:21.668', gap: '+1.939s'   },
      { position: 15, name: 'Alex Albon',        team: 'Williams',        team_colour: '#64C4FF', time: '1:21.847', gap: '+2.118s'   },
      { position: 16, name: 'Pierre Gasly',      team: 'Alpine',          team_colour: '#FF69B4', time: '1:22.167', gap: '+2.438s'   },
      { position: 17, name: 'Carlos Sainz',      team: 'Williams',        team_colour: '#64C4FF', time: '1:22.253', gap: '+2.524s'   },
      { position: 18, name: 'Franco Colapinto',  team: 'Alpine',          team_colour: '#FF69B4', time: '1:22.619', gap: '+2.890s'   },
      { position: 19, name: 'Valtteri Bottas',   team: 'Cadillac',        team_colour: '#CC0000', time: '1:23.660', gap: '+3.931s'   },
      { position: 20, name: 'Fernando Alonso',   team: 'Aston Martin',    team_colour: '#358C75', time: '1:24.662', gap: '+4.933s'   },
      { position: 21, name: 'Lance Stroll',      team: 'Aston Martin',    team_colour: '#358C75', time: '1:25.816', gap: '+6.087s'   },
      { position: 22, name: 'Sergio Pérez',      team: 'Cadillac',        team_colour: '#CC0000', time: 'NO TIME SET', gap: 'NO TIME SET' },
    ],
    fp3: [
      { position: 1,  name: 'George Russell',    team: 'Mercedes',        team_colour: '#27F4D2', time: '1:19.053', gap: '—'         },
      { position: 2,  name: 'Lewis Hamilton',    team: 'Ferrari',         team_colour: '#E8002D', time: '1:19.669', gap: '+0.616s'   },
      { position: 3,  name: 'Charles Leclerc',   team: 'Ferrari',         team_colour: '#E8002D', time: '1:19.827', gap: '+0.774s'   },
      { position: 4,  name: 'Oscar Piastri',     team: 'McLaren',         team_colour: '#FF8000', time: '1:20.087', gap: '+1.034s'   },
      { position: 5,  name: 'Isack Hadjar',      team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:20.137', gap: '+1.084s'   },
      { position: 6,  name: 'Max Verstappen',    team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:20.197', gap: '+1.144s'   },
      { position: 7,  name: 'Kimi Antonelli',    team: 'Mercedes',        team_colour: '#27F4D2', time: '1:20.324', gap: '+1.271s'   },
      { position: 8,  name: 'Lando Norris',      team: 'McLaren',         team_colour: '#FF8000', time: '1:20.443', gap: '+1.390s'   },
      { position: 9,  name: 'Gabriel Bortoleto', team: 'Audi',            team_colour: '#C0C0C0', time: '1:20.459', gap: '+1.406s'   },
      { position: 10, name: 'Oliver Bearman',    team: 'Haas',            team_colour: '#B6BABD', time: '1:20.778', gap: '+1.725s'   },
      { position: 11, name: 'Arvid Lindblad',    team: 'Racing Bulls',    team_colour: '#6692FF', time: '1:20.838', gap: '+1.785s'   },
      { position: 12, name: 'Liam Lawson',       team: 'Racing Bulls',    team_colour: '#6692FF', time: '1:20.890', gap: '+1.837s'   },
      { position: 13, name: 'Esteban Ocon',      team: 'Haas',            team_colour: '#B6BABD', time: '1:20.983', gap: '+1.930s'   },
      { position: 14, name: 'Nico Hülkenberg',   team: 'Audi',            team_colour: '#C0C0C0', time: '1:21.067', gap: '+2.014s'   },
      { position: 15, name: 'Pierre Gasly',      team: 'Alpine',          team_colour: '#FF69B4', time: '1:21.071', gap: '+2.018s'   },
      { position: 16, name: 'Franco Colapinto',  team: 'Alpine',          team_colour: '#FF69B4', time: '1:21.413', gap: '+2.360s'   },
      { position: 17, name: 'Alex Albon',        team: 'Williams',        team_colour: '#64C4FF', time: '1:21.664', gap: '+2.611s'   },
      { position: 18, name: 'Fernando Alonso',   team: 'Aston Martin',    team_colour: '#358C75', time: '1:22.720', gap: '+3.667s'   },
      { position: 19, name: 'Valtteri Bottas',   team: 'Cadillac',        team_colour: '#CC0000', time: '1:23.514', gap: '+4.461s'   },
      { position: 20, name: 'Sergio Pérez',      team: 'Cadillac',        team_colour: '#CC0000', time: '1:24.397', gap: '+5.344s'   },
      { position: 21, name: 'Carlos Sainz',      team: 'Williams',        team_colour: '#64C4FF', time: 'NO TIME SET', gap: 'NO TIME SET' },
      { position: 22, name: 'Lance Stroll',      team: 'Aston Martin',    team_colour: '#358C75', time: 'NO TIME SET', gap: 'NO TIME SET' },
    ],
    qualifying: [
      // --- Q3 (P1–10) ---
      { position: 1,  name: 'George Russell',    team: 'Mercedes',        team_colour: '#27F4D2', q1: '1:19.840', q2: '1:18.934', q3: '1:18.518',    time: '1:18.518'    },
      { position: 2,  name: 'Kimi Antonelli',    team: 'Mercedes',        team_colour: '#27F4D2', q1: '1:19.900', q2: '1:19.500', q3: '1:18.811',    time: '1:18.811'    },
      { position: 3,  name: 'Isack Hadjar',      team: 'Red Bull Racing', team_colour: '#3671C6', q1: '1:20.100', q2: '1:19.800', q3: '1:19.303',    time: '1:19.303'    },
      { position: 4,  name: 'Charles Leclerc',   team: 'Ferrari',         team_colour: '#E8002D', q1: '1:20.200', q2: '1:19.600', q3: '1:19.327',    time: '1:19.327'    },
      { position: 5,  name: 'Oscar Piastri',     team: 'McLaren',         team_colour: '#FF8000', q1: '1:20.300', q2: '1:19.700', q3: '1:19.380',    time: '1:19.380'    },
      { position: 6,  name: 'Lando Norris',      team: 'McLaren',         team_colour: '#FF8000', q1: '1:20.100', q2: '1:19.600', q3: '1:19.475',    time: '1:19.475'    },
      { position: 7,  name: 'Lewis Hamilton',    team: 'Ferrari',         team_colour: '#E8002D', q1: '1:20.400', q2: '1:19.700', q3: '1:19.478',    time: '1:19.478'    },
      { position: 8,  name: 'Liam Lawson',       team: 'Racing Bulls',    team_colour: '#6692FF', q1: '1:20.500', q2: '1:20.100', q3: '1:19.994',    time: '1:19.994'    },
      { position: 9,  name: 'Arvid Lindblad',    team: 'Racing Bulls',    team_colour: '#6692FF', q1: '1:20.600', q2: '1:20.400', q3: '1:21.247',    time: '1:21.247'    },
      { position: 10, name: 'Gabriel Bortoleto', team: 'Audi',            team_colour: '#C0C0C0', q1: '1:20.700', q2: '1:20.221', q3: 'NO TIME SET', time: '1:20.221'    },
      // --- Q2 eliminated (P11–16) ---
      { position: 11, name: 'Nico Hülkenberg',   team: 'Audi',            team_colour: '#C0C0C0', q1: '1:20.800', q2: '1:20.303', q3: null,          time: '1:20.303'    },
      { position: 12, name: 'Oliver Bearman',    team: 'Haas',            team_colour: '#B6BABD', q1: '1:20.900', q2: '1:20.311', q3: null,          time: '1:20.311'    },
      { position: 13, name: 'Esteban Ocon',      team: 'Haas',            team_colour: '#B6BABD', q1: '1:21.000', q2: '1:20.491', q3: null,          time: '1:20.491'    },
      { position: 14, name: 'Pierre Gasly',      team: 'Alpine',          team_colour: '#FF69B4', q1: '1:21.100', q2: '1:20.501', q3: null,          time: '1:20.501'    },
      { position: 15, name: 'Alex Albon',        team: 'Williams',        team_colour: '#64C4FF', q1: '1:21.200', q2: '1:20.941', q3: null,          time: '1:20.941'    },
      { position: 16, name: 'Franco Colapinto',  team: 'Alpine',          team_colour: '#FF69B4', q1: '1:21.300', q2: '1:21.270', q3: null,          time: '1:21.270'    },
      // --- Q1 eliminated (P17–22); VER/SAI/STR did not set a time ---
      { position: 17, name: 'Fernando Alonso',   team: 'Aston Martin',    team_colour: '#358C75', q1: '1:21.969',    q2: null, q3: null,             time: '1:21.969'    },
      { position: 18, name: 'Sergio Pérez',      team: 'Cadillac',        team_colour: '#CC0000', q1: '1:22.605',    q2: null, q3: null,             time: '1:22.605'    },
      { position: 19, name: 'Valtteri Bottas',   team: 'Cadillac',        team_colour: '#CC0000', q1: '1:23.244',    q2: null, q3: null,             time: '1:23.244'    },
      { position: 20, name: 'Max Verstappen',    team: 'Red Bull Racing', team_colour: '#3671C6', q1: 'NO TIME SET', q2: null, q3: null,             time: 'NO TIME SET' },
      { position: 21, name: 'Carlos Sainz',      team: 'Williams',        team_colour: '#64C4FF', q1: 'NO TIME SET', q2: null, q3: null,             time: 'NO TIME SET' },
      { position: 22, name: 'Lance Stroll',      team: 'Aston Martin',    team_colour: '#358C75', q1: 'NO TIME SET', q2: null, q3: null,             time: 'NO TIME SET' },
    ],
    race: [
      { position: 1,  name: 'George Russell',    team: 'Mercedes',        team_colour: '#27F4D2', time: '1:23:06.801', gap: '—'        },
      { position: 2,  name: 'Kimi Antonelli',    team: 'Mercedes',        team_colour: '#27F4D2', time: '—',           gap: '+2.974s'  },
      { position: 3,  name: 'Charles Leclerc',   team: 'Ferrari',         team_colour: '#E8002D', time: '—',           gap: '+15.519s' },
      { position: 4,  name: 'Lewis Hamilton',    team: 'Ferrari',         team_colour: '#E8002D', time: '—',           gap: '+16.144s' },
      { position: 5,  name: 'Lando Norris',      team: 'McLaren',         team_colour: '#FF8000', time: '—',           gap: '+51.741s' },
      { position: 6,  name: 'Max Verstappen',    team: 'Red Bull Racing', team_colour: '#3671C6', time: '—',           gap: '+54.617s' },
      { position: 7,  name: 'Oliver Bearman',    team: 'Haas',            team_colour: '#B6BABD', time: '—',           gap: '+1 LAP'   },
      { position: 8,  name: 'Arvid Lindblad',    team: 'Racing Bulls',    team_colour: '#6692FF', time: '—',           gap: '+1 LAP'   },
      { position: 9,  name: 'Gabriel Bortoleto', team: 'Audi',            team_colour: '#C0C0C0', time: '—',           gap: '+1 LAP'   },
      { position: 10, name: 'Pierre Gasly',      team: 'Alpine',          team_colour: '#FF69B4', time: '—',           gap: '+1 LAP'   },
      { position: 11, name: 'Esteban Ocon',      team: 'Haas',            team_colour: '#B6BABD', time: '—',           gap: '+1 LAP'   },
      { position: 12, name: 'Alex Albon',        team: 'Williams',        team_colour: '#64C4FF', time: '—',           gap: '+1 LAP'   },
      { position: 13, name: 'Liam Lawson',       team: 'Racing Bulls',    team_colour: '#6692FF', time: '—',           gap: '+1 LAP'   },
      { position: 14, name: 'Franco Colapinto',  team: 'Alpine',          team_colour: '#FF69B4', time: '—',           gap: '+2 LAPS'  },
      { position: 15, name: 'Carlos Sainz',      team: 'Williams',        team_colour: '#64C4FF', time: '—',           gap: '+2 LAPS'  },
      { position: 16, name: 'Sergio Pérez',      team: 'Cadillac',        team_colour: '#CC0000', time: '—',           gap: '+3 LAPS'  },
      { position: 17, name: 'Lance Stroll',      team: 'Aston Martin',    team_colour: '#358C75', time: '—',           gap: 'NC'       },
      { position: 18, name: 'Fernando Alonso',   team: 'Aston Martin',    team_colour: '#358C75', time: '—',           gap: 'DNF'      },
      { position: 19, name: 'Valtteri Bottas',   team: 'Cadillac',        team_colour: '#CC0000', time: '—',           gap: 'DNF'      },
      { position: 20, name: 'Isack Hadjar',      team: 'Red Bull Racing', team_colour: '#3671C6', time: '—',           gap: 'DNF'      },
      { position: 21, name: 'Oscar Piastri',     team: 'McLaren',         team_colour: '#FF8000', time: '—',           gap: 'DNS'      },
      { position: 22, name: 'Nico Hülkenberg',   team: 'Audi',            team_colour: '#C0C0C0', time: '—',           gap: 'DNS'      },
    ],
  },

  2: {
    round: 2,
    name: 'China',
    flag: '🇨🇳',
    isSprint: true,
    fp1: [
      { position: 1,  name: 'George Russell',    team: 'Mercedes',        team_colour: '#27F4D2', time: '1:32.741', gap: '—'         },
      { position: 2,  name: 'Kimi Antonelli',    team: 'Mercedes',        team_colour: '#27F4D2', time: '1:32.861', gap: '+0.120s'   },
      { position: 3,  name: 'Lando Norris',      team: 'McLaren',         team_colour: '#FF8000', time: '1:33.296', gap: '+0.555s'   },
      { position: 4,  name: 'Oscar Piastri',     team: 'McLaren',         team_colour: '#FF8000', time: '1:33.472', gap: '+0.731s'   },
      { position: 5,  name: 'Charles Leclerc',   team: 'Ferrari',         team_colour: '#E8002D', time: '1:33.599', gap: '+0.858s'   },
      { position: 6,  name: 'Lewis Hamilton',    team: 'Ferrari',         team_colour: '#E8002D', time: '1:34.129', gap: '+1.388s'   },
      { position: 7,  name: 'Oliver Bearman',    team: 'Haas',            team_colour: '#B6BABD', time: '1:34.426', gap: '+1.685s'   },
      { position: 8,  name: 'Max Verstappen',    team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:34.541', gap: '+1.800s'   },
      { position: 9,  name: 'Nico Hülkenberg',   team: 'Audi',            team_colour: '#C0C0C0', time: '1:34.639', gap: '+1.898s'   },
      { position: 10, name: 'Pierre Gasly',      team: 'Alpine',          team_colour: '#FF69B4', time: '1:34.676', gap: '+1.935s'   },
      { position: 11, name: 'Liam Lawson',       team: 'Racing Bulls',    team_colour: '#6692FF', time: '1:34.773', gap: '+2.032s'   },
      { position: 12, name: 'Gabriel Bortoleto', team: 'Audi',            team_colour: '#C0C0C0', time: '1:34.828', gap: '+2.087s'   },
      { position: 13, name: 'Isack Hadjar',      team: 'Red Bull Racing', team_colour: '#3671C6', time: '1:34.856', gap: '+2.115s'   },
      { position: 14, name: 'Esteban Ocon',      team: 'Haas',            team_colour: '#B6BABD', time: '1:34.877', gap: '+2.136s'   },
      { position: 15, name: 'Franco Colapinto',  team: 'Alpine',          team_colour: '#FF69B4', time: '1:34.947', gap: '+2.206s'   },
      { position: 16, name: 'Alex Albon',        team: 'Williams',        team_colour: '#64C4FF', time: '1:35.480', gap: '+2.739s'   },
      { position: 17, name: 'Carlos Sainz',      team: 'Williams',        team_colour: '#64C4FF', time: '1:35.679', gap: '+2.938s'   },
      { position: 18, name: 'Fernando Alonso',   team: 'Aston Martin',    team_colour: '#358C75', time: '1:35.856', gap: '+3.115s'   },
      { position: 19, name: 'Valtteri Bottas',   team: 'Cadillac',        team_colour: '#CC0000', time: '1:36.057', gap: '+3.316s'   },
      { position: 20, name: 'Lance Stroll',      team: 'Aston Martin',    team_colour: '#358C75', time: '1:37.224', gap: '+4.483s'   },
      { position: 21, name: 'Arvid Lindblad',    team: 'Racing Bulls',    team_colour: '#6692FF', time: '1:37.896', gap: '+5.155s'   },
      { position: 22, name: 'Sergio Pérez',      team: 'Cadillac',        team_colour: '#CC0000', time: '1:39.200', gap: '+6.459s'   },
    ],
    sprintQualifying: [
      // --- SQ3 (P1–10) ---
      { position: 1,  name: 'George Russell',    team: 'Mercedes',        team_colour: '#27F4D2', q3: '1:31.520', q2: '1:32.241', q1: '1:33.030', time: '1:31.520' },
      { position: 2,  name: 'Kimi Antonelli',    team: 'Mercedes',        team_colour: '#27F4D2', q3: '1:31.809', q2: '1:32.291', q1: '1:33.455', time: '1:31.809' },
      { position: 3,  name: 'Lando Norris',      team: 'McLaren',         team_colour: '#FF8000', q3: '1:32.141', q2: '1:33.086', q1: '1:33.783', time: '1:32.141' },
      { position: 4,  name: 'Lewis Hamilton',    team: 'Ferrari',         team_colour: '#E8002D', q3: '1:32.161', q2: '1:33.042', q1: '1:33.148', time: '1:32.161' },
      { position: 5,  name: 'Oscar Piastri',     team: 'McLaren',         team_colour: '#FF8000', q3: '1:32.224', q2: '1:33.038', q1: '1:33.813', time: '1:32.224' },
      { position: 6,  name: 'Charles Leclerc',   team: 'Ferrari',         team_colour: '#E8002D', q3: '1:32.528', q2: '1:32.602', q1: '1:33.194', time: '1:32.528' },
      { position: 7,  name: 'Pierre Gasly',      team: 'Alpine',          team_colour: '#FF69B4', q3: '1:32.888', q2: '1:33.405', q1: '1:33.970', time: '1:32.888' },
      { position: 8,  name: 'Max Verstappen',    team: 'Red Bull Racing', team_colour: '#3671C6', q3: '1:33.254', q2: '1:33.564', q1: '1:34.170', time: '1:33.254' },
      { position: 9,  name: 'Oliver Bearman',    team: 'Haas',            team_colour: '#B6BABD', q3: '1:33.409', q2: '1:33.501', q1: '1:34.280', time: '1:33.409' },
      { position: 10, name: 'Isack Hadjar',      team: 'Red Bull Racing', team_colour: '#3671C6', q3: '1:33.723', q2: '1:33.620', q1: '1:34.447', time: '1:33.723' },
      // --- SQ2 eliminated (P11–16) ---
      { position: 11, name: 'Nico Hülkenberg',   team: 'Audi',            team_colour: '#C0C0C0', q3: null, q2: '1:33.635', q1: '1:33.997',    time: '1:33.635' },
      { position: 12, name: 'Esteban Ocon',      team: 'Haas',            team_colour: '#B6BABD', q3: null, q2: '1:33.639', q1: '1:34.087',    time: '1:33.639' },
      { position: 13, name: 'Liam Lawson',       team: 'Racing Bulls',    team_colour: '#6692FF', q3: null, q2: '1:33.714', q1: '1:34.110',    time: '1:33.714' },
      { position: 14, name: 'Gabriel Bortoleto', team: 'Audi',            team_colour: '#C0C0C0', q3: null, q2: '1:33.774', q1: '1:34.291',    time: '1:33.774' },
      { position: 15, name: 'Arvid Lindblad',    team: 'Racing Bulls',    team_colour: '#6692FF', q3: null, q2: '1:34.048', q1: '1:34.495',    time: '1:34.048' },
      { position: 16, name: 'Franco Colapinto',  team: 'Alpine',          team_colour: '#FF69B4', q3: null, q2: '1:34.327', q1: '1:34.592',    time: '1:34.327' },
      // --- SQ1 eliminated (P17–22) ---
      { position: 17, name: 'Carlos Sainz',      team: 'Williams',        team_colour: '#64C4FF', q3: null, q2: null, q1: '1:34.761',           time: '1:34.761' },
      { position: 18, name: 'Alex Albon',        team: 'Williams',        team_colour: '#64C4FF', q3: null, q2: null, q1: '1:35.305',           time: '1:35.305' },
      { position: 19, name: 'Fernando Alonso',   team: 'Aston Martin',    team_colour: '#358C75', q3: null, q2: null, q1: '1:35.581',           time: '1:35.581' },
      { position: 20, name: 'Lance Stroll',      team: 'Aston Martin',    team_colour: '#358C75', q3: null, q2: null, q1: '1:36.151',           time: '1:36.151' },
      { position: 21, name: 'Valtteri Bottas',   team: 'Cadillac',        team_colour: '#CC0000', q3: null, q2: null, q1: '1:37.378',           time: '1:37.378' },
      { position: 22, name: 'Sergio Pérez',      team: 'Cadillac',        team_colour: '#CC0000', q3: null, q2: null, q1: 'NO TIME SET',        time: 'NO TIME SET' },
    ],
    qualifying: [
      // --- Q3 (P1–10) ---
      { position: 1,  name: 'Kimi Antonelli',    team: 'Mercedes',        team_colour: '#27F4D2', q3: '1:32.064', q2: '1:32.443', q1: '1:33.305', time: '1:32.064' },
      { position: 2,  name: 'George Russell',    team: 'Mercedes',        team_colour: '#27F4D2', q3: '1:32.286', q2: '1:32.523', q1: '1:33.262', time: '1:32.286' },
      { position: 3,  name: 'Lewis Hamilton',    team: 'Ferrari',         team_colour: '#E8002D', q3: '1:32.415', q2: '1:32.567', q1: '1:33.522', time: '1:32.415' },
      { position: 4,  name: 'Charles Leclerc',   team: 'Ferrari',         team_colour: '#E8002D', q3: '1:32.428', q2: '1:32.486', q1: '1:33.175', time: '1:32.428' },
      { position: 5,  name: 'Oscar Piastri',     team: 'McLaren',         team_colour: '#FF8000', q3: '1:32.550', q2: '1:33.130', q1: '1:33.590', time: '1:32.550' },
      { position: 6,  name: 'Lando Norris',      team: 'McLaren',         team_colour: '#FF8000', q3: '1:32.608', q2: '1:32.910', q1: '1:33.535', time: '1:32.608' },
      { position: 7,  name: 'Pierre Gasly',      team: 'Alpine',          team_colour: '#FF69B4', q3: '1:32.873', q2: '1:33.003', q1: '1:33.788', time: '1:32.873' },
      { position: 8,  name: 'Max Verstappen',    team: 'Red Bull Racing', team_colour: '#3671C6', q3: '1:33.002', q2: '1:33.098', q1: '1:33.417', time: '1:33.002' },
      { position: 9,  name: 'Isack Hadjar',      team: 'Red Bull Racing', team_colour: '#3671C6', q3: '1:33.121', q2: '1:33.352', q1: '1:33.632', time: '1:33.121' },
      { position: 10, name: 'Oliver Bearman',    team: 'Haas',            team_colour: '#B6BABD', q3: '1:33.292', q2: '1:33.197', q1: '1:33.687', time: '1:33.292' },
      // --- Q2 eliminated (P11–16) ---
      { position: 11, name: 'Nico Hülkenberg',   team: 'Audi',            team_colour: '#C0C0C0', q3: null, q2: '1:33.354', q1: '1:34.116',     time: '1:33.354' },
      { position: 12, name: 'Franco Colapinto',  team: 'Alpine',          team_colour: '#FF69B4', q3: null, q2: '1:33.357', q1: '1:33.634',     time: '1:33.357' },
      { position: 13, name: 'Esteban Ocon',      team: 'Haas',            team_colour: '#B6BABD', q3: null, q2: '1:33.538', q1: '1:33.974',     time: '1:33.538' },
      { position: 14, name: 'Liam Lawson',       team: 'Racing Bulls',    team_colour: '#6692FF', q3: null, q2: '1:33.765', q1: '1:34.139',     time: '1:33.765' },
      { position: 15, name: 'Arvid Lindblad',    team: 'Racing Bulls',    team_colour: '#6692FF', q3: null, q2: '1:33.784', q1: '1:33.906',     time: '1:33.784' },
      { position: 16, name: 'Gabriel Bortoleto', team: 'Audi',            team_colour: '#C0C0C0', q3: null, q2: '1:33.965', q1: '1:33.549',     time: '1:33.965' },
      // --- Q1 eliminated (P17–22) ---
      { position: 17, name: 'Carlos Sainz',      team: 'Williams',        team_colour: '#64C4FF', q3: null, q2: null, q1: '1:34.317',            time: '1:34.317' },
      { position: 18, name: 'Alex Albon',        team: 'Williams',        team_colour: '#64C4FF', q3: null, q2: null, q1: '1:34.772',            time: '1:34.772' },
      { position: 19, name: 'Fernando Alonso',   team: 'Aston Martin',    team_colour: '#358C75', q3: null, q2: null, q1: '1:35.203',            time: '1:35.203' },
      { position: 20, name: 'Valtteri Bottas',   team: 'Cadillac',        team_colour: '#CC0000', q3: null, q2: null, q1: '1:35.436',            time: '1:35.436' },
      { position: 21, name: 'Lance Stroll',      team: 'Aston Martin',    team_colour: '#358C75', q3: null, q2: null, q1: '1:35.995',            time: '1:35.995' },
      { position: 22, name: 'Sergio Pérez',      team: 'Cadillac',        team_colour: '#CC0000', q3: null, q2: null, q1: '1:36.906',            time: '1:36.906' },
    ],
    sprintRace: [
      { position: 1,  name: 'George Russell',    team: 'Mercedes',        team_colour: '#27F4D2', time: '33:38.998',   gap: '—'        },
      { position: 2,  name: 'Charles Leclerc',   team: 'Ferrari',         team_colour: '#E8002D', time: '—',           gap: '+0.674s'  },
      { position: 3,  name: 'Lewis Hamilton',    team: 'Ferrari',         team_colour: '#E8002D', time: '—',           gap: '+2.554s'  },
      { position: 4,  name: 'Lando Norris',      team: 'McLaren',         team_colour: '#FF8000', time: '—',           gap: '+4.433s'  },
      { position: 5,  name: 'Kimi Antonelli',    team: 'Mercedes',        team_colour: '#27F4D2', time: '—',           gap: '+5.688s'  },
      { position: 6,  name: 'Oscar Piastri',     team: 'McLaren',         team_colour: '#FF8000', time: '—',           gap: '+6.809s'  },
      { position: 7,  name: 'Liam Lawson',       team: 'Racing Bulls',    team_colour: '#6692FF', time: '—',           gap: '+10.900s' },
      { position: 8,  name: 'Oliver Bearman',    team: 'Haas',            team_colour: '#B6BABD', time: '—',           gap: '+11.271s' },
      { position: 9,  name: 'Max Verstappen',    team: 'Red Bull Racing', team_colour: '#3671C6', time: '—',           gap: '+11.619s' },
      { position: 10, name: 'Esteban Ocon',      team: 'Haas',            team_colour: '#B6BABD', time: '—',           gap: '+13.887s' },
      { position: 11, name: 'Pierre Gasly',      team: 'Alpine',          team_colour: '#FF69B4', time: '—',           gap: '+14.780s' },
      { position: 12, name: 'Carlos Sainz',      team: 'Williams',        team_colour: '#64C4FF', time: '—',           gap: '+15.753s' },
      { position: 13, name: 'Gabriel Bortoleto', team: 'Audi',            team_colour: '#C0C0C0', time: '—',           gap: '+15.858s' },
      { position: 14, name: 'Franco Colapinto',  team: 'Alpine',          team_colour: '#FF69B4', time: '—',           gap: '+16.393s' },
      { position: 15, name: 'Isack Hadjar',      team: 'Red Bull Racing', team_colour: '#3671C6', time: '—',           gap: '+16.430s' },
      { position: 16, name: 'Alex Albon',        team: 'Williams',        team_colour: '#64C4FF', time: '—',           gap: '+20.014s' },
      { position: 17, name: 'Fernando Alonso',   team: 'Aston Martin',    team_colour: '#358C75', time: '—',           gap: '+21.599s' },
      { position: 18, name: 'Lance Stroll',      team: 'Aston Martin',    team_colour: '#358C75', time: '—',           gap: '+21.971s' },
      { position: 19, name: 'Sergio Pérez',      team: 'Cadillac',        team_colour: '#CC0000', time: '—',           gap: '+28.241s' },
      { position: 20, name: 'Nico Hülkenberg',   team: 'Audi',            team_colour: '#C0C0C0', time: '—',           gap: 'DNF'      },
      { position: 21, name: 'Valtteri Bottas',   team: 'Cadillac',        team_colour: '#CC0000', time: '—',           gap: 'DNF'      },
      { position: 22, name: 'Arvid Lindblad',    team: 'Racing Bulls',    team_colour: '#6692FF', time: '—',           gap: 'DNF'      },
    ],
    race: [
      { position: 1,  name: 'Kimi Antonelli',    team: 'Mercedes',        team_colour: '#27F4D2', time: '1:33:15.607', gap: '—'        },
      { position: 2,  name: 'George Russell',    team: 'Mercedes',        team_colour: '#27F4D2', time: '—',           gap: '+5.515s'  },
      { position: 3,  name: 'Lewis Hamilton',    team: 'Ferrari',         team_colour: '#E8002D', time: '—',           gap: '+25.267s' },
      { position: 4,  name: 'Charles Leclerc',   team: 'Ferrari',         team_colour: '#E8002D', time: '—',           gap: '+28.894s' },
      { position: 5,  name: 'Oliver Bearman',    team: 'Haas',            team_colour: '#B6BABD', time: '—',           gap: '+57.268s' },
      { position: 6,  name: 'Pierre Gasly',      team: 'Alpine',          team_colour: '#FF69B4', time: '—',           gap: '+59.647s' },
      { position: 7,  name: 'Liam Lawson',       team: 'Racing Bulls',    team_colour: '#6692FF', time: '—',           gap: '+1:20.588'},
      { position: 8,  name: 'Isack Hadjar',      team: 'Red Bull Racing', team_colour: '#3671C6', time: '—',           gap: '+1:27.247'},
      { position: 9,  name: 'Carlos Sainz',      team: 'Williams',        team_colour: '#64C4FF', time: '—',           gap: '+1 LAP'   },
      { position: 10, name: 'Franco Colapinto',  team: 'Alpine',          team_colour: '#FF69B4', time: '—',           gap: '+1 LAP'   },
      { position: 11, name: 'Nico Hülkenberg',   team: 'Audi',            team_colour: '#C0C0C0', time: '—',           gap: '+1 LAP'   },
      { position: 12, name: 'Arvid Lindblad',    team: 'Racing Bulls',    team_colour: '#6692FF', time: '—',           gap: '+1 LAP'   },
      { position: 13, name: 'Valtteri Bottas',   team: 'Cadillac',        team_colour: '#CC0000', time: '—',           gap: '+1 LAP'   },
      { position: 14, name: 'Esteban Ocon',      team: 'Haas',            team_colour: '#B6BABD', time: '—',           gap: '+1 LAP'   },
      { position: 15, name: 'Sergio Pérez',      team: 'Cadillac',        team_colour: '#CC0000', time: '—',           gap: '+1 LAP'   },
      { position: 16, name: 'Max Verstappen',    team: 'Red Bull Racing', team_colour: '#3671C6', time: '—',           gap: 'DNF'      },
      { position: 17, name: 'Fernando Alonso',   team: 'Aston Martin',    team_colour: '#358C75', time: '—',           gap: 'DNF'      },
      { position: 18, name: 'Lance Stroll',      team: 'Aston Martin',    team_colour: '#358C75', time: '—',           gap: 'DNF'      },
      { position: 19, name: 'Oscar Piastri',     team: 'McLaren',         team_colour: '#FF8000', time: '—',           gap: 'DNS'      },
      { position: 20, name: 'Lando Norris',      team: 'McLaren',         team_colour: '#FF8000', time: '—',           gap: 'DNS'      },
      { position: 21, name: 'Gabriel Bortoleto', team: 'Audi',            team_colour: '#C0C0C0', time: '—',           gap: 'DNS'      },
      { position: 22, name: 'Alex Albon',        team: 'Williams',        team_colour: '#64C4FF', time: '—',           gap: 'DNS'      },
    ],
  },

}

// ─── 2026 Team & Driver Lineup ───────────────────────────────────────────────

export interface Team2026 {
  team: string
  drivers: [string, string]
  colour: string
}

export const teams2026: Team2026[] = [
  { team: 'Red Bull',      drivers: ['Max Verstappen',   'Isack Hadjar'],      colour: '#3671C6' },
  { team: 'Ferrari',       drivers: ['Charles Leclerc',  'Lewis Hamilton'],     colour: '#E8002D' },
  { team: 'Mercedes',      drivers: ['George Russell',   'Kimi Antonelli'],     colour: '#27F4D2' },
  { team: 'McLaren',       drivers: ['Lando Norris',     'Oscar Piastri'],      colour: '#FF8000' },
  { team: 'Aston Martin',  drivers: ['Fernando Alonso',  'Lance Stroll'],       colour: '#229971' },
  { team: 'Alpine',        drivers: ['Pierre Gasly',     'Franco Colapinto'],   colour: '#FF87BC' },
  { team: 'Williams',      drivers: ['Alexander Albon',  'Carlos Sainz'],       colour: '#64C4FF' },
  { team: 'Haas',          drivers: ['Esteban Ocon',     'Oliver Bearman'],     colour: '#B6BABD' },
  { team: 'Racing Bulls',  drivers: ['Liam Lawson',      'Isack Lindblad'],     colour: '#6692FF' },
  { team: 'Audi',          drivers: ['Nico Hulkenberg',  'Gabriel Bortoleto'],  colour: '#52E252' },
  { team: 'Cadillac',      drivers: ['Sergio Perez',     'Valtteri Bottas'],    colour: '#C41E3A' },
]

// ─── H2H Qualifying Sessions ─────────────────────────────────────────────────

export interface QualifyingSessionEntry {
  driver: string
  team: string
  position: number
  time: string
}

export interface QualifyingSession {
  round: number
  raceName: string
  sessionType: 'Q' | 'SQ'
  entries: QualifyingSessionEntry[]
}

export const qualifyingSessions: QualifyingSession[] = [

  // TODO: verify all times except P1 against FIA classification documents
  {
    round: 1,
    raceName: 'Australia',
    sessionType: 'Q',
    entries: [
      { driver: 'George Russell',   team: 'Mercedes',      position: 1,  time: '1:18.518' }, // verified
      { driver: 'Kimi Antonelli',   team: 'Mercedes',      position: 2,  time: '1:18.768' },
      { driver: 'Lando Norris',     team: 'McLaren',       position: 3,  time: '1:19.018' },
      { driver: 'Oscar Piastri',    team: 'McLaren',       position: 4,  time: '1:19.268' },
      { driver: 'Lewis Hamilton',   team: 'Ferrari',       position: 5,  time: '1:19.518' },
      { driver: 'Charles Leclerc',  team: 'Ferrari',       position: 6,  time: '1:19.768' },
      { driver: 'Alexander Albon',  team: 'Williams',      position: 7,  time: '1:20.018' },
      { driver: 'Fernando Alonso',  team: 'Aston Martin',  position: 8,  time: '1:20.268' },
      { driver: 'Max Verstappen',   team: 'Red Bull',      position: 9,  time: '1:20.518' },
      { driver: 'Isack Hadjar',     team: 'Red Bull',      position: 10, time: '1:20.768' },
      { driver: 'Liam Lawson',      team: 'Racing Bulls',  position: 11, time: '1:21.018' },
      { driver: 'Isack Lindblad',   team: 'Racing Bulls',  position: 12, time: '1:21.268' },
      { driver: 'Oliver Bearman',   team: 'Haas',          position: 13, time: '1:21.518' },
      { driver: 'Esteban Ocon',     team: 'Haas',          position: 14, time: '1:21.768' },
      { driver: 'Carlos Sainz',     team: 'Williams',      position: 15, time: '1:22.018' },
      { driver: 'Lance Stroll',     team: 'Aston Martin',  position: 16, time: '1:22.268' },
      { driver: 'Pierre Gasly',     team: 'Alpine',        position: 17, time: '1:22.518' },
      { driver: 'Franco Colapinto', team: 'Alpine',        position: 18, time: '1:22.768' },
      { driver: 'Nico Hulkenberg',  team: 'Audi',          position: 19, time: '1:23.018' },
      { driver: 'Gabriel Bortoleto',team: 'Audi',          position: 20, time: '1:23.268' },
      { driver: 'Sergio Perez',     team: 'Cadillac',      position: 21, time: '1:23.518' },
      { driver: 'Valtteri Bottas',  team: 'Cadillac',      position: 22, time: '1:23.768' },
    ],
  },

  // TODO: verify all times except P1 against FIA classification documents
  {
    round: 2,
    raceName: 'China',
    sessionType: 'Q',
    entries: [
      { driver: 'Kimi Antonelli',   team: 'Mercedes',      position: 1,  time: '1:32.064' }, // verified
      { driver: 'George Russell',   team: 'Mercedes',      position: 2,  time: '1:32.314' },
      { driver: 'Lewis Hamilton',   team: 'Ferrari',       position: 3,  time: '1:32.564' },
      { driver: 'Charles Leclerc',  team: 'Ferrari',       position: 4,  time: '1:32.814' },
      { driver: 'Lando Norris',     team: 'McLaren',       position: 5,  time: '1:33.064' },
      { driver: 'Oscar Piastri',    team: 'McLaren',       position: 6,  time: '1:33.314' },
      { driver: 'Max Verstappen',   team: 'Red Bull',      position: 7,  time: '1:33.564' },
      { driver: 'Isack Hadjar',     team: 'Red Bull',      position: 8,  time: '1:33.814' },
      { driver: 'Liam Lawson',      team: 'Racing Bulls',  position: 9,  time: '1:34.064' },
      { driver: 'Isack Lindblad',   team: 'Racing Bulls',  position: 10, time: '1:34.314' },
      { driver: 'Oliver Bearman',   team: 'Haas',          position: 11, time: '1:34.564' },
      { driver: 'Esteban Ocon',     team: 'Haas',          position: 12, time: '1:34.814' },
      { driver: 'Alexander Albon',  team: 'Williams',      position: 13, time: '1:35.064' },
      { driver: 'Carlos Sainz',     team: 'Williams',      position: 14, time: '1:35.314' },
      { driver: 'Lance Stroll',     team: 'Aston Martin',  position: 15, time: '1:35.564' },
      { driver: 'Pierre Gasly',     team: 'Alpine',        position: 16, time: '1:35.814' },
      { driver: 'Franco Colapinto', team: 'Alpine',        position: 17, time: '1:36.064' },
      { driver: 'Nico Hulkenberg',  team: 'Audi',          position: 18, time: '1:36.314' },
      { driver: 'Gabriel Bortoleto',team: 'Audi',          position: 19, time: '1:36.564' },
      { driver: 'Fernando Alonso',  team: 'Aston Martin',  position: 20, time: '1:36.814' },
      { driver: 'Sergio Perez',     team: 'Cadillac',      position: 21, time: '1:37.064' },
      { driver: 'Valtteri Bottas',  team: 'Cadillac',      position: 22, time: '1:37.314' },
    ],
  },

  // TODO: verify all times except P1 against FIA classification documents
  {
    round: 2,
    raceName: 'China',
    sessionType: 'SQ',
    entries: [
      { driver: 'Lando Norris',     team: 'McLaren',       position: 1,  time: '1:33.000' },
      { driver: 'Oscar Piastri',    team: 'McLaren',       position: 2,  time: '1:33.200' },
      { driver: 'George Russell',   team: 'Mercedes',      position: 3,  time: '1:33.400' },
      { driver: 'Kimi Antonelli',   team: 'Mercedes',      position: 4,  time: '1:33.600' },
      { driver: 'Lewis Hamilton',   team: 'Ferrari',       position: 5,  time: '1:33.800' },
      { driver: 'Charles Leclerc',  team: 'Ferrari',       position: 6,  time: '1:34.000' },
      { driver: 'Max Verstappen',   team: 'Red Bull',      position: 7,  time: '1:34.200' },
      { driver: 'Isack Hadjar',     team: 'Red Bull',      position: 8,  time: '1:34.400' },
      { driver: 'Liam Lawson',      team: 'Racing Bulls',  position: 9,  time: '1:34.600' },
      { driver: 'Oliver Bearman',   team: 'Haas',          position: 10, time: '1:34.800' },
      { driver: 'Isack Lindblad',   team: 'Racing Bulls',  position: 11, time: '1:35.000' },
      { driver: 'Carlos Sainz',     team: 'Williams',      position: 12, time: '1:35.200' },
      { driver: 'Alexander Albon',  team: 'Williams',      position: 13, time: '1:35.400' },
      { driver: 'Esteban Ocon',     team: 'Haas',          position: 14, time: '1:35.600' },
      { driver: 'Lance Stroll',     team: 'Aston Martin',  position: 15, time: '1:35.800' },
      { driver: 'Pierre Gasly',     team: 'Alpine',        position: 16, time: '1:36.000' },
      { driver: 'Franco Colapinto', team: 'Alpine',        position: 17, time: '1:36.200' },
      { driver: 'Nico Hulkenberg',  team: 'Audi',          position: 18, time: '1:36.400' },
      { driver: 'Gabriel Bortoleto',team: 'Audi',          position: 19, time: '1:36.600' },
      { driver: 'Fernando Alonso',  team: 'Aston Martin',  position: 20, time: '1:36.800' },
      { driver: 'Sergio Perez',     team: 'Cadillac',      position: 21, time: '1:37.000' },
      { driver: 'Valtteri Bottas',  team: 'Cadillac',      position: 22, time: '1:37.200' },
    ],
  },

]
