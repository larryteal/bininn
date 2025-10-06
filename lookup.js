const SHEET_ID = '1mYBY21oYceNRbTn-_V_beeLyOpWc0_zDbaALs7DQfI4';
const SHEET_NAME = 'Sheet1';
const BIN_TO_FIND = '462845';

async function lookup(bin) {
  // headers=1，Use the first row as column names
  const query = encodeURIComponent(`select * where A = '${bin}'`);
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tq=${query}&sheet=${SHEET_NAME}&headers=1`;

  const res = await fetch(url);
  const text = await res.text();
  // /*O_o*/
  // google.visualization.Query.setResponse({"version":"0.6","reqId":"0","status":"ok","sig":"281484947","table":{"cols":[{"id":"A","label":"BIN","type":"string"},{"id":"B","label":"Brand","type":"string"},{"id":"C","label":"Type","type":"string"},{"id":"D","label":"Category","type":"string"},{"id":"E","label":"Issuer","type":"string"},{"id":"F","label":"IssuerPhone","type":"string"},{"id":"G","label":"IssuerUrl","type":"string"},{"id":"H","label":"isoCode2","type":"string"},{"id":"I","label":"isoCode3","type":"string"},{"id":"J","label":"CountryName","type":"string"}],"rows":[{"c":[{"v":"462845"},{"v":"VISA"},{"v":"DEBIT"},{"v":"PLATINUM"},{"v":"DBS BANK, LTD."},{"v":"+6518001111111"},{"v":"https://www.dbs.com.sg"},{"v":"SG"},{"v":"SGP"},{"v":"SINGAPORE"}]}],"parsedNumHeaders":1}});

  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/);
  if (!match) throw new Error('Decode Error');

  const data = JSON.parse(match[1]);
  const headers = data.table.cols.map(c => c.label);
  const row = data.table.rows[0]?.c.map(cell => cell?.v || '');
  if (!row) return null;
  
  return Object.fromEntries(headers.map((h, i) => [h, row[i]]));

}

// Use Case
(async () => {
  const x = await lookup(BIN_TO_FIND)
  console.log(x)
  // {
  //   BIN: '462845',
  //   Brand: 'VISA',
  //   Type: 'DEBIT',
  //   Category: 'PLATINUM',
  //   Issuer: 'DBS BANK, LTD.',
  //   IssuerPhone: '+6518001111111',
  //   IssuerUrl: 'https://www.dbs.com.sg',
  //   isoCode2: 'SG',
  //   isoCode3: 'SGP',
  //   CountryName: 'SINGAPORE'
  // }
})();
