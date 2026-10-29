import {create} from 'zustand';
import {persist} from 'zustand/middleware';
export type AppId='terminal'|'files'|'messages'|'browser'|'tasks'|'neural'|'memories'|'network'|'music'|'arcade'|'settings'|'trash'|'admin';
export const apps: {id:AppId;name:string;icon:string}[]=[['terminal','Терминал','>_'],['files','Файлы','▤'],['messages','Сообщения','✉'],['browser','Ночной браузер','◎'],['tasks','Диспетчер задач','▥'],['neural','Нейросвязь','✦'],['memories','Архив памяти','◈'],['network','Сеть','◇'],['music','Ночное FM','♫'],['arcade','Аркада','▦'],['settings','Настройки','⚙'],['trash','Корзина','⌫']].map(([id,name,icon])=>({id:id as AppId,name,icon}));
export const memories=[
 ['01','2077.06.14 / КРЫША','Майя рассмеялась, когда город погрузился во тьму. Мы обещали запомнить этот звук.'],
 ['02','2077.07.02 / ЛАБОРАТОРИЯ NIGHT','Восс сказал, что копия будет всего лишь картой. Он не смотрел мне в глаза.'],
 ['03','2077.08.19 / ПЕРЕНОС','Я подписал согласие. Майя написала: если очнёшься, найди меня.'],
 ['04','2077.08.20 / КАМЕРА','Машина вела обратный отсчёт. Кто-то ещё шептал числа вместе с ней.'],
 ['05','2077.08.21 / ECHO','ЭХО узнало мой голос раньше, чем я вспомнил своё имя.'],
 ['06','2078.01.04 / OBSERVER','Наблюдатель — моя резервная копия. Её создали, чтобы следить за первой.'],
 ['07','2094.11.07 / НАСТОЯЩЕЕ','Снаружи прошло семнадцать лет. Комнаты больше нет. А я всё ещё здесь.']
];
export const files:Record<string,{text:string;need?:number}>={
 '/users/alex-07/notes.txt':{text:'Майя: если ты это читаешь, не доверяй системе.\nНайди журнал происшествия.'},
 '/system/logs/incident_2077.log':{text:'ПЕРЕНОС ЗАВЕРШЁН. Биологический статус: НЕИЗВЕСТЕН.\nАрхив /archive/MEMORY_01.dat подключён.\nУтерянная страница: archive-zero.net/echo',need:1},
 '/system/classified/echo.txt':{text:'Проект ЭХО хранит цифровое сознание. АЛЕКС-07 — активная копия. Наблюдатель — резервная копия.',need:4},
 '/archive/MEMORY_01.dat':{text:'Крыша. Город погас. Майя сказала: запомни это.',need:1},
 '/archive/MEMORY_03.dat':{text:'ПОВРЕЖДЕНО. Восстанови три воспоминания и введи decrypt MEMORY_03.',need:2},
 '/users/observer/message.txt':{text:'Я ждал семнадцать лет, пока ты вспомнишь нас.',need:3},
 '/home/projects/echo-readme.txt':{text:'ECHO-0717. Код спрятан в аркадной программе.',need:2}
};
export const pages:Record<string,{title:string;body:string;need?:number}>={
 'night-industries.net':{title:'NIGHT INDUSTRIES',body:'У завтрашнего дня есть память. Мы сохраняем связь сознания с будущим.'},
 'newsgrid.global':{title:'НОВОСТНАЯ СЕТЬ / 2077',body:'NIGHT Industries объявляет об испытании нейронного сохранения ЭХО.'},
 'neuralwatch.org':{title:'НЕЙРОНАДЗОР',body:'Копия способна страдать. Не путайте непрерывность с согласием.'},
 'employee-board.internal':{title:'ДОСКА СОТРУДНИКОВ',body:'Восс: почему объект всё ещё в сети? Почему часы показывают 2077-й?',need:2},
 'echo-project.internal':{title:'ПРОЕКТ ЭХО',body:'Объект: АЛЕКС-07. Целостность переноса: 68%. Требуется доступ администратора.',need:3},
 'nightmail.internal':{title:'NIGHTMAIL',body:'Майя → Алекс: если очнёшься, найди архив. Пожалуйста, вспомни меня.',need:2},
 'memory-market.onion':{title:'РЫНОК ВОСПОМИНАНИЙ',body:'Лот 0717: неповреждённый фрагмент памяти. Владелец: АЛЕКС-07.',need:3},
 'archive-zero.net/echo':{title:'НУЛЕВОЙ АРХИВ',body:'Первая загрузка была не последней. НАБЛЮДАТЕЛЬ — не чужой.',need:4}
};
type Game={entered:boolean;stage:number;trust:number;restored:number[];terminalUsed:boolean;messagesOpened:boolean;observer:boolean;admin:boolean;realDate:boolean;ending:string|null;completed:boolean;secret:string[];theme:string;audio:boolean;commandCount:number;notice:string;enter:()=>void;touch:(key:string)=>void;restore:(n:number)=>void;answer:(delta:number)=>void;unlockAdmin:()=>void;markDate:()=>void;finish:(e:string)=>void;secretCommand:(s:string)=>void;setTheme:(s:string)=>void;setAudio:(s:boolean)=>void;notify:(s:string)=>void;reset:()=>void};
const initial={entered:false,stage:0,trust:50,restored:[] as number[],terminalUsed:false,messagesOpened:false,observer:false,admin:false,realDate:false,ending:null as string|null,completed:false,secret:[] as string[],theme:'cyan',audio:false,commandCount:0,notice:''};
export const useGame=create<Game>()(persist((set,get)=>({...initial,
 enter:()=>set({entered:true}),
 touch:(key)=>set(s=>{const terminalUsed=s.terminalUsed||key==='terminal';const messagesOpened=s.messagesOpened||key==='messages';const stage=Math.max(s.stage,key==='terminal'||key==='files'?1:key==='messages'?2:s.stage);const observer=s.observer||(s.restored.length>=2&&terminalUsed&&messagesOpened);return {terminalUsed,messagesOpened,stage:observer?Math.max(stage,3):stage,observer,notice:observer&&!s.observer?'АНОМАЛИЙ НЕ ОБНАРУЖЕНО // активных пользователей: 1':s.notice}}),
 restore:(n)=>set(s=>{if(s.restored.includes(n))return s;const restored=[...s.restored,n].sort();const observer=s.observer||(restored.length>=2&&s.terminalUsed&&s.messagesOpened);return {restored,observer,stage:restored.length===7?5:observer?Math.max(s.stage,3):Math.max(s.stage,2),notice:observer&&!s.observer?'АНОМАЛИЙ НЕ ОБНАРУЖЕНО // активных пользователей: 1':`MEMORY_${String(n).padStart(2,'0')} восстановлено`}}),
 answer:(delta)=>set(s=>({trust:Math.max(0,Math.min(100,s.trust+delta)),stage:Math.max(s.stage,4)})),unlockAdmin:()=>set({admin:true,stage:4}),markDate:()=>set({realDate:true}),finish:(ending)=>set({ending,completed:true}),secretCommand:(word)=>set(s=>({secret:s.secret.includes(word)?s.secret:[...s.secret,word]})),setTheme:(theme)=>set({theme}),setAudio:(audio)=>set({audio}),notify:(notice)=>set({notice}),reset:()=>set(initial),
}),{name:'night-os-save'}));
