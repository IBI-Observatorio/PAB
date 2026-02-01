const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvPath = path.join(__dirname, 'temp', 'votacao_candidato_munzona_2022_SP.csv');

let found = [];
fs.createReadStream(csvPath, { encoding: 'latin1' })
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    if (row['SG_UF'] !== 'SP') return;
    if (row['CD_CARGO'] !== '6') return;
    const nomeUrna = row['NM_URNA_CANDIDATO'] || '';
    if (nomeUrna.includes('PAULO ALEXANDRE')) {
      if (!found.includes(nomeUrna)) {
        found.push(nomeUrna);
        console.log('Nome:', nomeUrna, '| Numero:', row['NR_CANDIDATO'], '| Partido:', row['SG_PARTIDO']);
      }
    }
  })
  .on('end', () => {
    console.log('\nTotal encontrados:', found.length);
  });
