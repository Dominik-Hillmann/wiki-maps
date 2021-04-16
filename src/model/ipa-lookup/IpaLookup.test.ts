

// // decode wanted words directly from websites and test whether they are equal

// this.agent.get(this.constructRequestUrl('Cola')).then(res => {
//     // console.log('DATA', typeof res.data, res.data);
//     // console.log();
//     // console.log('STATUS', res.status);
//     // console.log();
//     // console.log('STATUS_TEXT', res.statusText);
//     // console.log();
//     // console.log('HEADERS', res.headers);
//     console.log();
//     const s: string[] =  this.extractPhonetics(res.data);
//     console.log('Cola', s);
//     s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
// }).catch(err => {
//     console.log(err)
// });

// this.agent.get(this.constructRequestUrl('Linux')).then(res => {
//     // console.log('DATA', typeof res.data, res.data);
//     // console.log();
//     // console.log('STATUS', res.status);
//     // console.log();
//     // console.log('STATUS_TEXT', res.statusText);
//     console.log();
//     const s: string[] =  this.extractPhonetics(res.data);
//     console.log('Linux', s);
//     s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
// }).catch(err => {
//     console.log(err)
// });

// this.agent.get(this.constructRequestUrl('Berlin')).then(res => {
//     // console.log('DATA', typeof res.data, res.data);
//     // console.log();
//     // console.log('STATUS', res.status);
//     // console.log();
//     // console.log('STATUS_TEXT', res.statusText);
//     const s: string[] =  this.extractPhonetics(res.data);
//     console.log('Berlin', s);
//     s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
// }).catch(err => {
//     console.log(err)
// });

// this.agent.get(this.constructRequestUrl('BABABADIBABIDIBU')).then(res => {
//     // console.log('DATA', typeof res.data, res.data);
//     // console.log();
//     // console.log('STATUS', res.status);
//     // console.log();
//     // console.log('STATUS_TEXT', res.statusText);
//     console.log();
//     const s: string[] =  this.extractPhonetics(res.data);
//     console.log('BABABADIBABIDIBU', s);
//     s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
// }).catch(err => {
//     console.log(err)
// });

// this.agent.get(this.constructRequestUrl('London')).then(res => {
//     // console.log('DATA', typeof res.data, res.data);
//     // console.log();
//     // console.log('STATUS', res.status);
//     // console.log();
//     // console.log('STATUS_TEXT', res.statusText);
//     console.log();
//     const s: string[] =  this.extractPhonetics(res.data);
//     console.log('London', s);
//     s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
// }).catch(err => {
//     console.log(err)
// });

// this.agent.get(this.constructRequestUrl('pagoda')).then(res => {
//     // console.log('DATA', typeof res.data, res.data);
//     // console.log();
//     // console.log('STATUS', res.status);
//     // console.log();
//     // console.log('STATUS_TEXT', res.statusText);
//     console.log();
//     const s: string[] =  this.extractPhonetics(res.data);
//     console.log('pagoda', s);
//     s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
// }).catch(err => {
//     console.log(err)
// });