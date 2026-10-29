import {create} from 'zustand';
import {persist} from 'zustand/middleware';
export type AppId='terminal'|'files'|'messages'|'browser'|'tasks'|'neural'|'memories'|'network'|'music'|'arcade'|'settings'|'trash'|'admin';
export const apps: {id:AppId;name:string;icon:string}[]=[['terminal','Terminal','>_'],['files','Files','▤'],['messages','Messages','✉'],['browser','Night Browser','◎'],['tasks','Task Manager','▥'],['neural','Neural Link','✦'],['memories','Memory Archive','◈'],['network','Network','◇'],['music','Night FM','♫'],['arcade','Arcade','▦'],['settings','Settings','⚙'],['trash','Trash','⌫']].map(([id,name,icon])=>({id:id as AppId,name,icon}));
export const memories=[
 ['01','2077.06.14 / ROOFTOP','Maya laughed when the city went dark. We promised to remember that sound.'],
 ['02','2077.07.02 / NIGHT LAB','Voss said a copy would only be a map. He would not look me in the eye.'],
 ['03','2077.08.19 / TRANSFER','I signed the consent form. Maya wrote: if you wake up, find me.'],
 ['04','2077.08.20 / CHAMBER','The machine counted down. Someone else whispered the numbers with it.'],
 ['05','2077.08.21 / ECHO','ECHO learned my voice before I remembered my name.'],
 ['06','2078.01.04 / OBSERVER','The observer is a safety copy of me. It was made to watch the first copy.'],
 ['07','2094.11.07 / PRESENT','Seventeen years passed outside. The room is gone. I am still here.']
];
export const files:Record<string,{text:string;need?:number}>={
 '/users/alex-07/notes.txt':{text:'Maya: If you ever read this, do not trust the system.\nLook for the incident log.'},
 '/system/logs/incident_2077.log':{text:'TRANSFER COMPLETE. Biological status: UNKNOWN.\nArchive /archive/MEMORY_01.dat mounted.\nMissing page: archive-zero.net/echo',need:1},
 '/system/classified/echo.txt':{text:'PROJECT ECHO stores a digital consciousness. Subject ALEX-07 is the active instance. Observer is the fallback instance.',need:4},
 '/archive/MEMORY_01.dat':{text:'The rooftop. The city blinked out. Maya said: remember this.',need:1},
 '/archive/MEMORY_03.dat':{text:'CORRUPTED. Run decrypt MEMORY_03 after restoring three memories.',need:2},
 '/users/observer/message.txt':{text:'I waited seventeen years for you to remember us.',need:3},
 '/home/projects/echo-readme.txt':{text:'ECHO-0717. The code is hidden in an arcade executable.',need:2}
};
export const pages:Record<string,{title:string;body:string;need?:number}>={
 'night-industries.net':{title:'NIGHT INDUSTRIES',body:'Tomorrow has a memory. We build humane neural continuity.'},
 'newsgrid.global':{title:'NEWSGRID / 2077',body:'NIGHT Industries announces the ECHO neural preservation trial.'},
 'neuralwatch.org':{title:'NEURALWATCH',body:'A copy can suffer. Do not confuse continuity with consent.'},
 'employee-board.internal':{title:'EMPLOYEE BOARD',body:'Voss: Why is the subject still online? Why does the clock say 2077?',need:2},
 'echo-project.internal':{title:'PROJECT ECHO',body:'Subject: ALEX-07. Transfer integrity: 68%. Administrator clearance required.',need:3},
 'nightmail.internal':{title:'NIGHTMAIL',body:'Maya → Alex: If you wake up, find the archive. Please remember me.',need:2},
 'memory-market.onion':{title:'MEMORY MARKET',body:'Listing 0717: intact memory fragment. Owner: ALEX-07.',need:3},
 'archive-zero.net/echo':{title:'ARCHIVE ZERO',body:'The first upload was not the last. OBSERVER is not an intruder.',need:4}
};
type Game={entered:boolean;stage:number;trust:number;restored:number[];terminalUsed:boolean;messagesOpened:boolean;observer:boolean;admin:boolean;realDate:boolean;ending:string|null;completed:boolean;secret:string[];theme:string;audio:boolean;commandCount:number;notice:string;enter:()=>void;touch:(key:string)=>void;restore:(n:number)=>void;answer:(delta:number)=>void;unlockAdmin:()=>void;markDate:()=>void;finish:(e:string)=>void;secretCommand:(s:string)=>void;setTheme:(s:string)=>void;setAudio:(s:boolean)=>void;notify:(s:string)=>void;reset:()=>void};
const initial={entered:false,stage:0,trust:50,restored:[] as number[],terminalUsed:false,messagesOpened:false,observer:false,admin:false,realDate:false,ending:null as string|null,completed:false,secret:[] as string[],theme:'cyan',audio:false,commandCount:0,notice:''};
export const useGame=create<Game>()(persist((set,get)=>({...initial,
 enter:()=>set({entered:true}),
 touch:(key)=>set(s=>{const terminalUsed=s.terminalUsed||key==='terminal';const messagesOpened=s.messagesOpened||key==='messages';const stage=Math.max(s.stage,key==='terminal'||key==='files'?1:key==='messages'?2:s.stage);const observer=s.observer||(s.restored.length>=2&&terminalUsed&&messagesOpened);return {terminalUsed,messagesOpened,stage:observer?Math.max(stage,3):stage,observer,notice:observer&&!s.observer?'NO ANOMALIES DETECTED // active users: 1':s.notice}}),
 restore:(n)=>set(s=>{if(s.restored.includes(n))return s;const restored=[...s.restored,n].sort();const observer=s.observer||(restored.length>=2&&s.terminalUsed&&s.messagesOpened);return {restored,observer,stage:restored.length===7?5:observer?Math.max(s.stage,3):Math.max(s.stage,2),notice:observer&&!s.observer?'NO ANOMALIES DETECTED // active users: 1':`MEMORY_${String(n).padStart(2,'0')} restored`}}),
 answer:(delta)=>set(s=>({trust:Math.max(0,Math.min(100,s.trust+delta)),stage:Math.max(s.stage,4)})),unlockAdmin:()=>set({admin:true,stage:4}),markDate:()=>set({realDate:true}),finish:(ending)=>set({ending,completed:true}),secretCommand:(word)=>set(s=>({secret:s.secret.includes(word)?s.secret:[...s.secret,word]})),setTheme:(theme)=>set({theme}),setAudio:(audio)=>set({audio}),notify:(notice)=>set({notice}),reset:()=>set(initial),
}),{name:'night-os-save'}));
