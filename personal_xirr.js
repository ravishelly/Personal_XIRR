var func = async () => {
  // fetch momentjs
  let m = await fetch('https://momentjs.com/downloads/moment.min.js');
  m = await m.text();
  eval(m);

  let x = await fetch('https://gist.githubusercontent.com/ghalimi/4669712/raw/abce70ae085143d96c0662c45f855eeb89fb7052/XIRR.js');
  x = await x.text();
  eval(x);

  let t = document.cookie.split(';').filter(c => c.includes('public'))[0].split('=')[1];
  let res = await fetch("https://console.zerodha.com/api/dashboard/account_values", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9,hi;q=0.8",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "x-csrftoken": t
    },
    "referrer": "https://console.zerodha.com/",
    "referrerPolicy": "origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });

  res = await res.json();
  let payin = 0, payout = 0, curr = 0, currDate = moment("2010-01-01","YYYY-MM-DD"), payments = [], dates = [];
  for(let i in res.data.result.EQ){
    let dt = moment(i,"YYYY-MM-DD");
    if(res.data.result.EQ[i].payin) {
      payin += res.data.result.EQ[i].payin;
      payments.push(-res.data.result.EQ[i].payin);
      dates.push(dt);
    }
    if(res.data.result.EQ[i].payout){
      payout += res.data.result.EQ[i].payout;
      payments.push(res.data.result.EQ[i].payout);
      dates.push(dt);
    }
    if(dt > currDate){
      curr = res.data.result.EQ[i].eq_holdings_value;
      currDate = dt;
    }
  };
  payments.push(curr);
  dates.push(currDate);

  let xirr = XIRR(payments, dates)*100;
  alert('Total Payin = ' + payin + '\nTotal Payout = ' + payout + '\nXIRR = ' + xirr);
  
  }
